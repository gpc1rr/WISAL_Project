import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert, FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-[#F8F6F0] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <Badge variant="emerald" size="md">
            الميثاق واللوائح
          </Badge>
          <h1 className="text-3xl font-black text-charcoal-900 font-cairo">
            الشروط والأحكام
          </h1>
          <p className="text-xs text-charcoal-500">
            تاريخ آخر تحديث: نوفمبر 2026
          </p>
        </div>

        <Card className="p-8 border-[#E3E8E5] space-y-6 text-sm text-charcoal-700 leading-relaxed">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            <strong>تنويه:</strong> منصة وصال مشروع تخرج جامعي. البنود الواردة أدناه توضح الإطار التشغيلي والأخلاقي للمنصة لخدمة قاصدي المسجد الحرام، ويوافق عليها المستخدم عند إنشاء حسابه.
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">1. الالتزام بالآداب الشرعية والأنظمة</h2>
            <p>
              يلتزم كافة مستخدمي المنصة (المستفيدين ومقدمي الخدمات) بالآداب الإسلامية وحرمة وقداسة المكان والزمان في مكة المكرمة والمسجد الحرام، واتباع توجيهات الجهات التنظيمية والأمنية وإدارة الحرمين الشريفين.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">2. طبيعة الخدمات المساندة</h2>
            <p>
              الخدمات المعروضة في المنصة تقتصر على المساعدة البدنية، الإرشاد المكاني، الترجمة اللغوية، ومساعدة كبار السن وذوي الإعاقة، ولا تشمل أي فتاوى شرعية أو أعمال تختص بها الجهات الرسمية المصرحة.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">3. مسؤولية المواعيد ونقاط اللقاء</h2>
            <p>
              يتحمل الطرفان مسؤولية الالتزام بالمواعيد المتفق عليها ونقاط الالتقاء بالساحات. في حال تعذر الحضور، يلتزم الطرف المبادر بإلغاء الحجز عبر المنصة قبل الموعد بوقت كافٍ.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">4. الأسعار والدفع</h2>
            <p>
              الأسعار المعروضة يحددها مقدمو الخدمة، وهي أسعار تقديرية للخدمة. لا تُحصّل المنصة حالياً أي مبالغ إلكترونياً، ويتم الاتفاق على الدفع مباشرة بين المستفيد ومقدم الخدمة.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">5. المحادثة داخل الحجز</h2>
            <p>
              تتيح المنصة محادثة خاصة بين المستفيد ومقدم الخدمة لكل حجز، وتُستخدم لتنسيق الموعد ونقطة الالتقاء فقط. يُمنع استخدامها لأي محتوى مسيء أو مخالف، وتُغلق المحادثة تلقائياً عند إلغاء الحجز.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-charcoal-900 mb-2 font-cairo">6. التقييمات</h2>
            <p>
              يحق للمستفيد تقييم الخدمة بعد اكتمالها فقط، ومرة واحدة لكل حجز. يلتزم المستفيد بالصدق والموضوعية في التقييم، ويظهر التقييم للزوار الآخرين لمساعدتهم في الاختيار.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
