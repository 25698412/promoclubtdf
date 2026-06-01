'use client';

import React from 'react';
import { cn } from './Button';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'accent' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'neutral',
      size = 'md',
      dot = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const variantClasses: Record<BadgeVariant, string> = {
      success: 'bg-success-50 text-success-700 border-success-100',
      warning: 'bg-warning-50 text-warning-700 border-warning-100',
      error: 'bg-error-50 text-error-700 border-error-100',
      info: 'bg-blue-50 text-blue-700 border-blue-100',
      primary: 'bg-primary-50 text-primary-500 border-primary-100',
      accent: 'bg-accent-50 text-accent-600 border-accent-100',
      neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const sizeClasses: Record<BadgeSize, string> = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1.5 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-semibold border transition-colors duration-150',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              variant === 'success' && 'bg-success',
              variant === 'warning' && 'bg-warning',
              variant === 'error' && 'bg-error',
              variant === 'info' && 'bg-blue-500',
              variant === 'primary' && 'bg-primary-500',
              variant === 'accent' && 'bg-accent-500',
              variant === 'neutral' && 'bg-gray-500',
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
