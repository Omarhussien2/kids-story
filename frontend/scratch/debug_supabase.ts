
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('samples').select('*');
  if (error) {
    console.error("Error fetching samples:", error.message);
  } else {
    console.log("Samples found:", data.length);
    console.log(data);
  }

  const { data: stories, error: storiesError } = await supabase.from('stories').select('count');
  console.log("Stories count error:", storiesError?.message);
  
  // Try to list tables if possible (PostgreSQL specific query)
  const { data: tables, error: tablesError } = await supabase.rpc('get_tables'); // Won't work unless RPC exists
  console.log("Tables RPC error:", tablesError?.message);
}

check();
