import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RatingReview } from '@/types';
import { ratingRepository } from '@/data/repositories/ratingRepository';
import { RatingStars } from '@/components/ui/RatingStars';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDateArabic } from '@/utils/formatters';
import { Star } from 'lucide-react';

export const BeneficiaryRatings: React.FC = () => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<RatingReview[]>([]);

  useEffect(() => {
    if (!user) return;
    ratingRepository.getByBeneficiaryId(user.id).then(setRatings);
  }, [user]);

  return (
    <DashboardLayout
      role="beneficiary"
      title="تقييماتي السابقة"
      subtitle="سجل التقييمات والآراء التي شاركتها حول الخدمات التي تلقيتها في المسجد الحرام."
    >
      {ratings.length > 0 ? (
        <div className="space-y-4">
          {ratings.map(r => (
            <Card key={r.id} className="p-6 border-[#E3E8E5] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F0F3F2]">
                <div>
                  <span className="text-xs text-charcoal-400">تاريخ التقييم:</span>
                  <span className="text-xs font-semibold text-charcoal-700 mr-1.5">
                    {formatDateArabic(r.createdAt)}
                  </span>
                </div>
                <RatingStars rating={r.score} size="md" showScore={false} />
              </div>

              <div className="text-xs text-charcoal-600 bg-[#FAF8F4] p-3 rounded-xl border border-[#EFECE3]">
                <span className="font-bold text-charcoal-800 block mb-1">تعليقك:</span>
                <p className="italic leading-relaxed">{r.comment}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Star className="w-8 h-8" />}
          title="لم تقم بإضافة أي تقييمات بعد"
          description="بعد إتمام أي خدمة بنجاح، يمكنك مشاركة تقييمك ورأيك المبارك لدعم جودة الخدمات."
          actionText="الذهاب إلى حجوزاتي"
          onAction={() => (window.location.href = '/beneficiary/bookings')}
        />
      )}
    </DashboardLayout>
  );
};
