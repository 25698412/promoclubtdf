'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/Header';
import { Card, Badge } from '@/components/ui';
import { PromotionCard, LoadingSkeleton } from '@/components/features';
import { MobileNavBar } from '@/components/layout/MobileNavBar';
import {
  FiArrowLeft, FiUser, FiMapPin, FiPhone, FiMail, FiLogOut, FiStar, FiTag,
  FiShoppingBag, FiEdit2, FiHeart, FiGift, FiZap, FiClock, FiTrendingUp,
} from 'react-icons/fi';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [flashOffers, setFlashOffers] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [recentCoupons, setRecentCoupons] = useState<any[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Load user session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      const { data: profileData } = await supabase
        .from('user_profiles').select('*').eq('id', session.user.id).single();
      setProfile(profileData);

      // Load user's recent coupons
      const { data: coupons } = await supabase
        .from('coupons')
        .select('*, promotions(title, discount_percentage), businesses(name)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false }).limit(3);
      setRecentCoupons(coupons || []);

      // Count favorites
      const { count } = await supabase
        .from('favorites').select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);
      setFavoritesCount(count || 0);
    } else {
      // Demo mode
      setUser({ email: 'demo@promoclubtdf.com' });
      setProfile({ first_name: 'Usuario', last_name: 'Demo', points: 350, level: 'bronze', phone: '+54 9 2901 123456', city: 'Ushuaia' });
    }

    // Load public data
    const [promosRes, flashRes, bannerRes] = await Promise.all([
      supabase.from('promotions').select('*, businesses(name, category, logo_url)')
        .eq('is_active', true).eq('moderation_status', 'approved')
        .order('created_at', { ascending: false }).limit(6),
      supabase.from('promotions').select('*, businesses(name, category)')
        .eq('is_active', true).eq('moderation_status', 'approved').eq('is_flash', true)
        .order('created_at', { ascending: false }).limit(4),
      supabase.from('banners').select('*').eq('is_active', true)
        .order('display_order', { ascending: true }).limit(5),
    ]);

    setPromotions(promosRes.data || []);
    setFlashOffers(flashRes.data || []);
    setBanners(bannerRes.data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const quickActions = [
    { icon: <FiTag size={24} />, title: 'Explorar Promos', description: 'Descubrí ofertas', href: '/promotions', color: 'from-primary-500 to-secondary-500' },
    { icon: <FiShoppingBag size={24} />, title: 'Mis Cupones', description: 'Cupones activos', href: '/coupons', color: 'from-accent-500 to-accent-600' },
    { icon: <FiHeart size={24} />, title: 'Favoritos', description: 'Guardados', href: '/favorites', color: 'from-error to-pink-500' },
    { icon: <FiGift size={24} />, title: 'Premios', description: 'Canjeá puntos', href: '/rewards', color: 'from-success to-emerald-500' },
    { icon: <FiMapPin size={24} />, title: 'Mapa', description: 'Cerca tuyo', href: '/map', color: 'from-blue-500 to-indigo-500' },
  ];

  const levelColors: Record<string, string> = {
    gold: 'from-yellow-400 to-amber-500',
    silver: 'from-gray-300 to-gray-400',
    bronze: 'from-orange-300 to-orange-400',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pb-0">
        <Header userName="Usuario" homeLink="/" />
        <div className="max-w-7xl mx-auto px-4 py-8"><LoadingSkeleton /></div>
      </div>
    );
  }

  const levelGrad = levelColors[profile?.level || 'bronze'];
  const levelName = profile?.level === 'gold' ? 'Oro' : profile?.level === 'silver' ? 'Plata' : 'Bronce';
  const levelEmoji = profile?.level === 'gold' ? '🥇' : profile?.level === 'silver' ? '🥈' : '🥉';

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Header userName={profile?.first_name || 'Usuario'} onLogout={handleLogout} homeLink="/" />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className={`h-24 bg-gradient-to-r ${levelGrad}`} />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-500">
                  {profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                {levelEmoji} Nivel {levelName}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{profile?.first_name} {profile?.last_name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>

            {/* Level Progress */}
            <div className="mt-4 bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 flex items-center gap-1"><FiStar size={10} /> {profile?.points || 0} puntos</span>
                <span className="text-xs text-gray-400">
                  {profile?.level === 'gold' ? '¡Nivel máximo!' :
                   profile?.level === 'silver' ? `${5000 - (profile?.points || 0)} pts para Oro` :
                   `${1000 - (profile?.points || 0)} pts para Plata`}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, profile?.level === 'gold' ? 100 : profile?.level === 'silver' ? ((profile?.points || 0) / 5000) * 100 : ((profile?.points || 0) / 1000) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <FiStar className="text-warning" size={20} />, value: profile?.points ?? 0, label: 'Puntos' },
            { icon: <FiTag className="text-accent-500" size={20} />, value: recentCoupons.length, label: 'Cupones' },
            { icon: <FiHeart className="text-error" size={20} />, value: favoritesCount, label: 'Favoritos' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="hover-lift cursor-pointer group text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{action.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Banners */}
        {banners.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-3" style={{ minWidth: 'min-content' }}>
              {banners.map((banner) => (
                <div key={banner.id} className="flex-shrink-0 w-72 relative rounded-2xl overflow-hidden shadow-sm">
                  <img src={banner.image_url} alt={banner.title || ''} className="w-full h-32 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  {banner.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-white font-semibold text-sm">{banner.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flash Offers */}
        {flashOffers.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><FiZap className="text-warning" /> Ofertas Flash</h2>
              <Link href="/promotions?flash=true" className="text-sm text-accent-500 font-medium">Ver todas →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {flashOffers.map((flash) => (
                <Link key={flash.id} href={`/promotions#${flash.id}`}>
                  <Card className="hover-lift cursor-pointer border-warning/30 h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-warning text-white text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1"><FiZap size={10} /> FLASH</span>
                      {flash.discount_percentage && <span className="text-accent-500 font-bold">-{flash.discount_percentage}%</span>}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{flash.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{flash.businesses?.name}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Promotions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Promociones Recientes</h2>
            <Link href="/promotions" className="text-sm text-accent-500 font-medium">Ver todas →</Link>
          </div>
          {promotions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {promotions.map((promo) => (
                <PromotionCard
                  key={promo.id} id={promo.id} title={promo.title}
                  businessName={promo.businesses?.name || 'Negocio'}
                  discount={promo.discount_percentage || 0}
                  image={promo.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'}
                  category={promo.businesses?.category || ''} distance=""
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <FiTag size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500 text-sm">No hay promociones disponibles aún</p>
            </Card>
          )}
        </div>

        {/* Recent Coupons */}
        {recentCoupons.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">Mis Cupones Recientes</h2>
              <Link href="/coupons" className="text-sm text-accent-500 font-medium">Ver todos →</Link>
            </div>
            <div className="space-y-3">
              {recentCoupons.map((coupon) => (
                <Card key={coupon.id} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    coupon.status === 'active' ? 'bg-success-50 text-success' :
                    coupon.status === 'redeemed' ? 'bg-primary-50 text-primary-500' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {coupon.status === 'active' ? <FiTag size={20} /> :
                     coupon.status === 'redeemed' ? <FiShoppingBag size={20} /> : <FiClock size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{coupon.promotions?.title || 'Cupón'}</p>
                    <p className="text-xs text-gray-500">{coupon.businesses?.name || 'Negocio'}</p>
                  </div>
                  <Badge variant={coupon.status === 'active' ? 'success' : coupon.status === 'redeemed' ? 'info' : 'warning'} size="sm">
                    {coupon.status === 'active' ? 'Activo' : coupon.status === 'redeemed' ? 'Canjeado' : 'Expirado'}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* User Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Información Personal</h3>
          <div className="space-y-3">
            {[
              { icon: <FiUser size={16} className="text-gray-400" />, label: 'Nombre', value: `${profile?.first_name || ''} ${profile?.last_name || ''}` },
              { icon: <FiMail size={16} className="text-gray-400" />, label: 'Email', value: user?.email },
              { icon: <FiPhone size={16} className="text-gray-400" />, label: 'Teléfono', value: profile?.phone || 'No cargado' },
              { icon: <FiMapPin size={16} className="text-gray-400" />, label: 'Ciudad', value: profile?.city || 'No cargada' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-gray-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-error text-error hover:bg-error-50 transition-colors font-semibold">
          <FiLogOut size={18} /> Cerrar Sesión
        </button>
      </div>

      <MobileNavBar />
    </div>
  );
}
