'use client';

import { useEffect, useState } from 'react';
import { LogoImage } from '../ui/LogoImage';

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Animar la barra de progreso en 1500ms
    const totalDuration = 1500;
    const steps = 60;
    const interval = totalDuration / steps;
    let current = 0;

    const progressTimer = setInterval(() => {
      current += 1;
      // Easing: rápido al principio, se frena al final
      const eased = Math.min(100, Math.round((1 - Math.pow(1 - current / steps, 3)) * 100));
      setProgress(eased);
      if (current >= steps) clearInterval(progressTimer);
    }, interval);

    // Fade out a los 1800ms
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setShow(false);
        document.body.style.overflow = 'auto';
      }, 400);
    }, 1800);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(fadeTimer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center transition-opacity duration-400 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'linear-gradient(135deg, #071220 0%, #0F2440 50%, #071220 100%)' }}
    >
      {/* Orb de fondo sutil — sin pulse, solo presencia */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(245,130,32,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative flex flex-col items-center gap-10">
        {/* Logo — sin anillos giratorios, limpio */}
        <div className="relative flex items-center justify-center">
          {/* Halo estático de marca */}
          <div
            className="absolute w-36 h-36 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(245,130,32,0.15) 0%, transparent 70%)',
              filter: 'blur(16px)',
            }}
          />
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center border-2 border-[#F58220]/60 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 32px rgba(245,130,32,0.2), 0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <LogoImage className="w-[80%] h-[80%] object-contain" fallbackBg="transparent" />
          </div>
        </div>

        {/* Texto y barra de progreso */}
        <div className="flex flex-col items-center gap-5 w-56">
          <div className="text-center">
            <p className="text-white text-lg font-semibold tracking-wide">Promo Club TDF</p>
            <p className="text-white/40 text-xs mt-1 font-normal">Descuentos en Tierra del Fuego</p>
          </div>

          {/* Barra de progreso con dot animado */}
          <div className="w-full">
            <div
              className="w-full h-0.5 rounded-full overflow-visible relative"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <div
                className="h-full rounded-full relative transition-all duration-75"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #F58220, #ffb870)',
                }}
              >
                {/* Dot brillante en el extremo */}
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                  style={{
                    background: 'white',
                    boxShadow: '0 0 6px rgba(245,130,32,1), 0 0 12px rgba(245,130,32,0.6)',
                    transform: 'translateY(-50%) translateX(50%)',
                  }}
                />
              </div>
            </div>
            <p
              className="text-right text-[10px] mt-2 font-medium tabular-nums"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              {progress}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
