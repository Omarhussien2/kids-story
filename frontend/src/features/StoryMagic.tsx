import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Upload, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Loader2, 
  BookOpen, 
  CreditCard, 
  Truck, 
  Printer, 
  Wallet,
  Star,
  Camera,
  Heart,
  Wand2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { rpcCall, streamCall } from '../api';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Types ---
interface Sample {
  id: number;
  title: string;
  file_url: string;
  type: string;
}

interface Story {
  id: number;
  child_name: string;
  age: number;
  gender: string;
  challenge_type: string;
  content: string;
  status: 'generating' | 'ready' | 'paid' | 'printing' | 'shipped';
  photo_path?: string;
}

// --- Creation Wizard ---
export const CreationWizard = ({ onComplete }: { onComplete: (story: any) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    child_name: '',
    age: '5',
    gender: 'ذكر',
    challenge_type: 'شجاعة',
    custom_text: '',
    photo: null as string | null,
  });
  const [loading, setLoading] = useState(false);
  const [streamStatus, setStreamStatus] = useState({ status: '', progress: 0 });
  const [error, setError] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, photo: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const startMagic = async () => {
    setLoading(true);
    setError('');
    console.log('[ACTION_START] Starting Story Generation');
    
    try {
      let storyId: number | null = null;
      
      await streamCall({
        func: 'generate_story_streaming',
        args: { 
          child_name: formData.child_name,
          age: parseInt(formData.age),
          gender: formData.gender,
          challenge_type: formData.challenge_type,
          custom_text: formData.custom_text
        },
        onChunk: (chunk) => {
          console.log('[STREAM_CHUNK]', chunk);
          if (chunk.status) setStreamStatus(prev => ({ ...prev, status: chunk.status }));
          if (chunk.progress) setStreamStatus(prev => ({ ...prev, progress: chunk.progress }));
          if (chunk.story_id) storyId = chunk.story_id;
          if (chunk.result) {
            console.log('[STREAM_DONE] Story Ready');
            handleFinalStep(chunk.result);
          }
        },
        onError: (err) => {
          console.error('[STREAM_ERROR]', err);
          setError(err.message);
          setLoading(false);
        }
      });

      // If we have a photo, upload it now
      if (storyId && formData.photo) {
        console.log('[FETCH_START] Uploading child photo');
        await rpcCall({
          func: 'upload_child_photo',
          args: { story_id: storyId, image_base64: formData.photo }
        });
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFinalStep = (story: any) => {
    onComplete(story);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8" dir="rtl">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-900">بيانات البطل</h2>
              <p className="text-slate-500 font-bold">أخبرنا قليلاً عن طفلك</p>
            </div>
            
            <div className="grid gap-6">
              <div className="space-y-3">
                <Label className="text-slate-700 font-black ps-2">اسم الطفل</Label>
                <Input 
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold text-lg focus:border-[#7FCC00] focus:ring-[#7FCC00]"
                  placeholder="مثال: يوسف، مريم..." 
                  value={formData.child_name} 
                  onChange={e => setFormData(prev => ({ ...prev, child_name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-slate-700 font-black ps-2">العمر</Label>
                  <Select value={formData.age} onValueChange={val => setFormData(prev => ({ ...prev, age: val }))}>
                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[3,4,5,6,7,8,9,10,11,12].map(a => <SelectItem key={a} value={a.toString()} className="font-bold">{a} سنوات</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-slate-700 font-black ps-2">النوع</Label>
                  <Select value={formData.gender} onValueChange={val => setFormData(prev => ({ ...prev, gender: val }))}>
                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ذكر" className="font-bold">ولد</SelectItem>
                      <SelectItem value="أنثى" className="font-bold">بنت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex pt-4">
              <Button className="btn-primary w-full h-14 text-lg" onClick={() => setStep(2)} disabled={!formData.child_name}>
                التالي
              </Button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8" dir="rtl">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-900">موضوع المغامرة</h2>
              <p className="text-slate-500 font-bold">إيه السلوك اللي عاوزين نشجعه النهاردة؟</p>
            </div>

            <div className="grid gap-6">
              <div className="space-y-3">
                <Label className="text-slate-700 font-black ps-2">اختر التحدي</Label>
                <Select value={formData.challenge_type} onValueChange={val => setFormData(prev => ({ ...prev, challenge_type: val }))}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="شجاعة" className="font-bold">الشجاعة ومواجهة الخوف</SelectItem>
                    <SelectItem value="صدق" className="font-bold">الصدق والأمانة</SelectItem>
                    <SelectItem value="مساعدة" className="font-bold">مساعدة الآخرين</SelectItem>
                    <SelectItem value="نظافة" className="font-bold">الحفاظ على البيئة والنظافة</SelectItem>
                    <SelectItem value="دراسة" className="font-bold">حب العلم والمدرسة</SelectItem>
                    <SelectItem value="مخصص" className="font-bold">تحدي مخصص...</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.challenge_type === 'مخصص' && (
                <div className="space-y-3">
                  <Label className="text-slate-700 font-black ps-2">اكتب تفاصيل التحدي</Label>
                  <Textarea 
                    className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50 font-bold text-lg"
                    placeholder="مثال: يوسف يرفض أكل الخضروات، ساعده في حب الأكل الصحي..."
                    value={formData.custom_text}
                    onChange={e => setFormData(prev => ({ ...prev, custom_text: e.target.value }))}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="ghost" className="h-14 flex-1 text-slate-400 font-bold" onClick={() => setStep(1)}>السابق</Button>
              <Button className="btn-primary h-14 flex-[2] text-lg" onClick={() => setStep(3)}>
                التالي
              </Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">آخر خطوة!</h2>
              <p className="text-slate-500 font-bold">ارفع صورة بطلنا الصغير عشان السحر يكمل</p>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-6">
              <div className={cn(
                "relative w-56 h-56 rounded-[3rem] border-4 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 transition-all group hover:border-[#7FCC00]",
                formData.photo && "border-solid border-[#7FCC00] shadow-2xl scale-105"
              )}>
                {formData.photo ? (
                  <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-300 group-hover:text-[#7FCC00] transition-colors">
                    <Camera className="w-16 h-16" />
                    <span className="text-xs font-black">ارفع الصورة هنا</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handlePhotoUpload}
                />
              </div>
              <Button className="btn-outline h-12">
                {formData.photo ? 'تغيير الصورة' : 'اختر صورة من موبايلك'}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handlePhotoUpload}
                />
              </Button>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="ghost" className="h-14 flex-1 text-slate-400 font-bold" onClick={() => setStep(2)}>السابق</Button>
              <Button className="btn-primary h-14 flex-[2] text-xl group" onClick={startMagic}>
                ابتدأ السحر
                <Wand2 className="me-3 h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-10 min-h-[500px]">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[#7FCC00]"
        >
          <div className="w-24 h-24 bg-lime-100 rounded-[2rem] flex items-center justify-center shadow-2xl">
            <Wand2 className="w-12 h-12" />
          </div>
        </motion.div>
        
        <div className="text-center space-y-6 max-w-md w-full">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">{streamStatus.status || "نجمع النجوم لمغامرتك..."}</h3>
            <p className="text-slate-500 font-bold">جاري تأليف القصة خصيصاً لـ {formData.child_name}...</p>
          </div>
          
          <div className="relative pt-1 px-4">
             <div className="flex mb-3 items-center justify-between font-black text-sm text-[#7FCC00]">
                <span>اكتمال السحر</span>
                <span>{streamStatus.progress}%</span>
             </div>
             <Progress value={streamStatus.progress} className="h-4 bg-slate-100 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto border-none shadow-2xl overflow-hidden glass-card">
      <div className="h-2 bg-[#7FCC00]" style={{ width: `${(step/3)*100}%` }} />
      <CardContent className="p-10">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
        {error && (
           <div className="mt-6 p-4 rounded-2xl bg-rose-50 text-rose-600 text-sm font-bold border border-rose-100 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
             {error}
           </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Showcase Gallery ---
export const ShowcaseGallery = () => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackSamples: Sample[] = [
    { id: 101, title: 'يوسف في غابة الأرقام', file_url: './assets/card-book-open.jpg', type: 'story' },
    { id: 102, title: 'مريم وبساط الريح السحري', file_url: './assets/card-book-stack.jpg', type: 'story' },
    { id: 103, title: 'أرنوب وسر الجزرة العملاقة', file_url: './assets/card-character-1.jpg', type: 'story' }
  ];

  useEffect(() => {
    const loadSamples = async () => {
      try {
        const res = await rpcCall({ func: 'get_samples' });
        if (Array.isArray(res) && res.length > 0) {
          setSamples(res);
        } else {
          setSamples(fallbackSamples);
        }
      } catch (err) {
        console.error('Gallery Load Error:', err);
        setSamples(fallbackSamples);
      } finally {
        setLoading(false);
      }
    };
    loadSamples();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
      {[1,2,3].map(i => (
        <div key={i} className="aspect-[3/4] rounded-[2.5rem] bg-slate-100 animate-pulse border-4 border-slate-50" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
      {samples.map((sample, idx) => (
        <motion.div 
          key={sample.id}
          whileHover={{ y: -12, scale: 1.02 }}
          className="group relative"
        >
          <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all rounded-[2.5rem] bg-white ring-1 ring-slate-100">
            <div className="aspect-[3/4] overflow-hidden relative">
               <img 
                 src={sample.file_url || (idx % 2 === 0 ? './assets/card-book-open.jpg' : './assets/card-book-stack.jpg')} 
                 alt={sample.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = './assets/card-book-open.jpg';
                 }}
               />
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-8 pt-20">
                  <Badge className="bg-[#7FCC00] text-white border-none mb-3 font-black">قصة مميزة</Badge>
                  <h3 className="text-white text-2xl font-black mb-4 drop-shadow-md">{sample.title}</h3>
                  <Button className="w-full btn-primary h-12 text-lg rounded-2xl shadow-lg">تصفح القصة</Button>
               </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// --- Story Preview & Payment ---
export const StoryResult = ({ storyId, onBack }: { storyId: number, onBack: () => void }) => {
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState<'preview' | 'payment'>('preview');

  const fetchDetails = useCallback(async () => {
    const data = await rpcCall({ func: 'get_story_details', args: { story_id: storyId } });
    setStory(data);
    setLoading(false);
  }, [storyId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handlePaymentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setScreenshot(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submitPayment = async () => {
    if (!screenshot) return;
    setSubmitting(true);
    try {
      await rpcCall({ 
        func: 'submit_payment', 
        args: { story_id: storyId, screenshot_base64: screenshot, amount: 200.0 } 
      });
      fetchDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStep = () => {
    const statuses = ['generating', 'ready', 'paid', 'printing', 'shipped'];
    const currentIndex = statuses.indexOf(story?.status || 'generating');
    return currentIndex;
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-amber-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Visual Tracker Modernized */}
      <Card className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-10">
          <div className="flex justify-between items-center relative" dir="rtl">
            <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
            <div 
              className="absolute top-1/2 right-0 h-1.5 bg-[#7FCC00] -translate-y-1/2 z-0 transition-all duration-1000 rounded-full" 
              style={{ width: `${(getStatusStep() / 3) * 100}%` }}
            />
            {[
              { label: 'مراجعة الطلب', icon: Wand2 },
              { label: 'تأكيد الدفع', icon: Wallet },
              { label: 'طباعة القصة', icon: Printer },
              { label: 'شحن القصة', icon: Truck }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-4 transition-all duration-500 shadow-xl",
                  getStatusStep() >= idx ? "bg-[#7FCC00] border-white text-white scale-110" : "bg-white border-slate-50 text-slate-200"
                )}>
                  <step.icon className="w-7 h-7" />
                </div>
                <span className={cn(
                  "text-sm font-black",
                  getStatusStep() >= idx ? "text-slate-900" : "text-slate-300"
                )}>{step.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {view === 'preview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden border-none shadow-2xl rounded-[3rem] bg-white">
              <div 
                className="p-10 md:p-20 min-h-[700px] bg-slate-50 relative"
              >
                <div className="absolute inset-0 bg-pattern opacity-10" />
                <article className="relative prose prose-slate max-w-none text-start font-medium text-lg leading-loose" dir="rtl">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {story.content}
                  </ReactMarkdown>
                </article>
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="sticky top-6 border-none shadow-2xl rounded-[2.5rem] bg-white p-8">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-4 mb-4" dir="rtl">
                   <div className="w-14 h-14 rounded-2xl bg-lime-100 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-[#7FCC00]" />
                   </div>
                   <div className="text-start">
                      <h3 className="text-2xl font-black text-slate-900">قصة {story.child_name}</h3>
                      <p className="text-slate-400 font-bold">بطلنا السوبر</p>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="ps-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 space-y-3 font-bold" dir="rtl">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">التحدي:</span>
                    <span className="text-slate-900">{story.challenge_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">العمر:</span>
                    <span className="text-slate-900">{story.age} سنوات</span>
                  </div>
                </div>
                
                {story.status === 'ready' ? (
                  <div className="space-y-6">
                    <div className="text-center bg-lime-50 p-6 rounded-[2rem] border-2 border-dashed border-lime-200">
                      <p className="text-3xl font-black text-[#7FCC00]">٢٠٠ جنية</p>
                      <p className="text-sm text-[#7FCC00] font-bold">شامل الطباعة والشحن</p>
                    </div>
                    <Button className="btn-primary w-full h-16 text-xl" onClick={() => setView('payment')}>
                      اطلب النسخة المطبوعة
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-emerald-50 rounded-[2rem] text-emerald-700 border-2 border-emerald-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                       <Check className="w-8 h-8" />
                    </div>
                    <p className="font-black text-xl mb-1">تم تأكيد الطلب</p>
                    <p className="text-sm font-bold opacity-80">جاري المراجعة والبدء في الطباعة</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Button variant="ghost" className="w-full h-14 text-slate-400 font-bold hover:text-slate-900" onClick={onBack}>إنشاء قصة جديدة</Button>
          </div>
        </div>
      ) : (
        <Card className="max-w-xl mx-auto border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden" dir="rtl">
          <div className="bg-lime-500 p-12 text-center text-white relative">
             <div className="absolute inset-0 bg-pattern opacity-10" />
             <div className="relative z-10 space-y-4">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:rotate-6 transition-transform">
                   <Sparkles className="w-10 h-10 text-lime-500" />
                </div>
                <h2 className="text-3xl font-black">أرنوب مستني!</h2>
                <p className="text-lime-100 font-bold">حول ٢٠٠ جنية بس وشوف السحر بيتحقق</p>
             </div>
          </div>
          <CardContent className="space-y-10 p-10 pt-16">
             <div className="space-y-8">
                <div className="flex flex-col items-center gap-6 ps-8 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100">
                   <div className="text-center space-y-1">
                     <p className="text-xs text-slate-400 font-black uppercase tracking-widest text-center">عنوان الدفع (InstaPay)</p>
                     <p className="text-2xl font-black text-slate-800 select-all cursor-copy">omarhussien22@instapay</p>
                   </div>
                   <div className="w-56 h-56 bg-white p-4 rounded-[2rem] shadow-2xl flex items-center justify-center border-8 border-slate-100">
                     <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=omarhussien22@instapay" alt="QR Code" className="w-full" />
                   </div>
                </div>

                <div className="space-y-4">
                   <Label className="text-slate-700 font-black ps-2 text-lg">أرفق صورة الإيصال</Label>
                   <div className={cn(
                     "relative h-44 border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all group",
                     screenshot ? "border-emerald-500 bg-emerald-50" : "border-slate-100 bg-slate-50 hover:bg-slate-100/50 hover:border-lime-200"
                   )}>
                     {screenshot ? (
                       <div className="flex flex-col items-center gap-3">
                         <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
                           <Check />
                         </div>
                         <span className="text-sm font-black text-emerald-700">تم اختيار الإيصال بنجاح</span>
                         <Button variant="ghost" size="sm" className="text-slate-400 font-bold" onClick={() => setScreenshot(null)}>تغيير الصورة</Button>
                       </div>
                     ) : (
                       <div className="flex flex-col items-center gap-3 text-slate-300 group-hover:text-[#7FCC00] transition-colors">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                           <Upload className="w-8 h-8" />
                         </div>
                         <span className="font-black">اضغط هنا لرفع صورة الإيصال</span>
                       </div>
                     )}
                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePaymentUpload} />
                   </div>
                </div>
             </div>

             <div className="flex flex-col gap-4">
                <Button 
                  className="btn-primary h-20 text-2xl shadow-2xl shadow-lime-500/30" 
                  disabled={!screenshot || submitting}
                  onClick={submitPayment}
                >
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6 me-3" />}
                  تأكيد الطلب والدفع
                </Button>
                <Button variant="ghost" className="h-14 text-slate-400 font-bold" onClick={() => setView('preview')}>رجوع مراجعة القصة</Button>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
