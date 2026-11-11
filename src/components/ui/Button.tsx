import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm hover:shadow-soft focus:ring-emerald-600 border border-emerald-600/30',
      secondary: 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/70 focus:ring-emerald-500',
      gold: 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-charcoal-900 font-semibold shadow-gold-glow hover:shadow-lg focus:ring-gold-400 border border-gold-400/40',
      outline: 'bg-transparent border border-emerald-700/40 text-emerald-800 hover:bg-emerald-50/50 focus:ring-emerald-600',
      ghost: 'bg-transparent text-charcoal-700 hover:bg-emerald-50/60 hover:text-emerald-800 focus:ring-emerald-500',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0 ml-1.5" />}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
        <span>{children}</span>
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
