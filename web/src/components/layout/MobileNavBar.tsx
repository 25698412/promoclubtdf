'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiSearch, FiTag, FiHeart, FiUser } from 'react-icons/fi';
import { LogoImage } from '../ui/LogoImage';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const leftItems: NavItem[] = [
  { href: '/', label: 'Inicio', icon: FiHome },
  { href: '/promotions', label: 'Explorar', icon: FiSearch },
];

const rightItems: NavItem[] = [
  { href: '/coupons', label: 'Cupones', icon: FiTag },
  { href: '/profile', label: 'Perfil', icon: FiUser },
];

export const MobileNavBar = () => {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Blur background */}
      <div
        className="absolute inset-0 border-t border-white/30"
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          boxShadow: '0 -8px 32px rgba(27, 58, 92, 0.08), 0 -2px 8px rgba(27, 58, 92, 0.04)',
        }}
      />

      <div className="relative flex items-end justify-around px-2 pt-3 pb-3">
        {/* Left Items */}
        {leftItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1 min-w-[56px] group"
            >
              <div
                className={`flex items-center justify-center w-10 h-8 rounded-full transition-all duration-200 ${isActive ? 'bg-accent-100' : 'group-hover:bg-gray-100'
                  }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${isActive ? 'text-accent-500' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                />
              </div>
              <span
                className={`text-[10px] font-semibold tracking-tight transition-colors duration-200 ${isActive ? 'text-accent-500' : 'text-gray-400'
                  }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Center Logo Button */}
        <div className="flex flex-col items-center relative" style={{ marginTop: '-28px' }}>
          <Link
            href="/"
            className="group flex flex-col items-center"
            aria-label="Ir al inicio - Promo Club TDF"
          >
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'rgba(245, 130, 32, 0.3)',
                filter: 'blur(8px)',
                transform: 'scale(1.2)',
              }}
            />
            {/* Button */}
            <div
              className="relative w-16 h-16 rounded-full flex items-center justify-center border-[3px] border-[#F58220] bg-white overflow-hidden transition-all duration-300 group-hover:scale-105 group-active:scale-95"
              style={{
                boxShadow: '0 -4px 20px rgba(245, 130, 32, 0.2), 0 4px 16px rgba(245, 130, 32, 0.15), 0 0 0 6px rgba(245, 130, 32, 0.08)',
              }}
            >
              <LogoImage className="w-[85%] h-[85%] object-contain" fallbackBg="white" />
            </div>
            <span className="text-[10px] font-bold text-primary-500 mt-1.5 tracking-tight">
              Promo Club
            </span>
          </Link>
        </div>

        {/* Right Items */}
        {rightItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1 min-w-[56px] group"
            >
              <div
                className={`flex items-center justify-center w-10 h-8 rounded-full transition-all duration-200 ${isActive ? 'bg-accent-100' : 'group-hover:bg-gray-100'
                  }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${isActive ? 'text-accent-500' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                />
              </div>
              <span
                className={`text-[10px] font-semibold tracking-tight transition-colors duration-200 ${isActive ? 'text-accent-500' : 'text-gray-400'
                  }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavBar;
