'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '../ui/Button';
import {
  FiBell,
  FiSearch,
  FiUser,
  FiMenu,
  FiLogOut,
  FiMoon,
  FiSun,
} from 'react-icons/fi';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
  variant?: 'admin' | 'user';
  homeLink?: string;
}

export const Header = ({
  userName,
  userAvatar,
  onLogout,
  onToggleSidebar,
  variant = 'user',
  homeLink,
}: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 w-full backdrop-blur-md border-b transition-colors duration-300',
        variant === 'admin'
          ? 'bg-white/90 border-gray-200'
          : 'bg-white/90 border-gray-200'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FiMenu size={20} />
            </button>
          )}

          {/* Home link */}
          {homeLink && (
            <Link href={homeLink} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Volver al inicio">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </Link>
          )}

          {/* Logo visible solo en móvil cuando no hay sidebar */}
          {!onToggleSidebar && !homeLink && (
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm overflow-hidden border border-gray-100">
                <img
                  src="/logo.png"
                  alt="Promo Club TDF"
                  className="w-6 h-6 object-contain"
                  onError={(e) => { e.currentTarget.style.display='none'; }}
                />
              </div>
              <span className="text-sm font-bold text-primary-500">Promo Club TDF</span>
            </div>
          )}

          {/* Search */}
          <div className="hidden md:flex items-center relative">
            <FiSearch className="absolute left-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-500 rounded-full border-2 border-white" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative ml-2">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  userName?.charAt(0).toUpperCase() || <FiUser size={16} />
                )}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {userName || 'Usuario'}
              </span>
            </button>

            {/* Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-scale-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{userName || 'Usuario'}</p>
                  <p className="text-xs text-gray-500">Mi cuenta</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FiUser size={16} />
                    Mi Perfil
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FiBell size={16} />
                    Configuración
                  </Link>
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-error hover:bg-error-50 transition-colors"
                    >
                      <FiLogOut size={16} />
                      Cerrar Sesión
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
