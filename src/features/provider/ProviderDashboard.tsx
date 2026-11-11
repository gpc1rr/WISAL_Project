import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Service, Booking } from '@/types';
import { serviceRepository } from '@/data/repositories/serviceRepository';
import { bookingRepository } from '@/data/repositories/bookingRepository';
import { BookingCard } from '@/components/shared/BookingCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
import { 
  Briefcase, CalendarCheck, Clock, Award, Star, 
  PlusCircle, CheckCircle2, XCircle, ArrowLeft, Users
} from 'lucide-react';

export const ProviderDashboard: React.FC = () => {
  const { providerProfile } = useAuth();
  const { success } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProviderData = async () => {
    if (!providerProfile) return;
    setIsLoading(true);
    try {
      const srvs = await serviceRepository.getByProviderId(providerProfile.id);
      setServices(srvs);

      const boks = await bookingRepository.getByProviderId(providerProfile.id);
      setBookings(boks);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, [providerProfile]);

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const handleConfirm = async (b: Booking) => {
    await bookingRepository.updateStatus(b.id, 'confirmed');
    success(`تم قبول وتأكيد الحجز رقم ${b.bookingNumber}`);
    fetchProviderData();
  };

  const handleComplete = async (b: Booking) => {
    await bookingRepository.updateStatus(b.id, 'completed');
    success(`تم تسجيل إتمام الحجز رقم ${b.bookingNumber} بنجاح`);
    fetchProviderData();
  };

  const handleCancel = async (b: Booking) => {
    if (window.confirm('هل أنت متأكد من الاعتذار عن هذا الحجز؟')) {
      await bookingRepository.cancel(b.id);
      success('تم إلغاء الحجز');
      fetchProviderData();
    }
  };

  const statCards = [
    { label: 'الخدمات المنشورة', value: services.length, icon: Briefcase, color: 'text-emerald-800' },
    { label: 'طلبات جديدة بالانتظار', value: pendingBookings.length, icon: Clock, color: 'text-amber-700' },
    { label: 'حجوزات قيد التنفيذ', value: confirmedBookings.length, icon: CalendarCheck, color: 'text-emerald-700' },
    { label: 'حجوزات مكتملة بنجاح', value: completedBookings.length, icon: Award, color: 'text-blue-800' },
    { label: 'متوسط التقييم العام', value: `${providerProfile?.rating.toFixed(2) || '5.0'} ★`, icon: Star, color: 'text-gold-600' },
  ];

  return (
    <DashboardLayout
      role="provider"
      title={`لوحة التحكم — ${providerProfile?.fullName || 'مقدم الخدمة'}`}
      subtitle="إدارة خدماتك المساندة بالحرم المكي ومتابعة طلبات المعتمرين الواردة."
      action={
        <Link to="/provider/services">
          <Button variant="gold" size="sm" className="font-bold text-charcoal-900" rightIcon={<PlusCircle className="w-4 h-4" />}>
            إدارة و إضافة خدمة
          </Button>
        </Link>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((st, i) => {
          const Icon = st.icon;
          return (
            <Card key={i} className="p-4 sm:p-5 border-[#E3E8E5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-charcoal-500 font-medium truncate">{st.label}</span>
                <Icon className="w-4 h-4 text-charcoal-400 shrink-0" />
              </div>
              <div className={`text-xl sm:text-2xl font-black font-cairo ${st.color}`}>
                {st.value}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pending Requests Alert */}
      {pendingBookings.length > 0 && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <p className="text-xs sm:text-sm text-amber-950 font-medium">
              لديك <strong>{pendingBookings.length}</strong> طلب حجز جديد بانتظار موافقتك وتأكيدك.
            </p>
          </div>
          <Link to="/provider/bookings?status=pending">
            <Button variant="secondary" size="sm" className="bg-white hover:bg-amber-100 text-amber-900 text-xs">
              مراجعة الطلبات
            </Button>
          </Link>
        </div>
      )}

      {/* Incoming Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-charcoal-900 font-cairo">
            أحدث طلبات الحجز الواردة
          </h2>
          <Link to="/provider/bookings" className="text-xs font-semibold text-emerald-800 hover:underline">
            عرض كافة الحجوزات ({bookings.length})
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.slice(0, 3).map(b => (
              <BookingCard
                key={b.id}
                booking={b}
                viewMode="provider"
                onConfirm={handleConfirm}
                onComplete={handleComplete}
                onCancel={handleCancel}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 border-[#E3E8E5] text-center space-y-3">
            <p className="text-xs text-charcoal-500">لا توجد طلبات حجز مسجلة حتى الآن.</p>
          </Card>
        )}
      </div>

      {/* Published Services Preview */}
      <div className="space-y-4 pt-4 border-t border-[#E3E8E5]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-charcoal-900 font-cairo">
            خدماتك المنشورة حالياً ({services.length})
          </h2>
          <Link to="/provider/services" className="text-xs font-semibold text-emerald-800 hover:underline">
            إدارة الخدمات
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => (
            <Card key={s.id} className="p-4 border-[#E3E8E5] space-y-3">
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-stone-100">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-charcoal-900 line-clamp-1">{s.title}</h3>
                <p className="text-xs text-charcoal-500 line-clamp-2 mt-1">{s.description}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#F0F3F2] text-xs">
                <span className="font-bold text-emerald-800">{s.price} ر.س</span>
                <Badge variant="emerald" size="sm">{s.duration}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
