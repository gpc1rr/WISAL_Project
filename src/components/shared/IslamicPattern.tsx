import React from 'react';
import { cn } from '@/utils/cn';

export interface IslamicPatternProps {
  className?: string;
  variant?: 'subtle' | 'border' | 'star' | 'arch';
  color?: string;
}

export const IslamicPattern: React.FC<IslamicPatternProps> = ({
  className,
  variant = 'star',
}) => {
  if (variant === 'star') {
    return (
      <svg
        className={cn('w-8 h-8 text-gold-500/30', className)}
        viewBox="0 0 100 100"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M50 0 L61 35 L97 25 L75 54 L97 83 L61 73 L50 100 L39 73 L3 83 L25 54 L3 25 L39 35 Z" />
      </svg>
    );
  }

  if (variant === 'arch') {
    return (
      <svg
        className={cn('w-24 h-12 text-gold-500/20', className)}
        viewBox="0 0 120 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M10 60 V30 Q10 10 60 10 Q110 10 110 30 V60" />
        <path d="M25 60 V35 Q25 22 60 22 Q95 22 95 35 V60" />
        <circle cx="60" cy="10" r="3" fill="currentColor" />
      </svg>
    );
  }

  if (variant === 'border') {
    return (
      <div className={cn('h-1 w-full flex items-center justify-center gap-2 overflow-hidden', className)}>
        <div className="h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent flex-1" />
        <div className="w-2 h-2 rotate-45 border border-gold-500/80 shrink-0" />
        <div className="h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent flex-1" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#0E4D3A_1px,transparent_1px)] [background-size:16px_16px]',
        className
      )}
      aria-hidden="true"
    />
  );
};
