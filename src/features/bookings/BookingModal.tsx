import React, { useState } from 'react';
import { Service, Booking } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { bookingRepository } from '@/data/repositories/bookingRepository';
import { MAKKAH_MEETING_POINTS, TIME_SLOTS } from '@/utils/constants';
import { formatCurrency, formatDateArabic } from '@/utils/formatters';
import { 
  Calendar, Clock, MapPin, CheckCircle2, 
  ArrowLeft, ArrowRight, ShieldCheck, FileText, User as UserIcon
} from 'lucide-react';

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onSuccess?: (newBooking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  service,
  onSuccess,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [selectedMeetingPoint, setSelectedMeetingPoint] = useState<string>(() => {
    return service?.meetingPoints[0] || MAKKAH_MEETING_POINTS[0];
  });
  const [notes, setNotes] = useState<string>('');
  const [beneficiaryName, setBeneficiaryName] = useState<string>(user?.fullName || 'عبدالله بن أحمد الغامدي');
  const [beneficiaryPhone, setBeneficiaryPhone] = useState<string>(user?.phone || '0501234567');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  if (!service) return null;

  const handleNext = () => {
    if (step === 1) {
      if (!selectedDate) {
        toastError('يرجى اختيار تاريخ الحجز');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedMeetingPoint) {
        toastError('يرجى تحديد نقطة الالتقاء بالمسجد الحرام');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const bId = user?.id || 'usr-ben-1';
      const bName = beneficiaryName.trim() || user?.fullName || 'زائر الحرم';
      const bPhone = beneficiaryPhone.trim() || user?.phone || '0501234567';

      const newBooking = await bookingRepository.create({
        serviceId: service.id,
        serviceTitle: service.title,
        providerId: service.providerId,
        providerName: service.providerName,
        beneficiaryId: bId,
        beneficiaryName: bName,
        beneficiaryPhone: bPhone,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        meetingPoint: selectedMeetingPoint,
        notes: notes.trim(),
        totalPrice: service.price,
      });

      setCompletedBooking(newBooking);
      setStep(4);
      success('تم إرسال طلب الحجز بنجاح!', 'تم حفظ الحجز في سجل حجوزاتك وإشعار مقدم الخدمة');
      onSuccess?.(newBooking);
    } catch (err: any) {
      toastError(err.message || 'حدث خطأ أثناء تأكيد الحجز');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onClose();
    // Reset state after transition
    setTimeout(() => {
      setStep(1);
      setCompletedBooking(null);
    }, 300);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFinish}
      title={
        step === 4 ? (
          <span className="text-emerald-800">تم تأكيد طلب الحجز</span>
        ) : (
          <div className="flex items-center gap-2">
            <span>حجز خدمة: </span>
            <span className="text-emerald-800 text-sm font-semibold truncate max-w-xs">{service.title}</span>
          </div>
        )
      }
      maxWidth="lg"
    >
      {step < 4 && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F0F3F2]">
          {[
            { num: 1, title: 'التاريخ والوقت' },
            { num: 2, title: 'نقطة الالتقاء' },
            { num: 3, title: 'مراجعة وتأكيد' },
          ].map(s => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s.num
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : step > s.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-xs hidden sm:inline ${step === s.num ? 'font-bold text-charcoal-900' : 'text-charcoal-500'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Date & Time Slot */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-[#FAF8F4] p-4 rounded-xl border border-[#EFECE3] flex items-center justify-between">
            <div>
              <p className="text-xs text-charcoal-500">مقدم الخدمة:</p>
              <p className="text-sm font-bold text-charcoal-900">{service.providerName}</p>
            </div>
            <div className="text-left">
              <p className="text-xs text-charcoal-500">التكلفة المقدرة:</p>
              <p className="text-base font-bold text-emerald-800">{formatCurrency(service.price)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="تاريخ الخدمة المطلوبة"
              min={todayStr}
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              required
              rightIcon={<Calendar className="w-4 h-4 text-emerald-700" />}
            />

            <Select
              label="الفترة الزمنية المفضلة"
              value={selectedTimeSlot}
              onChange={e => setSelectedTimeSlot(e.target.value)}
              required
            >
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </Select>
          </div>

          <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>ملاحظة:</strong> الفترات الزمنية المعروضة مقترحة وفق أوقات الطواف المفضلة بالمسجد الحرام، ويمكنك تنسيق الموعد بدقة مع مقدم الخدمة عبر المحادثة بعد الحجز.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              onClick={handleNext}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              التالي: نقطة الالتقاء
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Meeting Point & Notes */}
      {step === 2 && (
        <div className="space-y-4">
          <Select
            label="نقطة الالتقاء المقترحة بالمسجد الحرام"
            value={selectedMeetingPoint}
            onChange={e => setSelectedMeetingPoint(e.target.value)}
            required
            helperText="اختر البوابة أو الساحة الأقرب لمكان وصولك أو فندقك"
          >
            {/* Preferred meeting points first */}
            {service.meetingPoints.map(pt => (
              <option key={pt} value={pt}>
                ⭐ {pt} (موصى بها لهذه الخدمة)
              </option>
            ))}
            {MAKKAH_MEETING_POINTS.filter(pt => !service.meetingPoints.includes(pt)).map(pt => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </Select>

          <div className="text-right">
            <label className="block text-sm font-medium text-charcoal-800 mb-1.5">
              ملاحظات أو احتياجات خاصة (اختياري)
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-[#D0DBD5] bg-white p-3 text-sm text-charcoal-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="مثال: برفقتنا والد مسن يحتاج كرسي متحرك، أو تفضيل مسار هادئ..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Input
              label="اسم المستفيد للتواصل"
              value={beneficiaryName}
              onChange={e => setBeneficiaryName(e.target.value)}
              required
              rightIcon={<UserIcon className="w-4 h-4 text-emerald-700" />}
            />
            <Input
              label="رقم الجوال للتواصل"
              value={beneficiaryPhone}
              onChange={e => setBeneficiaryPhone(e.target.value)}
              required
              rightIcon={<span className="text-xs text-charcoal-500 font-mono">966+</span>}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F0F3F2]">
            <Button variant="ghost" onClick={handleBack} rightIcon={<ArrowRight className="w-4 h-4" />}>
              السابق
            </Button>
            <Button variant="primary" onClick={handleNext} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              التالي: مراجعة الطلب
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Final Confirmation */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-[#FAF8F4] p-5 rounded-2xl border border-[#EFECE3] space-y-3">
            <h4 className="font-bold text-sm text-charcoal-900 pb-2 border-b border-[#E3E8E5]">
              ملخص تفاصيل الحجز
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-charcoal-500 block">الخدمة:</span>
                <span className="font-bold text-charcoal-900">{service.title}</span>
              </div>
              <div>
                <span className="text-charcoal-500 block">مقدم الخدمة:</span>
                <span className="font-bold text-emerald-800">{service.providerName}</span>
              </div>
              <div>
                <span className="text-charcoal-500 block">تاريخ الزيارة:</span>
                <span className="font-semibold text-charcoal-900">{formatDateArabic(selectedDate)}</span>
              </div>
              <div>
                <span className="text-charcoal-500 block">الفترة الزمنية:</span>
                <span className="font-semibold text-charcoal-900">{selectedTimeSlot}</span>
              </div>
              <div className="col-span-2">
                <span className="text-charcoal-500 block">نقطة الالتقاء:</span>
                <span className="font-semibold text-charcoal-900">{selectedMeetingPoint}</span>
              </div>
              {notes && (
                <div className="col-span-2 bg-white p-2.5 rounded-lg border border-stone-200">
                  <span className="text-charcoal-500 block font-semibold mb-0.5">ملاحظاتك:</span>
                  <p className="text-charcoal-800 italic">{notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E3E8E5] flex items-center justify-between">
              <span className="text-sm font-bold text-charcoal-900">المبلغ الإجمالي المتفق عليه:</span>
              <span className="text-xl font-black text-emerald-800">{formatCurrency(service.price)}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              <strong>دفع تجريبي آمن:</strong> لن يتم خصم أي مبالغ حقيقية، سيتم تسجيل الطلب وحفظه في سجل حجوزاتك مباشرة.
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F0F3F2]">
            <Button variant="ghost" onClick={handleBack} rightIcon={<ArrowRight className="w-4 h-4" />}>
              السابق
            </Button>
            <Button
              variant="gold"
              onClick={handleConfirmBooking}
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              تأكيد وإرسال طلب الحجز
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Success Screen */}
      {step === 4 && completedBooking && (
        <div className="text-center py-4 space-y-4 animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-soft">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-charcoal-900">بارك الله فيكم، تم تسجيل حجزكم بنجاح!</h3>
            <p className="text-xs text-charcoal-500 mt-1">
              تم إشعار مقدم الخدمة بطلبكم، وسيتواصل معكم للتنسيق في الموعد المحدد.
            </p>
          </div>

          <div className="bg-[#FAF8F4] p-4 rounded-xl border border-[#EFECE3] max-w-sm mx-auto text-xs space-y-2 text-right">
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-charcoal-500">رقم الحجز المرجعي:</span>
              <span className="font-mono font-bold text-emerald-800">{completedBooking.bookingNumber}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-charcoal-500">الموعد:</span>
              <span className="font-semibold">{formatDateArabic(completedBooking.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">نقطة الالتقاء:</span>
              <span className="font-semibold truncate max-w-[180px]">{completedBooking.meetingPoint}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" onClick={handleFinish} className="w-full sm:w-auto">
              إغلاق ومتابعة التصفح
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
