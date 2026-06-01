'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import {
  FiArrowLeft, FiCamera, FiCheckCircle, FiXCircle,
  FiAlertCircle, FiRefreshCw, FiType,
} from 'react-icons/fi';

export default function BusinessScannerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    // Demo mode: no login required
    loadBusiness();
  }, [user, authLoading]);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch {}
        scannerRef.current = null;
      }
    };
  }, []);

  const loadBusiness = async () => {
    const supabase = createClient();
    if (!supabase || !user) {
      setBusiness({ id: 'demo', name: 'Mi Comercio Demo' });
      setLoading(false);
      return;
    }
    const { data: biz } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('owner_id', user?.id)
      .single();
    setBusiness(biz || { id: 'demo', name: 'Mi Comercio Demo' });
    setLoading(false);
  };

  const startScanner = useCallback(async () => {
    if (scannerActive) return;

    try {
      const { Html5Qrcode } = await import('html5-qrcode');

      // Wait for DOM element
      await new Promise(resolve => setTimeout(resolve, 100));

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // QR scanned successfully
          handleValidate(decodedText);
          stopScanner();
        },
        () => {
          // QR not found in frame — ignore
        }
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
      try {
        await scannerRef.current.stop();
      } catch {}
      scannerRef.current = null;
    }
    setScannerActive(false);
    setScanning(false);
  }, []);

  const handleValidate = async (token: string) => {
    if (!token.trim()) return;
    setValidating(true);
    setResult(null);

    // Demo mode: no Supabase or no session
    const supabase = createClient();
    if (!supabase) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setResult({
        valid: true,
        message: `Cupón "${token.toUpperCase()}" validado (demo)`,
        points_awarded: 12,
      });
      setValidating(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // No session = demo mode
        await new Promise(resolve => setTimeout(resolve, 1200));
        setResult({
          valid: true,
          message: `Cupón "${token.toUpperCase()}" validado (demo)`,
          points_awarded: 12,
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
      setResult({ valid: false, error: err.message || 'Error al validar' });
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
    if (manualMode) {
      setManualCode('');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-24 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <Link href="/business/panel" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Escanear QR</h1>
            <p className="text-sm text-gray-500">{business?.name || 'Comercio'}</p>
          </div>
          <button
            onClick={() => { setManualMode(!manualMode); if (scannerActive) stopScanner(); }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={manualMode ? 'Usar cámara' : 'Ingresar código manual'}
          >
            {manualMode ? <FiCamera size={20} className="text-gray-600" /> : <FiType size={20} className="text-gray-600" />}
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4">
        {/* Scanner Area */}
        {!result && !manualMode && (
          <div className="mb-6">
            {/* QR Reader Container */}
            <div className="bg-black rounded-2xl overflow-hidden mb-4 relative" style={{ minHeight: 300 }}>
              <div id="qr-reader" ref={containerRef} className="w-full" />

              {!scannerActive && !scanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <FiCamera size={48} className="text-white/50 mb-4" />
                  <p className="text-white/70 text-sm mb-4">Apuntá la cámara al QR del cliente</p>
                  <button
                    onClick={startScanner}
                    className="bg-accent-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-accent-600 transition-colors"
                  >
                    <FiCamera size={18} /> Iniciar Cámara
                  </button>
                </div>
              )}
            </div>

            {/* Scanner controls */}
            {scannerActive && (
              <div className="flex gap-3">
                <button
                  onClick={stopScanner}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-600"
                >
                  <FiXCircle size={18} /> Detener
                </button>
              </div>
            )}
          </div>
        )}

        {/* Manual Input */}
        {(!result && manualMode) && (
          <div className="bg-white rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center text-accent-500">
                <FiType size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Código Manual</h2>
                <p className="text-xs text-gray-500">Ingresá el código del cupón</p>
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
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-xl font-mono font-bold tracking-[0.3em] text-gray-900 focus:border-accent-500 focus:outline-none mb-4"
            />

            <button
              onClick={handleManualSubmit}
              disabled={!manualCode.trim() || validating}
              className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 disabled:opacity-50"
            >
              {validating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiCheckCircle size={18} /> Validar Cupón
                </>
              )}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`rounded-2xl p-6 mb-6 ${result.valid ? 'bg-green-500' : 'bg-red-500'}`}>
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

              {result.valid && result.points_awarded && (
                <p className="text-white/90 text-lg mb-1">
                  +{result.points_awarded} puntos otorgados
                </p>
              )}

              {result.valid && result.message && (
                <p className="text-white/70 text-sm mb-4">{result.message}</p>
              )}

              {result.error && (
                <p className="text-white/90 text-sm mb-4">{result.error}</p>
              )}

              <button
                onClick={resetScanner}
                className="mt-4 bg-white/20 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto hover:bg-white/30 transition-colors"
              >
                <FiRefreshCw size={16} /> Escanear otro
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!result && (
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="text-white/90 font-semibold text-sm mb-2">¿Cómo funciona?</h3>
            <ol className="text-white/60 text-xs space-y-1 list-decimal list-inside">
              <li>El cliente genera un cupón QR desde la app</li>
              <li>Escaneá el QR o ingresá el código manualmente</li>
              <li>El sistema valida y otorga puntos automáticamente</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
