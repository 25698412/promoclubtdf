'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/AdminShell';
import {
  FiSearch, FiToggleLeft, FiToggleRight, FiEdit2, FiPlus,
  FiMapPin, FiStar, FiTag,
} from 'react-icons/fi';

export default function AdminBusinessesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => { loadBusinesses(); }, []);

  const loadBusinesses = async () => {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
    setBusinesses(data || []);
    setLoading(false);
  };

  const toggleStatus = async (id: string, current: boolean) => {
    await supabase.from('businesses').update({ is_active: !current }).eq('id', id);
    loadBusinesses();
  };

  const filtered = businesses.filter(b =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase()) ||
    b.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Locales</h1>
            <p className="text-gray-500 mt-1">{businesses.length} locales registrados</p>
          </div>
          <Link href="/admin/businesses/new" className="btn-accent flex items-center gap-2">
            <FiPlus size={16} /> Nuevo Local
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Nombre', 'Categoría', 'Ciudad', 'Estado', 'Fundador', 'Acciones'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center text-primary-500 font-bold text-sm flex-shrink-0">
                          {b.logo_url
                            ? <img src={b.logo_url} alt="" className="w-9 h-9 rounded-lg object-cover" />
                            : b.name?.charAt(0)
                          }
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{b.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{b.category || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiMapPin size={12} className="text-gray-400" />
                        {b.city || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${b.is_active ? 'badge-success' : 'badge-error'}`}>
                        {b.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {b.is_founder
                        ? <span className="badge badge-warning">⭐ Fundador</span>
                        : <span className="text-gray-300 text-sm">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleStatus(b.id, b.is_active)}
                          className="text-sm text-primary-500 hover:text-primary-700 font-medium transition-colors"
                        >
                          {b.is_active ? <FiToggleRight size={20} className="text-success" /> : <FiToggleLeft size={20} className="text-gray-400" />}
                        </button>
                        <Link href={`/admin/businesses/${b.id}`} className="text-accent-500 hover:text-accent-600 transition-colors">
                          <FiEdit2 size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <FiTag size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No se encontraron locales</p>
                <p className="text-sm mt-1">Probá con otro término de búsqueda</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
