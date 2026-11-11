import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  Search, Calendar, MapPin, CheckCircle, 
  Star, ShieldAlert, ArrowLeft, HeartHandshake, PhoneCall
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="bg-[#F8F6F0] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="emerald" size="md">
            دليل الاستخدام السريع
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-charcoal-900 font-cairo">
            كيف تسير رحلة حجز الخدمة في وصال؟
          </h1>
          <p className="text-sm text-charcoal-600">
            خطوات بسيطة وشفافة تضمن لك ولعائلتك تجربة استثنائية داخل رحاب الحرم المكي.
          </p>
        </div>

        {/* Steps Detailed Timeline */}
        <div className="space-y-6">
          {[
            {
              num: '1',
              title: 'تصفح الخدمات ومقارنة العروض',
              desc: 'ادخل إلى دليل الخدمات، واستعرض الخدمات المصنفة بدقة حسب احتياجك (مرافقة كبار السن، الترجمة، العربات). اطلع على أسعار الجولات، المؤهلات واللغات، وتقييمات المعتمرين السابقين.',
              icon: Search,
            },
            {
              num: '2',
              title: 'تحديد الموعد ونقطة الالتقاء',
              desc: 'اختر التاريخ المناسب، والفترة الزمنية (مثل فترة الضحى، العصر، أو ساعات الليل الهادئة)، ثم حدد أقرب بوابة أو ساحة في الحرم المكي للقاء مقدم الخدمة.',
              icon: Calendar,
            },
            {
              num: '3',
              title: 'تأكيد الحجز والإشعار المباشر',
              desc: 'راجع بيانات طلبك وأرسله بضغطة زر. سيصل الطلب إلى لوحة تحكم مقدم الخدمة للموافقة المباشرة، مع حفظ كافة التفاصيل في حسابك التجريبي.',
              icon: MapPin,
            },
            {
              num: '4',
              title: 'تنفيذ الخدمة والتقييم',
              desc: 'يلتقي بك مقدم الخدمة في النقطة المحددة لمساعدتك في الطواف أو السعي. عند اكتمال الجولة بنجاح، يمكنك تقييم الخدمة من حسابك لمساعدة زوار بيت الله الآخرين.',
              icon: Star,
            },
          ].map((st, i) => {
            const Icon = st.icon;
            return (
              <Card key={i} className="p-6 sm:p-8 border-[#E3E8E5] flex flex-col sm:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-gold-300 font-black text-xl font-cairo flex items-center justify-center shrink-0 shadow-sm">
                  {st.num}
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-emerald-800" />
                    <h2 className="text-lg font-bold text-charcoal-900">{st.title}</h2>
                  </div>
                  <p className="text-sm text-charcoal-600 leading-relaxed">{st.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-white p-8 rounded-3xl border border-[#E3E8E5] text-center space-y-4 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal-900 font-cairo">جاهز لتجربة المنصة؟</h2>
          <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto">
            تصفح الخدمات المتوفرة أو جرب إنشاء حجز جديد في نسختنا التفاعلية.
          </p>
          <div className="pt-2">
            <Link to="/services">
              <Button variant="gold" size="lg" className="font-bold text-charcoal-900" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                استعراض دليل الخدمات الآن
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
