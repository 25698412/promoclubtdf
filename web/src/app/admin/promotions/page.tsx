'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiPlus, FiEdit2, FiCheck, FiX, FiZap, FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function AdminPromotionsPage() {
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [batchLoading, setBatchLoading] = useState(false);

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
    else if (filter === 'flash_pending') query = query.eq('is_flash', true).eq('moderation_status', 'pending');
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

  const approveAllFlash = async () => {
    const flashPending = promotions.filter(p => p.is_flash && p.moderation_status === 'pending');
    if (flashPending.length === 0) return;
    setBatchLoading(true);
    const supabase = createClient();
    if (!supabase) { setBatchLoading(false); return; }
    const ids = flashPending.map(p => p.id);
    await supabase.from('promotions').update({
      moderation_status: 'approved',
      moderated_at: new Date().toISOString(),
    }).in('id', ids);
    await loadPromotions();
    setBatchLoading(false);
  };

  const filters = [
    { key: 'all', label: 'Todas' },
    { key: 'pending', label: '⏳ Pendientes' },
    { key: 'approved', label: '✅ Aprobadas' },
    { key: 'flash', label: '⚡ Todas Flash' },
    { key: 'flash_pending', label: '⚡ Flash Pendientes' },
  ];

  // Compute stats
  const pendingFlashCount = promotions.filter(p => p.is_flash && p.moderation_status === 'pending').length;
  const allPendingCount = promotions.filter(p => p.moderation_status === 'pending').length;
  const flashCount = promotions.filter(p => p.is_flash).length;

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Promociones</h1>
            <p className="text-gray-500 mt-1">{promotions.length} promociones</p>
          </div>
          <Link href="/admin/promotions/new" className="btn-accent flex items-center gap-2">
            <FiPlus size={16} /> Nueva Promoción
          </Link>
        </div>

        {/* Flash Pending Alert Banner */}
        {pendingFlashCount > 0 && filter !== 'flash_pending' && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-5 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-md">
                  <FiZap size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    ⚡ Flash Pendientes de Aprobación
                    <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingFlashCount}</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Hay {pendingFlashCount} promoción{pendingFlashCount > 1 ? 'es' : ''} flash esperando aprobación.
                    Las ofertas flash son temporales y requieren revisión rápida.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={approveAllFlash}
                  disabled={batchLoading}
                  className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all text-sm flex items-center gap-2 shadow-md disabled:opacity-60"
                >
                  {batchLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiCheckCircle size={14} />
                  )}
                  Aprobar Todas las Flash
                </button>
                <button
                  onClick={() => setFilter('flash_pending')}
                  className="px-4 py-2.5 bg-white border border-yellow-300 text-yellow-700 font-medium rounded-xl hover:bg-yellow-50 transition-colors text-sm"
                >
                  Ver Detalle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{allPendingCount}</p>
            <p className="text-xs text-gray-500 mt-1">⏳ Pendientes</p>
          </div>
          <div className="bg-white rounded-xl border border-yellow-200 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pendingFlashCount}</p>
            <p className="text-xs text-gray-500 mt-1">⚡ Flash Pendientes</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{promotions.filter(p => p.moderation_status === 'approved').length}</p>
            <p className="text-xs text-gray-500 mt-1">✅ Aprobadas</p>
          </div>
          <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{flashCount}</p>
            <p className="text-xs text-gray-500 mt-1">⚡ Total Flash</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.key
                  ? f.key.includes('flash')
                    ? 'bg-yellow-500 text-white shadow-sm'
                    : 'bg-primary-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}>
              {f.label}
              {f.key === 'pending' && allPendingCount > 0 && (
                <span className="ml-1.5 bg-white/20 text-xs px-1.5 py-0.5 rounded-full">{allPendingCount}</span>
              )}
              {f.key === 'flash_pending' && pendingFlashCount > 0 && (
                <span className="ml-1.5 bg-white/20 text-xs px-1.5 py-0.5 rounded-full">{pendingFlashCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Promotions List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid gap-3">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className={`bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow ${
                  promo.is_flash && promo.moderation_status === 'pending'
                    ? 'border-yellow-300 ring-1 ring-yellow-100'
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {promo.image_url
                      ? <img src={promo.image_url} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      : promo.is_flash
                        ? <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white flex-shrink-0"><FiZap size={20} /></div>
                        : <div className="w-16 h-16 bg-accent-50 rounded-xl flex items-center justify-center text-accent-500 flex-shrink-0 text-xl font-bold">%</div>
                    }
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">{promo.title}</h3>
                        {promo.is_flash && promo.moderation_status === 'pending' && (
                          <FiAlertTriangle size={14} className="text-yellow-500 flex-shrink-0 animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{promo.businesses?.name}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {promo.is_flash && (
                          <span className="badge badge-warning flex items-center gap-1">
                            <FiZap size={10} /> Flash
                            {promo.flash_duration_minutes && (
                              <span className="ml-1 flex items-center gap-0.5"><FiClock size={8} /> {promo.flash_duration_minutes}m</span>
                            )}
                          </span>
                        )}
                        <span className={`badge ${
                          promo.moderation_status === 'approved' ? 'badge-success' :
                          promo.moderation_status === 'rejected' ? 'badge-error' : 'badge-warning'
                        }`}>
                          {promo.moderation_status === 'approved' ? 'Aprobada' :
                           promo.moderation_status === 'rejected' ? 'Rechazada' : '⏳ Pendiente'}
                        </span>
                        {promo.discount_percentage && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">-{promo.discount_percentage}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {promo.moderation_status === 'pending' && (
                      <>
                        <button onClick={() => updateModeration(promo.id, 'approved')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-success-50 text-success rounded-lg text-sm font-medium hover:bg-success-100 transition-colors">
                          <FiCheck size={14} /> Aprobar
                        </button>
                        <button onClick={() => updateModeration(promo.id, 'rejected')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-error-50 text-error rounded-lg text-sm font-medium hover:bg-error-100 transition-colors">
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
                <FiZap size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No se encontraron promociones</p>
                <p className="text-sm mt-1">No hay promociones con este filtro</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
