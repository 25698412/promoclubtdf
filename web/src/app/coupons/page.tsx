'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase/client';
import { MobileNavBar } from '@/components/layout/MobileNavBar';
import { LogoImage } from '@/components/ui/LogoImage';
import { FiArrowLeft, FiClock, FiCheckCircle, FiTag, FiRefreshCw, FiZap } from 'react-icons/fi';
import { generateCoupon } from '@/lib/supabase/edge-functions';
import { QRCodeSVG } from 'qrcode.react';

interface CouponWithDetails {
  id: string;
  token: string;
  expires_at: string;
  status: 'active' | 'redeemed' | 'expired';
  redeemed_at: string | null;
  created_at: string;
  promotion_id: string;
  business_id: string;
  promotions?: {
    title: string;
    discount_percentage: number | null;
    discount_text: string | null;
    is_flash: boolean;
  };
  businesses?: {
    name: string;
    logo_url: string | null;
    category: string | null;
  };
}

export default function CouponsPage() {
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [coupons, setCoupons] = useState<CouponWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!authLoading) {
      loadCoupons();
    }
  }, [user, authLoading]);

  useEffect(() => {
    // Countdown timer for active coupons
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const now = Date.now();
        const updated: Record<string, number> = {};
        coupons.forEach((c) => {
          if (c.status === 'active') {
            const expires = new Date(c.expires_at).getTime();
            const remaining = Math.max(0, Math.floor((expires - now) / 1000));
            updated[c.id] = remaining;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [coupons]);

  const loadCoupons = async () => {
    if (!user) {
      setCoupons([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('coupons')
      .select('*, promotions(title, discount_percentage, discount_text, is_flash), businesses(name, logo_url, category)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setCoupons(data || []);
    setLoading(false);
  };

  const handleRefreshCoupon = async (coupon: CouponWithDetails) => {
    if (!coupon.promotions || !coupon.businesses) return;
    try {
      await generateCoupon(coupon.promotion_id, coupon.business_id);
      loadCoupons();
    } catch (err) {
      console.error('Error refreshing coupon:', err);
    }
  };

  const active = coupons.filter((c) => c.status === 'active');
  const used = coupons.filter((c) => c.status === 'redeemed');
  const expired = coupons.filter((c) => c.status === 'expired');

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
              <h1 className="font-bold text-gray-900">Mis Cupones</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-3">Cargando cupones...</p>
          </div>
        ) : !user ? (
          <div className="text-center py-16">
            <FiTag size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Iniciá sesión para ver tus cupones</h2>
            <p className="text-gray-500 mb-6">Activá promociones y generá cupones QR</p>
            <Link href="/login" className="btn-accent">Iniciar Sesión</Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <p className="text-3xl font-bold text-primary-500">{active.length}</p>
                <p className="text-sm text-gray-500 mt-1">Cupones activos</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <p className="text-3xl font-bold text-gray-400">{used.length + expired.length}</p>
                <p className="text-sm text-gray-500 mt-1">Usados / Expirados</p>
              </div>
            </div>

            {/* Active Coupons with QR */}
            {active.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiTag className="text-accent-500" size={18} /> Cupones Activos
                </h2>
                <div className="space-y-4">
                  {active.map((c) => {
                    const secondsLeft = timeLeft[c.id] || 0;
                    const isExpired = secondsLeft <= 0;
                    return (
                      <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Top colored strip */}
                        <div className={`h-2 ${c.promotions?.is_flash ? 'bg-gradient-to-r from-warning to-error' : 'bg-gradient-to-r from-primary-500 to-accent-500'}`} />
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{c.businesses?.name || 'Negocio'}</p>
                              <h3 className="font-bold text-gray-900 mt-1">{c.promotions?.title || 'Cupón'}</h3>
                              {c.promotions?.is_flash && (
                                <span className="inline-flex items-center gap-1 text-xs text-warning font-semibold mt-1">
                                  <FiZap size={10} /> Flash
                                </span>
                              )}
                            </div>
                            {c.promotions?.discount_percentage && (
                              <div className="bg-accent-500 text-white text-xl font-black px-3 py-1.5 rounded-xl flex-shrink-0">
                                -{c.promotions.discount_percentage}%
                              </div>
                            )}
                          </div>

                          {/* Dashed separator */}
                          <div className="border-t border-dashed border-gray-200 my-4 relative">
                            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full" />
                            <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full" />
                          </div>

                          {/* QR Code */}
                          <div className="flex flex-col items-center mb-4">
                            {isExpired ? (
                              <div className="text-center py-4">
                                <FiClock size={32} className="mx-auto mb-2 text-error" />
                                <p className="text-sm text-error font-medium">QR Expirado</p>
                                <button
                                  onClick={() => handleRefreshCoupon(c)}
                                  className="mt-2 btn-outline-accent text-sm flex items-center gap-1 mx-auto"
                                >
                                  <FiRefreshCw size={14} /> Regenerar QR
                                </button>
                              </div>
                            ) : (
                              <>
                                <QRCodeSVG
                                  value={c.token}
                                  size={160}
                                  bgColor="#ffffff"
                                  fgColor="#1B3A5C"
                                  level="M"
                                  includeMargin={false}
                                />
                                <div className="mt-3 text-center">
                                  <p className="font-mono font-bold text-primary-500 text-lg tracking-widest">{c.token}</p>
                                  <div className={`flex items-center gap-1 text-sm mt-1 ${secondsLeft <= 10 ? 'text-error font-bold' : 'text-gray-500'}`}>
                                    <FiClock size={12} />
                                    {secondsLeft > 0 ? `${secondsLeft}s restantes` : 'Expirado'}
                                  </div>
                                  {/* Progress bar */}
                                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-1000 ${secondsLeft <= 10 ? 'bg-error' : 'bg-accent-500'}`}
                                      style={{ width: `${(secondsLeft / 60) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <div className="text-center">
                            <p className="text-xs text-gray-400">
                              Mostrá este QR al comercio para canjear
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Used Coupons */}
            {used.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiCheckCircle className="text-success" size={18} /> Canjeados
                </h2>
                <div className="space-y-3">
                  {used.map((c) => (
                    <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 opacity-60">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">{c.businesses?.name}</p>
                          <p className="font-medium text-gray-900 text-sm">{c.promotions?.title || 'Cupón'}</p>
                          {c.redeemed_at && (
                            <p className="text-xs text-gray-400 mt-1">Canjeado el {new Date(c.redeemed_at).toLocaleDateString('es-AR')}</p>
                          )}
                        </div>
                        <FiCheckCircle className="text-success" size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {active.length === 0 && used.length === 0 && expired.length === 0 && (
              <div className="text-center py-16">
                <FiTag size={48} className="mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">No tenés cupones aún</h2>
                <p className="text-gray-500 mb-6">Explorá las promociones activas y generá tu primer cupón</p>
                <Link href="/promotions" className="btn-accent">Explorar Promociones</Link>
              </div>
            )}
          </>
        )}
      </div>

      <MobileNavBar />
    </div>
  );
}
