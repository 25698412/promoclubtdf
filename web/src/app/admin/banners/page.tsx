'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiPlus, FiEdit2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminBannersPage() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => { loadBanners(); }, []);

  const loadBanners = async () => {
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true });
    setBanners(data || []);
    setLoading(false);
  };

  const toggleStatus = async (id: string, current: boolean) => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.from('banners').update({ is_active: !current }).eq('id', id);
    loadBanners();
  };

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Banners</h1>
            <p className="text-gray-500 mt-1">{banners.length} banners</p>
          </div>
          <Link href="/admin/banners/new" className="btn-accent flex items-center gap-2">
            <FiPlus size={16} /> Nuevo Banner
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid gap-4">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={banner.image_url}
                    alt=""
                    className="w-32 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{banner.title || 'Sin título'}</h3>
                    <p className="text-sm text-gray-500">Orden: {banner.display_order}</p>
                    <span className={`badge mt-1 ${banner.is_active ? 'badge-success' : 'badge-error'}`}>
                      {banner.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button onClick={() => toggleStatus(banner.id, banner.is_active)}>
                    {banner.is_active
                      ? <FiToggleRight size={22} className="text-success" />
                      : <FiToggleLeft size={22} className="text-gray-400" />}
                  </button>
                  <Link href={`/admin/banners/${banner.id}`} className="p-2 text-accent-500 hover:bg-accent-50 rounded-lg transition-colors">
                    <FiEdit2 size={16} />
                  </Link>
                </div>
              </div>
            ))}
            {banners.length === 0 && (
              <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
                <p className="font-medium">No hay banners creados</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
