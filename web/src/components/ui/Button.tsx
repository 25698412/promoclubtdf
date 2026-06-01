'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'outline-accent' | 'ghost' | 'ghost-accent' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses: Record<ButtonVariant, string> = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5 focus:ring-primary-500 active:bg-primary-700',
      secondary: 'bg-secondary-500 text-white hover:bg-primary-500 hover:shadow-md hover:-translate-y-0.5 focus:ring-secondary-500',
      accent: 'bg-accent-500 text-white hover:bg-accent-600 hover:shadow-glow hover:-translate-y-0.5 focus:ring-accent-500 active:bg-accent-600',
      outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white hover:shadow-md focus:ring-primary-500',
      'outline-accent': 'bg-transparent border-2 border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white hover:shadow-glow focus:ring-accent-500',
      ghost: 'bg-transparent text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
      'ghost-accent': 'bg-transparent text-accent-500 hover:bg-accent-50 focus:ring-accent-500',
      danger: 'bg-error text-white hover:bg-error-700 hover:shadow-lg focus:ring-error',
      success: 'bg-success text-white hover:bg-success-700 hover:shadow-lg focus:ring-success',
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs min-h-[32px]',
      md: 'px-5 py-2.5 text-sm min-h-[44px]',
      lg: 'px-7 py-3.5 text-base min-h-[52px]',
      xl: 'px-8 py-4 text-lg min-h-[56px]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'active:scale-[0.98]',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          isLoading && 'pointer-events-none',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Cargando...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
