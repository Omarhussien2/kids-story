import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  Star, 
  Heart, 
  Gift,
  ArrowRight
} from 'lucide-react';
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

  useEffect(() => {
    console.log("RENDER_SUCCESS");
    
    // Floating particles CSS
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(20px, -40px); }
      }
      .animate-float {
        animation: float ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleStartMagic = () => {
    console.log("[ACTION_START] Starting Magic Flow");
    setView('wizard');
  };

  const handleCreationComplete = (story: any) => {
    console.log("[ACTION_COMPLETE] Story Generated", story.id);
    setActiveStoryId(story.id);
    setView('story');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] selection:bg-amber-200 selection:text-amber-900 overflow-x-hidden font-sans">
      {/* Background Textures */}
      <div 
        className="fixed inset-0 pointer-events-none bg-repeat opacity-[0.03] z-0" 
        style={{ backgroundImage: "url('./assets/bg-paper-texture.jpg')" }}
      />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-amber-100 p-2 rounded-xl shadow-inner border border-amber-200">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <span className="font-heading text-2xl font-black text-amber-900 tracking-tight">خيال مصر</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-amber-800 hidden md:inline-flex" onClick={() => setView('landing')}>الرئيسية</Button>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-6 shadow-lg shadow-amber-200" onClick={handleStartMagic}>ابدأ السحر</Button>
        </div>
      </nav>

      <main className="relative z-10 pb-20">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-24"
            >
              {/* Hero Section */}
              <section className="relative max-w-7xl mx-auto px-6 pt-12 md:pt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 text-right order-2 lg:order-1" dir="rtl">
                  <motion.div 
                    initial={{ x: 50, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200 px-4 py-1.5 mb-6 text-sm">
                      ✨ قصص مخصصة بلهجة مصرية عامية
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-heading font-black text-amber-950 leading-tight">
                      كل طفل هو بطل <br/> 
                      <span className="text-amber-600 relative">
                        قصته السحرية
                        <motion.div 
                          className="absolute -bottom-2 left-0 right-0 h-3 bg-amber-200/50 -z-10 rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 1, duration: 0.8 }}
                        />
                      </span>
                    </h1>
                  </motion.div>
                  
                  <motion.p 
                    className="text-xl text-amber-800/70 max-w-xl leading-relaxed"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    حوّل طفلك إلى شخصية رئيسية في قصة تعليمية ملهمة. ارفع صورته، اختر التحدي، واترك السحر لنا ليؤلف له مغامرته الخاصة.
                  </motion.p>

                  <motion.div 
                    className="flex flex-wrap items-center gap-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 h-14 text-lg rounded-2xl shadow-xl shadow-amber-200 group" onClick={handleStartMagic}>
                      اصنع القصة الآن 
                      <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-amber-200 text-amber-800 bg-white/50 backdrop-blur" onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}>
                      شاهد النماذج <BookOpen className="mr-2 h-5 w-5" />
                    </Button>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-8 pt-8 opacity-60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-500 text-amber-500" /> <span className="text-sm font-bold">1000+ قصة</span></div>
                    <div className="flex items-center gap-2"><Heart className="h-4 w-4 fill-amber-500 text-amber-500" /> <span className="text-sm font-bold">تقييم 5 نجوم</span></div>
                  </motion.div>
                </div>

                <motion.div 
                  className="relative order-1 lg:order-2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white group">
                    <img 
                      src="./assets/hero-magical-book.jpg" 
                      alt="Magical Book" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 via-transparent to-transparent" />
                  </div>
                  
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-amber-50 overflow-hidden"
                  >
                    <img src="./assets/card-character-1.jpg" alt="Child" className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-500 rounded-full shadow-2xl flex items-center justify-center border-4 border-white p-4"
                  >
                    <Gift className="w-16 h-16 text-white" />
                  </motion.div>
                </motion.div>
              </section>

              {/* Showcase Section */}
              <section id="gallery" className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center mb-16 space-y-4">
                  <h2 className="text-4xl font-heading font-black text-amber-950">مكتبة خيال</h2>
                  <p className="text-amber-800/60 max-w-xl mx-auto">تصفح نماذج من قصصنا المطبوعة والتي غيرت حياة أبطالنا الصغار</p>
                </div>
                <ShowcaseGallery />
              </section>
              
              {/* Footer */}
              <footer className="border-t border-amber-100 mt-20 bg-amber-50/30">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
                   <div className="flex items-center gap-2">
                     <Sparkles className="w-5 h-5 text-amber-600" />
                     <span className="font-heading font-bold text-amber-900">خيال مصر - 2026</span>
                   </div>
                   <div className="flex gap-6 text-sm text-amber-800/60">
                     <button onClick={() => openWhatsApp("أهلاً خيال مصر، أريد الاستفسار عن خدمة القصص")} className="hover:text-amber-900 flex items-center gap-1">
                       تواصل واتساب
                     </button>
                     <button onClick={() => {
                       const p = prompt("أدخل كلمة مرور الإدارة:");
                       if(p) handleAdminLogin(p);
                     }} className="hover:text-amber-900">الإدارة</button>
                     <a href="#" className="hover:text-amber-900">سياسة الخصوصية</a>
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
              className="max-w-7xl mx-auto px-6 pt-12"
            >
              <CreationWizard onComplete={handleCreationComplete} />
              <div className="text-center mt-8 pb-10">
                 <Button variant="ghost" onClick={() => setView('landing')}>رجوع للرئيسية</Button>
              </div>
            </motion.div>
          )}

          {view === 'story' && activeStoryId && (
             <motion.div 
              key="story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 pt-12"
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
            >
              <AdminDashboard onBack={() => setView('landing')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Magical Floating Particles */}
      <div className="magical-particles pointer-events-none fixed inset-0 overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-amber-400/10 blur-xl animate-float"
            style={{
              width: Math.random() * 100 + 50 + 'px',
              height: Math.random() * 100 + 50 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 10 + 10 + 's'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
