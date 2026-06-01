'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { LogoImage } from '@/components/ui/LogoImage';
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiEye, FiEyeOff, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Por favor completá tu nombre y apellido');
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Por favor ingresá un email válido');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
    } else if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || null,
          city: formData.city || null,
        });

      if (profileError) {
        setError(profileError.message);
      } else {
        router.push('/dashboard');
      }
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) setError(error.message);
  };

  const passwordStrength = (password: string) => {
    if (password.length === 0) return { level: 0, text: '', color: '' };
    if (password.length < 6) return { level: 1, text: 'Débil', color: 'bg-error' };
    if (password.length < 10) return { level: 2, text: 'Media', color: 'bg-[#F58220]' };
    return { level: 3, text: 'Fuerte', color: 'bg-success' };
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-[#F58220]/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-[#F58220]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />

      {/* Back to Home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors z-10"
      >
        <FiArrowLeft size={18} />
        <span className="hidden sm:inline">Volver al inicio</span>
      </Link>

      {/* Register Card */}
      <div className="relative w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center border-[3px] border-[#F58220] bg-white overflow-hidden mx-auto transition-all duration-300 group-hover:scale-105"
              style={{
                boxShadow: '0 0 30px rgba(245, 130, 32, 0.25), 0 8px 32px rgba(0,0,0,0.15)',
              }}
            >
              <LogoImage className="w-[80%] h-[80%] object-contain" fallbackBg="white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-6">Creá tu cuenta</h1>
          <p className="text-white/70 mt-2">Unite a Promo Club TDF y empezá a ahorrar</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= 1 ? 'bg-[#F58220] text-white' : 'bg-white/20 text-white/60'}`}>
              {step > 1 ? <FiCheckCircle size={16} /> : '1'}
            </div>
            <span className="text-sm text-white/80 hidden sm:inline">Datos</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-[#F58220]' : 'bg-white/20'}`} />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= 2 ? 'bg-[#F58220] text-white' : 'bg-white/20 text-white/60'}`}>
              2
            </div>
            <span className="text-sm text-white/80 hidden sm:inline">Seguridad</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-100 rounded-xl flex items-start gap-3 animate-shake">
              <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Juan"
                    leftIcon={<FiUser size={18} />}
                    required
                  />
                  <Input
                    label="Apellido"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Pérez"
                    leftIcon={<FiUser size={18} />}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  leftIcon={<FiMail size={18} />}
                  required
                />

                {/* Continue Button - Orange */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #F58220 0%, #e0711a 100%)',
                    boxShadow: '0 4px 15px rgba(245, 130, 32, 0.35)',
                  }}
                >
                  Continuar
                </button>
              </>
            ) : (
              <>
                <div className="relative">
                  <Input
                    label="Contraseña"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    leftIcon={<FiLock size={18} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    }
                    required
                    minLength={6}
                  />
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${strength.color}`}
                            style={{ width: `${(strength.level / 3) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{strength.text}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  label="Teléfono (opcional)"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+54 9 2901 123456"
                  leftIcon={<FiPhone size={18} />}
                />

                <Input
                  label="Ciudad (opcional)"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ushuaia"
                  leftIcon={<FiMapPin size={18} />}
                />

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Volver al paso anterior
                </button>

                {/* Register Button - Orange */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-300 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                  style={{
                    background: 'linear-gradient(135deg, #F58220 0%, #e0711a 100%)',
                    boxShadow: '0 4px 15px rgba(245, 130, 32, 0.35)',
                  }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>
              </>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-400">o registrate con</span>
            </div>
          </div>

          {/* Google Sign Up - Full width */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Continuar con Google</span>
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center mt-8 text-white/80">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-white font-semibold hover:text-[#F58220] transition-colors">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
