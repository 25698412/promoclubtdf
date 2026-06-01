'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiEye, FiMousePointer, FiShoppingBag, FiTrendingUp, FiUsers, FiTag, FiMapPin } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminAnalyticsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    views: 0, clicks: 0, redemptions: 0, totalUsers: 0, totalPromotions: 0, totalBusinesses: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [cityData, setCityData] = useState<any[]>([]);
  const [topPromos, setTopPromos] = useState<any[]>([]);

  useEffect(() => { loadMetrics(); }, []);

  const loadMetrics = async () => {
    const [eventsRes, usersRes, promosRes, bizRes, cityBizRes, topPromosRes] = await Promise.all([
      supabase.from('analytics_events').select('event_type, created_at').limit(5000),
      supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('promotions').select('id', { count: 'exact', head: true }),
      supabase.from('businesses').select('id', { count: 'exact', head: true }),
      supabase.from('businesses').select('city').eq('is_active', true),
      supabase.from('promotions').select('id, title, is_flash').eq('moderation_status', 'approved'),
    ]);

    const events: { event_type?: string; created_at?: string; entity_id?: string }[] = eventsRes.data || [];
    setMetrics({
      views: events.filter((e) => e.event_type?.includes('view')).length,
      clicks: events.filter((e) => e.event_type?.includes('click')).length,
      redemptions: events.filter((e) => e.event_type?.includes('redeem')).length,
      totalUsers: usersRes.count || 0,
      totalPromotions: promosRes.count || 0,
      totalBusinesses: bizRes.count || 0,
    });

    // Generate chart data from events (group by day)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const chartPoints = last7Days.map((day) => {
      const dayEvents = events.filter((e) => e.created_at?.startsWith(day));
      return {
        date: new Date(day).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' }),
        vistas: dayEvents.filter((e) => e.event_type?.includes('view')).length,
        clics: dayEvents.filter((e) => e.event_type?.includes('click')).length,
        canjes: dayEvents.filter((e) => e.event_type?.includes('redeem')).length,
      };
    });
    setChartData(chartPoints);

    // City breakdown
    const cities = (cityBizRes.data || []).reduce((acc: Record<string, number>, b: any) => {
      acc[b.city] = (acc[b.city] || 0) + 1;
      return acc;
    }, {});
    setCityData(Object.entries(cities).map(([city, count]) => ({ city, count })));

    // Top promotions
    const promoCounts = events.reduce((acc: Record<string, number>, e: any) => {
      if (e.entity_id) acc[e.entity_id] = (acc[e.entity_id] || 0) + 1;
      return acc;
    }, {});
    const topIds = Object.entries(promoCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    setTopPromos(topIds.map(([id, count]) => {
      const promo = (topPromosRes.data || []).find((p: { id: string; title?: string; is_flash?: boolean }) => p.id === id);
      return { name: promo?.title || 'Promoción', views: count, is_flash: promo?.is_flash };
    }));

    setLoading(false);
  };

  const cards = [
    { label: 'Usuarios Totales', value: metrics.totalUsers, icon: <FiUsers size={22} />, color: 'bg-blue-50 text-blue-500' },
    { label: 'Promociones', value: metrics.totalPromotions, icon: <FiTag size={22} />, color: 'bg-accent-50 text-accent-500' },
    { label: 'Comercios', value: metrics.totalBusinesses, icon: <FiShoppingBag size={22} />, color: 'bg-success-50 text-success' },
    { label: 'Visualizaciones', value: metrics.views, icon: <FiEye size={22} />, color: 'bg-purple-50 text-purple-500' },
    { label: 'Clics', value: metrics.clicks, icon: <FiMousePointer size={22} />, color: 'bg-pink-50 text-pink-500' },
    { label: 'Canjes', value: metrics.redemptions, icon: <FiShoppingBag size={22} />, color: 'bg-warning-50 text-warning' },
  ];

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Métricas y Analytics</h1>
          <p className="text-gray-500 mt-1">Resumen del rendimiento de la plataforma</p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {cards.map((card) => (
                <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover-lift">
                  <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}>{card.icon}</div>
                  <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Activity Chart */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FiTrendingUp className="text-accent-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Actividad (Últimos 7 días)</h2>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8EFF5" />
                    <XAxis dataKey="date" stroke="#759FC3" fontSize={12} />
                    <YAxis stroke="#759FC3" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8EFF5', borderRadius: '12px', boxShadow: '0 4px 6px rgba(27, 58, 92, 0.1)' }}
                    />
                    <Area type="monotone" dataKey="vistas" stroke="#1B3A5C" fill="#1B3A5C" fillOpacity={0.1} strokeWidth={2} />
                    <Area type="monotone" dataKey="clics" stroke="#F58220" fill="#F58220" fillOpacity={0.1} strokeWidth={2} />
                    <Area type="monotone" dataKey="canjes" stroke="#22C55E" fill="#22C55E" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-4 justify-center">
                <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-primary-500" /> Vistas</span>
                <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-accent-500" /> Clics</span>
                <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-success" /> Canjes</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* City Breakdown */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiMapPin className="text-primary-500" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">Actividad por Ciudad</h2>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8EFF5" />
                      <XAxis dataKey="city" stroke="#759FC3" fontSize={12} />
                      <YAxis stroke="#759FC3" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8EFF5', borderRadius: '12px' }} />
                      <Bar dataKey="count" fill="#F58220" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Promotions */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiTrendingUp className="text-accent-500" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">Promociones Más Vistas</h2>
                </div>
                {topPromos.length > 0 ? (
                  <div className="space-y-3">
                    {topPromos.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500 font-bold text-sm">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                          {p.is_flash && <span className="text-xs text-warning font-semibold">⚡ Flash</span>}
                        </div>
                        <span className="text-sm font-semibold text-accent-500">{p.views}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-8">Sin datos de actividad aún</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
