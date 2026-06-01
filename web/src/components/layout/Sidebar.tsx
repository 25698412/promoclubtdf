'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../ui/Button';
import { LogoImage } from '../ui/LogoImage';
import {
  FiHome,
  FiShoppingBag,
  FiTag,
  FiImage,
  FiUsers,
  FiGift,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiCheckCircle,
  FiMapPin,
} from 'react-icons/fi';

interface MenuItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { href: '/admin', label: 'Dashboard', icon: <FiHome /> },
  { href: '/admin/businesses', label: 'Locales', icon: <FiShoppingBag /> },
  { href: '/admin/promotions', label: 'Promociones', icon: <FiTag /> },
  { href: '/admin/banners', label: 'Banners', icon: <FiImage /> },
  { href: '/admin/users', label: 'Usuarios', icon: <FiUsers /> },
  { href: '/admin/verifications', label: 'Aprobación', icon: <FiCheckCircle /> },
  { href: '/admin/map', label: 'Mapa', icon: <FiMapPin /> },
  { href: '/admin/rewards', label: 'Premios', icon: <FiGift /> },
  { href: '/admin/analytics', label: 'Métricas', icon: <FiBarChart2 /> },
  { href: '/admin/settings', label: 'Configuración', icon: <FiSettings /> },
];

interface SidebarProps {
  onLogout: () => void;
  userName?: string;
  userRole?: string;
}

export const Sidebar = ({ onLogout, userName, userRole }: SidebarProps) => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary-500 text-white shadow-lg"
      >
        {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-primary text-white flex flex-col',
          'transform transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0 group-hover:shadow-glow transition-all duration-300">
              <LogoImage className="w-10 h-10 object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-sm leading-tight">Promo Club TDF</h1>
              <p className="text-xs text-white/50 mt-0.5">Panel Admin</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        {(userName || userRole) && (
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {userName?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName || 'Admin'}</p>
                <p className="text-xs text-gray-300">{userRole || 'Administrador'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200',
                  'hover:bg-white/10 hover:translate-x-1',
                  isActive
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-gray-300'
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
