import React, { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    return (
      <div className="w-full text-right">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-charcoal-800 mb-1.5">
            {label}
            {props.required && <span className="text-rose-500 mr-1">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-charcoal-400">
              {rightIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full rounded-xl border border-[#D0DBD5] bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all duration-200',
              rightIcon && 'pr-10',
              leftIcon && 'pl-10',
              error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-400/20',
              className
            )}
            {...props}
          />
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
              {leftIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-charcoal-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
