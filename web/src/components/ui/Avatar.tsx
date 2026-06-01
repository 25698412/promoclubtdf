'use client';

import React from 'react';
import { cn } from './Button';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  (
    {
      src,
      alt = 'Avatar',
      size = 'md',
      fallback,
      status,
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses: Record<string, string> = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
    };

    const statusColors: Record<string, string> = {
      online: 'bg-success',
      offline: 'bg-gray-400',
      busy: 'bg-error',
      away: 'bg-warning',
    };

    const statusSizeClasses: Record<string, string> = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4',
      xl: 'w-5 h-5',
    };

    const [error, setError] = React.useState(false);

    return (
      <div className="relative inline-block">
        {src && !error ? (
          <img
            ref={ref as React.RefObject<HTMLImageElement>}
            src={src}
            alt={alt}
            className={cn(
              'rounded-full object-cover border-2 border-white shadow-sm',
              'transition-transform duration-200',
              sizeClasses[size],
              className
            )}
            onError={() => setError(true)}
            {...props}
          />
        ) : (
          <div
            className={cn(
              'rounded-full bg-primary-100 text-primary-500 flex items-center justify-center',
              'border-2 border-white shadow-sm font-semibold',
              sizeClasses[size],
              className
            )}
          >
            {fallback ? (
              <span className={cn(
                size === 'sm' && 'text-xs',
                size === 'md' && 'text-sm',
                size === 'lg' && 'text-base',
                size === 'xl' && 'text-lg',
              )}>
                {fallback}
              </span>
            ) : (
              <svg className={cn(
                'text-primary-300',
                size === 'sm' && 'w-4 h-4',
                size === 'md' && 'w-6 h-6',
                size === 'lg' && 'w-8 h-8',
                size === 'xl' && 'w-10 h-10',
              )} fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </div>
        )}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-white',
              statusColors[status],
              statusSizeClasses[size]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
