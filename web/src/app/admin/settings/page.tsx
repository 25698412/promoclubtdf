'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => { loadRules(); }, []);

  const loadRules = async () => {
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('points_rules').select('*').order('created_at');
    setRules(data || []);
    setLoading(false);
  };

  const updateRule = async (id: string, field: string, value: string | number) => {
    setSaving(true);
    const supabase = createClient();
    if (!supabase) { setSaving(false); return; }
    await supabase.from('points_rules').update({ [field]: value }).eq('id', id);
    setRules(rules.map((r) => r.id === id ? { ...r, [field]: value } : r));
    setSaving(false);
  };

  const addRule = async () => {
    const supabase = createClient();
    if (!supabase) return;
    const { data } = await supabase.from('points_rules').insert({
      rule_name: 'Nueva regla',
      points_per_amount: 1,
      amount_threshold: 100,
      points_expiry_days: 365,
      is_active: true,
    }).select().single();
    if (data) setRules([...rules, data]);
  };

  const deleteRule = async (id: string) => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.from('points_rules').delete().eq('id', id);
    setRules(rules.filter((r) => r.id !== id));
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
                  <button onClick={addRule} className="btn-accent text-sm flex items-center gap-1"><FiPlus size={14} /> Nueva Regla</button>
                </div>
              </div>
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <input type="text" value={rule.rule_name} onChange={(e) => updateRule(rule.id, 'rule_name', e.target.value)}
                        className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0" />
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
                    <button onClick={() => deleteRule(rule.id)} className="p-1 text-gray-400 hover:text-error rounded-lg hover:bg-error-50">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
                {rules.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">No hay reglas configuradas</p>
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
