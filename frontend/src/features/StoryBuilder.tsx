import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { streamCall } from '../api';
import { cn } from '../lib/utils';
import { Sparkles, ArrowRight, ArrowLeft, BookOpen, User, Calendar, Smile, Wand2, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryBuilderProps {
  onStoryGenerated: (storyId: number, content: string) => void;
  onBack: () => void;
}

export const StoryBuilder: React.FC<StoryBuilderProps> = ({ onStoryGenerated, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    child_name: '',
    age: '5',
    gender: 'boy',
    challenge: 'overcoming fear of the dark'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [generatedStoryId, setGeneratedStoryId] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streamingContent]);

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setStreamingContent('');
    setProgress(10);
    setStatus('بدأنا نألف الحكاية...');
    setStep(3);

    try {
      await streamCall({
        func: 'generate_story_streaming',
        args: {
          child_name: formData.child_name,
          age: parseInt(formData.age),
          gender: formData.gender,
          challenge: formData.challenge
        },
        onChunk: (chunk) => {
          if (chunk.status) setStatus(chunk.status || '');
          if (chunk.progress) setProgress(chunk.progress || 0);
          if (chunk.chunk) {
            setStreamingContent(prev => prev + chunk.chunk);
          }
          if (chunk.story_id) setGeneratedStoryId(chunk.story_id);
          if (chunk.result && chunk.result.story_id) setGeneratedStoryId(chunk.result.story_id);
        },
        onError: (err) => {
          console.error("[GENERATION_ERROR]", err);
          setStatus('حصل خطأ في التوليد، حاول تاني.');
          setIsGenerating(false);
        }
      });
      setIsGenerating(false);
      setProgress(100);
      setStatus('القصة جاهزة! يا بطل');
    } catch (err) {
      console.error("[GENERATION_FATAL]", err);
      setIsGenerating(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-12 min-h-[80vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-heading font-bold text-amber-900">مين البطل النهاردة؟</h2>
              <p className="text-muted-foreground text-right">اكتب لنا شوية تفاصيل عن طفلك عشان نألف له حكاية خاصة بيه.</p>
            </div>
            
            <Card className="shadow-elevated border-amber-100 overflow-hidden">
              <div className="h-2 bg-amber-400 w-full" />
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-lg flex items-center gap-2 justify-end">
                      <User className="h-4 w-4 text-amber-500" />
                      اسم الطفل
                    </Label>
                    <Input 
                      placeholder="زياد، نور، مريم..." 
                      className="text-lg py-6 text-right"
                      value={formData.child_name}
                      onChange={e => setFormData({...formData, child_name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-lg flex items-center gap-2 justify-end">
                        <Calendar className="h-4 w-4 text-amber-500" />
                        العمر
                      </Label>
                      <Select value={formData.age} onValueChange={val => setFormData({...formData, age: val})}>
                        <SelectTrigger className="py-6 text-lg text-right">
                          <SelectValue placeholder="اختر العمر" />
                        </SelectTrigger>
                        <SelectContent>
                          {[3,4,5,6,7,8,9,10,11,12].map(n => (
                            <SelectItem key={n} value={n.toString()}>{n} سنين</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-lg flex items-center gap-2 justify-end">
                        <Smile className="h-4 w-4 text-amber-500" />
                        النوع
                      </Label>
                      <div className="flex gap-2">
                        <Button 
                          variant={formData.gender === 'boy' ? 'default' : 'outline'}
                          className="flex-1 py-6"
                          onClick={() => setFormData({...formData, gender: 'boy'})}
                        >ولد</Button>
                        <Button 
                          variant={formData.gender === 'girl' ? 'default' : 'outline'}
                          className="flex-1 py-6"
                          onClick={() => setFormData({...formData, gender: 'girl'})}
                        >بنت</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-amber-50/50 p-6 flex justify-between">
                <Button variant="ghost" onClick={onBack}>رجوع</Button>
                <Button 
                  onClick={nextStep} 
                  disabled={!formData.child_name}
                  className="rounded-full px-8 py-6 text-lg bg-amber-600 hover:bg-amber-700"
                >
                  الخطوة الجاية <ArrowRight className="mr-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-heading font-bold text-amber-900">إيه المغامرة المطلوبة؟</h2>
              <p className="text-muted-foreground text-right">ممكن القصة تساعده يواجه خوفه، يحب القراءة، أو يتعلم قيمة جديدة.</p>
            </div>
            
            <Card className="shadow-elevated border-amber-100 overflow-hidden">
              <div className="h-2 bg-amber-400 w-full" />
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg text-right block">اختار التحدي أو القيمة</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'fear', label: 'الخوف من الضلمة', desc: 'عشان ينام وهو مطمن.' },
                      { id: 'friends', label: 'تكوين صداقات', desc: 'حب الغير والمشاركة.' },
                      { id: 'health', label: 'حب الأكل الصحي', desc: 'أهمية الخضار والفاكهة.' },
                      { id: 'reading', label: 'حب القراءة', desc: 'عالم الكتب الممتع.' },
                      { id: 'custom', label: 'تحدي مخصص', desc: 'اكتب اللي تحبه.' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setFormData({...formData, challenge: item.label})}
                        className={cn(
                          "text-right p-4 rounded-xl border-2 transition-all hover:border-amber-400",
                          formData.challenge === item.label ? "border-amber-500 bg-amber-50 shadow-md" : "border-muted bg-white"
                        )}
                      >
                        <div className="font-bold text-amber-900">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                  
                  {formData.challenge === 'تحدي مخصص' && (
                    <div className="pt-4 space-y-2">
                      <Label className="text-right block">اكتب التحدي هنا</Label>
                      <Input 
                        placeholder="مثلاً: الخوف من أول يوم مدرسة" 
                        className="py-6 text-right"
                        onChange={e => setFormData({...formData, challenge: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-amber-50/50 p-6 flex justify-between">
                <Button variant="ghost" onClick={prevStep}>رجوع</Button>
                <Button 
                  onClick={handleStartGeneration}
                  className="rounded-full px-8 py-6 text-lg bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/20"
                >
                  ألف الحكاية بالسحر <Wand2 className="mr-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-2">
                <Sparkles className="h-8 w-8 text-amber-600 animate-pulse" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-amber-900">{status}</h2>
              <div className="max-w-md mx-auto space-y-1">
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-muted-foreground text-center">{progress}% تم</p>
              </div>
            </div>

            <Card className="shadow-2xl border-none overflow-hidden relative min-h-[500px] flex flex-col">
              {/* Paper Texture Overlay */}
              <div 
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{ backgroundImage: "url('./assets/texture-paper.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-white/30 pointer-events-none" />
              
              <CardContent className="relative flex-1 p-8 md:p-12 overflow-y-auto" ref={scrollRef}>
                <div className="max-w-2xl mx-auto space-y-6">
                  {streamingContent ? (
                    <div className="prose prose-amber prose-lg max-w-none text-right font-medium leading-loose text-amber-950 whitespace-pre-wrap">
                      {streamingContent}
                      {isGenerating && <span className="inline-block w-2 h-6 bg-amber-500 animate-pulse mr-1" />}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground space-y-4">
                      <BookOpen className="h-12 w-12 opacity-20" />
                      <p>بيتم تحضير القلم السحري...</p>
                    </div>
                  )}
                </div>
              </CardContent>

              {!isGenerating && streamingContent && (
                <CardFooter className="relative bg-white/80 backdrop-blur-sm border-t p-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-700 font-medium">
                    <Check className="h-5 w-5 bg-amber-100 rounded-full p-1" />
                    تم تأليف القصة بنجاح!
                  </div>
                  <Button 
                    size="xl"
                    onClick={() => onStoryGenerated(generatedStoryId!, streamingContent)}
                    className="rounded-full px-12 py-8 text-xl bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-600/30 w-full sm:w-auto"
                  >
                    اطبع الكتاب لطفلك <ArrowRight className="mr-2 h-6 w-6" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
