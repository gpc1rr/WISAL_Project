import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'gold' | 'neutral' | 'outline' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'emerald',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    gold: 'bg-gold-50 text-gold-800 border-gold-300/80',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    outline: 'bg-transparent text-charcoal-700 border-charcoal-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium border',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium border',
  };

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 transition-colors', variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
