import React from 'react';
import { Booking } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from './StatusBadge';
import { formatDateArabic, formatCurrency } from '@/utils/formatters';
import { Calendar, Clock, MapPin, Phone, User as UserIcon, Star, Check, X, ShieldAlert } from 'lucide-react';

export interface BookingCardProps {
  booking: Booking;
  viewMode: 'beneficiary' | 'provider';
  onCancel?: (booking: Booking) => void;
  onRate?: (booking: Booking) => void;
  onConfirm?: (booking: Booking) => void;
  onComplete?: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  viewMode,
  onCancel,
  onRate,
  onConfirm,
  onComplete,
}) => {
  return (
    <Card className="border-[#E3E8E5] transition-all duration-200">
      <div className="p-5 sm:p-6">
        {/* Top Header: ID & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F0F3F2]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-100">
              {booking.bookingNumber}
            </span>
            <span className="text-xs text-charcoal-400">
              تم الطلب: {new Date(booking.createdAt).toLocaleDateString('ar-SA')}
            </span>
          </div>

          <StatusBadge status={booking.status} />
        </div>

        {/* Title */}
        <div className="my-4">
          <h4 className="text-base sm:text-lg font-bold text-charcoal-900 leading-snug">
            {booking.serviceTitle}
          </h4>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal-700 bg-[#FAF8F4] p-3.5 rounded-xl border border-[#EFECE3] mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>التاريخ: <strong className="text-charcoal-900">{formatDateArabic(booking.date)}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>الفترة: <strong className="text-charcoal-900">{booking.timeSlot}</strong></span>
          </div>

          <div className="flex items-center gap-2 sm:col-span-2">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="truncate">نقطة الالتقاء: <strong className="text-charcoal-900">{booking.meetingPoint}</strong></span>
          </div>

          {/* Role specific counterpart details */}
          {viewMode === 'beneficiary' ? (
            <div className="flex items-center gap-2 sm:col-span-2 border-t border-stone-200/60 pt-2 mt-1">
              <UserIcon className="w-4 h-4 text-gold-600 shrink-0" />
              <span>مقدم الخدمة: <strong className="text-charcoal-900">{booking.providerName}</strong></span>
              {booking.providerPhone && (
                <span className="text-charcoal-500 font-mono mr-auto">({booking.providerPhone})</span>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between sm:col-span-2 border-t border-stone-200/60 pt-2 mt-1">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gold-600 shrink-0" />
                <span>المستفيد: <strong className="text-charcoal-900">{booking.beneficiaryName}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <Phone className="w-3.5 h-3.5" />
                <span className="font-mono text-xs">{booking.beneficiaryPhone}</span>
              </div>
            </div>
          )}

          {booking.notes && (
            <div className="sm:col-span-2 text-xs text-charcoal-600 bg-white p-2.5 rounded-lg border border-stone-200 mt-1">
              <span className="font-semibold block mb-0.5 text-charcoal-800">ملاحظات المستفيد:</span>
              <p className="italic">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Footer: Price & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal-400">إجمالي المبلغ:</span>
            <span className="text-base font-bold text-emerald-800">{formatCurrency(booking.totalPrice)}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Beneficiary Actions */}
            {viewMode === 'beneficiary' && (
              <>
                {booking.status === 'completed' && !booking.rated && onRate && (
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => onRate(booking)}
                    rightIcon={<Star className="w-3.5 h-3.5" />}
                  >
                    تقييم الخدمة
                  </Button>
                )}

                {booking.status === 'completed' && booking.rated && (
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    تم التقييم بنجاح
                  </span>
                )}

                {(booking.status === 'pending' || booking.status === 'confirmed') && onCancel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancel(booking)}
                    className="text-rose-700 border-rose-200 hover:bg-rose-50"
                  >
                    إلغاء الحجز
                  </Button>
                )}
              </>
            )}

            {/* Provider Actions */}
            {viewMode === 'provider' && (
              <>
                {booking.status === 'pending' && onConfirm && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onConfirm(booking)}
                    rightIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    قبول وتأكيد
                  </Button>
                )}

                {booking.status === 'confirmed' && onComplete && (
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => onComplete(booking)}
                    rightIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    إتمام الخدمة
                  </Button>
                )}

                {(booking.status === 'pending' || booking.status === 'confirmed') && onCancel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancel(booking)}
                    className="text-rose-700 border-rose-200 hover:bg-rose-50"
                    rightIcon={<X className="w-3.5 h-3.5" />}
                  >
                    اعتذار / إلغاء
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
