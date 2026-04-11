import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { rpcCall, invalidateCache } from '../api';
import { cn } from '../lib/utils';
import { LayoutDashboard, Users, CreditCard, Printer, Truck, FileText, CheckCircle2, MoreHorizontal, RefreshCw, Star, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchOrders = React.useCallback(async () => {
    try {
      const data = await rpcCall({ func: 'admin_get_orders' });
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (storyId: number, newStatus: string) => {
    setUpdating(storyId);
    try {
      await rpcCall({ func: 'admin_update_status', args: { story_id: storyId, status: newStatus } });
      invalidateCache(['admin_get_orders', 'get_order_status']);
      fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'ready': 'bg-orange-100 text-orange-700 border-orange-200',
      'paid': 'bg-blue-100 text-blue-700 border-blue-200',
      'printing': 'bg-lime-100 text-[#7FCC00] border-lime-200',
      'shipped': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return (
      <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold border", variants[status] || 'bg-muted')}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#7FCC00] rounded-2xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-7 w-7 text-white" />
            </div>
            لوحة تحكم أرنوب
          </h2>
          <p className="text-slate-500 font-bold pr-16">إدارة قصص الأطفال والطلبات والمتابعة.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> تحديث البيانات
          </Button>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> خروج
          </Button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي القصص', value: orders.length, icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50' },
          { label: 'بانتظار الدفع', value: orders.filter(o => o.status === 'ready').length, icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'قيد الطباعة', value: orders.filter(o => o.status === 'printing').length, icon: Printer, color: 'text-[#7FCC00]', bg: 'bg-lime-50' },
          { label: 'تم التوصيل', value: orders.filter(o => o.status === 'shipped').length, icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-heading">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-2xl border-none rounded-[2rem] overflow-hidden bg-white">
        <CardHeader>
          <CardTitle className="font-heading">جدول الطلبات</CardTitle>
          <CardDescription>متابعة وتحديث حالة كل قصة تم تأليفها.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم القصة</TableHead>
                  <TableHead className="text-right">اسم الطفل</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تحديث الحالة</TableHead>
                  <TableHead className="text-right">إثبات الدفع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">لا يوجد طلبات حالياً.</TableCell>
                  </TableRow>
                ) : (
                  orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-bold">#{order.id}</TableCell>
                      <TableCell>
                        <div className="font-black text-slate-900">{order.child_name}</div>
                        <div className="text-xs text-muted-foreground">{order.age} سنين - {order.gender}</div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('ar-EG')}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <Select 
                          value={order.status} 
                          onValueChange={(val) => handleUpdateStatus(order.id, val)}
                          disabled={updating === order.id}
                        >
                          <SelectTrigger className="w-[140px] h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ready">مستعد للدفع</SelectItem>
                            <SelectItem value="paid">تم الدفع</SelectItem>
                            <SelectItem value="printing">جاري الطباعة</SelectItem>
                            <SelectItem value="shipped">تم الشحن</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {order.status !== 'ready' ? (
                          <Button size="sm" variant="outline" className="text-xs h-8">
                            عرض الصورة
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">لم يتم الرفع</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
