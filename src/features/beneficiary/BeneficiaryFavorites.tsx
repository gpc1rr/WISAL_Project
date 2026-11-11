import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Service } from '@/types';
import { serviceRepository } from '@/data/repositories/serviceRepository';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { BookingModal } from '@/features/bookings/BookingModal';
import { Heart } from 'lucide-react';

export const BeneficiaryFavorites: React.FC = () => {
  const [favoriteServices, setFavoriteServices] = useState<Service[]>([]);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);

  const fetchFavorites = async () => {
    const favs = await serviceRepository.getFavoriteServices();
    setFavoriteServices(favs);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <DashboardLayout
      role="beneficiary"
      title="الخدمات المفضلة"
      subtitle="قائمتك الخاصة بالخدمات المساندة التي قمت بحفظها للرجوع إليها سريعاً."
    >
      {favoriteServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onBookClick={s => setSelectedServiceForBooking(s)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart className="w-8 h-8" />}
          title="لا توجد خدمات في المفضلة حالياً"
          description="أثناء تصفحك لخدمات الحرم، يمكنك النقر على أيقونة القلب لحفظ أي خدمة في هذه القائمة."
          actionText="استعراض الخدمات"
          onAction={() => (window.location.href = '/services')}
        />
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={!!selectedServiceForBooking}
        onClose={() => {
          setSelectedServiceForBooking(null);
          fetchFavorites();
        }}
        service={selectedServiceForBooking}
      />
    </DashboardLayout>
  );
};
