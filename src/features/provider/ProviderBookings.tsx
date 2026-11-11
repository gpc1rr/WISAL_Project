import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Booking, BookingStatus } from '@/types';
import { bookingRepository } from '@/data/repositories/bookingRepository';
import { BookingCard } from '@/components/shared/BookingCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { useToast } from '@/hooks/useToast';
import { CalendarCheck } from 'lucide-react';

export const ProviderBookings: React.FC = () => {
  const { providerProfile } = useAuth();
  const { success, error: toastError } = useToast();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>(initialStatus);

  const fetchBookings = async () => {
    if (!providerProfile) return;
    const data = await bookingRepository.getByProviderId(providerProfile.id);
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, [providerProfile]);

  const handleConfirm = async (b: Booking) => {
    try {
      await bookingRepository.updateStatus(b.id, 'confirmed');
      success(`تم قبول وتأكيد الحجز رقم ${b.bookingNumber}`);
      fetchBookings();
    } catch (err: any) {
      toastError(err.message || 'حدث خطأ أثناء التأكيد');
    }
  };

  const handleComplete = async (b: Booking) => {
    try {
      await bookingRepository.updateStatus(b.id, 'completed');
      success(`تم تسجيل إتمام الحجز رقم ${b.bookingNumber} بنجاح! يمكن للمستفيد الآن إضافة تقييمه.`);
      fetchBookings();
    } catch (err: any) {
      toastError(err.message || 'حدث خطأ أثناء إتمام الحجز');
    }
  };

  const handleCancel = async (b: Booking) => {
    if (window.confirm('هل أنت متأكد من الاعتذار عن هذا الحجز؟ سيتم إشعار المستفيد بذلك.')) {
      try {
        await bookingRepository.cancel(b.id);
        success('تم إلغاء الحجز');
        fetchBookings();
      } catch (err: any) {
        toastError(err.message || 'حدث خطأ أثناء إلغاء الحجز');
      }
    }
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  const filterTabs = [
    { key: 'all', label: `الكل (${bookings.length})` },
    { key: 'pending', label: `بانتظار الموافقة (${bookings.filter(b => b.status === 'pending').length})` },
    { key: 'confirmed', label: `مؤكد ومجدول (${bookings.filter(b => b.status === 'confirmed').length})` },
    { key: 'completed', label: `مكتمل (${bookings.filter(b => b.status === 'completed').length})` },
    { key: 'cancelled', label: `ملغي (${bookings.filter(b => b.status === 'cancelled').length})` },
  ];

  return (
    <DashboardLayout
      role="provider"
      title="إدارة الحجوزات الواردة"
      subtitle="متابعة طلبات المعتمرين والزوار، والموافقة عليها، وتحديث مراحل التنفيذ."
    >
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E3E8E5] pb-3">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterStatus === tab.key
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-charcoal-700 hover:bg-emerald-50 border border-[#E3E8E5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map(b => (
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
        <EmptyState
          icon={<CalendarCheck className="w-8 h-8" />}
          title="لا توجد حجوزات تطابق هذا التصنيف"
          description="ستظهر طلبات الزوار الجدد هنا بمجرد اختيارهم لخدماتك المنشورة."
        />
      )}
    </DashboardLayout>
  );
};
