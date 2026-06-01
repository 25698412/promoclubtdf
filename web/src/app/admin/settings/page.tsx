'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiSave, FiPlus, FiTrash2, FiAlertCircle, FiAward } from 'react-icons/fi';

interface PointsRule {
  id: string;
  rule_name: string;
  points_per_amount: number;
  amount_threshold: number;
  points_expiry_days: number;
  is_active: boolean;
}

interface LevelThresholds {
  silver: number;
  gold: number;
}

const DEMO_RULES: PointsRule[] = [
  { id: 'demo-1', rule_name: 'Regla estándar', points_per_amount: 1, amount_threshold: 100, points_expiry_days: 365, is_active: true },
];

const DEFAULT_LEVELS: LevelThresholds = { silver: 1000, gold: 5000 };

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [rules, setRules] = useState<PointsRule[]>([]);
  const [levels, setLevels] = useState<LevelThresholds>(DEFAULT_LEVELS);
  const [levelsDirty, setLevelsDirty] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const supabase = createClient();
    if (!supabase) {
      setDemoMode(true);
      setRules([...DEMO_RULES]);
      setLoading(false);
      return;
    }

    // Load rules
    const { data: rulesData, error: rulesErr } = await supabase.from('points_rules').select('*').order('created_at');
    if (rulesErr) {
      setError('Error al cargar reglas: ' + rulesErr.message);
    } else {
      setRules(rulesData || []);
    }

    // Load level thresholds
    const { data: settingsData } = await supabase.from('platform_settings').select('value').eq('key', 'level_thresholds').single();
    if (settingsData?.value) {
      setLevels({
        silver: settingsData.value.silver ?? 1000,
        gold: settingsData.value.gold ?? 5000,
      });
    }

    setLoading(false);
  };

  // ── Points Rules CRUD ──────────────────────────────────────

  const updateRule = async (id: string, field: string, value: string | number) => {
    setSaving(true);
    setError('');
    setRules(rules.map((r) => r.id === id ? { ...r, [field]: value } : r));

    if (demoMode) { setSaving(false); return; }

    const supabase = createClient();
    if (!supabase) { setSaving(false); return; }
    const { error: updateError } = await supabase.from('points_rules').update({ [field]: value }).eq('id', id);
    if (updateError) {
      setError('Error al guardar: ' + updateError.message);
    }
    setSaving(false);
  };

  const addRule = async () => {
    setAdding(true);
    setError('');

    const newRule: PointsRule = {
      id: `local-${Date.now()}`,
      rule_name: 'Nueva regla',
      points_per_amount: 1,
      amount_threshold: 100,
      points_expiry_days: 365,
      is_active: true,
    };
    setRules([...rules, newRule]);

    if (demoMode) { setAdding(false); return; }

    const supabase = createClient();
    if (!supabase) { setAdding(false); return; }
    const { data, error: insertError } = await supabase.from('points_rules').insert({
      rule_name: 'Nueva regla',
      points_per_amount: 1,
      amount_threshold: 100,
      points_expiry_days: 365,
      is_active: true,
    }).select().single();
    if (insertError) {
      setError('Error al crear regla: ' + insertError.message);
    } else if (data) {
      setRules(rules.map(r => r.id === newRule.id ? data : r));
    }
    setAdding(false);
  };

  const deleteRule = async (id: string) => {
    setError('');
    setRules(rules.filter((r) => r.id !== id));
    if (demoMode) return;

    const supabase = createClient();
    if (!supabase) return;
    const { error: deleteError } = await supabase.from('points_rules').delete().eq('id', id);
    if (deleteError) {
      setError('Error al eliminar: ' + deleteError.message);
    }
  };

  // ── Level Thresholds ───────────────────────────────────────

  const updateLevel = (level: 'silver' | 'gold', value: string) => {
    const num = parseInt(value) || 0;
    setLevels({ ...levels, [level]: num });
    setLevelsDirty(true);
  };

  const saveLevels = async () => {
    setSaving(true);
    setError('');

    if (demoMode) {
      setLevelsDirty(false);
      setSaving(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) { setSaving(false); return; }
    const { error: upsertError } = await supabase
      .from('platform_settings')
      .upsert({ key: 'level_thresholds', value: levels, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (upsertError) {
      setError('Error al guardar niveles: ' + upsertError.message);
    } else {
      setLevelsDirty(false);
    }
    setSaving(false);
  };

  // ── Derived level info ─────────────────────────────────────

  const levelDisplay: Array<{
    emoji: string; name: string; from: number; to: number | typeof Infinity;
    color: string; inputKey: 'silver' | 'gold' | null;
  }> = [
    { emoji: '🥉', name: 'Bronce', from: 0, to: levels.silver - 1, color: 'bg-orange-50', inputKey: null },
    { emoji: '🥈', name: 'Plata', from: levels.silver, to: levels.gold - 1, color: 'bg-gray-50', inputKey: 'silver' },
    { emoji: '🥇', name: 'Oro', from: levels.gold, to: Infinity, color: 'bg-yellow-50', inputKey: 'gold' },
  ];

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-500 mt-1">Parámetros globales de la plataforma</p>
        </div>

        {demoMode && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <FiAlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Modo Demo</p>
              <p className="text-xs text-blue-700 mt-1">
                Sin conexión a Supabase — los cambios se guardan localmente para demostración.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <FiAlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1"><p className="text-sm text-red-700">{error}</p></div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 text-sm">✕</button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* ── Points Rules ──────────────────────────────── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Reglas de Puntos</h2>
                <div className="flex items-center gap-3">
                  {saving && <span className="text-xs text-gray-400">Guardando...</span>}
                  <button onClick={addRule} disabled={adding}
                    className="btn-accent text-sm flex items-center gap-1 disabled:opacity-50">
                    {adding ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiPlus size={14} />}
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
                        onChange={(e) => updateRule(rule.id, 'is_active', e.target.checked ? 1 : 0)}
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
                    <button onClick={addRule} disabled={adding} className="btn-outline-accent text-sm">Crear primera regla</button>
                  </div>
                )}
              </div>
            </div>

            {/* ── User Levels (Editable) ────────────────────── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500">
                    <FiAward size={18} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Niveles de Usuario</h2>
                </div>
                {levelsDirty && (
                  <button onClick={saveLevels} disabled={saving}
                    className="btn-accent text-sm flex items-center gap-1 disabled:opacity-50">
                    {saving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={14} />}
                    Guardar
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 mb-4">
                Definí desde cuántos puntos asciende cada nivel. Los niveles se actualizan automáticamente cuando el cliente supera el umbral.
              </p>

              <div className="space-y-3">
                {levelDisplay.map((level) => (
                  <div key={level.name} className={`flex items-center justify-between p-4 ${level.color} rounded-xl`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{level.emoji}</span>
                      <div>
                        <span className="font-semibold text-gray-900">{level.name}</span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {level.from.toLocaleString('es-AR')} – {level.to === Infinity ? '∞' : level.to.toLocaleString('es-AR')} puntos
                        </p>
                      </div>
                    </div>
                    {level.inputKey !== null ? (
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500">Desde:</label>
                        <input
                          type="number"
                          value={levels[level.inputKey]}
                          onChange={(e) => { if (level.inputKey) updateLevel(level.inputKey, e.target.value); }}
                          className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-accent-500"
                          min="1"
                        />
                        <span className="text-xs text-gray-400">pts</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Siempre desde 0</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
