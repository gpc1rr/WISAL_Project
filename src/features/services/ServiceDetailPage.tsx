import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Service, ProviderProfile, RatingReview } from '@/types';
import { serviceRepository } from '@/data/repositories/serviceRepository';
import { ratingRepository } from '@/data/repositories/ratingRepository';
import { storage } from '@/data/mocks/storage';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { RatingStars } from '@/components/ui/RatingStars';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { BookingModal } from '@/features/bookings/BookingModal';
import { CATEGORIES } from '@/utils/constants';
import { formatCurrency, formatDateArabic } from '@/utils/formatters';
import { useToast } from '@/hooks/useToast';
import { 
  ArrowRight, Heart, MapPin, Clock, ShieldCheck, 
  CheckCircle2, User as UserIcon, Calendar, Star, Languages, Award
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [service, setService] = useState<Service | null>(null);
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [reviews, setReviews] = useState<RatingReview[]>([]);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    serviceRepository.getById(id).then(found => {
      setService(found);
      if (found) {
        setIsFav(serviceRepository.isFavorite(found.id));
        // Provider info
        const provs = storage.getProviders();
        const p = provs.find(pr => pr.id === found.providerId) || null;
        setProvider(p);

        // Reviews
        ratingRepository.getByServiceId(found.id).then(setReviews);

        // Related services
        serviceRepository.getAll({ category: found.category }).then(all => {
          setRelatedServices(all.filter(s => s.id !== found.id).slice(0, 3));
        });

        // If URL has ?book=true, auto-open modal
        if (searchParams.get('book') === 'true') {
          setIsBookingOpen(true);
        }
      }
      setIsLoading(false);
    });
  }, [id, searchParams]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-charcoal-600 font-medium">جاري تحميل تفاصيل الخدمة...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-stone-200 text-center space-y-4">
        <h3 className="text-lg font-bold text-charcoal-900">عذراً، الخدمة المطلوبة غير متوفرة</h3>
        <p className="text-xs text-charcoal-500">ربما تم حذفها أو تعديل مسارها.</p>
        <Link to="/services">
          <Button variant="primary" size="md">العودة لدليل الخدمات</Button>
        </Link>
      </div>
    );
  }

  const categoryConfig = CATEGORIES[service.category];

  const handleFavoriteToggle = () => {
    const newState = serviceRepository.toggleFavorite(service.id);
    setIsFav(newState);
    if (newState) {
      toast('تمت إضافة الخدمة إلى المفضلة', 'success');
    } else {
      toast('تمت إزالة الخدمة من المفضلة', 'info');
    }
  };

  return (
    <div className="bg-[#F8F6F0] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لجميع الخدمات</span>
          </button>

          <Badge variant="emerald" size="md">
            {categoryConfig?.label || 'خدمة مساندة'}
          </Badge>
        </div>

        {/* Main Grid: Details (8 cols) & Booking Sticky Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Card with Hero Photo */}
            <Card className="overflow-hidden border-[#E3E8E5]">
              <div className="relative aspect-[21/9] sm:aspect-[16/7] bg-stone-100">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <button
                  onClick={handleFavoriteToggle}
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-charcoal-700 hover:text-rose-600 transition-colors shadow-md"
                  aria-label="المفضلة"
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <div className="absolute bottom-4 right-4 left-4 text-white">
                  <div className="flex flex-wrap items-center gap-3 text-xs mb-1">
                    <span className="bg-emerald-900/80 px-2.5 py-1 rounded-md font-medium border border-emerald-700/60">
                      {categoryConfig?.label}
                    </span>
                    <span className="bg-black/40 px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1 text-gold-300 font-semibold">
                      ★ {service.rating.toFixed(1)} ({service.reviewsCount} تقييم)
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-cairo leading-snug">
                    {service.title}
                  </h1>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-charcoal-900 mb-3 font-cairo">وصف الخدمة</h2>
                  <p className="text-sm text-charcoal-700 leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>
                </div>

                {/* Features list */}
                {service.features && service.features.length > 0 && (
                  <div className="pt-4 border-t border-[#F0F3F2]">
                    <h3 className="text-base font-bold text-charcoal-900 mb-3">ما تشمله هذه الخدمة:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {service.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-charcoal-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meeting points */}
                <div className="pt-4 border-t border-[#F0F3F2]">
                  <h3 className="text-base font-bold text-charcoal-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>نقاط الالتقاء المقترحة بالمسجد الحرام:</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.meetingPoints.map((pt, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF8F4] border border-[#EFECE3] text-xs font-medium text-charcoal-800"
                      >
                        📍 {pt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Provider Profile Card */}
            {provider && (
              <Card className="p-6 sm:p-8 border-[#E3E8E5]">
                <h3 className="text-base font-bold text-charcoal-900 mb-4 font-cairo">
                  عن مقدم الخدمة
                </h3>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-[#F0F3F2]">
                  <img
                    src={provider.avatar}
                    alt={provider.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 shadow-sm"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-charcoal-900">{provider.fullName}</h4>
                      {provider.isVerified && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          معتمد لدى وصال
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal-500">{provider.serviceType}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-600 pt-1">
                      <div className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-gold-600" />
                        <span>خبرة: {provider.experienceYears} سنوات</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Languages className="w-3.5 h-3.5 text-gold-600" />
                        <span>اللغات: {provider.languages.join('، ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                  <p>{provider.bio}</p>
                </div>
              </Card>
            )}

            {/* Reviews Section */}
            <Card className="p-6 sm:p-8 border-[#E3E8E5]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F0F3F2]">
                <div>
                  <h3 className="text-lg font-bold text-charcoal-900 font-cairo">
                    تقييمات المعتمرين ({reviews.length})
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-0.5">آراء وانطباعات الزوار الكرام</p>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-black text-emerald-800 font-cairo">
                    {service.rating.toFixed(1)}
                  </span>
                  <div className="text-[10px] text-charcoal-400">من 5 نجوم</div>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(rev => (
                    <div key={rev.id} className="p-4 rounded-xl bg-[#FAF8F4] border border-[#EFECE3] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                            {rev.beneficiaryName.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-charcoal-900 block">{rev.beneficiaryName}</span>
                            <span className="text-[10px] text-charcoal-400">{formatDateArabic(rev.createdAt)}</span>
                          </div>
                        </div>
                        <RatingStars rating={rev.score} size="sm" showScore={false} />
                      </div>
                      <p className="text-xs text-charcoal-700 leading-relaxed pr-9">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-charcoal-500 text-center py-6">
                  لا توجد تقييمات مكتوبة لهذه الخدمة حتى الآن. كن أول من يخوض التجربة ويشارك انطباعه المبارك!
                </p>
              )}
            </Card>
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <Card className="p-6 border-gold-500/40 shadow-elevated bg-white space-y-6">
              <div>
                <span className="text-xs text-charcoal-500 block mb-1">المبلغ التقديري للخدمة:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-800 font-cairo">
                    {formatCurrency(service.price)}
                  </span>
                  <span className="text-xs text-charcoal-500 font-medium">{service.priceUnit}</span>
                </div>
              </div>

              <div className="space-y-3 py-4 border-y border-[#F0F3F2] text-xs text-charcoal-700">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-500">المدة التقديرية:</span>
                  <span className="font-bold">{service.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-500">نطاق التواجد:</span>
                  <span className="font-bold">{service.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-500">تأكيد الحجز:</span>
                  <span className="font-bold text-emerald-700">فوري ومجاني للتجربة</span>
                </div>
              </div>

              <Button
                variant="gold"
                size="lg"
                className="w-full font-bold text-charcoal-900 shadow-gold-glow"
                onClick={() => setIsBookingOpen(true)}
              >
                احجز هذه الخدمة الآن
              </Button>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>ضمان التجربة والأمان:</span>
                </p>
                <p className="leading-relaxed">
                  يتم التواصل والتنسيق المباشر مع مقدم الخدمة وتحديد نقطة اللقاء الدقيقة بالساحات لراحتك التامة.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="pt-12 border-t border-[#E3E8E5] space-y-6">
            <h3 className="text-xl font-bold text-charcoal-900 font-cairo">
              خدمات أخرى قد تهمك في نفس المجال
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map(rel => (
                <ServiceCard key={rel.id} service={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        service={service}
      />
    </div>
  );
};
