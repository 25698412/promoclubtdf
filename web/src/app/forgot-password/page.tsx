'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { LogoImage } from '@/components/ui/LogoImage';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-40 h-40 bg-accent-500/20 rounded-full blur-3xl animate-float" />
      <Link href="/login" className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
        <FiArrowLeft size={18} /> <span className="hidden sm:inline">Volver</span>
      </Link>

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl mx-auto overflow-hidden">
            <LogoImage className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mt-6">¿Olvidaste tu contraseña?</h1>
          <p className="text-white/70 mt-2">Te enviamos un email para recuperarla</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <FiCheckCircle size={48} className="text-success mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">¡Email enviado!</h3>
              <p className="text-gray-500 text-sm mb-6">Revisá tu bandeja de entrada y seguí las instrucciones.</p>
              <Link href="/login" className="btn-primary w-full justify-center">Volver al login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-error-50 border border-error-100 rounded-xl text-sm text-error-700">{error}</div>
              )}
              <div className="space-y-1.5">
                <label className="input-label">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-accent w-full justify-center"
              >
                {loading ? 'Enviando...' : 'Enviar instrucciones'}
              </button>
              <p className="text-center text-sm text-gray-500">
                <Link href="/login" className="text-accent-500 hover:text-accent-600 font-medium">Volver al inicio de sesión</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
