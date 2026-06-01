'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiPlus, FiTrash2, FiSave, FiAlertCircle, FiAward, FiCreditCard, FiCheck, FiEdit2 } from 'react-icons/fi';

interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_ARS: number;
  duration_months: number;
  benefits: string[];
  max_promotions: number;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

const DEMO_PLANS: MembershipPlan[] = [
  {
    id: 'demo-1', name: 'Plata', slug: 'plata', description: 'Ideal para empezar a promocionar tu negocio',
    price_ARS: 9900, duration_months: 1,
    benefits: ['5 promociones activas', 'Aparece en búsquedas', 'Estadísticas básicas', 'Soporte por email'],
    max_promotions: 5, is_featured: false, is_active: true, display_order: 1,
  },
  {
    id: 'demo-2', name: 'Oro', slug: 'oro', description: 'Para negocios que quieren destacar',
    price_ARS: 19900, duration_months: 1,
    benefits: ['15 promociones activas', 'Ubicación destacada en el mapa', 'Promociones flash', 'Estadísticas avanzadas', 'Badge dorado', 'Soporte prioritario'],
    max_promotions: 15, is_featured: true, is_active: true, display_order: 2,
  },
  {
    id: 'demo-3', name: 'Platino', slug: 'platino', description: 'La experiencia premium para tu negocio',
    price_ARS: 39900, duration_months: 1,
    benefits: ['Promociones ilimitadas', 'Posición top en búsquedas', 'Promociones flash + banner', 'Analytics completos', 'Badge platino', 'Destacado en homepage', 'Soporte dedicado 24/7'],
    max_promotions: -1, is_featured: false, is_active: true, display_order: 3,
  },
];

const PLAN_COLORS: Record<string, string> = {
  plata: 'from-gray-300 to-gray-400',
  oro: 'from-yellow-400 to-amber-500',
  platino: 'from-indigo-400 to-purple-500',
};

const PLAN_ICONS: Record<string, string> = {
  plata: '🥈',
  oro: '🥇',
  platino: '💎',
};

export default function AdminMembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [newBenefit, setNewBenefit] = useState<Record<string, string>>({});

  useEffect(() => { loadPlans(); }, []);

  const loadPlans = async () => {
    const supabase = createClient();
    if (!supabase) {
      setDemoMode(true);
      setPlans([...DEMO_PLANS]);
      setLoading(false);
      return;
    }
    const { data, error: fetchError } = await supabase.from('membership_plans').select('*').order('display_order');
    if (fetchError) {
      setError('Error al cargar planes: ' + fetchError.message);
    } else {
      setPlans(data?.length ? data : [...DEMO_PLANS]);
    }
    setLoading(false);
  };

  const savePlan = async (plan: MembershipPlan) => {
    setSaving(true);
    setError('');

    if (demoMode) {
      setPlans(plans.map(p => p.id === plan.id ? plan : p));
      setEditingPlan(null);
      setSaving(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) { setSaving(false); return; }

    const { error: updateError } = await supabase.from('membership_plans').update({
      name: plan.name,
      description: plan.description,
      price_ARS: plan.price_ARS,
      duration_months: plan.duration_months,
      benefits: plan.benefits,
      max_promotions: plan.max_promotions,
      is_featured: plan.is_featured,
      is_active: plan.is_active,
      display_order: plan.display_order,
    }).eq('id', plan.id);

    if (updateError) {
      setError('Error al guardar: ' + updateError.message);
    } else {
      setPlans(plans.map(p => p.id === plan.id ? plan : p));
      setEditingPlan(null);
    }
    setSaving(false);
  };

  const addPlan = async () => {
    const newPlan: MembershipPlan = {
      id: `local-${Date.now()}`,
      name: 'Nuevo Plan',
      slug: `nuevo-${Date.now()}`,
      description: 'Descripción del plan',
      price_ARS: 0,
      duration_months: 1,
      benefits: [],
      max_promotions: 5,
      is_featured: false,
      is_active: true,
      display_order: plans.length + 1,
    };
    setPlans([...plans, newPlan]);
    setEditingPlan(newPlan.id);

    if (demoMode) return;

    const supabase = createClient();
    if (!supabase) return;
    const { data, error: insertError } = await supabase.from('membership_plans').insert({
      name: 'Nuevo Plan', slug: `nuevo-${Date.now()}`, description: 'Descripción del plan',
      price_ARS: 0, duration_months: 1, benefits: [], max_promotions: 5,
      is_featured: false, is_active: true, display_order: plans.length + 1,
    }).select().single();
    if (insertError) {
      setError('Error al crear plan: ' + insertError.message);
    } else if (data) {
      setPlans(plans.map(p => p.id === newPlan.id ? data : p));
      setEditingPlan(data.id);
    }
  };

  const deletePlan = async (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
    if (demoMode) return;
    const supabase = createClient();
    if (!supabase) return;
    await supabase.from('membership_plans').delete().eq('id', id);
  };

  const addBenefit = (planId: string) => {
    const benefit = newBenefit[planId]?.trim();
    if (!benefit) return;
    setPlans(plans.map(p => p.id === planId ? { ...p, benefits: [...p.benefits, benefit] } : p));
    setNewBenefit({ ...newBenefit, [planId]: '' });
  };

  const removeBenefit = (planId: string, index: number) => {
    setPlans(plans.map(p => p.id === planId ? { ...p, benefits: p.benefits.filter((_, i) => i !== index) } : p));
  };

  const updatePlanField = (id: string, field: string, value: any) => {
    setPlans(plans.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Membresías de Comercios</h1>
          <p className="text-gray-500 mt-1">Configurá los planes de suscripción que los comercios pueden contratar</p>
        </div>

        {demoMode && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <FiAlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Modo Demo</p>
              <p className="text-xs text-blue-700 mt-1">Los cambios se guardan localmente para demostración.</p>
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
          <>
            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {plans.map((plan) => {
                const isEditing = editingPlan === plan.id;
                const colorGrad = PLAN_COLORS[plan.slug] || 'from-gray-400 to-gray-500';
                const icon = PLAN_ICONS[plan.slug] || '📦';

                return (
                  <div key={plan.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${plan.is_featured ? 'border-accent-300 ring-2 ring-accent-100' : 'border-gray-100'}`}>
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${colorGrad} p-5 text-white relative`}>
                      {plan.is_featured && (
                        <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-0.5 rounded-full font-medium">⭐ Popular</span>
                      )}
                      <div className="text-3xl mb-2">{icon}</div>
                      {isEditing ? (
                        <input type="text" value={plan.name}
                          onChange={(e) => updatePlanField(plan.id, 'name', e.target.value)}
                          className="bg-white/20 text-white placeholder-white/50 border-none rounded-lg px-2 py-1 text-xl font-bold w-full focus:outline-none focus:ring-2 focus:ring-white/50" />
                      ) : (
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                      )}
                    </div>

                    <div className="p-5">
                      {/* Price */}
                      <div className="mb-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">$</span>
                            <input type="number" value={plan.price_ARS}
                              onChange={(e) => updatePlanField(plan.id, 'price_ARS', parseFloat(e.target.value) || 0)}
                              className="text-3xl font-black text-gray-900 bg-transparent border-b-2 border-accent-300 focus:border-accent-500 focus:outline-none w-32" />
                            <span className="text-gray-400 text-sm">/mes</span>
                          </div>
                        ) : (
                          <p className="text-3xl font-black text-gray-900">
                            ${plan.price_ARS.toLocaleString('es-AR')} <span className="text-sm font-normal text-gray-400">/mes</span>
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {isEditing ? (
                        <textarea value={plan.description}
                          onChange={(e) => updatePlanField(plan.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full text-sm text-gray-500 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none mb-4" />
                      ) : (
                        <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                      )}

                      {/* Max promotions */}
                      <div className="mb-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500">Máx promos:</label>
                            <input type="number" value={plan.max_promotions === -1 ? '' : plan.max_promotions}
                              placeholder="Ilimitado"
                              onChange={(e) => updatePlanField(plan.id, 'max_promotions', e.target.value === '' ? -1 : parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center" />
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">
                            <FiCreditCard size={12} className="inline mr-1" />
                            {plan.max_promotions === -1 ? 'Promociones ilimitadas' : `Hasta ${plan.max_promotions} promociones activas`}
                          </p>
                        )}
                      </div>

                      {/* Benefits */}
                      <div className="space-y-2 mb-4">
                        {plan.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <FiCheck size={14} className="text-green-500 flex-shrink-0" />
                            {isEditing ? (
                              <div className="flex items-center gap-1 flex-1">
                                <span className="flex-1 text-gray-700">{benefit}</span>
                                <button onClick={() => removeBenefit(plan.id, i)} className="text-red-400 hover:text-red-600 p-0.5">
                                  <FiTrash2 size={12} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-700">{benefit}</span>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <div className="flex items-center gap-2 mt-2">
                            <input type="text" value={newBenefit[plan.id] || ''} placeholder="Nuevo beneficio..."
                              onChange={(e) => setNewBenefit({ ...newBenefit, [plan.id]: e.target.value })}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(plan.id); } }}
                              className="flex-1 px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                            <button onClick={() => addBenefit(plan.id)} className="text-accent-500 hover:text-accent-600 text-sm font-medium">+</button>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        {isEditing ? (
                          <>
                            <button onClick={() => savePlan(plan)} disabled={saving}
                              className="flex-1 py-2 bg-accent-500 text-white text-sm font-medium rounded-lg hover:bg-accent-600 flex items-center justify-center gap-1 disabled:opacity-50">
                              <FiSave size={14} /> Guardar
                            </button>
                            <button onClick={() => { setEditingPlan(null); loadPlans(); }}
                              className="py-2 px-3 text-gray-500 text-sm rounded-lg hover:bg-gray-100">
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setEditingPlan(plan.id)}
                              className="flex-1 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1">
                              <FiEdit2 size={14} /> Editar
                            </button>
                            <button onClick={() => deletePlan(plan.id)}
                              className="py-2 px-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                              <FiTrash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Plan Button */}
            <div className="text-center">
              <button onClick={addPlan}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-accent-400 hover:text-accent-500 transition-colors">
                <FiPlus size={18} /> Agregar Plan
              </button>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
