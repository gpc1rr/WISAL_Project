import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Service, ServiceCategory } from '@/types';
import { serviceRepository } from '@/data/repositories/serviceRepository';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookingModal } from '@/features/bookings/BookingModal';
import { CATEGORIES } from '@/utils/constants';
import { Search, SlidersHorizontal, X, Compass, RotateCcw } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating_desc'>('recommended');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await serviceRepository.getAll({
        category: selectedCategory === 'all' ? undefined : (selectedCategory as ServiceCategory),
        search: searchQuery,
        sortBy,
      });
      setServices(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('recommended');
    searchParams.delete('category');
    setSearchParams(searchParams);
    serviceRepository.getAll().then(setServices);
  };

  return (
    <div className="py-10 bg-[#F8F6F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-[#073D2D] via-[#0E4D3A] to-[#073D2D] text-white p-8 sm:p-10 rounded-3xl border border-gold-500/30 shadow-soft">
          <div className="max-w-3xl space-y-3">
            <Badge variant="gold" size="md" className="bg-gold-500/20 text-gold-300 border-gold-500/30">
              دليل الخدمات المساندة
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-cairo">
              استكشف خدمات الحرم المكي الشريف
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
              مرافقة كبار السن، الإرشاد المكاني، الترجمة اللغوية، وقيادة العربات بأيدي أبناء مكة المكرمة المؤهلين.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-6 rounded-2xl border border-[#E3E8E5] shadow-soft space-y-5">
          {/* Search & Sort Controls */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8">
              <Input
                placeholder="ابحث بالاسم أو الوصف (مثال: طواف، كبار السن، ترجمة، عربة)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                rightIcon={<Search className="w-4 h-4 text-emerald-700" />}
                leftIcon={
                  searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        serviceRepository.getAll({ category: selectedCategory === 'all' ? undefined : (selectedCategory as any), sortBy }).then(setServices);
                      }}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : undefined
                }
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <Select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full text-xs"
              >
                <option value="recommended">الترتيب: الموصى به والأعلى تقييماً</option>
                <option value="price_asc">السعر: من الأقل إلى الأعلى</option>
                <option value="price_desc">السعر: من الأعلى إلى الأقل</option>
                <option value="rating_desc">التقييم: الأعلى أولاً</option>
              </Select>
            </div>
          </form>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0F3F2]">
            <span className="text-xs font-semibold text-charcoal-500 ml-2">المجال:</span>
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-charcoal-700 hover:bg-stone-200'
              }`}
            >
              جميع الخدمات ({services.length})
            </button>

            {Object.entries(CATEGORIES).map(([catKey, catVal]) => {
              const isActive = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => handleCategoryChange(catKey)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 text-charcoal-700 hover:bg-stone-200'
                  }`}
                >
                  {catVal.label}
                </button>
              );
            })}

            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 mr-auto px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط التصفية</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-charcoal-600 px-1">
          <span>
            عرض <strong>{services.length}</strong> من نتائج الخدمات المتاحة
          </span>
          <span className="text-emerald-800 font-semibold">
            جميع الخدمات تخضع لمعايير الجودة والإرشاد المعتمدة
          </span>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-80 bg-stone-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onBookClick={s => setSelectedServiceForBooking(s)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Compass className="w-8 h-8" />}
            title="لم نجد خدمات تطابق خيارات البحث"
            description="جرب البحث بكلمات أخرى أو اختر جميع التصنيفات لاستعراض كامل الخدمات المتاحة بالحرم."
            actionText="إعادة ضبط البحث"
            onAction={handleResetFilters}
          />
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={!!selectedServiceForBooking}
        onClose={() => setSelectedServiceForBooking(null)}
        service={selectedServiceForBooking}
      />
    </div>
  );
};
