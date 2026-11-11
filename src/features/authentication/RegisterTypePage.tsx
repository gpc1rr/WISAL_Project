import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Heart, Award, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const RegisterTypePage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F6F0]">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="emerald" size="md">
            الانضمام إلى وصال
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-cairo">
            اختر نوع الحساب المناسب لك
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600">
            حدد ما إذا كنت قادماً للاستفادة من الخدمات، أو ترغب في تقديم خدماتك لضيوف الرحمن.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Beneficiary Option */}
          <Card hoverable className="p-8 border-[#E3E8E5] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Heart className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  للمعتمرين والزوار
                </span>
                <h2 className="text-xl font-bold text-charcoal-900 mt-2">حساب مستفيد</h2>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                تصفح وحجز خدمات المرافقة والإرشاد، عربات الطواف والسعي، ومساعدة كبار السن بسهولة وأمان.
              </p>
              <ul className="space-y-2 text-xs text-charcoal-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>حجز فوري ومتابعة حالة الطلبات</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>حفظ الخدمات المفضلة</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>تقييم مقدمي الخدمات بعد الزيارة</span>
                </li>
              </ul>
            </div>

            <Link to="/register/beneficiary" className="block pt-2">
              <Button variant="primary" size="md" className="w-full font-bold" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                التسجيل كمستفيد
              </Button>
            </Link>
          </Card>

          {/* Provider Option */}
          <Card hoverable className="p-8 border-gold-400/50 flex flex-col justify-between space-y-6 bg-gradient-to-br from-white to-gold-50/20">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gold-100 text-gold-800 flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-gold-900 bg-gold-100 px-2.5 py-0.5 rounded-full border border-gold-300">
                  لأبناء مكة ومقدمي الدعم
                </span>
                <h2 className="text-xl font-bold text-charcoal-900 mt-2">حساب مقدم خدمة</h2>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                انشر خدماتك وخبراتك، واستقبل طلبات الحجز من ضيوف الرحمن وأدر جدول مواعيدك بمهنية.
              </p>
              <ul className="space-y-2 text-xs text-charcoal-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-600" />
                  <span>إضافة وتعديل الخدمات والأسعار بحرية</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-600" />
                  <span>قبول وتأكيد الحجوزات وإدارتها</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-600" />
                  <span>بناء ملف مهني وتقييمات موثقة</span>
                </li>
              </ul>
            </div>

            <Link to="/register/provider" className="block pt-2">
              <Button variant="gold" size="md" className="w-full font-bold text-charcoal-900" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                التسجيل كمقدم خدمة
              </Button>
            </Link>
          </Card>
        </div>

        <div className="text-center text-xs text-charcoal-500">
          <span>لديك حساب بالفعل؟ </span>
          <Link to="/login" className="font-bold text-emerald-800 hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
};
