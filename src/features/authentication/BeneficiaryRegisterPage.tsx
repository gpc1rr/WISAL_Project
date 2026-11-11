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
import { User, Phone, Lock, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

export const BeneficiaryRegisterPage: React.FC = () => {
  const { registerBeneficiary } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number | ''>(35);
  const [nationality, setNationality] = useState('سعودي');
  const [preferredLanguage, setPreferredLanguage] = useState('العربية');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      toastError('يرجى ملء كافة الحقول الأساسية المطلوبة');
      return;
    }

    setIsLoading(true);
    try {
      const user = await registerBeneficiary({
        fullName: fullName.trim(),
        password,
        phone: phone.trim(),
        age: age ? Number(age) : undefined,
        nationality,
        preferredLanguage,
      });

      success(`أهلاً بك يا ${user.fullName} في منصة وصال!`, 'تم إنشاء حسابك بنجاح');
      navigate('/beneficiary/dashboard');
    } catch (err: any) {
      toastError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F6F0]">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="emerald" size="md">
            تسجيل مستفيد جديد
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-cairo">
            إنشاء حساب زائر الحرم
          </h1>
          <p className="text-xs text-charcoal-500">
            خطوات بسيطة للاستفادة من كافة خدمات المنصة ومتابعة حجوزاتك
          </p>
        </div>

        <Card className="p-6 sm:p-8 border-[#E3E8E5] shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="الاسم الثلاثي أو الكامل"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="مثال: فهد بن عبدالله السالم"
              rightIcon={<User className="w-4 h-4 text-emerald-700" />}
            />

            <Input
              label="رقم الجوال"
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="05XXXXXXXX"
              rightIcon={<Phone className="w-4 h-4 text-emerald-700" />}
              helperText="سيستخدم للتواصل المباشر مع مقدم الخدمة بالمسجد الحرام"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="العمر"
                type="number"
                min="18"
                max="100"
                value={age}
                onChange={e => setAge(e.target.value ? Number(e.target.value) : '')}
                placeholder="35"
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
              label="اللغة المفضلة للتواصل"
              value={preferredLanguage}
              onChange={e => setPreferredLanguage(e.target.value)}
            >
              {SPOKEN_LANGUAGES.map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Select>

            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full font-bold"
              >
                إتمام التسجيل والدخول للحساب
              </Button>
            </div>
          </form>

          <div className="pt-6 mt-6 border-t border-[#F0F3F2] text-center text-xs text-charcoal-600">
            <span>لديك حساب مسبق؟ </span>
            <Link to="/login" className="font-bold text-emerald-800 hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
