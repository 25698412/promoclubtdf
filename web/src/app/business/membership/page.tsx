'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { FiArrowLeft, FiCheck, FiCreditCard, FiAlertCircle, FiClock, FiAward } from 'react-icons/fi';

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
  display_order: number;
}

const DEMO_PLANS: MembershipPlan[] = [
  {
    id: 'demo-1', name: 'Plata', slug: 'plata', description: 'Ideal para empezar a promocionar tu negocio',
    price_ARS: 9900, duration_months: 1,
    benefits: ['5 promociones activas', 'Aparece en búsquedas', 'Estadísticas básicas', 'Soporte por email'],
    max_promotions: 5, is_featured: false, display_order: 1,
  },
  {
    id: 'demo-2', name: 'Oro', slug: 'oro', description: 'Para negocios que quieren destacar',
    price_ARS: 19900, duration_months: 1,
    benefits: ['15 promociones activas', 'Ubicación destacada en el mapa', 'Promociones flash', 'Estadísticas avanzadas', 'Badge dorado', 'Soporte prioritario'],
    max_promotions: 15, is_featured: true, display_order: 2,
  },
  {
    id: 'demo-3', name: 'Platino', slug: 'platino', description: 'La experiencia premium para tu negocio',
    price_ARS: 39900, duration_months: 1,
    benefits: ['Promociones ilimitadas', 'Posición top en búsquedas', 'Promociones flash + banner', 'Analytics completos', 'Badge platino', 'Destacado en homepage', 'Soporte dedicado 24/7'],
    max_promotions: -1, is_featured: false, display_order: 3,
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

export default function BusinessMembershipPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    loadData();
  }, [user, authLoading]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('membership') === 'success') {
      setSuccess(true);
    }
  }, []);

  const loadData = async () => {
    const supabase = createClient();

    if (!supabase) {
      // Demo mode
      setDemoMode(true);
      setPlans([...DEMO_PLANS]);
      setBusiness({
        id: 'demo-business',
        name: 'Mi Comercio Demo',
        category: 'Gastronomía',
        membership_plan_id: null,
        membership_expires_at: null,
        membership_plans: null,
      });
      setLoading(false);
      return;
    }

    const { data: biz } = await supabase
      .from('businesses')
      .select('*, membership_plans!businesses_membership_plan_id_fkey(*)')
      .eq('owner_id', user?.id)
      .single();

    setBusiness(biz);

    const { data: plansData } = await supabase
      .from('membership_plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    setPlans(plansData?.length ? plansData : [...DEMO_PLANS]);
    setLoading(false);
  };

  const handleSubscribe = async (plan: MembershipPlan) => {
    if (!business) return;
    setPurchasing(plan.id);
    setError('');

    if (demoMode) {
      // Simulate subscription locally
      await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + plan.duration_months);

      setBusiness({
        ...business,
        membership_plan_id: plan.id,
        membership_expires_at: expiresAt.toISOString(),
        membership_plans: plan,
      });
      setPurchasing(null);
      setSuccess(true);
      return;
    }

    // Real MercadoPago flow
    try {
      const supabaseClient = createClient();
      if (!supabaseClient) { setPurchasing(null); return; }
      const { data: { session } } = await supabaseClient.auth.getSession();
      const response = await fetch(`${supabaseClient.supabaseUrl}/functions/v1/mercadopago-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ plan_id: plan.id, business_id: business.id }),
      });

      const data = await response.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else if (data.sandbox_url) {
        window.location.href = data.sandbox_url;
      } else {
        setError(data.error || 'No se pudo crear el checkout');
      }
    } catch (err: any) {
      setError('Error al procesar: ' + (err.message || 'Error desconocido'));
    }
    setPurchasing(null);
  };

  const currentPlan = business?.membership_plans;
  const isExpired = business?.membership_expires_at && new Date(business.membership_expires_at) < new Date();

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/business/panel" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Membresía</h1>
            <p className="text-sm text-gray-500">Elegí el plan ideal para tu negocio</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {demoMode && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <FiAlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Modo Demo</p>
              <p className="text-xs text-blue-700 mt-1">Las suscripciones se simulan localmente. Conectá Supabase y MercadoPago para pagos reales.</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <FiCheck size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">
                {demoMode ? '¡Membresía activada!' : '¡Pago aprobado!'}
              </p>
              <p className="text-xs text-green-700 mt-1">
                {demoMode ? 'Tu plan fue activado en modo demo.' : 'Tu membresía fue activada correctamente.'}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <FiAlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Current Membership Status */}
        {business && (
          <div className="mb-8">
            {currentPlan && !isExpired ? (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Tu plan actual</p>
                    <p className="text-2xl font-black mt-1">{PLAN_ICONS[currentPlan.slug] || '📦'} {currentPlan.name}</p>
                  </div>
                  <FiAward size={32} className="text-white/50" />
                </div>
                {business.membership_expires_at && (
                  <div className="mt-3 flex items-center gap-2 text-white/70 text-sm">
                    <FiClock size={14} />
                    Vence: {new Date(business.membership_expires_at).toLocaleDateString('es-AR')}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-300 rounded-2xl flex items-center justify-center">
                    <FiCreditCard size={24} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {isExpired ? 'Tu membresía expiró' : 'Sin membresía activa'}
                    </p>
                    <p className="text-sm text-gray-500">Elegí un plan para empezar a destacar</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Plans */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Planes disponibles</h2>
        <div className="space-y-4">
          {plans.map((plan) => {
            const isCurrent = currentPlan?.id === plan.id && !isExpired;
            const colorGrad = PLAN_COLORS[plan.slug] || 'from-gray-400 to-gray-500';
            const icon = PLAN_ICONS[plan.slug] || '📦';
            const isPurchasingThis = purchasing === plan.id;

            return (
              <div key={plan.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  plan.is_featured ? 'border-accent-300 ring-2 ring-accent-100' : 'border-gray-100'
                } ${isCurrent ? 'ring-2 ring-green-200 border-green-300' : ''}`}>

                <div className={`bg-gradient-to-r ${colorGrad} px-5 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      {plan.is_featured && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">⭐ Popular</span>}
                    </div>
                  </div>
                  <p className="text-white font-black text-xl">
                    ${plan.price_ARS.toLocaleString('es-AR')}
                    <span className="text-sm font-normal">/mes</span>
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

                  <div className="space-y-2 mb-5">
                    {plan.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <FiCheck size={14} className="text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {isCurrent ? (
                    <div className="py-3 text-center bg-green-50 text-green-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2">
                      <FiCheck size={16} /> Plan actual
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={isPurchasingThis}
                      className="w-full py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isPurchasingThis ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <FiCreditCard size={16} />
                          {currentPlan && !isExpired ? 'Cambiar a este plan' : 'Suscribirme'}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
