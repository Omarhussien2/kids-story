import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { rpcCall, invalidateCache } from '../api';
import { cn } from '../lib/utils';
import { CreditCard, Upload, Check, Printer, Truck, FileText, Smartphone, ArrowRight, Download, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Checkout Component ---
interface CheckoutProps {
  storyId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ storyId, onSuccess, onBack }) => {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!screenshot) return;
    setIsSubmitting(true);
    setError('');

    try {
      await rpcCall({
        func: 'submit_payment',
        args: { story_id: storyId, screenshot_base64: screenshot }
      });
      invalidateCache(['get_order_status']);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'حصل خطأ في رفع إثبات الدفع، حاول تاني.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-heading font-bold text-amber-900">الخطوة الأخيرة: ادفع بـ إنستا باي</h2>
        <p className="text-muted-foreground">قيمة القصة المطبوعة ٢٠٠ جنيه شاملة التوصيل لأي مكان في مصر.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-elevated border-amber-100 flex flex-col items-center p-8 space-y-6 text-center">
          <img src="./assets/logo-instapay-eg.png" alt="InstaPay" className="h-16 object-contain" />
          <div className="space-y-4 w-full">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex flex-col items-center space-y-2">
              <span className="text-sm text-muted-foreground">رقم إنستا باي / IPA</span>
              <span className="text-xl font-bold font-heading text-amber-900 select-all">khayal_masr@instapay</span>
              <Button size="sm" variant="ghost" className="text-amber-600">نسخ الرقم</Button>
            </div>
            <div className="text-sm text-muted-foreground text-right space-y-2">
              <p>١. افتح تطبيق إنستا باي.</p>
              <p>٢. ابعت ٢٠٠ جنيه للرقم اللي فوق.</p>
              <p>٣. خد لقطة شاشة (Screenshot) للتحويل.</p>
              <p>٤. ارفع الصورة هنا عشان نبدأ الطباعة.</p>
            </div>
          </div>
        </Card>

        <Card className="shadow-elevated border-amber-100 flex flex-col">
          <CardHeader>
            <CardTitle className="font-heading">رفع إثبات الدفع</CardTitle>
            <CardDescription>ارفع لقطة شاشة التحويل هنا</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-center">
            {screenshot ? (
              <div className="relative group rounded-xl overflow-hidden border-2 border-emerald-500 shadow-lg">
                <img src={screenshot} alt="Payment Proof" className="w-full h-auto" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="outline" className="text-white border-white hover:text-white" onClick={() => setScreenshot(null)}>تغيير الصورة</Button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-amber-200 rounded-2xl p-12 flex flex-col items-center space-y-4 cursor-pointer hover:bg-amber-50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-amber-600" />
                </div>
                <div className="text-center">
                  <span className="font-bold text-amber-900 block">اختر الصورة</span>
                  <span className="text-sm text-muted-foreground">JPG, PNG, PDF</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}

            {error && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-amber-50/50 p-6">
            <Button 
              className="w-full py-6 text-lg rounded-full" 
              disabled={!screenshot || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'بيتم الرفع...' : 'تأكيد الطلب'}
              <Check className="mr-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// --- OrderTracking Component ---
interface OrderTrackingProps {
  storyId: number;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ storyId }) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = React.useCallback(async () => {
    try {
      const data = await rpcCall({ func: 'get_order_status', args: { story_id: storyId } });
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  React.useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 15000); // Poll every 15s
    return () => clearInterval(timer);
  }, [fetchStatus]);

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
      <p className="text-muted-foreground">جاري تحميل حالة الطلب...</p>
    </div>
  );

  if (!order) return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
      <AlertCircle className="h-12 w-12 text-rose-500" />
      <h2 className="text-2xl font-heading font-bold">الطلب مش موجود!</h2>
      <p className="text-muted-foreground">اتأكد من رقم القصة أو تواصل معانا.</p>
    </div>
  );

  const stages = [
    { id: 'ready', label: 'تأليف القصة', icon: FileText, desc: 'القصة اتألفت بالسحر.' },
    { id: 'paid', label: 'تأكيد الدفع', icon: CreditCard, desc: 'بنراجع تحويل الإنستا باي.' },
    { id: 'printing', label: 'الطباعة', icon: Printer, desc: 'الكتاب بيطبع دلوقتي.' },
    { id: 'shipped', label: 'التوصيل', icon: Truck, desc: 'الطيار في الطريق ليك.' }
  ];

  const currentIdx = stages.findIndex(s => s.id === order.status);
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-heading font-bold text-amber-900">تتبع رحلة حكايتكم</h2>
        <div className="inline-block px-4 py-2 bg-amber-100 rounded-full text-amber-700 font-bold">
          رقم القصة: #{storyId}
        </div>
      </div>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0 hidden md:block" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-1000 hidden md:block" 
          style={{ width: `${(currentIdx / (stages.length - 1)) * 100}%` }}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {stages.map((stage, i) => {
            const isActive = i <= currentIdx;
            const isCurrent = i === currentIdx;
            
            return (
              <div key={stage.id} className="flex flex-col items-center text-center space-y-4">
                <motion.div 
                  initial={false}
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500",
                    isActive ? "bg-amber-500 border-amber-200 text-white shadow-lg shadow-amber-500/30" : "bg-white border-muted text-muted-foreground"
                  )}
                >
                  <stage.icon className="h-7 w-7" />
                </motion.div>
                <div className="space-y-1">
                  <h4 className={cn("font-bold text-lg", isActive ? "text-amber-900" : "text-muted-foreground")}>{stage.label}</h4>
                  <p className="text-sm text-muted-foreground px-2">{stage.desc}</p>
                </div>
                {isCurrent && (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 animate-pulse">الحالة الحالية</Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card className="shadow-elevated border-amber-100 bg-gradient-to-br from-amber-50/50 to-white overflow-hidden">
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-48 rounded-xl overflow-hidden shadow-lg transform -rotate-3 border-8 border-white">
            <img src="./assets/card-book-open.jpg" alt="Story Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-right">
            <h3 className="text-2xl font-bold font-heading text-amber-900">حكايتكم بتتحول لواقع!</h3>
            <p className="text-muted-foreground leading-relaxed">
              فريق خيال مصر مهتم جداً بكل تفصيلة في قصة بطلنا الصغير. القصة دلوقتي في مرحلة {stages[currentIdx].label}، وهتوصل لكم قريب جداً.
            </p>
            <div className="pt-2 flex flex-wrap justify-center md:justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Download className="mr-2 h-4 w-4" /> تحميل نسخة PDF
              </Button>
              <Button size="sm" onClick={fetchStatus}>
                تحديث الحالة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-8">
        <Button variant="ghost" className="text-muted-foreground" onClick={() => window.location.reload()}>
          الرجوع للرئيسية
        </Button>
      </div>
    </div>
  );
};

// Simple reusable Badge if not in components/ui
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold border", className)}>
    {children}
  </span>
);
