'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { LogoImage } from '@/components/ui/LogoImage';
import { FiCreditCard } from 'react-icons/fi';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  FiHome, FiTag, FiBarChart2, FiLogOut, FiPlus,
  FiUsers, FiCheckCircle, FiMenu, FiX,
  FiEdit2, FiEye, FiCamera, FiZap, FiClock,
} from 'react-icons/fi';

export default function BusinessPanelPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [business, setBusiness] = useState<any>(null);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [stats, setStats] = useState({ views: 0, redemptions: 0, newCustomers: 0 });

  useEffect(() => {
    loadData();
  }, [user, authLoading]);

  const loadData = async () => {
    const supabase = createClient();
    if (!supabase || !user) {
      // Demo mode: show sample data
      setBusiness({
        id: 'demo-business',
        name: 'Burger House Demo',
        category: 'Gastronomía',
        address: 'Av. San Martín 456',
        city: 'Ushuaia',
        phone: '+54 2901 555-1234',
        is_active: true,
        is_founder: true,
      });
      setPromotions([
        { id: 'p1', title: '50% OFF en Hamburguesas', discount_percentage: 50, is_active: true, is_flash: false, moderation_status: 'approved', created_at: new Date().toISOString() },
        { id: 'p2', title: '⚡ Flash: 2x1 en Bebidas', discount_percentage: null, is_active: true, is_flash: true, flash_duration_minutes: 60, moderation_status: 'approved', created_at: new Date().toISOString() },
        { id: 'p3', title: '30% OFF en Postres', discount_percentage: 30, is_active: true, is_flash: false, moderation_status: 'pending', created_at: new Date().toISOString() },
      ]);
      setStats({ views: 1250, redemptions: 342, newCustomers: 89 });
      setLoading(false);
      return;
    }

    const { data: biz } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', user?.id)
      .single();

    if (biz) {
      setBusiness(biz);

      const { data: promos } = await supabase
        .from('promotions')
        .select('*')
        .eq('business_id', biz.id)
        .order('created_at', { ascending: false });

      setPromotions(promos || []);

      const [viewsRes, redemptionsRes, customersRes] = await Promise.all([
        supabase.from('analytics_events').select('id', { count: 'exact', head: true })
          .eq('entity_type', 'business').eq('entity_id', biz.id).like('event_type', 'view%'),
        supabase.from('coupons').select('id', { count: 'exact', head: true })
          .eq('business_id', biz.id).eq('status', 'redeemed'),
        supabase.from('coupons').select('user_id', { count: 'exact', head: true })
          .eq('business_id', biz.id).eq('status', 'redeemed'),
      ]);

      setStats({
        views: viewsRes.count || 0,
        redemptions: redemptionsRes.count || 0,
        newCustomers: customersRes.count || 0,
      });
    } else {
      // No business found for this user, show demo data
      setBusiness({
        id: 'demo-business',
        name: 'Burger House Demo',
        category: 'Gastronomía',
        address: 'Av. San Martín 456',
        city: 'Ushuaia',
        phone: '+54 2901 555-1234',
        is_active: true,
        is_founder: true,
      });
      setPromotions([
        { id: 'p1', title: '50% OFF en Hamburguesas', discount_percentage: 50, is_active: true, is_flash: false, moderation_status: 'approved', created_at: new Date().toISOString() },
        { id: 'p2', title: '⚡ Flash: 2x1 en Bebidas', discount_percentage: null, is_active: true, is_flash: true, flash_duration_minutes: 60, moderation_status: 'approved', created_at: new Date().toISOString() },
        { id: 'p3', title: '30% OFF en Postres', discount_percentage: 30, is_active: true, is_flash: false, moderation_status: 'pending', created_at: new Date().toISOString() },
      ]);
      setStats({ views: 1250, redemptions: 342, newCustomers: 89 });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { icon: <FiEye size={20} />, label: 'Visitas totales', value: stats.views, color: 'text-primary-500', bg: 'bg-primary-50' },
    { icon: <FiCheckCircle size={20} />, label: 'Cupones canjeados', value: stats.redemptions, color: 'text-accent-500', bg: 'bg-accent-50' },
    { icon: <FiUsers size={20} />, label: 'Clientes únicos', value: stats.newCustomers, color: 'text-success', bg: 'bg-success-50' },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary-500 text-white shadow-lg">
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-primary-500 to-primary-700 text-white flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="px-5 py-4 border-b border-white/10">
            <Link href="/business/panel" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <LogoImage className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h1 className="font-bold text-sm leading-tight">Promo Club TDF</h1>
                <p className="text-xs text-white/50 mt-0.5">Panel Comercio</p>
              </div>
            </Link>
          </div>

          {business && (
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center font-bold text-sm">
                  {business.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{business.name}</p>
                  <p className="text-xs text-white/50">{business.category}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 px-3 py-4 space-y-1">
            {[
              { icon: <FiHome size={18} />, label: 'Dashboard', href: '/business/panel' },
              { icon: <FiTag size={18} />, label: 'Mis Promociones', href: '/business/panel?tab=promos' },
              { icon: <FiZap size={18} />, label: 'Promociones Flash', href: '/business/panel?tab=flash', highlight: true },
              { icon: <FiCamera size={18} />, label: 'Escanear QR', href: '/business/scanner' },
              { icon: <FiCreditCard size={18} />, label: 'Membresía', href: '/business/membership' },
              { icon: <FiBarChart2 size={18} />, label: 'Estadísticas', href: '/business/panel?tab=stats' },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  (item as any).highlight
                    ? 'text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10 font-medium'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}>
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-white/10">
            <button onClick={signOut} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors w-full">
              <FiLogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Panel de Comercio</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{business?.name || ''}</span>
              <Link href="/" title="Ir al inicio" className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-accent-50 hover:text-accent-500 text-gray-500 transition-colors">
                <FiHome size={18} />
              </Link>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {statCards.map((card) => (
                  <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center ${card.color} mb-3`}>{card.icon}</div>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                  </div>
                ))}
              </div>

              {/* Flash Promotions Quick Action */}
              <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <FiZap size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">⚡ Promociones Flash</h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        Creá ofertas por tiempo limitado para generar urgencia y atraer más clientes.
                      </p>
                      {promotions.filter(p => p.is_flash && p.is_active).length > 0 && (
                        <p className="text-xs text-yellow-700 mt-1 font-medium">
                          <FiClock size={10} className="inline -mt-0.5" /> {promotions.filter(p => p.is_flash && p.is_active).length} flash activa(s)
                        </p>
                      )}
                    </div>
                  </div>
                  <Link
                    href="/business/promotions/new"
                    className="px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all text-sm flex items-center gap-2 shadow-md whitespace-nowrap"
                  >
                    <FiZap size={14} /> Crear Flash
                  </Link>
                </div>
              </div>

              {/* Flash Promotions Active */}
              {promotions.filter(p => p.is_flash).length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <FiZap size={18} className="text-yellow-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Promociones Flash</h2>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                      {promotions.filter(p => p.is_flash).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {promotions.filter(p => p.is_flash).map((promo) => (
                      <div key={promo.id} className="bg-white rounded-xl border border-yellow-200 shadow-sm p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                            <FiZap size={20} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{promo.title}</h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`badge ${promo.is_active ? 'badge-success' : 'badge-error'}`}>
                                {promo.is_active ? 'Activa' : 'Inactiva'}
                              </span>
                              <span className={`badge ${
                                promo.moderation_status === 'approved' ? 'badge-success' :
                                promo.moderation_status === 'rejected' ? 'badge-error' : 'badge-warning'
                              }`}>
                                {promo.moderation_status === 'approved' ? 'Aprobada' :
                                 promo.moderation_status === 'rejected' ? 'Rechazada' : '⏳ Pendiente'}
                              </span>
                              {promo.flash_duration_minutes && (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <FiClock size={10} /> {promo.flash_duration_minutes} min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link href={`/business/promotions/new`} className="p-2 text-accent-500 hover:bg-accent-50 rounded-lg transition-colors">
                          <FiEdit2 size={16} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Promotions */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Todas las Promociones</h2>
                  <Link href="/business/promotions/new" className="btn-accent text-sm flex items-center gap-1">
                    <FiPlus size={14} /> Nueva
                  </Link>
                </div>
                {promotions.length > 0 ? (
                  <div className="space-y-3">
                    {promotions.map((promo) => (
                      <div key={promo.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                            promo.is_flash
                              ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                              : 'bg-accent-50 text-accent-500'
                          }`}>
                            {promo.is_flash ? <FiZap size={18} /> : (promo.discount_percentage ? `-${promo.discount_percentage}%` : '🎯')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{promo.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`badge ${promo.is_active ? 'badge-success' : 'badge-error'}`}>
                                {promo.is_active ? 'Activa' : 'Inactiva'}
                              </span>
                              {promo.is_flash && <span className="badge badge-warning">⚡ Flash</span>}
                              <span className={`text-xs ${
                                promo.moderation_status === 'approved' ? 'text-green-600' :
                                promo.moderation_status === 'rejected' ? 'text-red-500' : 'text-yellow-600'
                              }`}>
                                {promo.moderation_status === 'approved' ? '✓ Aprobada' :
                                 promo.moderation_status === 'rejected' ? '✗ Rechazada' : '⏳ Pendiente'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/business/promotions/new`} className="p-2 text-accent-500 hover:bg-accent-50 rounded-lg transition-colors">
                          <FiEdit2 size={16} />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm text-center py-12">
                    <FiTag size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No tenés promociones creadas</p>
                    <Link href="/business/promotions/new" className="btn-accent text-sm mt-4 inline-flex">Crear primera promoción</Link>
                  </div>
                )}
              </div>

              {business && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Local</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">Nombre:</span> <span className="font-medium">{business.name}</span></div>
                    <div><span className="text-gray-500">Categoría:</span> <span className="font-medium">{business.category}</span></div>
                    <div><span className="text-gray-500">Dirección:</span> <span className="font-medium">{business.address}</span></div>
                    <div><span className="text-gray-500">Ciudad:</span> <span className="font-medium">{business.city}</span></div>
                    <div><span className="text-gray-500">Teléfono:</span> <span className="font-medium">{business.phone || '—'}</span></div>
                    <div><span className="text-gray-500">Estado:</span> <span className={`badge ${business.is_active ? 'badge-success' : 'badge-error'}`}>{business.is_active ? 'Activo' : 'Inactivo'}</span></div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
