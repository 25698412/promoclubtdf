'use client';

import React from 'react';
import { cn } from '../ui/Button';

// Clase shimmer reutilizable — usa los colores del sistema, no grises genéricos
const shimmerClass = [
  'relative overflow-hidden rounded-md',
  'before:absolute before:inset-0',
  'before:bg-gradient-to-r before:from-[#F0F4F8] before:via-[#DDE6EF] before:to-[#F0F4F8]',
  'before:bg-[length:200%_100%]',
  'before:animate-[shimmer_1.6s_linear_infinite]',
].join(' ');

interface SkeletonProps {
  variant?: 'text' | 'title' | 'image' | 'avatar' | 'card' | 'button';
  className?: string;
  lines?: number;
}

export const LoadingSkeleton = ({ variant = 'text', className, lines = 3 }: SkeletonProps) => {
  if (variant === 'card') {
    return (
      <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(27,58,92,0.06), 0 8px 24px rgba(27,58,92,0.04)' }}>
        {/* Image skeleton */}
        <div className={cn('h-48', shimmerClass)} />
        <div className="p-4 space-y-3">
          {/* Business row */}
          <div className="flex items-center gap-2">
            <div className={cn('w-7 h-7 rounded-full flex-shrink-0', shimmerClass)} />
            <div className={cn('h-3 w-28', shimmerClass)} />
          </div>
          {/* Title */}
          <div className={cn('h-5 w-3/4', shimmerClass)} />
          {/* Description */}
          <div className={cn('h-4 w-full', shimmerClass)} />
          <div className={cn('h-4 w-2/3', shimmerClass)} />
          {/* Footer */}
          <div className="flex justify-between items-center pt-1">
            <div className={cn('h-3 w-20', shimmerClass)} />
            <div className={cn('h-3 w-14', shimmerClass)} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return <div className={cn('rounded-full', shimmerClass, className || 'w-12 h-12')} />;
  }

  if (variant === 'button') {
    return <div className={cn('rounded-lg h-11', shimmerClass, className || 'w-32')} />;
  }

  if (variant === 'image') {
    return <div className={cn('rounded-xl', shimmerClass, className || 'w-full h-48')} />;
  }

  if (variant === 'title') {
    return <div className={cn('h-6 w-3/4', shimmerClass, className)} />;
  }

  // Text variant (múltiples líneas)
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn('h-4', shimmerClass, i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  );
};

interface SkeletonGridProps {
  count?: number;
  variant?: 'card' | 'text' | 'title';
  className?: string;
  cols?: number;
}

export const SkeletonGrid = ({ count = 6, variant = 'card', className, cols = 3 }: SkeletonGridProps) => {
  return (
    <div className={cn(`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6`, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
