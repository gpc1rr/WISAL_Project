import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { SPOKEN_LANGUAGES } from '@/utils/constants';
import { User, Phone, CheckCircle2, Save } from 'lucide-react';

export const BeneficiaryProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [age, setAge] = useState<number | ''>(user?.age || 40);
  const [nationality, setNationality] = useState(user?.nationality || 'سعودي');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'العربية');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      toastError('يرجى ملء الحقول الإلزامية');
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        age: age ? Number(age) : undefined,
        nationality,
        preferredLanguage,
      });
      success('تم تحديث الملف الشخصي بنجاح!');
    } catch (err: any) {
      toastError(err.message || 'حدث خطأ أثناء حفظ التعديلات');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout
      role="beneficiary"
      title="الملف الشخصي"
      subtitle="إدارة بياناتك الشخصية وتفضيلات التواصل لرحلتك بالمسجد الحرام."
    >
      <div className="max-w-2xl">
        <Card className="p-6 sm:p-8 border-[#E3E8E5] shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User Avatar & Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#F0F3F2]">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={user?.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 shadow-sm"
              />
              <div>
                <h3 className="text-base font-bold text-charcoal-900">{user?.fullName}</h3>
                <p className="text-xs text-charcoal-500 font-mono">{user?.phone}</p>
                <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  حساب مستفيد
                </span>
              </div>
            </div>

            <Input
              label="الاسم الكامل"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              rightIcon={<User className="w-4 h-4 text-emerald-700" />}
            />

            <Input
              label="رقم الجوال للتواصل"
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              rightIcon={<Phone className="w-4 h-4 text-emerald-700" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="العمر"
                type="number"
                min="18"
                max="100"
                value={age}
                onChange={e => setAge(e.target.value ? Number(e.target.value) : '')}
              />

              <Select
                label="الجنسية"
                value={nationality}
                onChange={e => setNationality(e.target.value)}
              >
                <option value="سعودي">سعودي</option>
                <option value="إماراتي">إماراتي</option>
                <option value="كويتي">كويتي</option>
                <option value="مصري">مصري</option>
                <option value="أردني">أردني</option>
                <option value="باكستاني">باكستاني</option>
                <option value="إندونيسي">إندونيسي</option>
                <option value="ماليزي">ماليزي</option>
                <option value="تركي">تركي</option>
                <option value="أخرى">أخرى</option>
              </Select>
            </div>

            <Select
              label="اللغة المفضلة"
              value={preferredLanguage}
              onChange={e => setPreferredLanguage(e.target.value)}
            >
              {SPOKEN_LANGUAGES.map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Select>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                حفظ التعديلات
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};
