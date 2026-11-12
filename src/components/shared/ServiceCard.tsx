import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Service } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { CATEGORIES } from '@/utils/constants';
import { formatCurrency } from '@/utils/formatters';
import { serviceRepository } from '@/data/repositories/serviceRepository';
import { useToast } from '@/hooks/useToast';
import { Heart, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ServiceCardProps {
  service: Service;
  onBookClick?: (service: Service) => void;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookClick, className }) => {
  const [isFav, setIsFav] = useState(() => serviceRepository.isFavorite(service.id));
  const [isFavLoading, setIsFavLoading] = useState(false);
  const { toast } = useToast();
  const categoryConfig = CATEGORIES[service.category];

  // نجيب المفضلة من الخادم (طلب واحد لكل البطاقات)
  useEffect(() => {
    let active = true;
    serviceRepository.loadFavorites().then(() => {
      if (active) setIsFav(serviceRepository.isFavorite(service.id));
    });
    return () => {
      active = false;
    };
  }, [service.id]);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavLoading) return;

    setIsFavLoading(true);
    try {
      const newState = await serviceRepository.toggleFavorite(service.id);
      setIsFav(newState);
      if (newState) {
        toast('تمت إضافة الخدمة إلى المفضلة', 'success');
      } else {
        toast('تمت إزالة الخدمة من المفضلة', 'info');
      }
    } catch (err: any) {
      toast(err.message || 'تعذر تحديث المفضلة', 'error');
    } finally {
      setIsFavLoading(false);
    }
  };

  return (
    <Card hoverable className={cn('flex flex-col h-full group border-[#E3E8E5]', className)}>
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="gold" className="bg-white/95 backdrop-blur-md shadow-sm border-white/40 text-charcoal-900 font-medium">
            {categoryConfig?.label || 'خدمة مساندة'}
          </Badge>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-charcoal-700 hover:text-rose-600 transition-colors shadow-sm focus:outline-none"
          aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart
            className={cn('w-4 h-4 transition-colors', isFav ? 'fill-rose-500 text-rose-500' : 'text-charcoal-600')}
          />
        </button>

        {/* Provider Tag on Image */}
        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
            {service.providerAvatar && (
              <img
                src={service.providerAvatar}
                alt={service.providerName}
                className="w-4 h-4 rounded-full object-cover"
              />
            )}
            <span className="font-medium truncate max-w-[130px]">{service.providerName}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 text-gold-300 font-semibold">
            <span>★</span>
            <span>{service.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/services/${service.id}`} className="group-hover:text-emerald-800 transition-colors">
          <h3 className="font-bold text-base text-charcoal-900 mb-2 line-clamp-1 leading-snug">
            {service.title}
          </h3>
        </Link>

        <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {service.description}
        </p>

        {/* Meta badges: Location & Duration */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-charcoal-500 border-t border-[#F0F3F2] pt-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>{service.duration}</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate max-w-[180px]">{service.location}</span>
          </div>
        </div>

        {/* Footer: Price and CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F0F3F2] mt-auto">
          <div>
            <span className="text-xs text-charcoal-400 block">السعر المقدر</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-emerald-800">{formatCurrency(service.price)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/services/${service.id}`}>
              <Button variant="outline" size="sm" className="rounded-lg text-xs px-2.5 py-1.5">
                التفاصيل
              </Button>
            </Link>
            {onBookClick ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onBookClick(service)}
                className="rounded-lg text-xs px-3 py-1.5"
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                احجز الآن
              </Button>
            ) : (
              <Link to={`/services/${service.id}?book=true`}>
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-lg text-xs px-3 py-1.5"
                  leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  احجز الآن
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
