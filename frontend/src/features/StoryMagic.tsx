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
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-heading font-bold text-amber-900">أهلاً بك في عالم الخيال</h2>
              <p className="text-muted-foreground">لنبدأ برفع صورة بطل قصتنا الصغير</p>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-4">
              <div className={cn(
                "relative w-48 h-48 rounded-full border-4 border-dashed border-amber-200 flex items-center justify-center overflow-hidden bg-amber-50/50 transition-all",
                formData.photo && "border-solid border-amber-500 shadow-xl"
              )}>
                {formData.photo ? (
                  <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-12 h-12 text-amber-300" />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handlePhotoUpload}
                />
              </div>
              <Button variant="outline" className="relative">
                {formData.photo ? 'تغيير الصورة' : 'اختر صورة'}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handlePhotoUpload}
                />
              </Button>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} disabled={!formData.child_name && step === 2}>
                التالي <ChevronLeft className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-heading font-bold text-amber-900">بيانات البطل</h2>
              <p className="text-muted-foreground">أخبرنا قليلاً عن طفلك</p>
            </div>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>اسم الطفل</Label>
                <Input 
                  placeholder="مثال: يوسف، مريم..." 
                  value={formData.child_name} 
                  onChange={e => setFormData(prev => ({ ...prev, child_name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>العمر</Label>
                  <Select value={formData.age} onValueChange={val => setFormData(prev => ({ ...prev, age: val }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[3,4,5,6,7,8,9,10,11,12].map(a => <SelectItem key={a} value={a.toString()}>{a} سنوات</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>النوع</Label>
                  <Select value={formData.gender} onValueChange={val => setFormData(prev => ({ ...prev, gender: val }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ذكر">ولد</SelectItem>
                      <SelectItem value="أنثى">بنت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(1)}><ChevronRight className="ml-2 h-4 w-4" /> السابق</Button>
              <Button onClick={() => setStep(3)} disabled={!formData.child_name}>
                التالي <ChevronLeft className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-heading font-bold text-amber-900">موضوع المغامرة</h2>
              <p className="text-muted-foreground">ما هو التحدي الذي سيواجهه بطلنا اليوم؟</p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>اختر التحدي</Label>
                <Select value={formData.challenge_type} onValueChange={val => setFormData(prev => ({ ...prev, challenge_type: val }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="شجاعة">الشجاعة ومواجهة الخوف</SelectItem>
                    <SelectItem value="صدق">الصدق والأمانة</SelectItem>
                    <SelectItem value="مساعدة">مساعدة الآخرين</SelectItem>
                    <SelectItem value="نظافة">الحفاظ على البيئة والنظافة</SelectItem>
                    <SelectItem value="دراسة">حب العلم والمدرسة</SelectItem>
                    <SelectItem value="مخصص">تحدي مخصص...</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.challenge_type === 'مخصص' && (
                <div className="space-y-2">
                  <Label>اكتب تفاصيل التحدي</Label>
                  <Textarea 
                    placeholder="مثال: يوسف يرفض أكل الخضروات، ساعده في حب الأكل الصحي..."
                    value={formData.custom_text}
                    onChange={e => setFormData(prev => ({ ...prev, custom_text: e.target.value }))}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(2)}><ChevronRight className="ml-2 h-4 w-4" /> السابق</Button>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={startMagic}>
                ابتدأ السحر <Sparkles className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-8 min-h-[400px]">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-amber-500"
        >
          <Wand2 className="w-20 h-20" />
        </motion.div>
        
        <div className="text-center space-y-4 max-w-md w-full">
          <h3 className="text-xl font-heading font-bold text-amber-900">{streamStatus.status || "نجمع النجوم لمغامرتك..."}</h3>
          <div className="relative pt-1">
             <div className="flex mb-2 items-center justify-between">
                <div>
                  <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200">
                    {streamStatus.progress}% اكتمل
                  </Badge>
                </div>
             </div>
             <Progress value={streamStatus.progress} className="h-3 bg-amber-100" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            جاري تأليف القصة خصيصاً لـ {formData.child_name}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto border-amber-100 shadow-xl overflow-hidden bg-white/80 backdrop-blur">
      <div className="h-1 bg-amber-500" style={{ width: `${(step/3)*100}%` }} />
      <CardContent className="p-8">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
        {error && (
           <div className="mt-4 p-3 rounded-lg bg-rose-50 text-rose-600 text-sm border border-rose-100">
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

  useEffect(() => {
    rpcCall({ func: 'get_samples' }).then(res => {
      setSamples(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />)}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {samples.map((sample, idx) => (
        <motion.div 
          key={sample.id}
          whileHover={{ y: -10 }}
          className="group relative"
        >
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all bg-amber-50/30">
            <div className="aspect-[3/4] overflow-hidden relative">
               <img 
                 src={idx % 2 === 0 ? './assets/card-book-open.jpg' : './assets/card-book-stack.jpg'} 
                 alt={sample.title} 
                 className="w-full h-full object-cover transition-transform group-hover:scale-110" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                 <Button variant="secondary" className="w-full">تصفح القصة</Button>
               </div>
            </div>
            <CardHeader className="p-4 text-center">
              <CardTitle className="text-lg font-heading text-amber-900">{sample.title}</CardTitle>
              <Badge variant="outline" className="w-fit mx-auto border-amber-200 text-amber-700">نسخة معاينة</Badge>
            </CardHeader>
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
        args: { story_id: storyId, screenshot_base64: screenshot, amount: 150.0 } 
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
      
      {/* Visual Tracker */}
      <Card className="bg-amber-50/50 border-amber-100">
        <CardContent className="p-6">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-amber-100 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-1000" 
              style={{ width: `${(getStatusStep() / 4) * 100}%` }}
            />
            {[
              { label: 'تأليف', icon: Wand2, status: 'ready' },
              { label: 'دفع', icon: Wallet, status: 'paid' },
              { label: 'طباعة', icon: Printer, status: 'printing' },
              { label: 'شحن', icon: Truck, status: 'shipped' }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500",
                  getStatusStep() >= idx + 1 ? "bg-amber-500 border-amber-500 text-white" : "bg-white border-amber-200 text-amber-200"
                )}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-xs font-bold",
                  getStatusStep() >= idx + 1 ? "text-amber-900" : "text-amber-300"
                )}>{step.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {view === 'preview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-none shadow-2xl">
              <div 
                className="p-8 md:p-12 min-h-[600px] bg-cover bg-center relative"
                style={{ backgroundImage: "url('./assets/bg-paper-texture.jpg')" }}
              >
                <div className="absolute inset-0 bg-amber-900/5" />
                <article className="relative prose prose-amber max-w-none text-right" dir="rtl">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {story.content}
                  </ReactMarkdown>
                </article>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6 border-amber-200">
              <CardHeader>
                <CardTitle className="font-heading">نسخة {story.child_name}</CardTitle>
                <CardDescription>هذه مسودة لقصتك السحرية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">التحدي:</span>
                    <span className="font-bold">{story.challenge_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">العمر:</span>
                    <span className="font-bold">{story.age} سنوات</span>
                  </div>
                </div>
                
                {story.status === 'ready' ? (
                  <div className="space-y-4">
                    <div className="text-center p-4">
                      <p className="text-2xl font-bold text-amber-600">150 EGP</p>
                      <p className="text-xs text-muted-foreground">شامل الطباعة الفاخرة والتوصيل</p>
                    </div>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 h-12" onClick={() => setView('payment')}>
                      اطلب النسخة المطبوعة الآن
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-emerald-50 rounded-lg text-emerald-700 border border-emerald-100">
                    <Check className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold">تم تأكيد الطلب</p>
                    <p className="text-xs">جاري المراجعة والبدء في الطباعة</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Button variant="ghost" className="w-full" onClick={onBack}>إنشاء قصة جديدة</Button>
          </div>
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto border-amber-200">
          <CardHeader className="text-center">
             <CardTitle className="text-2xl font-heading">تأكيد الدفع</CardTitle>
             <CardDescription>قم بالتحويل عبر إنستا باي وأرفق صورة الإيصال</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
             <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-200">
                <img src="./assets/logo-instapay-eg.png" alt="InstaPay" className="h-8 opacity-80" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">عنوان الدفع (IPA)</p>
                  <p className="text-xl font-mono font-bold text-amber-900">khayal@instapay</p>
                </div>
                <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-inner flex items-center justify-center">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=khayal@instapay" alt="QR Code" />
                </div>
             </div>

             <div className="space-y-4">
                <Label>أرفق صورة التحويل</Label>
                <div className={cn(
                  "relative h-32 border-2 border-dashed rounded-xl flex items-center justify-center transition-all",
                  screenshot ? "border-emerald-500 bg-emerald-50" : "border-amber-200 bg-amber-50/30 hover:bg-amber-50"
                )}>
                  {screenshot ? (
                    <div className="flex items-center gap-3">
                      <Check className="text-emerald-500" />
                      <span className="text-sm font-medium">تم اختيار الصورة</span>
                      <Button variant="ghost" size="sm" onClick={() => setScreenshot(null)}>تغيير</Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-amber-400">
                      <Upload className="w-8 h-8" />
                      <span className="text-xs">اضغط هنا لرفع الصورة</span>
                    </div>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePaymentUpload} />
                </div>
             </div>

             <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setView('preview')}>رجوع</Button>
                <Button 
                  className="flex-[2] bg-amber-600 hover:bg-amber-700" 
                  disabled={!screenshot || submitting}
                  onClick={submitPayment}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                  تأكيد إرسال الدفع
                </Button>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
