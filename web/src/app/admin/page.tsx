'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/features';
import { Card, Badge, Button } from '@/components/ui';
import {
  FiShoppingBag, FiTag, FiUsers, FiCheckCircle, FiPlus,
  FiTrendingUp, FiClock, FiAlertCircle,
} from 'react-icons/fi';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalBusinesses: 0, totalPromotions: 0, totalUsers: 0, totalRedemptions: 0,
  });

  useEffect(() => {
    const loadDemoData = async () => {
      const supabase = createClient();
      try {
        if (supabase) {
          const [businessesRes, promotionsRes, usersRes] = await Promise.all([
            supabase.from('businesses').select('id', { count: 'exact', head: true }),
            supabase.from('promotions').select('id', { count: 'exact', head: true }),
            supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
          ]);
          setStats({
            totalBusinesses: businessesRes.count || 12,
            totalPromotions: promotionsRes.count || 48,
            totalUsers: usersRes.count || 1250,
            totalRedemptions: 3420,
          });
        } else {
          setStats({ totalBusinesses: 12, totalPromotions: 48, totalUsers: 1250, totalRedemptions: 3420 });
        }
      } catch {
        setStats({ totalBusinesses: 12, totalPromotions: 48, totalUsers: 1250, totalRedemptions: 3420 });
      }
      setLoading(false);
    };
    loadDemoData();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push('/');
  };

  const recentActivity = [
    { id: 1, type: 'business', action: 'Nuevo local registrado', name: 'Burger House', time: 'Hace 5 min', status: 'success' },
    { id: 2, type: 'promotion', action: 'Promoción creada', name: '50% OFF en Hamburguesas', time: 'Hace 15 min', status: 'success' },
    { id: 3, type: 'user', action: 'Nuevo usuario registrado', name: 'María García', time: 'Hace 30 min', status: 'info' },
    { id: 4, type: 'redemption', action: 'Cupón canjeado', name: 'Sport Center - 30% OFF', time: 'Hace 1 hora', status: 'warning' },
    { id: 5, type: 'business', action: 'Local pendiente de aprobación', name: 'Tech Store', time: 'Hace 2 horas', status: 'pending' },
  ];

  const topPromotions = [
    { id: 1, name: '50% OFF en Hamburguesas', business: 'Burger House', redemptions: 156 },
    { id: 2, name: '30% OFF en Zapatillas', business: 'Sport Center', redemptions: 98 },
    { id: 3, name: '40% OFF en Celulares', business: 'Tech Store', redemptions: 87 },
    { id: 4, name: '20% OFF en Libros', business: 'Librería Central', redemptions: 65 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar onLogout={handleLogout} userName={profile?.first_name || 'Admin'} userRole="Administrador" />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header userName={profile?.first_name || 'Admin'} onLogout={handleLogout} variant="admin" homeLink="/" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 animate-fade-in-up">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Resumen general de la plataforma</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Locales Activos" value={stats.totalBusinesses} icon={<FiShoppingBag size={24} />} trend={{ value: 12, isPositive: true }} color="primary" className="animate-fade-in-up" />
              <StatCard title="Promociones" value={stats.totalPromotions} icon={<FiTag size={24} />} trend={{ value: 8, isPositive: true }} color="accent" className="animate-fade-in-up" style={{ animationDelay: '0.1s' }} />
              <StatCard title="Usuarios" value={stats.totalUsers} icon={<FiUsers size={24} />} trend={{ value: 24, isPositive: true }} color="success" className="animate-fade-in-up" style={{ animationDelay: '0.2s' }} />
              <StatCard title="Canjes Totales" value={stats.totalRedemptions} icon={<FiCheckCircle size={24} />} trend={{ value: 15, isPositive: true }} color="warning" className="animate-fade-in-up" style={{ animationDelay: '0.3s' }} />
            </div>

            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { href: '/admin/businesses/new', label: 'Nuevo Local', sub: 'Registrar comercio', color: 'primary' },
                  { href: '/admin/promotions/new', label: 'Nueva Promoción', sub: 'Crear oferta', color: 'accent' },
                  { href: '/admin/banners/new', label: 'Nuevo Banner', sub: 'Crear banner', color: 'success' },
                ].map((a) => (
                  <Link key={a.href} href={a.href}>
                    <Card className="hover-lift cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-${a.color}-50 rounded-lg flex items-center justify-center text-${a.color}-500 group-hover:bg-${a.color}-500 group-hover:text-white transition-colors`}>
                          <FiPlus size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{a.label}</p>
                          <p className="text-sm text-gray-500">{a.sub}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <Card padding="none">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
                    <Button variant="ghost" size="sm">Ver todo</Button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.status === 'success' ? 'bg-success-50 text-success' :
                          activity.status === 'warning' ? 'bg-warning-50 text-warning' :
                          activity.status === 'pending' ? 'bg-error-50 text-error' : 'bg-blue-50 text-blue-500'
                        }`}>
                          {activity.type === 'business' && <FiShoppingBag size={16} />}
                          {activity.type === 'promotion' && <FiTag size={16} />}
                          {activity.type === 'user' && <FiUsers size={16} />}
                          {activity.type === 'redemption' && <FiCheckCircle size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{activity.name}</p>
                          <p className="text-xs text-gray-500">{activity.action}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <FiClock size={10} /><span>{activity.time}</span>
                          </div>
                          <Badge variant={activity.status === 'success' ? 'success' : activity.status === 'warning' ? 'warning' : activity.status === 'pending' ? 'error' : 'info'} size="sm" className="mt-1">
                            {activity.status === 'success' ? 'Completado' : activity.status === 'warning' ? 'Canjeado' : activity.status === 'pending' ? 'Pendiente' : 'Nuevo'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <Card padding="none">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Top Promociones</h2>
                    <FiTrendingUp className="text-accent-500" />
                  </div>
                  <div className="divide-y divide-gray-100">
                    {topPromotions.map((promo, index) => (
                      <div key={promo.id} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500 font-bold text-sm flex-shrink-0">{index + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{promo.name}</p>
                          <p className="text-xs text-gray-500">{promo.business}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-accent-500">{promo.redemptions}</p>
                          <p className="text-xs text-gray-400">canjes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <Link href="/admin/promotions" className="text-sm text-accent-500 hover:text-accent-600 font-medium">Ver todas las promociones →</Link>
                  </div>
                </Card>
              </div>
            </div>

            <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <Card className="border-l-4 border-l-warning bg-warning-50/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center text-warning flex-shrink-0">
                    <FiAlertCircle size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Locales Pendientes de Aprobación</h3>
                    <p className="text-sm text-gray-600 mb-4">Hay 3 locales esperando revisión y aprobación</p>
                    <div className="flex gap-3">
                      <Button variant="accent" size="sm">Revisar ahora</Button>
                      <Button variant="outline" size="sm">Ver más tarde</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
