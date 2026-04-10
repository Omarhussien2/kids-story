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
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('./assets/hero-reading-mother-1.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background bg-mesh" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
              خيال مصر
            </h1>
            <p className="text-xl md:text-3xl text-white/90 font-medium max-w-3xl mx-auto drop-shadow-md leading-relaxed">
              كل طفل يستحق يكون بطل حكايته الخاصة بالعامية المصرية اللي بنحبها.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="xl" 
              onClick={onStart}
              className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-10 py-8 rounded-full shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              ابدأ تأليف حكايتك الآن
              <Sparkles className="mr-2 h-5 w-5" />
            </Button>
            <Button 
              size="xl" 
              variant="outline"
              onClick={onTrack}
              className="bg-white/10 backdrop-blur-md border-white/30 text-white text-lg px-10 py-8 rounded-full hover:bg-white/20 transition-all"
            >
              تتبع طلبك
              <Truck className="mr-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
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
      <section className="relative py-32 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.4]"
          style={{ backgroundImage: "url('./assets/bg-starry-night.jpg')" }}
        />
        <div className="absolute inset-0 bg-blue-900/40" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <Star className="h-12 w-12 text-amber-400 mx-auto animate-pulse" />
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight">
            "القراءة للطفل هي أول خطوة في بناء عالم من الخيال اللامحدود"
          </h2>
          <div className="h-1 w-24 bg-amber-400 mx-auto rounded-full" />
          <p className="text-amber-100 text-xl">سعر القصة المطبوعة: ٢٠٠ جنيه مصري فقط</p>
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
      <footer className="py-12 px-4 border-t bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <span className="font-heading font-bold text-xl text-amber-900">خيال مصر</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-amber-600 transition-colors">عن المشروع</a>
            <a href="#" className="hover:text-amber-600 transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-amber-600 transition-colors">تواصل معنا</a>
          </div>
          <p className="text-sm text-muted-foreground">© ٢٠٢٦ خيال مصر. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};
