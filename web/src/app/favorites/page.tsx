'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase/client';
import { MobileNavBar } from '@/components/layout/MobileNavBar';
import { LogoImage } from '@/components/ui/LogoImage';
import { FiArrowLeft, FiHeart, FiMapPin, FiTrash2, FiTag } from 'react-icons/fi';

interface FavoriteWithPromo {
  id: string;
  promotion_id: string;
  created_at: string;
  promotions?: Array<{
    id: string;
    title: string;
    discount_percentage: number | null;
    image_url: string | null;
    is_flash: boolean;
    businesses?: Array<{
      name: string;
      category: string | null;
      city: string | null;
    }>;
  }>;
}

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [favorites, setFavorites] = useState<FavoriteWithPromo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      loadFavorites();
    }
  }, [user, authLoading]);

  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('favorites')
      .select('id, promotion_id, created_at, promotions(id, title, discount_percentage, image_url, is_flash, businesses(name, category, city))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Supabase returns joined data as arrays, flatten to single objects
    const flattened = (data || []).map((item: any) => ({
      ...item,
      promotions: item.promotions?.[0] || null,
    }));
    setFavorites(flattened);
    setLoading(false);
  };

  const removeFavorite = async (favoriteId: string) => {
    await supabase.from('favorites').delete().eq('id', favoriteId);
    setFavorites(favorites.filter((f) => f.id !== favoriteId));
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                <LogoImage className="w-6 h-6 object-contain" />
              </div>
              <h1 className="font-bold text-gray-900">Mis Favoritos</h1>
            </div>
            <span className="ml-auto text-sm text-gray-400">{favorites.length} guardados</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-3">Cargando favoritos...</p>
          </div>
        ) : !user ? (
          <div className="text-center py-16">
            <FiHeart size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Iniciá sesión para ver tus favoritos</h2>
            <p className="text-gray-500 mb-6">Guardá las promociones que más te gusten</p>
            <Link href="/login" className="btn-accent">Iniciar Sesión</Link>
          </div>
        ) : favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((fav) => {
              const promo = fav.promotions as any;
              if (!promo) return null;
              return (
                <div
                  key={fav.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="relative w-32 sm:w-40 flex-shrink-0">
                      {promo.image_url ? (
                        <img
                          src={promo.image_url}
                          alt={promo.title}
                          className="w-full h-full object-cover min-h-[120px]"
                        />
                      ) : (
                        <div className="w-full h-full min-h-[120px] bg-accent-50 flex items-center justify-center">
                          <FiTag size={32} className="text-accent-300" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        {promo.discount_percentage && (
                          <span className="bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                            -{promo.discount_percentage}%
                          </span>
                        )}
                      </div>
                      {promo.is_flash && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-warning text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                            ⚡ Flash
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                          {promo.businesses?.[0]?.name || promo.businesses?.name || 'Negocio'}
                        </p>
                        <h3 className="font-semibold text-gray-900 mt-0.5 line-clamp-2">{promo.title}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          {promo.businesses?.[0]?.city && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <FiMapPin size={10} /> {promo.businesses[0].city}
                            </span>
                          )}
                          {promo.businesses?.[0]?.category && (
                            <span className="badge-primary text-xs">{promo.businesses[0].category}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Link
                          href={`/promotions#${promo.id}`}
                          className="text-xs font-semibold text-accent-500 hover:text-accent-600"
                        >
                          Ver promo →
                        </Link>
                        <button
                          onClick={() => removeFavorite(fav.id)}
                          className="p-1.5 text-gray-300 hover:text-error rounded-lg hover:bg-error-50 transition-colors"
                          title="Eliminar de favoritos"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiHeart size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No tenés favoritos</h2>
            <p className="text-gray-500 mb-6">Guardá promociones que te interesen para encontrarlas fácilmente</p>
            <Link href="/promotions" className="btn-accent">Explorar Promociones</Link>
          </div>
        )}
      </div>

      <MobileNavBar />
    </div>
  );
}
