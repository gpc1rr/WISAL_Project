import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Service } from '@/types';
import { serviceRepository } from '@/data/repositories/serviceRepository';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IslamicPattern } from '@/components/shared/IslamicPattern';
import { CATEGORIES } from '@/utils/constants';
import { BookingModal } from '@/features/bookings/BookingModal';
import { 
  Compass, Languages, HeartHandshake, Accessibility, ShieldCheck, 
  ArrowLeft, CheckCircle2, Star, Users, MapPin, 
  ChevronDown, Sparkles, Clock, Heart, Award, ShieldAlert
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    serviceRepository.getAll().then(services => {
      setFeaturedServices(services.slice(0, 3));
    });
  }, []);

  const stats = [
    { label: 'زائر ومعتمر مخدوم', value: '+14,500', icon: Users },
    { label: 'مقدم خدمة معتمد', value: '+380', icon: Award },
    { label: 'نسبة رضا المستفيدين', value: '99.4%', icon: Star },
    { label: 'متوسط سرعة الاستجابة', value: '< 15 دقيقة', icon: Clock },
  ];

  const categoryEntries = Object.entries(CATEGORIES) as [keyof typeof CATEGORIES, typeof CATEGORIES[keyof typeof CATEGORIES]][];

  const categoryIcons: Record<string, any> = {
    escort_guidance: Compass,
    translation: Languages,
    elderly_assistance: HeartHandshake,
    mobility_support: Accessibility,
    support_care: ShieldCheck,
  };

  const howItWorksSteps = [
    {
      step: '01',
      title: 'استعراض واختيار الخدمة',
      desc: 'تصفح قائمة الخدمات المساندة المعتمدة في الحرم المكي الشريف، مع الاطلاع على خبرات ومؤهلات مقدمي الخدمة وتقييمات المعتمرين السابقين.',
      icon: Compass,
    },
    {
      step: '02',
      title: 'تحديد الموعد ونقطة الالتقاء',
      desc: 'اختر اليوم والفترة الزمنية المناسبة لزيارتك، وحدد البوابة أو الساحة الأقرب لمكان قدومك (مثل بوابة الملك فهد، أجياد، أو الساحة الغربية).',
      icon: MapPin,
    },
    {
      step: '03',
      title: 'الالتقاء وأداء المناسك بطمأنينة',
      desc: 'يلتقي بك مقدم الخدمة في النقطة المحددة لمرافقتك ومساعدتك طوال فترة الطواف والسعي والزيارة برفق وإتقان وسكينة تامة.',
      icon: CheckCircle2,
    },
    {
      step: '04',
      title: 'التقييم ومشاركة التجربة',
      desc: 'بعد إتمام الخدمة بنجاح، شارك انطباعك وتقييمك للمساهمة في استمرار الارتقاء بجودة الخدمات المقدمة لضيوف الرحمن.',
      icon: Star,
    },
  ];

  const faqs = [
    {
      q: 'ما هي منصة وصال؟',
      a: 'وصال هي منصة رقمية اجتماعية مخصصة لقاصدي المسجد الحرام بمكة المكرمة، تهدف إلى ربط الزوار والمعتمرين بمقدمي الخدمات المساندة المؤهلين (مثل الإرشاد، الترجمة، ومساعدة كبار السن وذوي الاحتياجات) لتسهيل رحلتهم الإيمانية بكل يسر وطمأنينة.',
    },
    {
      q: 'هل هذه النسخة هي نسخة فعلية أم نموذج تجريبي؟',
      a: 'هذه النسخة هي نموذج تجريبي وتفاعلي متكامل لمشروع تخرج جامعي، يعتمد على بيانات تجريبية وحفظ محلي لإظهار كافة رحلات المستخدم والمميزات دون الحاجة لربط مالي أو خوادم خلفية فعلية.',
    },
    {
      q: 'كيف يتم التحقق من مقدمي الخدمات؟',
      a: 'في الرؤية التشغيلية للمنصة، يخضع مقدمو الخدمات المساندة لبرامج تأهيلية مكثفة تشمل آداب التعامل مع ضيوف الرحمن، ومعرفة مسارات وأبواب وتوسعات المسجد الحرام، ومبادئ الإسعافات الأولية.',
    },
    {
      q: 'هل يمكنني التبديل بين تجربة المستفيد وتجربة مقدم الخدمة؟',
      a: 'نعم بكل سهولة! وفرنا لك في الشريط العلوي أزراراً سريعة للتبديل الفوري بين حساب "المستفيد" وحساب "مقدم الخدمة" لتجربة كافة لوحات التحكم والميزات.',
    },
    {
      q: 'أين تتم نقاط الالتقاء عادة داخل الحرم المكي؟',
      a: 'يتم تحديد نقاط واضحة ومعروفة بالساحات الخارجية مثل: ساحة باب الملك فهد (بوابة 79)، ساحة باب الملك عبدالعزيز (بوابة 1)، محطة استلام العربات بالساحة الغربية، وأمام مجمع أبراج الساعة.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#073D2D] via-[#0E4D3A] to-[#073D2D] text-white overflow-hidden py-20 lg:py-28 border-b-2 border-gold-500/30">
        <IslamicPattern variant="subtle" className="opacity-15 text-gold-400" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Right Column: Hero Content */}
            <div className="lg:col-span-7 text-right space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-gold-500/40 text-gold-300 text-xs font-semibold shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>منصة ربط قاصدي الحرم المكي بالخدمات المساندة</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-cairo leading-tight sm:leading-tight tracking-tight">
                رحلتك الإيمانية في رحاب البيت الحرام.. <br />
                <span className="gold-gradient-text font-black">أكثر يسراً وسكينة واطمئناناً</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-200 leading-relaxed max-w-2xl font-light">
                نجمع ضيوف الرحمن من معتمرين وزوار بنخبة من أبناء مكة المكرمة المؤهلين للمرافقة والإرشاد، الترجمة اللغوية، ومساندة كبار السن وذوي الإعاقة طوال مناسك الطواف والسعي.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/services">
                  <Button
                    variant="gold"
                    size="lg"
                    className="text-charcoal-900 font-bold"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    استعراض خدمات الحرم
                  </Button>
                </Link>

                <Link to="/how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-white border-white/40 hover:bg-white/10 hover:border-white"
                  >
                    كيف تعمل المنصة؟
                  </Button>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-emerald-800/80 flex flex-wrap gap-6 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>مقدمو خدمات موثوقون</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>نقاط التقاء محددة بالساحات</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>دعم متواصل ومتعدد اللغات</span>
                </div>
              </div>
            </div>

            {/* Left Column: Visual Composition */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-gold-500/30 to-emerald-500/30 rounded-3xl blur-xl opacity-70" />

                {/* Main Card */}
                <div className="relative bg-gradient-to-b from-[#0E4D3A] to-[#073D2D] rounded-3xl p-6 border border-gold-500/40 shadow-elevated space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-emerald-800/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-400 border border-gold-500/30 font-bold">
                        و
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white">بطاقة خدمة مميزة</h2>
                        <span className="text-[11px] text-gold-300 font-medium">مرافقة معتمر خلال المناسك</span>
                      </div>
                    </div>
                    <Badge variant="gold" size="sm" className="bg-gold-500/20 text-gold-300 border-gold-500/30">
                      موصى به
                    </Badge>
                  </div>

                  <div className="aspect-[16/9] rounded-2xl overflow-hidden relative shadow-inner">
                    <img
                      src="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800&auto=format&fit=crop&q=80"
                      alt="الكعبة المشرفة"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 right-3 text-white text-xs font-semibold">
                      مكة المكرمة — صحن المطاف وأدوار العربات
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 text-xs text-stone-200">
                    <div className="flex items-center justify-between py-1 border-b border-emerald-800/50">
                      <span className="text-stone-400">مقدم الخدمة:</span>
                      <span className="font-bold text-gold-300">م. ريان الشريف (تقييم 4.98 ★)</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-emerald-800/50">
                      <span className="text-stone-400">نقطة الالتقاء:</span>
                      <span>ساحة باب الملك فهد</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-stone-400">التكلفة:</span>
                      <span className="font-bold text-white text-sm">150 ر.س / جولة</span>
                    </div>
                  </div>

                  <Link to="/services/srv-1" className="block w-full">
                    <Button variant="gold" size="md" className="w-full text-charcoal-900 font-bold">
                      عرض تفاصيل التجربة
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-white border-b border-[#E3E8E5] py-10 shadow-xs relative z-20 -mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EFECE3]">
                  <Icon className="w-6 h-6 text-emerald-800 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-cairo">
                    {st.value}
                  </div>
                  <div className="text-xs text-charcoal-600 mt-1 font-medium">{st.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-16 sm:py-24 bg-[#F8F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <Badge variant="emerald" size="md">
              مجالات الخدمة المساندة
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-cairo">
              خدمات متخصصة تلبي كافة احتياجات زوار الحرم
            </h2>
            <p className="text-sm text-charcoal-600">
              اختر المجال الذي يناسب رغبتك أو احتياجات مرافقيك أثناء زيارة المسجد الحرام.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryEntries.map(([key, cat]) => {
              const Icon = categoryIcons[key] || Compass;
              return (
                <Link
                  key={key}
                  to={`/services?category=${key}`}
                  className="group bg-white p-6 rounded-2xl border border-[#E3E8E5] hover:border-emerald-600/40 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-gold-300 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-charcoal-900 group-hover:text-emerald-800 transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-[#F0F3F2] flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:text-emerald-900">
                    <span>تصفح الخدمات</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="py-16 sm:py-24 bg-white border-y border-[#E3E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <Badge variant="gold" size="md" className="mb-2">
                الخدمات الأعلى تقييماً
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-cairo">
                خدمات مميزة تلقى إقبالاً من المعتمرين
              </h2>
            </div>
            <Link to="/services">
              <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                عرض جميع الخدمات ({featuredServices.length > 0 ? '+5' : '0'})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onBookClick={s => setSelectedServiceForBooking(s)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-24 bg-[#F8F6F0] relative overflow-hidden">
        <IslamicPattern variant="subtle" className="opacity-5 text-emerald-900" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="emerald" size="md">
              خطوات يسيرة
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-cairo">
              كيف تعمل منصة وصال؟
            </h2>
            <p className="text-sm text-charcoal-600">
              رحلة حجز ميسرة تبدأ من هاتفك وتنتهي بطمأنينة وسكينة في صحن المطاف.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-[#E3E8E5] shadow-soft relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-gold-500 font-cairo">{s.step}</span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-bold text-base text-charcoal-900 mb-2">{s.title}</h3>
                    <p className="text-xs text-charcoal-600 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DUAL PORTAL INTRO: Beneficiary vs Provider */}
      <section className="py-16 sm:py-24 bg-white border-y border-[#E3E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-cairo">
              منصة تجمع بين الباذل والمستفيد في أقدس البقاع
            </h2>
            <p className="text-sm text-charcoal-600">
              سواء كنت قادماً لأداء العمرة أو شاباً مكيّاً مؤهلاً لخدمة ضيوف الرحمن، وصال هي بوابتك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Beneficiary Card */}
            <div className="bg-gradient-to-br from-[#FAF8F4] to-white p-8 rounded-3xl border border-[#E3E8E5] shadow-soft space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-gold-300 flex items-center justify-center shadow-sm">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900">للمعتمرين وزوار الحرم (المستفيد)</h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                استمتع برحلة روحانية خالية من التشتت والارتباك. اختر مرافقاً يتقن لغتك أو مرشداً يخفف عن والديك كبار السن مشقة التنقل وحجز العربات.
              </p>
              <ul className="space-y-2 text-xs text-charcoal-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>حجز سهل وتأكيد مباشر</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>تحديد دقيق لنقاط الالتقاء بالساحات</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>تقييم شفاف ومراجعات حقيقية</span>
                </li>
              </ul>
              <div className="pt-3">
                <Link to="/register/beneficiary">
                  <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    تسجيل حساب مستفيد جديد
                  </Button>
                </Link>
              </div>
            </div>

            {/* Provider Card */}
            <div className="bg-gradient-to-br from-[#073D2D] to-[#0E4D3A] text-white p-8 rounded-3xl border border-gold-500/40 shadow-soft space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-gold-500 text-charcoal-900 flex items-center justify-center shadow-gold-glow">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">لمقدمي الخدمات المساندة (مقدم الخدمة)</h3>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
                انضم إلى نخبة شباب مكة المكرمة في خدمة ضيوف الرحمن، وانشر خدماتك وخبراتك ونظم مواعيد حجوزاتك باحترافية كاملة.
              </p>
              <ul className="space-y-2 text-xs text-stone-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>لوحة تحكم ذكية لإدارة الخدمات والحجوزات</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>إشراف وتنظيم المواعيد وقبول الطلبات</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>بناء سمعة مهنية وتقييمات معتمدة</span>
                </li>
              </ul>
              <div className="pt-3">
                <Link to="/register/provider">
                  <Button variant="gold" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    انضم كمقدم خدمة معتمد
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 sm:py-24 bg-[#F8F6F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <Badge variant="emerald" size="md">
              الأسئلة الشائعة
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-900 font-cairo">
              كل ما تود معرفته عن منصة وصال
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E3E8E5] overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-sm text-charcoal-900 hover:text-emerald-800 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-charcoal-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-700' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-charcoal-600 leading-relaxed border-t border-[#F0F3F2] animate-slide-up">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-gradient-to-r from-[#073D2D] via-[#0E4D3A] to-[#073D2D] text-white py-16 border-t border-gold-500/30 text-center relative overflow-hidden">
        <IslamicPattern variant="subtle" className="opacity-10 text-gold-400" />
        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-cairo">
            ابدأ رحلتك المباركة مع وصال الآن
          </h2>
          <p className="text-sm sm:text-base text-stone-200 font-light">
            تصفح الخدمات المتاحة أو أنشئ حسابك خلال لحظات لتجربة حجز متكاملة وآمنة.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/services">
              <Button variant="gold" size="lg" className="font-bold text-charcoal-900">
                استعراض دليل الخدمات
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="text-white border-white/50 hover:bg-white/10">
                إنشاء حساب جديد
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={!!selectedServiceForBooking}
        onClose={() => setSelectedServiceForBooking(null)}
        service={selectedServiceForBooking}
      />
    </div>
  );
};
