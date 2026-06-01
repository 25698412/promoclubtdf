'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase/client';
import { MobileNavBar } from '@/components/layout/MobileNavBar';
import { Badge } from '@/components/ui';
import { LogoImage } from '@/components/ui/LogoImage';
import { FiArrowLeft, FiGift, FiStar, FiAward, FiLock, FiCheckCircle } from 'react-icons/fi';

interface RewardWithBusiness {
  id: string;
  name: string;
  description: string | null;
  points_cost: number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  businesses?: { name: string };
}

export default function RewardsPage() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const supabase = createClient();
  const [rewards, setRewards] = useState<RewardWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const userPoints = profile?.points || 0;
  const userLevel = profile?.level || 'bronze';
  const nextLevel = userLevel === 'gold' ? null : userLevel === 'silver' ? 'Oro' : 'Plata';
  const pointsForNextLevel = userLevel === 'gold' ? 5000 : userLevel === 'silver' ? 5000 : 1000;

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    const { data } = await supabase
      .from('rewards')
      .select('*, businesses(name)')
      .eq('is_active', true)
      .order('points_cost', { ascending: true });

    setRewards(data || []);
    setLoading(false);
  };

  const handleRedeem = async (reward: RewardWithBusiness) => {
    if (!user || userPoints < reward.points_cost || reward.stock <= 0) return;

    setRedeeming(reward.id);
    try {
      // Deduct points
      const newPoints = userPoints - reward.points_cost;
      await supabase
        .from('user_profiles')
        .update({ points: newPoints, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      // Reduce stock
      await supabase
        .from('rewards')
        .update({ stock: reward.stock - 1 })
        .eq('id', reward.id);

      // Record redemption
      await supabase.from('reward_redemptions').insert({
        user_id: user.id,
        reward_id: reward.id,
        points_spent: reward.points_cost,
        status: 'completed',
      });

      // Record points history
      await supabase.from('points_history').insert({
        user_id: user.id,
        points_change: -reward.points_cost,
        reason: `Canje de premio: ${reward.name}`,
        reference_type: 'reward',
        reference_id: reward.id,
      });

      // Track analytics
      await supabase.from('analytics_events').insert({
        event_type: 'redeem_reward',
        entity_type: 'reward',
        entity_id: reward.id,
        user_id: user.id,
      });

      // Refresh profile and rewards
      await refreshProfile();
      await loadRewards();
    } catch (err) {
      console.error('Error redeeming reward:', err);
    }
    setRedeeming(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                <LogoImage className="w-6 h-6 object-contain" />
              </div>
              <h1 className="font-bold text-gray-900">Premios</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm">Tus puntos</p>
                <p className="text-4xl font-black">{userPoints}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FiStar size={32} className="text-accent-400" />
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm flex items-center gap-1.5">
                  <FiAward size={14} className="text-accent-400" />
                  Nivel {userLevel === 'gold' ? 'Oro' : userLevel === 'silver' ? 'Plata' : 'Bronce'}
                </span>
                <span className="text-xs text-white/60">
                  {nextLevel ? `${pointsForNextLevel - userPoints} pts para ${nextLevel}` : '¡Nivel máximo!'}
                </span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (userPoints / pointsForNextLevel) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* How to earn points */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">¿Cómo ganar puntos?</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: '🎟️', label: 'Canjeá cupones', points: '+10' },
              { emoji: '⭐', label: 'Comprá en locales', points: '+1/100$' },
              { emoji: '🎁', label: 'Canjeá premios', points: '-puntos' },
            ].map((item, i) => (
              <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-xs text-gray-600 mt-1">{item.label}</p>
                <p className="text-xs font-bold text-accent-500 mt-1">{item.points}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-3">Cargando premios...</p>
          </div>
        ) : rewards.length > 0 ? (
          <div className="space-y-3">
            {rewards.map((reward) => {
              const canRedeem = userPoints >= reward.points_cost && reward.stock > 0 && !!user;
              const isRedeeming = redeeming === reward.id;
              return (
                <div key={reward.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon/Image */}
                      <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                        {reward.image_url ? (
                          <img src={reward.image_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <FiGift size={24} className="text-primary-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900">{reward.name}</h3>
                        {reward.description && (
                          <p className="text-sm text-gray-500 mt-0.5">{reward.description}</p>
                        )}
                        {reward.businesses?.name && (
                          <p className="text-xs text-gray-400 mt-1">{reward.businesses.name}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm font-bold text-accent-500 flex items-center gap-1">
                            <FiStar size={12} /> {reward.points_cost} puntos
                          </span>
                          <span className={`text-xs ${reward.stock > 0 ? 'text-gray-500' : 'text-error font-medium'}`}>
                            Stock: {reward.stock}
                          </span>
                        </div>
                      </div>

                      {/* Redeem Button */}
                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem || isRedeeming}
                        className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          canRedeem
                            ? 'bg-accent-500 text-white hover:bg-accent-600 active:scale-95'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isRedeeming ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : reward.stock <= 0 ? (
                          <FiLock size={16} />
                        ) : !user ? (
                          'Iniciar sesión'
                        ) : userPoints < reward.points_cost ? (
                          'Sin puntos'
                        ) : (
                          'Canjear'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiGift size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No hay premios disponibles</h2>
            <p className="text-gray-500">Los premios aparecerán cuando estén disponibles</p>
          </div>
        )}

        {/* My Redemptions */}
        {user && (
          <div className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiCheckCircle size={16} className="text-success" /> Mis Canjes
            </h3>
            <RedemptionsList userId={user.id} />
          </div>
        )}
      </div>

      <MobileNavBar />
    </div>
  );
}

function RedemptionsList({ userId }: { userId: string }) {
  const supabase = createClient();
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRedemptions();
  }, [userId]);

  const loadRedemptions = async () => {
    const { data } = await supabase
      .from('reward_redemptions')
      .select('*, rewards(name, image_url)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    setRedemptions(data || []);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-4"><div className="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  if (redemptions.length === 0) return <p className="text-sm text-gray-400">Aún no canjeaste ningún premio</p>;

  return (
    <div className="space-y-2">
      {redemptions.map((r) => (
        <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
            {r.rewards?.image_url ? (
              <img src={r.rewards.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <FiGift size={16} className="text-primary-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{r.rewards?.name || 'Premio'}</p>
            <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('es-AR')}</p>
          </div>
          <Badge variant={r.status === 'completed' ? 'success' : r.status === 'pending' ? 'warning' : 'error'} size="sm">
            {r.status === 'completed' ? 'Completado' : r.status === 'pending' ? 'Pendiente' : 'Cancelado'}
          </Badge>
        </div>
      ))}
    </div>
  );
}
