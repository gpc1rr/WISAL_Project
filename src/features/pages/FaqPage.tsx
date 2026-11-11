import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqItems = [
    {
      category: 'عام عن المنصة',
      items: [
        {
          q: 'ما هي الأهداف الرئيسية لمنصة وصال؟',
          a: 'تهدف وصال إلى توفير تجربة ميسرة لضيوف الرحمن في المسجد الحرام من خلال الربط المباشر مع مقدمي الخدمات المساندة (مرافقة، ترجمة، مساعدة كبار السن، والتنقل)، والارتقاء بجودة الخدمة عبر التقييمات الشفافة.',
        },
        {
          q: 'هل المنصة جهة رسمية أو حكومية؟',
          a: 'لا، منصة وصال هي مشروع تخرج جامعي مستقل ونموذج رقمي تجريبي (Prototype) تم تطويره لتطبيق أفضل ممارسات هندسة البرمجيات وتصميم تجربة المستخدم في خدمة زوار مكة المكرمة.',
        },
      ],
    },
    {
      category: 'الحجوزات والخدمات',
      items: [
        {
          q: 'كيف يمكنني حجز خدمة كزائر (مستفيد)؟',
          a: 'يمكنك ببساطة التوجه إلى صفحة "استعراض الخدمات"، واختيار الخدمة المناسبة، ثم النقر على "احجز الآن" لتحديد التاريخ، الفترة المفضلة، ونقطة الالتقاء بالساحات، وتأكيد الحجز.',
        },
        {
          q: 'ماذا يحدث بعد تأكيد الحجز؟',
          a: 'يظهر الحجز في لوحة تحكم المستفيد تحت حالة "قيد الانتظار"، كما يظهر في لوحة تحكم مقدم الخدمة حيث يمكنه قبوله وتأكيده والتواصل لتنسيق موعد اللقاء.',
        },
        {
          q: 'هل يمكن إلغاء الحجز؟',
          a: 'نعم، يمكن للمستفيد أو مقدم الخدمة إلغاء الحجز من صفحة الحجوزات مع تحديث الحالة بشكل فوري.',
        },
      ],
    },
    {
      category: 'مقدمو الخدمة',
      items: [
        {
          q: 'كيف يسجل مقدم الخدمة خدمات جديدة؟',
          a: 'يمكن لمقدم الخدمة بعد تسجيل الدخول الدخول إلى لوحة التحكم الخاصة به، ثم اختيار "خدماتي المنشورة"، والنقر على "إضافة خدمة جديدة" لتحديد الاسم، التصنيف، السعر، والتفاصيل.',
        },
        {
          q: 'كيف يحصل مقدم الخدمة على التقييمات؟',
          a: 'بمجرد اكتمال الحجز واعتماده من قبل مقدم الخدمة، يتاح للمستفيد تقييم الخدمة من 1 إلى 5 نجوم وكتابة تعليق، ويتم تحديث متوسط تقييم مقدم الخدمة تلقائياً.',
        },
      ],
    },
  ];

  return (
    <div className="bg-[#F8F6F0] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <Badge variant="emerald" size="md">
            مركز المساعدة
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-charcoal-900 font-cairo">
            الأسئلة الشائعة
          </h1>
          <p className="text-sm text-charcoal-600">
            إجابات وافية على كافة التساؤلات المتعلقة بآلية عمل وصال وخدماتها.
          </p>
        </div>

        <div className="space-y-8">
          {faqItems.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-3">
              <h2 className="text-base font-bold text-emerald-850 px-1">{cat.category}</h2>
              <div className="space-y-2.5">
                {cat.items.map((it, iIdx) => {
                  const globalIdx = cIdx * 10 + iIdx;
                  const isOpen = openIdx === globalIdx;
                  return (
                    <Card key={iIdx} className="border-[#E3E8E5] overflow-hidden">
                      <button
                        onClick={() => setOpenIdx(isOpen ? null : globalIdx)}
                        className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-sm text-charcoal-900 hover:text-emerald-800 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{it.q}</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-charcoal-400 transition-transform ${
                            isOpen ? 'rotate-180 text-emerald-700' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-charcoal-600 leading-relaxed border-t border-[#F0F3F2]">
                          {it.a}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
