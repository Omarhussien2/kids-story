import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  Star, 
  Heart, 
  Gift,
  ArrowRight,
  Menu,
  ShieldCheck,
  Zap,
  Smile,
  User
} from 'lucide-react';
import { cn } from './lib/utils';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { CreationWizard, ShowcaseGallery, StoryResult } from './features/StoryMagic';
import { AdminDashboard } from './features/AdminDashboard';

function App() {
  const [view, setView] = useState<'landing' | 'wizard' | 'story' | 'admin'>('landing');
  const [activeStoryId, setActiveStoryId] = useState<number | null>(null);

  const ADMIN_PASSWORD = 'admin123';

  const openWhatsApp = (message: string) => {
    const phone = '201152806034';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleAdminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setView('admin');
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const handleStartMagic = () => {
    console.log("[ACTION_START] Starting Magic Flow");
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView('wizard');
  };

  const handleCreationComplete = (story: any) => {
    console.log("[ACTION_COMPLETE] Story Generated", story.id);
    setActiveStoryId(story.id);
    setView('story');
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-lime-200 selection:text-lime-900 overflow-x-hidden font-body">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-lime-400/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-400/5 blur-[80px] rounded-full" />
      </div>
      
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6 max-w-7xl mx-auto flex items-center justify-between" dir="rtl">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-12 h-12 bg-[#7FCC00] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="font-heading text-2xl font-black text-slate-900 tracking-tight">أرنوب</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-slate-600 font-bold">
            <button className="hover:text-[#7FCC00] transition-colors" onClick={() => setView('landing')}>إزاي بنشتغل؟</button>
            <button className="hover:text-[#7FCC00] transition-colors">التحديات</button>
            <button className="hover:text-[#7FCC00] transition-colors">شكل القصص</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-slate-600 font-bold hidden md:inline-flex">تسجيل دخول</Button>
          <Button className="btn-primary" onClick={handleStartMagic}>ابدأ القصة دلوقتى</Button>
        </div>
      </nav>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-32"
            >
              {/* Hero Section */}
              <section className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-10 text-right order-2 lg:order-1" dir="rtl">
                  <header className="space-y-6">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-2 bg-lime-50 text-[#7FCC00] px-4 py-2 rounded-full font-bold text-sm border border-lime-100"
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                      جديد: أول حواديت مألفة بالذكاء الاصطناعي
                    </motion.div>
                    
                    <h1 className="text-6xl md:text-8xl font-black text-slate-950 leading-[1.1]">
                      قصص طفلك من <br/> 
                      تأليف <span className="text-[#7FCC00]">أرنوب</span>
                    </h1>
                  </header>
                  
                  <p className="text-xl text-slate-600 max-w-xl leading-relaxed font-bold">
                    أرنوب يحول بيانات طفلك لقصة بطلها هو نفسه، مكتوبة بالعامية المصرية الدافئة عشان يتعلم القيم وهو مستمتع.
                  </p>

                  <div className="flex flex-wrap items-center gap-6 pt-4">
                    <Button size="lg" className="btn-primary h-16 px-12 text-2xl shadow-xl shadow-lime-500/20" onClick={handleStartMagic}>
                      ابدأ القصة دلوقتى
                    </Button>
                    <Button size="lg" className="btn-outline h-16 px-10 text-xl" onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}>
                      شوف نماذج
                    </Button>
                  </div>
                </div>

                {/* Hero Illustration Area */}
                <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
                  <motion.div 
                    className="relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <div className="absolute inset-0 bg-lime-400 opacity-20 blur-[120px] rounded-full" />
                    <img 
                      src="./assets/hero-mascot.png" 
                      alt="Arnowb Mascot" 
                      className="relative z-10 w-full max-w-lg drop-shadow-[0_30px_60px_rgba(127,204,0,0.4)]" 
                    />
                    {/* Floating Stats - Image Style */}
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -top-10 -right-10 bg-white p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-4 border border-slate-50"
                    >
                      <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center text-[#7FCC00]">
                        <Star className="w-6 h-6 fill-current" />
                      </div>
                      <div className="text-right" dir="rtl">
                        <p className="text-2xl font-black text-slate-900 leading-none">٤.٩ / ٥</p>
                        <p className="text-xs font-bold text-slate-400">تقييم عائلاتنا</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </section>

              {/* Stats Bar */}
              <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 py-20 border-y border-slate-100">
                {[
                  { label: 'قصة تم تأليفها', value: '+٥,٠٠٠', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-50' },
                  { label: 'أب وأم سعيدين', value: '+٢,٠٠٠', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { label: 'ساعة من القراءة', value: '+١٠,٠٠٠', icon: Zap, color: 'text-lime-500', bg: 'bg-lime-50' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-6 justify-center">
                    <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center", stat.bg, stat.color)}>
                      <stat.icon className="w-8 h-8" />
                    </div>
                    <div className="text-right" dir="rtl">
                      <h4 className="text-4xl font-black text-slate-900 leading-none mb-2">{stat.value}</h4>
                      <p className="text-slate-400 font-bold">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </section>

              {/* How It Works - Match Image */}
              <section className="max-w-7xl mx-auto px-6 py-20 bg-white rounded-[5rem] shadow-inner">
                <div className="text-center mb-24 space-y-4">
                  <h2 className="text-5xl font-black text-slate-900">إزاي أرنوب بيشتغل؟</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                  <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-50 -translate-y-[150%] z-0" />
                  {[
                    { title: 'دخل البيانات', desc: 'اكتب اسم طفلك، سنه، واختار الشخصية اللي بيحبها والتحدي اللي بيواجهه.', step: '١', icon: '📝', color: 'bg-blue-500' },
                    { title: 'أرنوب بيكتب', desc: 'بذكاء أرنوب الخارق، هيألف قصة فريدة بالعامية المصرية بطلها هو طفلك.', step: '٢', icon: '🐰', color: 'bg-lime-500' },
                    { title: 'القصة توصلك', desc: 'اقرأها فوراً أونلاين، أو اطلبها نسخة مطبوعة فاخرة توصلك لحد باب البيت.', step: '٣', icon: '🎁', color: 'bg-orange-500' },
                  ].map((item, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                      <div className="relative mb-8">
                        <div className={cn("w-20 h-20 rounded-[2rem] shadow-xl text-white flex items-center justify-center text-3xl transition-transform group-hover:scale-110 group-hover:rotate-3", item.color)}>
                          <span className="text-4xl">{item.icon}</span>
                        </div>
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg font-black text-[#7FCC00]">
                          {item.step}
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                      <p className="text-slate-500 font-bold leading-relaxed max-w-[280px]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Showcase Gallery Section */}
              <section id="gallery" className="max-w-7xl mx-auto px-6 py-20 relative">
                <div className="text-center mb-16 space-y-4">
                  <Badge className="bg-lime-100 text-[#7FCC00] hover:bg-lime-100 border-none font-bold px-4 py-1">مكتبة أرنوب السحرية</Badge>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">قصص غيرت حياة أصحابها</h2>
                  <p className="text-slate-500 font-medium max-w-xl mx-auto">تصفح النماذج اللي عملناها قبل كدة وشوف إزاي أرنوب بيجسد طفلك في كل صفحة.</p>
                </div>
                <ShowcaseGallery />
              </section>
              
              {/* Footer Modernized */}
              <footer className="border-t border-slate-200 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-16">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-right" dir="rtl">
                    <div className="md:col-span-2 space-y-6">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#7FCC00] rounded-xl flex items-center justify-center transform rotate-3">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-heading text-xl font-black text-slate-950">خيال مصر</span>
                      </div>
                      <p className="text-slate-500 font-medium leading-relaxed max-w-md">
                        بنكبر معاك ومع طفلك، بنحاول نخلي القراءة والتعلم تجربة سحرية مش مجرد واجب، خيال مصر هو بوابتك لعالم مخصص بالكامل لبطل بيتك.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-black text-slate-900">روابط سريعة</h4>
                      <ul className="space-y-3 text-slate-500 font-bold">
                        <li><button onClick={() => setView('landing')} className="hover:text-[#7FCC00]">الرئيسية</button></li>
                        <li><button className="hover:text-[#7FCC00]">قصصنا</button></li>
                        <li><button onClick={() => openWhatsApp("أهلاً خيال مصر، أريد الاستفسار عن خدمة القصص")} className="hover:text-[#7FCC00]">واتساب</button></li>
                        <li><button onClick={() => {
                           const p = prompt("أدخل كلمة مرور الإدارة:");
                           if(p) handleAdminLogin(p);
                        }} className="hover:text-[#7FCC00]">الإدارة</button></li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-black text-slate-900">قانوني</h4>
                      <ul className="space-y-3 text-slate-500 font-bold">
                        <li><a href="#" className="hover:text-[#7FCC00]">سياسة الخصوصية</a></li>
                        <li><a href="#" className="hover:text-[#7FCC00]">الشروط والأحكام</a></li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-slate-400">
                    <p>© 2026 جميع الحقوق محفوظة لـ خيال مصر</p>
                    <p>صنع بكل حب في مصر 🇪🇬</p>
                  </div>
                </div>
              </footer>
            </motion.div>
          )}

          {view === 'wizard' && (
            <motion.div 
              key="wizard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6 pt-12 pb-20"
            >
              <CreationWizard onComplete={handleCreationComplete} />
              <div className="text-center mt-12">
                 <Button variant="ghost" className="text-slate-400 font-bold hover:text-slate-600" onClick={() => setView('landing')}>رجوع للرئيسية</Button>
              </div>
            </motion.div>
          )}

          {view === 'story' && activeStoryId && (
             <motion.div 
              key="story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 pt-12 pb-20"
            >
              <StoryResult storyId={activeStoryId} onBack={() => setView('landing')} />
            </motion.div>
          )}

          {view === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-1"
            >
              <AdminDashboard onBack={() => setView('landing')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;

