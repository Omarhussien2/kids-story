import React, { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { cn } from '../lib/utils';
import { Sparkles, BookOpen, CreditCard, Truck, Printer, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onStart: () => void;
  onTrack: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onTrack }) => {
  useEffect(() => {
    console.log("[LANDING_RENDER]");
  }, []);

  const features = [
    {
      title: "ابنك هو البطل",
      desc: "قصص مخصصة باسم وشخصية طفلك في قلب المغامرة.",
      icon: Sparkles,
      color: "text-amber-500",
      bg: "bg-amber-100"
    },
    {
      title: "محتوى مصري أصيل",
      desc: "حكايات بالعامية المصرية الدافئة اللي طفلك بيفهمها ويحبها.",
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-100"
    },
    {
      title: "جودة الطباعة",
      desc: "كتاب فاخر مطبوع بجودة عالية ليكون ذكرى تدوم طويلاً.",
      icon: Printer,
      color: "text-rose-500",
      bg: "bg-rose-100"
    }
  ];

  const steps = [
    { title: "احكي لنا", desc: "اكتب اسم طفلك والتحدي اللي بيواجهه." },
    { title: "اسمع الحكاية", desc: "بنألف قصة مخصصة لطفلك في ثواني." },
    { title: "ادفع واستلم", desc: "ادفع بـ إنستا باي واستلم كتابك مطبوع." }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7FCC00]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 blur-[120px] rounded-full" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-right order-2 lg:order-1"
            dir="rtl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-100 text-[#7FCC00] font-black text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              أول منصة قصص أطفال بذكاء اصطناعي مصري
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 leading-[1.1]">
              خلي طفلك <span className="text-[#7FCC00]">بطل</span> حكايته
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-bold max-w-2xl leading-relaxed">
              بنألف لطلفلك قصة مخصصة باسمه وصورته، بتساعده يواجه تحدياته اليومية بالعامية المصرية اللي بنحبها.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="xl" 
                onClick={onStart}
                className="btn-primary text-xl px-12 py-8 rounded-[2rem] shadow-2xl shadow-lime-500/20"
              >
                ابدأ المغامرة الآن
                <Sparkles className="mr-3 h-6 w-6" />
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                onClick={onTrack}
                className="bg-white border-2 border-slate-100 text-slate-600 text-xl px-12 py-8 rounded-[2rem] hover:bg-slate-50 transition-all font-bold"
              >
                تتبع طلبك
                <Truck className="mr-3 h-6 w-6" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square">
               <div className="absolute inset-0 bg-gradient-to-br from-[#7FCC00]/20 to-transparent rounded-[4rem] rotate-6 scale-95" />
               <img 
                 src="./assets/hero-mascot.png" 
                 alt="أرنوب" 
                 className="relative z-10 w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(127,204,0,0.3)]" 
               />
               <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl z-20 hidden md:block animate-bounce-slow">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                        <Star className="text-amber-500 fill-amber-500" />
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-slate-400 font-black">تقييم الأمهات</p>
                        <p className="font-black text-slate-900">٤.٩ / ٥ نجوم</p>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Value Prop */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card className="border-none shadow-soft hover:shadow-elevated transition-shadow duration-300 h-full overflow-hidden group">
                  <div className={cn("h-2 w-full", f.bg.replace('100', '500'))} />
                  <CardContent className="p-8 space-y-4">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12", f.bg)}>
                      <f.icon className={cn("h-7 w-7", f.color)} />
                    </div>
                    <h3 className="text-2xl font-bold font-heading">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Magical Quote Section */}
      <section className="relative py-40 px-4 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-pattern opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <div className="w-24 h-24 bg-[#7FCC00] rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-12">
            <Star className="h-12 w-12 text-white fill-white animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            "القراءة للطفل هي أول خطوة في بناء عالم من الخيال اللامحدود"
          </h2>
          <div className="flex flex-col items-center gap-4">
             <div className="px-8 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
                <p className="text-[#7FCC00] text-2xl font-black">سعر القصة المطبوعة: ٢٠٠ جنيه شامل التوصيل</p>
             </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 px-4 bg-amber-50/50">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-heading font-bold">إزاي بنعمل السحر ده؟</h2>
            <p className="text-muted-foreground text-lg">تلات خطوات بسيطة وتكون القصة بين إيديك</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((s, i) => (
              <div key={i} className="relative flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center text-2xl font-bold z-10 shadow-lg">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-amber-200 -z-0" />
                )}
                <h4 className="text-xl font-bold pt-2">{s.title}</h4>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="pt-8 flex justify-center">
            <Button onClick={onStart} size="lg" className="rounded-full px-12 py-6 text-lg">
              ابدأ الآن <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#7FCC00] rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <span className="font-black text-3xl text-slate-900 tracking-tighter">أرنوب</span>
              </div>
              <div className="flex flex-wrap justify-center gap-10 text-lg font-bold text-slate-400">
                <a href="#" className="hover:text-[#7FCC00] transition-colors">عن أرنوب</a>
                <a href="#" className="hover:text-[#7FCC00] transition-colors">سياسة الخصوصية</a>
                <a href="#" className="hover:text-[#7FCC00] transition-colors">تواصل معنا</a>
              </div>
           </div>
           
           <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 font-bold">
              <p>© ٢٠٢٦ أرنوب. جميع الحقوق محفوظة.</p>
              <div className="flex items-center gap-2">
                 صُنع بكل <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> في مصر
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};
