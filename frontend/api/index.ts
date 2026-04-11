import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { func, args = {} } = await req.json();

    switch (func) {
      case 'generate_story_streaming': {
        return await generateStory(args);
      }
      case 'upload_child_photo': {
        const result = await uploadPhoto(args);
        return Response.json(result);
      }
      case 'submit_payment': {
        const result = await submitPayment(args);
        return Response.json(result);
      }
      case 'get_story_details': {
        const result = await getStoryDetails(args);
        return Response.json(result);
      }
      case 'get_samples': {
        const result = await getSamples();
        return Response.json(result);
      }
      case 'admin_get_orders': {
        const result = await adminGetOrders();
        return Response.json(result);
      }
      case 'admin_update_status': {
        const result = await adminUpdateStatus(args);
        return Response.json(result);
      }
      case 'admin_login': {
        const valid = args.password === process.env.ADMIN_PASSWORD;
        return Response.json({ success: valid });
      }
      default:
        return Response.json({ error: `Unknown function: ${func}` }, { status: 400 });
    }
  } catch (err: any) {
    console.error('[API_ERROR]', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

async function generateStory(args: any) {
  const { child_name = 'طفل', age = 5, gender = 'ذكر', challenge_type = 'شجاعة', custom_text = '' } = args;

  // Create story record
  const { data: story, error: dbError } = await supabase
    .from('stories')
    .insert({
      child_name,
      age,
      gender,
      challenge_type,
      custom_challenge_text: custom_text,
      status: 'generating'
    })
    .select()
    .single();

  if (dbError) throw new Error(dbError.message);
  const storyId = story.id;

  // Use Gemini API directly
  const apiKey = process.env.NEXTTOKEN_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('AI API key not configured');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
    Write a personalized children's story in Egyptian Arabic (Ammiya).
    The child's name is ${child_name}, age ${age}, gender ${gender}.
    The theme of the story is: ${challenge_type}.
    Additional context: ${custom_text}
    
    The story should be:
    1. In authentic, warm, and engaging Egyptian Ammiya.
    2. Educational and empowering.
    3. Suitable for a ${age} year old.
    4. About 300-500 words.
    5. Include a title at the beginning.
    
    Format the output with a clear Title and then the story paragraphs.
  `;

  const result = await model.generateContent(prompt);
  const content = result.response.text();

  // Update story with content
  const { data: updated, error: updateError } = await supabase
    .from('stories')
    .update({ content, status: 'ready' })
    .eq('id', storyId)
    .select()
    .single();

  if (updateError) throw new Error(updateError.message);

  return Response.json({
    id: updated.id,
    content: updated.content,
    status: updated.status,
    child_name: updated.child_name,
    age: updated.age,
    gender: updated.gender,
    challenge_type: updated.challenge_type,
    created_at: updated.created_at
  });
}

async function uploadPhoto(args: any) {
  const { story_id, image_base64 } = args;
  if (!story_id || !image_base64) throw new Error('Missing story_id or image_base64');

  const base64Data = image_base64.includes(',') ? image_base64.split(',')[1] : image_base64;
  const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
  const filename = `child_${story_id}_${Date.now()}.png`;

  const { error: uploadError } = await supabase.storage
    .from('khayal-assets')
    .upload(filename, buffer, { contentType: 'image/png', upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage.from('khayal-assets').getPublicUrl(filename);
  const photo_url = urlData.publicUrl;

  const { data, error } = await supabase
    .from('stories')
    .update({ photo_url })
    .eq('id', story_id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function submitPayment(args: any) {
  const { story_id, screenshot_base64, amount = 150.0 } = args;
  if (!story_id || !screenshot_base64) throw new Error('Missing story_id or screenshot_base64');

  const base64Data = screenshot_base64.includes(',') ? screenshot_base64.split(',')[1] : screenshot_base64;
  const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
  const filename = `payment_${story_id}_${Date.now()}.png`;

  const { error: uploadError } = await supabase.storage
    .from('khayal-assets')
    .upload(filename, buffer, { contentType: 'image/png', upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage.from('khayal-assets').getPublicUrl(filename);
  const screenshot_url = urlData.publicUrl;

  await supabase.from('payments').insert({ story_id, screenshot_url, amount, status: 'pending' });

  const { data, error } = await supabase
    .from('stories')
    .update({ status: 'paid' })
    .eq('id', story_id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function getStoryDetails(args: any) {
  const { story_id } = args;

  const { data: story, error } = await supabase
    .from('stories')
    .select('*')
    .eq('id', story_id)
    .single();

  if (error) return { error: 'Story not found' };

  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('story_id', story_id)
    .single();

  if (payment) (story as any).payment = payment;
  return story;
}

async function getSamples() {
  const { data, error } = await supabase
    .from('samples')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

async function adminGetOrders() {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

async function adminUpdateStatus(args: any) {
  const { story_id, status } = args;

  const { data, error } = await supabase
    .from('stories')
    .update({ status })
    .eq('id', story_id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
