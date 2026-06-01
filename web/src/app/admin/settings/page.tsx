'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiSave, FiPlus, FiTrash2, FiAlertCircle } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [rules, setRules] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(true);

  useEffect(() => { loadRules(); }, []);

  const loadRules = async () => {
    const supabase = createClient();
    if (!supabase) {
      setConnected(false);
      setLoading(false);
      return;
    }
    const { data, error: fetchError } = await supabase.from('points_rules').select('*').order('created_at');
    if (fetchError) {
      console.error('Error loading rules:', fetchError);
      setError('Error al cargar reglas: ' + fetchError.message);
    } else {
      setRules(data || []);
    }
    setLoading(false);
  };

  const updateRule = async (id: string, field: string, value: string | number) => {
    setSaving(true);
    setError('');
    const supabase = createClient();
    if (!supabase) {
      setError('No hay conexión a Supabase');
      setSaving(false);
      return;
    }
    const { error: updateError } = await supabase.from('points_rules').update({ [field]: value }).eq('id', id);
    if (updateError) {
      console.error('Error updating rule:', updateError);
      setError('Error al guardar: ' + updateError.message);
    } else {
      setRules(rules.map((r) => r.id === id ? { ...r, [field]: value } : r));
    }
    setSaving(false);
  };

  const addRule = async () => {
    setAdding(true);
    setError('');
    const supabase = createClient();
    if (!supabase) {
      setError('No hay conexión a Supabase. Verificá las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      setAdding(false);
      return;
    }
    const { data, error: insertError } = await supabase.from('points_rules').insert({
      rule_name: 'Nueva regla',
      points_per_amount: 1,
      amount_threshold: 100,
      points_expiry_days: 365,
      is_active: true,
    }).select().single();
    if (insertError) {
      console.error('Error adding rule:', insertError);
      setError('Error al crear regla: ' + insertError.message + '. Verificá que tu usuario tenga rol de admin.');
    } else if (data) {
      setRules([...rules, data]);
    }
    setAdding(false);
  };

  const deleteRule = async (id: string) => {
    setError('');
    const supabase = createClient();
    if (!supabase) {
      setError('No hay conexión a Supabase');
      return;
    }
    const { error: deleteError } = await supabase.from('points_rules').delete().eq('id', id);
    if (deleteError) {
      console.error('Error deleting rule:', deleteError);
      setError('Error al eliminar: ' + deleteError.message);
    } else {
      setRules(rules.filter((r) => r.id !== id));
    }
  };

  const levels = [
    { emoji: '🥉', name: 'Bronce', range: '0 – 999 puntos', color: 'bg-orange-50' },
    { emoji: '🥈', name: 'Plata', range: '1.000 – 4.999 puntos', color: 'bg-gray-50' },
    { emoji: '🥇', name: 'Oro', range: '5.000+ puntos', color: 'bg-yellow-50' },
  ];

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-500 mt-1">Parámetros globales de la plataforma</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <FiAlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 text-sm">✕</button>
          </div>
        )}

        {/* No Connection Banner */}
        {!connected && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <FiAlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Sin conexión a Supabase</p>
              <p className="text-xs text-yellow-700 mt-1">
                Las variables de entorno <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
                <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no están configuradas
                o contienen valores placeholder. Configuralas en <code className="bg-yellow-100 px-1 rounded">.env.local</code>.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Points Rules */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Reglas de Puntos</h2>
                <div className="flex items-center gap-3">
                  {saving && <span className="text-xs text-gray-400">Guardando...</span>}
                  <button
                    onClick={addRule}
                    disabled={adding || !connected}
                    className="btn-accent text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {adding ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiPlus size={14} />
                    )}
                    Nueva Regla
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                Configurá cuántos puntos recibe el cliente por cada monto en ARS canjeado.
              </p>

              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl flex-wrap">
                    <div className="flex-1 min-w-[120px]">
                      <input type="text" value={rule.rule_name} onChange={(e) => updateRule(rule.id, 'rule_name', e.target.value)}
                        className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">Puntos:</label>
                      <input type="number" value={rule.points_per_amount}
                        onChange={(e) => updateRule(rule.id, 'points_per_amount', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center" min="0" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">Cada $:</label>
                      <input type="number" value={rule.amount_threshold}
                        onChange={(e) => updateRule(rule.id, 'amount_threshold', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center" min="1" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">Expira días:</label>
                      <input type="number" value={rule.points_expiry_days}
                        onChange={(e) => updateRule(rule.id, 'points_expiry_days', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center" min="1" />
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={rule.is_active}
                        onChange={(e) => { updateRule(rule.id, 'is_active', e.target.checked ? 1 : 0); }}
                        className="w-4 h-4 rounded border-gray-300 text-accent-500" />
                      <span className="text-xs text-gray-500">Activa</span>
                    </label>
                    <button onClick={() => deleteRule(rule.id)} className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
                {rules.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-3">No hay reglas configuradas</p>
                    {connected && (
                      <button onClick={addRule} disabled={adding} className="btn-outline-accent text-sm">
                        Crear primera regla
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* User Levels */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Niveles de Usuario</h2>
              <div className="space-y-3">
                {levels.map((level) => (
                  <div key={level.name} className={`flex items-center justify-between p-4 ${level.color} rounded-xl`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{level.emoji}</span>
                      <span className="font-semibold text-gray-900">{level.name}</span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{level.range}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">Los niveles se actualizan automáticamente al superar los puntos requeridos.</p>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
