'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiCheck, FiX, FiShoppingBag, FiMapPin, FiMail, FiPhone, FiClock } from 'react-icons/fi';

export default function AdminVerificationsPage() {
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [filter, setFilter] = useState('pending');

  useEffect(() => { loadBusinesses(); }, [filter]);

  const loadBusinesses = async () => {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    let query = supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter === 'pending') query = query.eq('is_active', false);
    else if (filter === 'active') query = query.eq('is_active', true);

    const { data } = await query;
    setBusinesses(data || []);
    setLoading(false);
  };

  const updateVerification = async (businessId: string, isActive: boolean) => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase
      .from('businesses')
      .update({ is_active: isActive })
      .eq('id', businessId);
    loadBusinesses();
  };

  const filters = [
    { key: 'pending', label: '⏳ Pendientes de aprobación' },
    { key: 'active', label: '✅ Activos' },
  ];

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Aprobación de Comercios</h1>
          <p className="text-gray-500 mt-1">Aprobá o rechazá los comercios que se registran en la plataforma</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.key
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : businesses.length > 0 ? (
          <div className="grid gap-4">
            {businesses.map((biz) => (
              <div key={biz.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {biz.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{biz.name}</h3>
                      <span className={`badge ${biz.is_active ? 'badge-success' : 'badge-warning'}`}>
                        {biz.is_active ? '✅ Activo' : '⏳ Pendiente'}
                      </span>
                      {biz.is_founder && <span className="badge badge-warning">📍 Fundador</span>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1"><FiShoppingBag size={12} /> {biz.category}</span>
                      <span className="flex items-center gap-1"><FiMapPin size={12} /> {biz.address}, {biz.city}</span>
                      {biz.phone && <span className="flex items-center gap-1"><FiPhone size={12} /> {biz.phone}</span>}
                      {biz.email && <span className="flex items-center gap-1"><FiMail size={12} /> {biz.email}</span>}
                    </div>
                    {biz.description && (
                      <p className="text-sm text-gray-400 mt-2">{biz.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <FiClock size={10} /> Registrado el {new Date(biz.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  {!biz.is_active && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateVerification(biz.id, true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-success-50 text-success rounded-lg text-sm font-medium hover:bg-success-100 transition-colors"
                      >
                        <FiCheck size={14} /> Aprobar
                      </button>
                      <button
                        onClick={() => {
                          const supabase = createClient();
                          if (supabase) supabase.from('businesses').delete().eq('id', biz.id).then(() => loadBusinesses());
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-error-50 text-error rounded-lg text-sm font-medium hover:bg-error-100 transition-colors"
                      >
                        <FiX size={14} /> Rechazar
                      </button>
                    </div>
                  )}
                  {biz.is_active && (
                    <button
                      onClick={() => updateVerification(biz.id, false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex-shrink-0"
                    >
                      <FiX size={14} /> Desactivar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
            <FiShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">
              {filter === 'pending' ? 'No hay comercios pendientes de aprobación' : 'No hay comercios activos'}
            </p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
