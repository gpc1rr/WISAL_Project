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
            تاريخ آخر تحديث: نوفمبر 2026
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
              نجمع البيانات اللازمة لتقديم الخدمة فقط: الاسم ورقم الجوال والعمر والجنسية واللغة المفضلة للمستفيد، وبيانات الخبرة واللغات والنبذة المهنية لمقدم الخدمة، إضافة إلى بيانات الحجوزات والتقييمات ورسائل المحادثة.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">2. حفظ البيانات وحمايتها</h2>
            <p>
              تُحفظ البيانات في قاعدة بيانات المنصة على خادم مستضاف، ويتم الاتصال بالمنصة عبر اتصال مشفّر (HTTPS). كلمات المرور لا تُحفظ كما هي، بل تُخزَّن مشفّرة، ولا يمكن لأي أحد الاطلاع عليها. ولا تطلب المنصة أي بيانات بنكية.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">3. استخدام رقم الجوال</h2>
            <p>
              يُستخدم رقم الجوال لتسجيل الدخول، ولتمكين مقدم الخدمة والمستفيد من التواصل لتحديد مكان اللقاء عند الوصول لساحات الحرم، ولا يظهر إلا لطرفي الحجز.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">4. المحادثات</h2>
            <p>
              رسائل المحادثة خاصة بكل حجز، ولا يطّلع عليها إلا المستفيد ومقدم الخدمة في ذلك الحجز.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">5. رسائل "تواصل معنا"</h2>
            <p>
              الرسائل المرسلة عبر صفحة "تواصل معنا" تُحفظ في قاعدة بيانات المنصة وتصل إلى فريق وصال عبر البريد الإلكتروني للرد عليها، ولا تُستخدم لأي غرض آخر.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">6. حذف البيانات</h2>
            <p>
              يمكنك طلب حذف حسابك وبياناتك في أي وقت عبر صفحة "تواصل معنا".
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
