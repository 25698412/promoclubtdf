'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiPlus, FiEdit2, FiCheck, FiX, FiZap } from 'react-icons/fi';

export default function AdminPromotionsPage() {
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadPromotions(); }, [filter]);

  const loadPromotions = async () => {
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    setLoading(true);
    let query = supabase
      .from('promotions')
      .select('*, businesses(name)')
      .order('created_at', { ascending: false });
    if (filter === 'pending') query = query.eq('moderation_status', 'pending');
    else if (filter === 'approved') query = query.eq('moderation_status', 'approved');
    else if (filter === 'flash') query = query.eq('is_flash', true);
    const { data } = await query;
    setPromotions(data || []);
    setLoading(false);
  };

  const updateModeration = async (id: string, status: string) => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.from('promotions').update({
      moderation_status: status,
      moderated_at: new Date().toISOString(),
    }).eq('id', id);
    loadPromotions();
  };

  const filters = [
    { key: 'all', label: 'Todas' },
    { key: 'pending', label: '⏳ Pendientes' },
    { key: 'approved', label: '✅ Aprobadas' },
    { key: 'flash', label: '⚡ Flash' },
  ];

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Promociones</h1>
            <p className="text-gray-500 mt-1">{promotions.length} promociones</p>
          </div>
          <Link href="/admin/promotions/new" className="btn-accent flex items-center gap-2">
            <FiPlus size={16} /> Nueva Promoción
          </Link>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.key ? 'bg-primary-500 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid gap-3">
            {promotions.map((promo) => (
              <div key={promo.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {promo.image_url
                      ? <img src={promo.image_url} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      : <div className="w-16 h-16 bg-accent-50 rounded-xl flex items-center justify-center text-accent-500 flex-shrink-0 text-xl font-bold">%</div>
                    }
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{promo.title}</h3>
                      <p className="text-sm text-gray-500">{promo.businesses?.name}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {promo.is_flash && <span className="badge badge-warning flex items-center gap-1"><FiZap size={10} /> Flash</span>}
                        <span className={`badge ${promo.moderation_status === 'approved' ? 'badge-success' : promo.moderation_status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                          {promo.moderation_status === 'approved' ? 'Aprobada' : promo.moderation_status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {promo.moderation_status === 'pending' && (
                      <>
                        <button onClick={() => updateModeration(promo.id, 'approved')} className="flex items-center gap-1.5 px-3 py-1.5 bg-success-50 text-success rounded-lg text-sm font-medium hover:bg-success-100 transition-colors">
                          <FiCheck size={14} /> Aprobar
                        </button>
                        <button onClick={() => updateModeration(promo.id, 'rejected')} className="flex items-center gap-1.5 px-3 py-1.5 bg-error-50 text-error rounded-lg text-sm font-medium hover:bg-error-100 transition-colors">
                          <FiX size={14} /> Rechazar
                        </button>
                      </>
                    )}
                    <Link href={`/admin/promotions/${promo.id}`} className="p-2 text-accent-500 hover:bg-accent-50 rounded-lg transition-colors">
                      <FiEdit2 size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {promotions.length === 0 && (
              <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
                <p className="font-medium">No se encontraron promociones</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
