'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { MobileNavBar } from '@/components/layout/MobileNavBar';
import { LogoImage } from '@/components/ui/LogoImage';
import { PromotionCard } from '@/components/features';
import { SkeletonGrid } from '@/components/features/LoadingSkeleton';
import { FiSearch, FiFilter, FiArrowLeft, FiZap, FiTag } from 'react-icons/fi';

const categories = [
  { name: 'Todos', icon: '🌟' },
  { name: 'Gastronomía', icon: '🍔' },
  { name: 'Moda', icon: '👗' },
  { name: 'Tecnología', icon: '💻' },
  { name: 'Salud', icon: '💊' },
  { name: 'Deportes', icon: '⚽' },
  { name: 'Hogar', icon: '🏠' },
  { name: 'Servicios', icon: '🔧' },
  { name: 'Entretenimiento', icon: '🎬' },
];

export default function PromotionsPage() {
  const supabase = createClient();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showFlashOnly, setShowFlashOnly] = useState(false);

  useEffect(() => { loadPromotions(); }, []);

  const loadPromotions = async () => {
    let query = supabase
      .from('promotions')
      .select('*, businesses(name, category, city, logo_url)')
      .eq('is_active', true)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false });

    const { data } = await query;
    setPromotions(data || []);
    setLoading(false);
  };

  const filtered = promotions.filter((p) => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.businesses?.name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'Todos' || p.businesses?.category === selectedCategory;
    const matchFlash = !showFlashOnly || p.is_flash;
    return matchSearch && matchCategory && matchFlash;
  });

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                <LogoImage className="w-6 h-6 object-contain" />
              </div>
              <h1 className="font-bold text-gray-900">Promociones</h1>
            </div>
            <span className="ml-auto text-sm text-gray-400">{filtered.length} disponibles</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar promociones o comercios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-4 px-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.name
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
              style={selectedCategory === cat.name ? {
                boxShadow: '0 3px 10px rgba(27,58,92,0.25), 0 1px 3px rgba(27,58,92,0.15)',
              } : {
                boxShadow: '0 1px 3px rgba(27,58,92,0.06)',
              }}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Flash Filter — tratamiento semántico propio */}
        <button
          onClick={() => setShowFlashOnly(!showFlashOnly)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold mb-4 transition-all duration-200 ${
            showFlashOnly
              ? 'text-amber-800'
              : 'text-gray-600 border border-gray-200 bg-white hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700'
          }`}
          style={showFlashOnly ? {
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            border: '1px solid #F59E0B',
            boxShadow: '0 2px 8px rgba(245,158,11,0.25)',
          } : {
            boxShadow: '0 1px 3px rgba(27,58,92,0.06)',
          }}
        >
          <FiZap size={13} className={showFlashOnly ? 'text-amber-600' : ''} />
          Solo Flash
        </button>

        {/* Promotions Grid */}
        {loading ? (
          <SkeletonGrid count={6} variant="card" cols={3} />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((promo) => (
              <PromotionCard
                key={promo.id}
                id={promo.id}
                title={promo.title}
                businessName={promo.businesses?.name || 'Negocio'}
                discount={promo.discount_percentage || 0}
                image={promo.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'}
                category={promo.businesses?.category || ''}
                distance=""
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
              style={{
                background: 'linear-gradient(135deg, #E8EFF5 0%, #F0F4F8 100%)',
                boxShadow: '0 4px 16px rgba(27,58,92,0.08)',
              }}
            >
              <FiTag size={32} className="text-primary-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              No hay resultados
            </h3>
            <p className="text-sm text-gray-400 max-w-xs mb-6">
              {search
                ? `No encontramos nada para "${search}". Probá con otro término.`
                : 'No hay promociones en esta categoría por ahora. ¡Volvé pronto!'}
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all"
                  style={{ boxShadow: '0 1px 3px rgba(27,58,92,0.06)' }}
                >
                  Limpiar búsqueda
                </button>
              )}
              <button
                onClick={() => { setSelectedCategory('Todos'); setShowFlashOnly(false); setSearch(''); }}
                className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all"
                style={{
                  background: 'linear-gradient(135deg, #1B3A5C, #2E6B8A)',
                  boxShadow: '0 4px 12px rgba(27,58,92,0.25)',
                }}
              >
                Ver todas las promociones
              </button>
            </div>
          </div>
        )}
      </div>

      <MobileNavBar />
    </div>
  );
}
