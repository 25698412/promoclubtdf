'use client';

import React from 'react';
import { cn } from '../ui/Button';
import { Card, Badge } from '../ui';
import { FiHeart, FiMapPin, FiClock, FiShare2 } from 'react-icons/fi';

interface PromotionCardProps {
  id: string;
  title: string;
  businessName: string;
  businessLogo?: string;
  image?: string;
  discount: number;
  description?: string;
  distance?: string;
  expiresAt?: string;
  isFavorite?: boolean;
  isFlash?: boolean;
  category?: string;
  onToggleFavorite?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const PromotionCard = ({
  id,
  title,
  businessName,
  businessLogo,
  image,
  discount,
  description,
  distance,
  expiresAt,
  isFavorite = false,
  isFlash = false,
  category,
  onToggleFavorite,
  className,
  style,
}: PromotionCardProps) => {
  return (
    <Card
      variant="interactive"
      padding="none"
      className={cn('overflow-hidden group', className)}
      style={style}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <span className="text-4xl">🎫</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Discount Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="accent"
            size="lg"
            className="shadow-lg animate-bounce-soft"
          >
            -{discount}%
          </Badge>
        </div>

        {/* Flash Offer Badge */}
        {isFlash && (
          <div className="absolute top-3 right-16">
            <Badge variant="error" size="sm" dot>
              Flash
            </Badge>
          </div>
        )}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
          >
            <FiHeart
              className={cn(
                'w-4 h-4 transition-colors',
                isFavorite ? 'fill-error text-error' : 'text-gray-500'
              )}
            />
          </button>
        )}

        {/* Category Badge */}
        {category && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="primary" size="sm">
              {category}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Business Info */}
        <div className="flex items-center gap-2 mb-2">
          {businessLogo ? (
            <img
              src={businessLogo}
              alt={businessName}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xs text-primary-500 font-semibold">
                {businessName.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-500 truncate">{businessName}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            {distance && (
              <div className="flex items-center gap-1">
                <FiMapPin size={12} />
                <span>{distance}</span>
              </div>
            )}
            {expiresAt && (
              <div className="flex items-center gap-1">
                <FiClock size={12} />
                <span>{expiresAt}</span>
              </div>
            )}
          </div>
          <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <FiShare2 size={14} />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PromotionCard;
