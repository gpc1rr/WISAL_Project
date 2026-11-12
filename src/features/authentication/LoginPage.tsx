import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Phone, Lock, Eye, EyeOff, LogIn, Sparkles, User, Award } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toastError('يرجى إدخال رقم الجوال');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(phone, password);
      success(`أهلاً بك مجدداً، ${user.fullName}`);
      if (user.role === 'provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/beneficiary/dashboard');
      }
    } catch (err: any) {
      toastError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const isDemo = import.meta.env.VITE_AUTH_MODE === 'demo';

  const handleQuickLogin = (role: 'beneficiary' | 'provider') => {
    switchDemoRole(role);
    success(`تم التبديل وتسجيل الدخول كـ ${role === 'provider' ? 'مقدم خدمة' : 'مستفيد'}`);
    navigate(role === 'provider' ? '/provider/dashboard' : '/beneficiary/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F6F0]">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="emerald" size="md">
            بوابة تسجيل الدخول
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-cairo">
            مرحباً بك في وِصَـــال
          </h1>
          <p className="text-xs text-charcoal-500">
            أدخل بيانات حسابك لتسجيل الدخول إلى منصة وصال
          </p>
        </div>

        {/* Quick Demo Access Box, only in demo mode */}
        {isDemo && <Card className="p-4 bg-gradient-to-r from-emerald-50/70 to-gold-50/70 border-gold-300/60 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal-900">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <span>تجربة المنصة السريعة (Demo Accounts):</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin('beneficiary')}
              className="text-xs bg-white hover:bg-emerald-50 border-emerald-600/30"
              rightIcon={<User className="w-3.5 h-3.5 text-emerald-700" />}
            >
              دخول: زائر / مستفيد
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin('provider')}
              className="text-xs bg-white hover:bg-gold-50 border-gold-500/40"
              rightIcon={<Award className="w-3.5 h-3.5 text-gold-600" />}
            >
              دخول: مقدم خدمة
            </Button>
          </div>
        </Card>}

        {/* Login Form */}
        <Card className="p-6 sm:p-8 border-[#E3E8E5] shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="رقم الجوال"
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="05XXXXXXXX"
              rightIcon={<Phone className="w-4 h-4 text-emerald-700" />}
              helperText={isDemo ? "جرب: 0501234567 (مستفيد) أو 0543219876 (مقدم خدمة)" : "أدخل رقم الجوال المسجل في قاعدة البيانات"}
            />

            <div>
              <Input
                label={isDemo ? "كلمة المرور التجريبية" : "كلمة المرور"}
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                rightIcon={<Lock className="w-4 h-4 text-emerald-700" />}
                leftIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-stone-400 hover:text-stone-600 focus:outline-none"
                    aria-label="تبديل ظهور كلمة المرور"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full font-bold"
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                تسجيل الدخول
              </Button>
            </div>
          </form>

          <div className="pt-6 mt-6 border-t border-[#F0F3F2] text-center text-xs text-charcoal-600">
            <span>ليس لديك حساب بعد؟ </span>
            <Link to="/register" className="font-bold text-emerald-800 hover:underline">
              إنشاء حساب جديد
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
