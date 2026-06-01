'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { MobileNavBar } from '@/components/layout/MobileNavBar';
import { LogoImage } from '@/components/ui/LogoImage';
import { FiArrowLeft, FiMapPin, FiTag, FiSearch } from 'react-icons/fi';

const CATEGORIES = ['Todos', 'Gastronomía', 'Moda', 'Tecnología', 'Salud', 'Deportes', 'Hogar', 'Servicios', 'Entretenimiento'];

export default function BusinessesPage() {
  const supabase = createClient();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => { loadBusinesses(); }, []);

  const loadBusinesses = async () => {
    const { data } = await supabase
      .from('businesses')
      .select('*, promotions(id, is_active, moderation_status)')
      .eq('is_active', true)
      .order('name');
    setBusinesses(data || []);
    setLoading(false);
  };

  const filtered = businesses.filter((b) => {
    const matchSearch = !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase()) ||
      b.city?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'Todos' || b.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                <LogoImage className="w-6 h-6 object-contain" />
              </div>
              <h1 className="font-bold text-gray-900">Comercios</h1>
            </div>
            <span className="ml-auto text-sm text-gray-400">{filtered.length} locales</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar comercios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 -mx-4 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Businesses Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((biz) => {
              const activePromos = (biz.promotions || []).filter((p: any) => p.is_active && p.moderation_status === 'approved');
              return (
                <Link key={biz.id} href={`/businesses/${biz.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {biz.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 truncate group-hover:text-accent-500 transition-colors">{biz.name}</h3>
                            {biz.is_founder && <span title="Fundador">📍</span>}
                          </div>
                          <p className="text-sm text-gray-500">{biz.category} • {biz.city}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                            <FiMapPin size={10} /> {biz.address}
                          </div>
                        </div>
                      </div>
                      {activePromos.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-accent-500 font-medium flex items-center gap-1">
                            <FiTag size={10} /> {activePromos.length} promoción{activePromos.length > 1 ? 'es' : ''} activa{activePromos.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">No se encontraron comercios</p>
            <p className="text-sm mt-1">Intentá con otros filtros</p>
          </div>
        )}
      </div>

      <MobileNavBar />
    </div>
  );
}
