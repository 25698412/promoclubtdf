'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiUsers, FiMapPin, FiMail } from 'react-icons/fi';

export default function AdminUsersPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  const levelConfig: Record<string, { badge: string; label: string }> = {
    gold: { badge: 'badge-warning', label: '🥇 Oro' },
    silver: { badge: 'badge-info', label: '🥈 Plata' },
    bronze: { badge: 'badge-success', label: '🥉 Bronce' },
  };

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-1">{users.length} usuarios registrados</p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Usuario', 'Email', 'Ciudad', 'Nivel', 'Puntos', 'Verificado'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => {
                  const level = levelConfig[u.level] || levelConfig.bronze;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-500 font-semibold text-sm flex-shrink-0">
                            {u.first_name?.charAt(0)}{u.last_name?.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{u.first_name} {u.last_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiMail size={12} className="text-gray-400" />
                          {u.email || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiMapPin size={12} className="text-gray-400" />
                          {u.city || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${level.badge}`}>{level.label}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary-500">{u.points ?? 0}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${u.is_verified_resident ? 'badge-success' : 'badge-warning'}`}>
                          {u.is_verified_resident ? '✅ Verificado' : '⏳ Pendiente'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <FiUsers size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No hay usuarios registrados</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
