import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { IslamicPattern } from '@/components/shared/IslamicPattern';
import { Compass, Heart, ShieldCheck, Users, Award, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#F8F6F0] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#073D2D] via-[#0E4D3A] to-[#073D2D] text-white p-8 sm:p-12 rounded-3xl border border-gold-500/30 shadow-soft text-center relative overflow-hidden">
          <IslamicPattern variant="subtle" className="opacity-15 text-gold-400" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <Badge variant="gold" size="md" className="bg-gold-500/20 text-gold-300 border-gold-500/30">
              مشروع تخرج جامعي متميز
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black font-cairo">
              عن منصة وِصَـــال (WISAL)
            </h1>
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-light">
              مبادرة تقنية أكاديمية تسعى لتسخير الحلول الرقمية في تيسير خدمة قاصدي المسجد الحرام وربطهم بنخبة من مقدمي الخدمات المساندة المعتمدين.
            </p>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 border-[#E3E8E5] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-charcoal-900 font-cairo">رؤيتنا</h2>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              أن نكون النموذج الرقمي الأبرز في تقديم الخدمات المساندة لضيوف الرحمن في مكة المكرمة، محققين أعلى معايير الكفاءة، الرفق، وحسن الوفادة التي تليق بمكانة بيت الله الحرام.
            </p>
          </Card>

          <Card className="p-8 border-[#E3E8E5] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-800 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-charcoal-900 font-cairo">رسالتنا</h2>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              تسهيل وصول المعتمرين والزوار — لا سيما كبار السن وذوي الاحتياجات الخاصة والناطقين بغير العربية — إلى مرافقين ومرشدين موثوقين يرعون راحتهم ويؤنسون وحشتهم أثناء الطواف والسعي.
            </p>
          </Card>
        </div>

        {/* Platform Values */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E3E8E5] shadow-soft space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-charcoal-900 font-cairo">قيمنا الجوهرية</h2>
            <p className="text-xs text-charcoal-500">المبادئ التي تأسست عليها منصة وصال</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="text-center p-5 rounded-2xl bg-[#FAF8F4] border border-[#EFECE3] space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-800 mx-auto mb-1" />
              <h3 className="font-bold text-base text-charcoal-900">الأمانة والمسؤولية</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                استشعار شرف خدمة ضيف الرحمن والالتزام بأعلى درجات المصداقية والإخلاص.
              </p>
            </div>

            <div className="text-center p-5 rounded-2xl bg-[#FAF8F4] border border-[#EFECE3] space-y-2">
              <Award className="w-8 h-8 text-gold-600 mx-auto mb-1" />
              <h3 className="font-bold text-base text-charcoal-900">الرفق والإتقان</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                معاملة كبار السن والعائلات بالرحمة واللين، وضمان تقديم خدمات بمستوى احترافي عالٍ.
              </p>
            </div>

            <div className="text-center p-5 rounded-2xl bg-[#FAF8F4] border border-[#EFECE3] space-y-2">
              <Users className="w-8 h-8 text-emerald-800 mx-auto mb-1" />
              <h3 className="font-bold text-base text-charcoal-900">الضيافة المكية</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                إحياء الموروث العريق لأهل مكة في إكرام الوفود وبذل الجهد لإدخال السرور على قلوبهم.
              </p>
            </div>
          </div>
        </div>

        {/* Academic Project Context Note */}
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed space-y-1">
          <p className="font-bold text-sm text-amber-950">إشعار المشروع الأكاديمي:</p>
          <p>
            مشروع "وصال" هو مشروع تخرج تطبيقي تم تصميمه وتطويره بهدف إبراز القدرات البرمجية وتصميم واجهات المستخدم الحديثة وفق أحدث تقنيات الويب، والبيانات المعروضة فيه هي بيانات تجريبية (Demo Data).
          </p>
        </div>
      </div>
    </div>
  );
};
