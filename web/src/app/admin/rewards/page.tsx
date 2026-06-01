'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiPlus, FiEdit2, FiGift } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminRewardsPage() {
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<any[]>([]);

  useEffect(() => { loadRewards(); }, []);

  const loadRewards = async () => {
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase
      .from('rewards')
      .select('*, businesses(name)')
      .order('created_at', { ascending: false });
    setRewards(data || []);
    setLoading(false);
  };

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Premios</h1>
            <p className="text-gray-500 mt-1">{rewards.length} premios disponibles</p>
          </div>
          <Link href="/admin/rewards/new" className="btn-accent flex items-center gap-2">
            <FiPlus size={16} /> Nuevo Premio
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid gap-4">
            {rewards.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 min-w-0">
                  {r.image_url
                    ? <img src={r.image_url} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    : <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center text-primary-400 flex-shrink-0"><FiGift size={24} /></div>
                  }
                  <div>
                    <h3 className="font-semibold text-gray-900">{r.name}</h3>
                    <p className="text-sm text-gray-500">{r.businesses?.name}</p>
                    <p className="text-sm font-semibold text-accent-500 mt-1">{r.points_cost} puntos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Stock</p>
                    <p className="font-semibold text-gray-900">{r.stock}</p>
                  </div>
                  <span className={`badge ${r.is_active ? 'badge-success' : 'badge-error'}`}>
                    {r.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                  <Link href={`/admin/rewards/${r.id}`} className="p-2 text-accent-500 hover:bg-accent-50 rounded-lg transition-colors">
                    <FiEdit2 size={16} />
                  </Link>
                </div>
              </div>
            ))}
            {rewards.length === 0 && (
              <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
                <FiGift size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No hay premios creados</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
