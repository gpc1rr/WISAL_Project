import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Booking, Service } from '@/types';
import { bookingRepository } from '@/data/repositories/bookingRepository';
import { serviceRepository } from '@/data/repositories/serviceRepository';
import { BookingCard } from '@/components/shared/BookingCard';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { RatingModal } from '@/features/ratings/RatingModal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
import { 
  CalendarCheck, Clock, Award, Heart, ArrowLeft, 
  Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const BeneficiaryDashboard: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [suggestedServices, setSuggestedServices] = useState<Service[]>([]);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<Booking | null>(null);

  const fetchDashboardData = async () => {
    if (!user) return;
    const boks = await bookingRepository.getByBeneficiaryId(user.id);
    setBookings(boks);

    const srvs = await serviceRepository.getAll();
    setSuggestedServices(srvs.slice(0, 3));
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const stats = [
    { label: 'إجمالي الحجوزات', value: bookings.length, icon: CalendarCheck, color: 'text-emerald-800' },
    { label: 'حجوزات قادمة ومؤكدة', value: upcomingBookings.length, icon: Clock, color: 'text-amber-800' },
    { label: 'حجوزات مكتملة', value: completedBookings.length, icon: Award, color: 'text-blue-800' },
  ];

  const handleCancelBooking = async (b: Booking) => {
    if (window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟')) {
      await bookingRepository.cancel(b.id);
      success('تم إلغاء الحجز بنجاح');
      fetchDashboardData();
    }
  };

  return (
    <DashboardLayout
      role="beneficiary"
      title={`أهلاً بك، ${user?.fullName || 'ضيف الحرم'}`}
      subtitle="مرحباً بك في لوحة تحكم المستفيد. تابع حجوزاتك وخدماتك بكل يسر وسهولة."
      action={
        <Link to="/services">
          <Button variant="gold" size="sm" className="font-bold text-charcoal-900" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            حجز خدمة جديدة
          </Button>
        </Link>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <Card key={i} className="p-5 border-[#E3E8E5]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-charcoal-500 font-medium">{st.label}</span>
                  <div className={`text-2xl font-black font-cairo mt-1 ${st.color}`}>{st.value}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-charcoal-600">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-charcoal-900 font-cairo">الحجوزات القادمة والنشطة</h2>
            <Badge variant="emerald" size="sm">{upcomingBookings.length}</Badge>
          </div>
          <Link to="/beneficiary/bookings" className="text-xs font-semibold text-emerald-800 hover:underline">
            عرض كافة الحجوزات
          </Link>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {upcomingBookings.slice(0, 2).map(b => (
              <BookingCard
                key={b.id}
                booking={b}
                viewMode="beneficiary"
                onCancel={handleCancelBooking}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 border-[#E3E8E5] text-center space-y-3">
            <p className="text-xs text-charcoal-500">لا توجد حجوزات نشطة حالياً. يمكنك تصفح الخدمات وحجز موعد مناسب.</p>
            <Link to="/services">
              <Button variant="outline" size="sm">تصفح الخدمات المتاحة</Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Suggested Services */}
      <div className="space-y-4 pt-4 border-t border-[#E3E8E5]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-charcoal-900 font-cairo">خدمات مقترحة لزيارتك القادمة</h2>
          <Link to="/services" className="text-xs font-semibold text-emerald-800 hover:underline">
            تصفح كل الخدمات
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestedServices.map(s => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={!!selectedBookingForRating}
        onClose={() => setSelectedBookingForRating(null)}
        booking={selectedBookingForRating}
        onSuccess={fetchDashboardData}
      />
    </DashboardLayout>
  );
};
