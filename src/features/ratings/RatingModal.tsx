import React, { useState } from 'react';
import { Booking } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { ratingRepository } from '@/data/repositories/ratingRepository';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Star, CheckCircle } from 'lucide-react';

export interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSuccess?: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toastError('يرجى كتابة كلمة أو تعليق يعبر عن تجربتكم مع الخدمة');
      return;
    }

    setIsSubmitting(true);
    try {
      await ratingRepository.create({
        bookingId: booking.id,
        serviceId: booking.serviceId,
        providerId: booking.providerId,
        beneficiaryId: user?.id || booking.beneficiaryId,
        beneficiaryName: user?.fullName || booking.beneficiaryName,
        score,
        comment: comment.trim(),
      });

      success('شكراً لكم، تم تسجيل تقييمكم بنجاح!', 'تقييمكم يسهم في تحسين جودة خدمات الحرم الشريف');
      onSuccess?.();
      onClose();
      setComment('');
      setScore(5);
    } catch (err: any) {
      toastError(err.message || 'حدث خطأ أثناء حفظ التقييم');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تقييم الخدمة ومقدمها"
      description={`حجز رقم: ${booking.bookingNumber}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#FAF8F4] p-3.5 rounded-xl border border-[#EFECE3] text-xs">
          <p className="text-charcoal-500 mb-0.5">الخدمة المنفذة:</p>
          <p className="font-bold text-charcoal-900 text-sm mb-1">{booking.serviceTitle}</p>
          <p className="text-emerald-800">مقدم الخدمة: <strong>{booking.providerName}</strong></p>
        </div>

        <div className="text-center py-3 bg-white rounded-xl border border-[#D0DBD5]">
          <span className="block text-xs font-semibold text-charcoal-700 mb-2">
            حدد تقييمك العام (1 - 5 نجوم):
          </span>
          <div className="flex justify-center">
            <RatingStars
              rating={score}
              size="lg"
              interactive
              onChange={setScore}
              showScore={false}
            />
          </div>
          <span className="inline-block mt-2 text-xs font-bold text-emerald-800">
            {score === 5 && 'ممتاز جداً، تجربة مباركة'}
            {score === 4 && 'جيد جداً'}
            {score === 3 && 'جيد'}
            {score === 2 && 'مقبول'}
            {score === 1 && 'يحتاج تحسين'}
          </span>
        </div>

        <div className="text-right">
          <label className="block text-sm font-medium text-charcoal-800 mb-1.5">
            رأيكم وملاحظاتكم الكريمة <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            className="w-full rounded-xl border border-[#D0DBD5] bg-white p-3 text-sm text-charcoal-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            placeholder="اكتب انطباعك عن التزام الموعد، حسن المعاملة، والرفق أثناء أداء المناسك..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0F3F2]">
          <Button type="button" variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="gold"
            isLoading={isSubmitting}
            rightIcon={<Star className="w-4 h-4" />}
          >
            نشر التقييم
          </Button>
        </div>
      </form>
    </Modal>
  );
};
