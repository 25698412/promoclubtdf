'use client';

import React from 'react';
import { cn } from '../ui/Button';
import { Card } from '../ui/Card';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'info';
  className?: string;
  style?: React.CSSProperties;
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  className,
  style,
}: StatCardProps) => {
  const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
    primary: { bg: 'bg-primary-50', text: 'text-primary-500', icon: 'bg-primary-500' },
    accent: { bg: 'bg-accent-50', text: 'text-accent-500', icon: 'bg-accent-500' },
    success: { bg: 'bg-success-50', text: 'text-success-500', icon: 'bg-success-500' },
    warning: { bg: 'bg-warning-50', text: 'text-warning-500', icon: 'bg-warning-500' },
    info: { bg: 'bg-blue-50', text: 'text-blue-500', icon: 'bg-blue-500' },
  };

  return (
    <Card className={cn('hover-lift', className)} style={style}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className={cn('text-3xl font-bold', colorClasses[color].text)}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <FiTrendingUp className="text-success w-4 h-4" />
              ) : (
                <FiTrendingDown className="text-error w-4 h-4" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-success' : 'text-error'
                )}
              >
                {trend.value}%
              </span>
              <span className="text-xs text-gray-400">vs mes anterior</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center text-white',
            colorClasses[color].icon
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
