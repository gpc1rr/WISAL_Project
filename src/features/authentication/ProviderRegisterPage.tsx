import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SPOKEN_LANGUAGES } from '@/utils/constants';
import { Award, Phone, Lock, Briefcase, User, Sparkles } from 'lucide-react';

export const ProviderRegisterPage: React.FC = () => {
  const { registerProvider } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number>(28);
  const [serviceType, setServiceType] = useState('مرافقة وإرشاد وتسهيل مناسك');
  const [experienceYears, setExperienceYears] = useState<number>(4);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['العربية', 'الإنجليزية']);
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
      }
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      toastError('يرجى استكمال الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerProvider({
        fullName: fullName.trim(),
        password,
        phone: phone.trim(),
        age: Number(age) || 28,
        serviceType,
        experienceYears: Number(experienceYears) || 1,
        languages: selectedLanguages,
        bio: bio.trim(),
      });

      success(`مرحباً بك يا ${res.user.fullName} كـ مقدم خدمة معتمد!`, 'تم إنشاء حسابك ونقلك للوحة التحكم');
      navigate('/provider/dashboard');
    } catch (err: any) {
      toastError(err.message || 'حدث خطأ أثناء التسجيل');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F6F0]">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="gold" size="md">
            تسجيل مقدم خدمة معتمد
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-cairo">
            انضم لنخبة خادمي ضيوف الرحمن
          </h1>
          <p className="text-xs text-charcoal-500">
            انشر خبراتك ومجالاتك لتصل إلى آلاف المعتمرين وزوار المسجد الحرام
          </p>
        </div>

        <Card className="p-6 sm:p-8 border-[#E3E8E5] shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="الاسم الكامل"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="مثال: ريان بن خالد الشريف"
              rightIcon={<User className="w-4 h-4 text-emerald-700" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="رقم الجوال"
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                rightIcon={<Phone className="w-4 h-4 text-emerald-700" />}
              />

              <Input
                label="كلمة المرور (8 أحرف على الأقل)"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                rightIcon={<Lock className="w-4 h-4 text-emerald-700" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="العمر"
                type="number"
                min="20"
                max="70"
                required
                value={age}
                onChange={e => setAge(Number(e.target.value))}
              />

              <Input
                label="سنوات الخبرة بالحرم"
                type="number"
                min="1"
                max="30"
                required
                value={experienceYears}
                onChange={e => setExperienceYears(Number(e.target.value))}
              />
            </div>

            <Select
              label="مجال الخدمة الأساسي"
              value={serviceType}
              onChange={e => setServiceType(e.target.value)}
            >
              <option value="مرافقة وإرشاد وتسهيل مناسك">مرافقة وإرشاد وتسهيل مناسك</option>
              <option value="مساعدة كبار السن وذوي الحركة المحدودة">مساعدة كبار السن وذوي الحركة المحدودة</option>
              <option value="الترجمة والتواصل اللغوي لضيوف الحرم">الترجمة والتواصل اللغوي لضيوف الحرم</option>
              <option value="إدارة وتنقل العربات المخصصة">إدارة وتنقل العربات المخصصة</option>
              <option value="مساندة العائلات والأطفال">مساندة العائلات والأطفال</option>
            </Select>

            {/* Languages multiselect pills */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-charcoal-800">
                اللغات التي تتقنها للتواصل مع الزوار:
              </label>
              <div className="flex flex-wrap gap-2">
                {SPOKEN_LANGUAGES.map(lang => {
                  const isSelected = selectedLanguages.includes(lang);
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
                نبذة تعريفية عن خبراتك وخلفيتك
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-[#D0DBD5] bg-white p-3 text-sm text-charcoal-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                placeholder="تحدث بإيجاز عن خبرتك في مسارات الحرم، اللغات، أو التعامل مع كبار السن..."
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="gold"
                size="md"
                isLoading={isLoading}
                className="w-full font-bold text-charcoal-900"
              >
                إنشاء الملف المهني والبدء
              </Button>
            </div>
          </form>

          <div className="pt-6 mt-6 border-t border-[#F0F3F2] text-center text-xs text-charcoal-600">
            <span>لديك حساب بالفعل؟ </span>
            <Link to="/login" className="font-bold text-emerald-800 hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
