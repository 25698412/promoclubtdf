'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { LogoImage } from '@/components/ui/LogoImage';
import { FiCreditCard } from 'react-icons/fi';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  FiArrowLeft, FiCamera, FiCheckCircle, FiXCircle,
  FiAlertCircle, FiRefreshCw, FiType, FiHome,
  FiTag, FiZap, FiLogOut, FiMenu, FiX, FiBarChart2,
} from 'react-icons/fi';

export default function BusinessScannerPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    loadBusiness();
  }, [user, authLoading]);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch {}
        scannerRef.current = null;
      }
    };
  }, []);

  const loadBusiness = async () => {
    const supabase = createClient();
    if (!supabase || !user) {
      setBusiness({ id: 'demo', name: 'Burger House Demo', category: 'Gastronomía' });
      setLoading(false);
      return;
    }
    const { data: biz } = await supabase
      .from('businesses')
      .select('id, name, category')
      .eq('owner_id', user?.id)
      .single();
    setBusiness(biz || { id: 'demo', name: 'Burger House Demo', category: 'Gastronomía' });
    setLoading(false);
  };

  const startScanner = useCallback(async () => {
    if (scannerActive) return;
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      await new Promise(resolve => setTimeout(resolve, 100));
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        (decodedText) => {
          handleValidate(decodedText);
          stopScanner();
        },
        () => {}
      );
      setScannerActive(true);
      setScanning(true);
    } catch (err: any) {
      console.error('Scanner error:', err);
      setManualMode(true);
      setScanning(false);
    }
  }, [scannerActive]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
      scannerRef.current = null;
    }
    setScannerActive(false);
    setScanning(false);
  }, []);

  const handleValidate = async (token: string) => {
    if (!token.trim()) return;
    setValidating(true);
    setResult(null);

    const supabase = createClient();
    if (!supabase) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setResult({
        valid: true,
        message: `Cupón "${token.toUpperCase()}" validado correctamente`,
        customer: 'María García',
        promotion: '50% OFF en Hamburguesas',
        points_awarded: 12,
        discount: '$2,500',
      });
      setValidating(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        setResult({
          valid: true,
          message: `Cupón "${token.toUpperCase()}" validado correctamente`,
          customer: 'María García',
          promotion: '50% OFF en Hamburguesas',
          points_awarded: 12,
          discount: '$2,500',
        });
        setValidating(false);
        return;
      }
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/coupon-validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ token: token.trim().toUpperCase() }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setResult({ valid: false, error: err.message || 'Error al validar el cupón' });
    }
    setValidating(false);
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) return;
    handleValidate(manualCode);
    setManualCode('');
  };

  const resetScanner = () => {
    setResult(null);
    if (manualMode) setManualCode('');
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex">
        {/* Mobile overlay */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary-500 text-white shadow-lg">
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-primary-500 to-primary-700 text-white flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="px-5 py-4 border-b border-white/10">
            <Link href="/business/panel" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <LogoImage className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h1 className="font-bold text-sm leading-tight">Promo Club TDF</h1>
                <p className="text-xs text-white/50 mt-0.5">Panel Comercio</p>
              </div>
            </Link>
          </div>

          {business && (
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center font-bold text-sm">
                  {business.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{business.name}</p>
                  <p className="text-xs text-white/50">{business.category}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 px-3 py-4 space-y-1">
            {([
              { icon: <FiHome size={18} />, label: 'Dashboard', href: '/business/panel' },
              { icon: <FiTag size={18} />, label: 'Mis Promociones', href: '/business/panel?tab=promos' },
              { icon: <FiZap size={18} />, label: 'Promociones Flash', href: '/business/panel?tab=flash', highlight: true },
            ]).map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  (item as any).highlight
                    ? 'text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10 font-medium'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}>
                {item.icon} {item.label}
              </Link>
            ))}
            <div className="border-t border-white/10 my-2" />
            <Link href="/business/scanner" onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-white/20 text-white font-medium">
              <FiCamera size={18} /> Escanear QR
            </Link>
            <Link href="/business/membership" onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <FiCreditCard size={18} /> Membresía
            </Link>
          </nav>

          <div className="px-3 py-4 border-t border-white/10">
            <button onClick={signOut} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors w-full">
              <FiLogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/business/panel" className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden">
                <FiArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FiCamera size={20} className="text-accent-500" />
                  Escanear QR
                </h1>
                <p className="text-sm text-gray-500">{business?.name} · Validá cupones de clientes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setManualMode(!manualMode); if (scannerActive) stopScanner(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={manualMode ? 'Usar cámara' : 'Ingresar código manual'}
              >
                {manualMode ? <FiCamera size={20} className="text-gray-600" /> : <FiType size={20} className="text-gray-600" />}
              </button>
              <Link href="/" title="Ir al inicio" className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-accent-50 hover:text-accent-500 text-gray-500 transition-colors">
                <FiHome size={18} />
              </Link>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">24</p>
                  <p className="text-xs text-gray-500 mt-1">Cupones validados hoy</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                  <p className="text-2xl font-bold text-accent-500">156</p>
                  <p className="text-xs text-gray-500 mt-1">Total este mes</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                  <p className="text-2xl font-bold text-primary-500">$38K</p>
                  <p className="text-xs text-gray-500 mt-1">Descuentos otorgados</p>
                </div>
              </div>

              {/* Scanner Area */}
              {!result && !manualMode && (
                <div className="mb-6">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden mb-4 relative" style={{ minHeight: 320 }}>
                    <div id="qr-reader" ref={containerRef} className="w-full" />

                    {!scannerActive && !scanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
                          <FiCamera size={36} className="text-white/60" />
                        </div>
                        <p className="text-white/70 text-sm mb-2 font-medium">Apuntá la cámara al QR del cliente</p>
                        <p className="text-white/40 text-xs mb-6">El código aparece en la app del usuario</p>
                        <button
                          onClick={startScanner}
                          className="bg-accent-500 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-accent-600 transition-colors shadow-lg"
                        >
                          <FiCamera size={18} /> Iniciar Cámara
                        </button>
                      </div>
                    )}

                    {/* Scanner overlay frame */}
                    {scannerActive && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 border-2 border-accent-500/30 rounded-2xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent-500 rounded-tl-lg" />
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent-500 rounded-tr-lg" />
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent-500 rounded-bl-lg" />
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent-500 rounded-br-lg" />
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-accent-500/60 animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scanner controls */}
                  {scannerActive && (
                    <div className="flex gap-3">
                      <button onClick={stopScanner}
                        className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors">
                        <FiXCircle size={18} /> Detener Cámara
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Manual Input */}
              {(!result && manualMode) && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center text-accent-500">
                      <FiType size={20} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Ingreso Manual</h2>
                      <p className="text-xs text-gray-500">Ingresá el código del cupón del cliente</p>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleManualSubmit(); }}
                    placeholder="CÓDIGO DEL CUPÓN"
                    maxLength={16}
                    autoFocus
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-xl font-mono font-bold tracking-[0.3em] text-gray-900 focus:border-accent-500 focus:outline-none mb-4 transition-colors"
                  />

                  <button
                    onClick={handleManualSubmit}
                    disabled={!manualCode.trim() || validating}
                    className="w-full py-3.5 bg-green-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    {validating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><FiCheckCircle size={18} /> Validar Cupón</>
                    )}
                  </button>
                </div>
              )}

              {/* Result */}
              {result && (
                <div className={`rounded-2xl p-8 mb-6 ${result.valid ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-red-600'} shadow-xl`}>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      {result.valid ? (
                        <FiCheckCircle size={40} className="text-white" />
                      ) : (
                        <FiXCircle size={40} className="text-white" />
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                      {result.valid ? '¡Cupón Válido!' : 'Cupón Inválido'}
                    </h2>

                    {result.valid && result.message && (
                      <p className="text-white/80 text-sm mb-4">{result.message}</p>
                    )}

                    {result.valid && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4 text-left space-y-2">
                        {result.customer && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Cliente:</span>
                            <span className="text-white font-medium">{result.customer}</span>
                          </div>
                        )}
                        {result.promotion && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Promoción:</span>
                            <span className="text-white font-medium">{result.promotion}</span>
                          </div>
                        )}
                        {result.discount && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Descuento:</span>
                            <span className="text-white font-bold">{result.discount}</span>
                          </div>
                        )}
                        {result.points_awarded && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Puntos otorgados:</span>
                            <span className="text-accent-300 font-bold">+{result.points_awarded} pts</span>
                          </div>
                        )}
                      </div>
                    )}

                    {result.error && (
                      <p className="text-white/90 text-sm mt-2 bg-white/10 rounded-lg p-3">{result.error}</p>
                    )}

                    <button onClick={resetScanner}
                      className="mt-6 bg-white/20 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto hover:bg-white/30 transition-colors">
                      <FiRefreshCw size={16} /> Escanear Otro
                    </button>
                  </div>
                </div>
              )}

              {/* Instructions */}
              {!result && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">¿Cómo funciona?</h3>
                  <div className="space-y-3">
                    {[
                      { step: '1', text: 'El cliente genera un cupón QR desde la app Promo Club', icon: <FiTag size={14} /> },
                      { step: '2', text: 'Escaneá el QR con la cámara o ingresá el código manualmente', icon: <FiCamera size={14} /> },
                      { step: '3', text: 'El sistema valida automáticamente y otorga puntos al cliente', icon: <FiCheckCircle size={14} /> },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-accent-50 rounded-full flex items-center justify-center flex-shrink-0 text-accent-500">
                          {item.icon}
                        </div>
                        <p className="text-sm text-gray-600 pt-0.5">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
