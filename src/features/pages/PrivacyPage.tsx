import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-[#F8F6F0] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <Badge variant="emerald" size="md">
            حماية البيانات
          </Badge>
          <h1 className="text-3xl font-black text-charcoal-900 font-cairo">
            سياسة الخصوصية
          </h1>
          <p className="text-xs text-charcoal-500">
            تاريخ آخر تحديث: أكتوبر 2026
          </p>
        </div>

        <Card className="p-8 border-[#E3E8E5] space-y-6 text-sm text-charcoal-700 leading-relaxed">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
            <Lock className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              نلتزم بحماية خصوصية بيانات زوار الحرم ومقدمي الخدمات وفق أعلى معايير أمن المعلومات.
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">1. البيانات التي يتم جمعها</h2>
            <p>
              تقتصر البيانات على الاسم ورقم الجوال لأغراض التنسيق المباشر والالتقاء بالمسجد الحرام، بالإضافة إلى تقييمات الخدمة واللغات المفضلة.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">2. التخزين المحلي في النسخة التجريبية</h2>
            <p>
              يتم حفظ كافة البيانات في ذاكرة المتصفح المحلية (LocalStorage) الخاصة بجهازك الشخصي، ولا يتم إرسال أي كلمات مرور حقيقية أو بيانات بنكية إلى خوادم خارجية.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">3. استخدام رقم الجوال</h2>
            <p>
              يُستخدم رقم الجوال حصرياً لتمكين مقدم الخدمة والمستفيد من التواصل الصوتي أو عبر الرسائل لتحديد مكان اللقاء عند الوصول لساحات الحرم.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
