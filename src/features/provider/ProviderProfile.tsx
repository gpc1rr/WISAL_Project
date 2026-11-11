import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
import { SPOKEN_LANGUAGES } from '@/utils/constants';
import { Award, Phone, Save, ShieldCheck, User } from 'lucide-react';

export const ProviderProfilePage: React.FC = () => {
  const { providerProfile, updateProviderProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState(providerProfile?.fullName || '');
  const [phone, setPhone] = useState(providerProfile?.phone || '');
  const [age, setAge] = useState<number>(providerProfile?.age || 30);
  const [serviceType, setServiceType] = useState(providerProfile?.serviceType || 'مرافقة وإرشاد وتسهيل مناسك');
  const [experienceYears, setExperienceYears] = useState<number>(providerProfile?.experienceYears || 5);
  const [languages, setLanguages] = useState<string[]>(providerProfile?.languages || ['العربية', 'الإنجليزية']);
  const [bio, setBio] = useState(providerProfile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      if (languages.length > 1) {
        setLanguages(languages.filter(l => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      toastError('يرجى ملء الحقول الإلزامية');
      return;
    }

    setIsSaving(true);
    try {
      await updateProviderProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        age: Number(age) || 30,
        serviceType,
        experienceYears: Number(experienceYears) || 1,
        languages,
        bio: bio.trim(),
      });
      success('تم تحديث الملف المهني بنجاح!');
    } catch (err: any) {
      toastError(err.message || 'حدث خطأ أثناء حفظ الملف');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout
      role="provider"
      title="الملف المهني لمقدم الخدمة"
      subtitle="إدارة بياناتك وخبراتك التي تظهر للمعتمرين وزوار المسجد الحرام."
    >
      <div className="max-w-2xl">
        <Card className="p-6 sm:p-8 border-[#E3E8E5] shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header info */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#F0F3F2]">
              <img
                src={providerProfile?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                alt={providerProfile?.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-charcoal-900">{providerProfile?.fullName}</h3>
                  <Badge variant="gold" size="sm">
                    {providerProfile?.rating.toFixed(2)} ★ ({providerProfile?.reviewsCount} تقييم)
                  </Badge>
                </div>
                <p className="text-xs text-charcoal-500 font-mono mt-0.5">{providerProfile?.phone}</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>مقدم خدمة معتمد وموثق</span>
                </div>
              </div>
            </div>

            <Input
              label="الاسم الكامل"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              rightIcon={<User className="w-4 h-4 text-emerald-700" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="رقم الجوال للتواصل"
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                rightIcon={<Phone className="w-4 h-4 text-emerald-700" />}
              />

              <Input
                label="العمر"
                type="number"
                min="20"
                max="75"
                required
                value={age}
                onChange={e => setAge(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="سنوات الخبرة بالحرم"
                type="number"
                min="1"
                max="40"
                required
                value={experienceYears}
                onChange={e => setExperienceYears(Number(e.target.value))}
              />

              <Select
                label="مجال التخصص الأساسي"
                value={serviceType}
                onChange={e => setServiceType(e.target.value)}
              >
                <option value="مرافقة وإرشاد وتسهيل مناسك">مرافقة وإرشاد وتسهيل مناسك</option>
                <option value="مساعدة كبار السن وذوي الحركة المحدودة">مساعدة كبار السن وذوي الحركة المحدودة</option>
                <option value="الترجمة والتواصل اللغوي لضيوف الحرم">الترجمة والتواصل اللغوي لضيوف الحرم</option>
                <option value="إدارة وتنقل العربات المخصصة">إدارة وتنقل العربات المخصصة</option>
                <option value="مساندة العائلات والأطفال">مساندة العائلات والأطفال</option>
              </Select>
            </div>

            {/* Languages Pills */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-charcoal-800">
                اللغات المتقنة للتواصل:
              </label>
              <div className="flex flex-wrap gap-2">
                {SPOKEN_LANGUAGES.map(lang => {
                  const isSelected = languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-stone-100 text-charcoal-700 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{lang}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-right">
              <label className="block text-sm font-medium text-charcoal-800 mb-1.5">
                النبذة التعريفية (تظهر للمعتمرين بالملف)
              </label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-[#D0DBD5] bg-white p-3 text-sm text-charcoal-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="gold"
                size="md"
                isLoading={isSaving}
                className="font-bold text-charcoal-900"
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
