import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showScore?: boolean;
  reviewsCount?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
  showScore = true,
  reviewsCount,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const currentVal = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1.5 dir-ltr select-none">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.round(currentVal);

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={cn(
                'transition-transform',
                interactive && 'hover:scale-110 cursor-pointer focus:outline-none',
                !interactive && 'cursor-default'
              )}
              aria-label={`${starValue} من ${max} نجوم`}
            >
              <Star
                className={cn(
                  starSizes[size],
                  isFilled
                    ? 'text-gold-500 fill-gold-500'
                    : 'text-stone-300 fill-stone-100'
                )}
              />
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className="text-xs font-semibold text-charcoal-800 dir-rtl mr-1">
          {rating > 0 ? rating.toFixed(1) : 'جديد'}
        </span>
      )}

      {reviewsCount !== undefined && (
        <span className="text-xs text-charcoal-400 dir-rtl">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
