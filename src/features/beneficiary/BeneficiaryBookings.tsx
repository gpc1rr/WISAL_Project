import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Booking, BookingStatus } from '@/types';
import { bookingRepository } from '@/data/repositories/bookingRepository';
import { BookingCard } from '@/components/shared/BookingCard';
import { RatingModal } from '@/features/ratings/RatingModal';
import { ChatModal } from '@/features/chat/ChatModal';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { CalendarCheck, ArrowLeft } from 'lucide-react';

export const BeneficiaryBookings: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<Booking | null>(null);
  const [selectedBookingForChat, setSelectedBookingForChat] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    if (!user) return;
    const data = await bookingRepository.getByBeneficiaryId(user.id);
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (b: Booking) => {
    if (window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟')) {
      await bookingRepository.cancel(b.id);
      success('تم إلغاء الحجز بنجاح');
      fetchBookings();
    }
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  const filterTabs = [
    { key: 'all', label: `الكل (${bookings.length})` },
    { key: 'pending', label: `قيد الانتظار (${bookings.filter(b => b.status === 'pending').length})` },
    { key: 'confirmed', label: `مؤكد (${bookings.filter(b => b.status === 'confirmed').length})` },
    { key: 'completed', label: `مكتمل (${bookings.filter(b => b.status === 'completed').length})` },
    { key: 'cancelled', label: `ملغي (${bookings.filter(b => b.status === 'cancelled').length})` },
  ];

  return (
    <DashboardLayout
      role="beneficiary"
      title="سجل الحجوزات"
      subtitle="استعرض كافة طلبات الحجز الحالية والسابقة وتابع حالتها مع مقدمي الخدمة."
      action={
        <Link to="/services">
          <Button variant="gold" size="sm" className="font-bold text-charcoal-900" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            طلب حجز جديد
          </Button>
        </Link>
      }
    >
      {/* Tabs Filter */}
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
              viewMode="beneficiary"
              onCancel={handleCancelBooking}
              onRate={bk => setSelectedBookingForRating(bk)}
              onChat={bk => setSelectedBookingForChat(bk)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarCheck className="w-8 h-8" />}
          title="لا توجد حجوزات في هذه القائمة"
          description="يمكنك استعراض خدمات الحرم المتاحة وحجز موعد لمرافقتك أو مساعدة عائلتك."
          actionText="تصفح دليل الخدمات"
          onAction={() => (window.location.href = '/services')}
        />
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={!!selectedBookingForRating}
        onClose={() => setSelectedBookingForRating(null)}
        booking={selectedBookingForRating}
        onSuccess={fetchBookings}
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={!!selectedBookingForChat}
        onClose={() => setSelectedBookingForChat(null)}
        booking={selectedBookingForChat}
        viewMode="beneficiary"
      />
    </DashboardLayout>
  );
};
