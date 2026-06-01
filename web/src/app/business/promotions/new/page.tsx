'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import {
  FiArrowLeft, FiTag, FiCheckCircle, FiCalendar,
  FiPercent, FiInfo, FiZap, FiAlertCircle,
} from 'react-icons/fi';

export default function BusinessNewPromotionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_type: 'percentage',
    discount_percentage: '',
    valid_from: '',
    valid_until: '',
    terms: '',
    max_redemptions: '',
    is_flash: false,
    flash_duration_minutes: '60',
  });

  // Cargar el negocio del usuario logueado
  useEffect(() => {
    // Esperar a que auth termine de cargar
    if (authLoading) return;
    // Si no hay usuario, redirigir al login
    if (!user) {
      router.push('/login');
      return;
    }
    const supabase = createClient();
    if (!supabase) { setPageLoading(false); return; }
    supabase
      .from('businesses')
      .select('id, name, category, is_active')
      .eq('owner_id', user.id)
      .single()
      .then(({ data, error: bizError }: { data: { id: string; name: string; category?: string; is_active?: boolean } | null; error: unknown }) => {
        if (data) setBusiness(data);
        else if (bizError) setError('No se encontró un comercio asociado a tu cuenta.');
        setPageLoading(false);
      });
  }, [user, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setLoading(true);
    setError('');
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }

    const payload: any = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      business_id: business.id,
      is_active: true,
      // Queda pendiente de moderación por el admin
      moderation_status: 'pending',
      is_flash: formData.is_flash,
    };

    if (formData.discount_percentage) {
      payload.discount_percentage = parseFloat(formData.discount_percentage);
    }
    if (formData.valid_from) payload.valid_from = formData.valid_from;
    if (formData.valid_until) payload.valid_until = formData.valid_until;
    if (formData.terms.trim()) payload.terms = formData.terms.trim();
    if (formData.max_redemptions) payload.max_redemptions = parseInt(formData.max_redemptions);
    if (formData.is_flash && formData.flash_duration_minutes) {
      payload.flash_duration_minutes = parseInt(formData.flash_duration_minutes);
    }

    const { error: insertError } = await supabase.from('promotions').insert(payload);

    if (insertError) {
      setError('Error al crear la promoción: ' + insertError.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSuccess(false);
    setFormData({
      title: '', description: '', discount_type: 'percentage',
      discount_percentage: '', valid_from: '', valid_until: '',
      terms: '', max_redemptions: '', is_flash: false, flash_duration_minutes: '60',
    });
  };

  // ── Estados de carga y error ─────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <FiAlertCircle size={40} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Comercio no encontrado</h2>
          <p className="text-gray-500 text-sm mb-6">{error || 'Tu cuenta no tiene un comercio asociado.'}</p>
          <Link href="/business/panel" className="btn-accent">Volver al Panel</Link>
        </div>
      </div>
    );
  }

  // ── Éxito ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">¡Promoción enviada!</h2>
          <p className="text-gray-500 text-sm mb-2">
            Tu promoción fue enviada y está <strong>pendiente de aprobación</strong> por el equipo de Promo Club TDF.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Una vez aprobada, aparecerá automáticamente en la app para todos los usuarios.
          </p>
          <div className="flex gap-3">
            <Link href="/business/panel" className="flex-1 py-3 text-center border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 transition-colors text-sm">
              Volver al Panel
            </Link>
            <button onClick={resetForm} className="flex-1 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors text-sm">
              Crear Otra
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulario ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/business/panel" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Nueva Promoción</h1>
            <p className="text-sm text-gray-500">{business.name} · quedará pendiente de aprobación</p>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto p-4 sm:p-6 pb-16">

        {/* Banner informativo */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 mb-6">
          <FiInfo size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            Tu promoción será revisada por el equipo antes de publicarse. Normalmente tarda menos de 24 horas en aprobarse.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Info básica */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 bg-accent-50 rounded-xl flex items-center justify-center text-accent-500">
                <FiTag size={18} />
              </div>
              <h2 className="font-semibold text-gray-900">Detalles</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Título de la Promoción <span className="text-red-500">*</span>
              </label>
              <input
                type="text" name="title" value={formData.title} onChange={handleChange} required
                maxLength={80}
                placeholder="Ej: 30% OFF en todas las pizzas"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
              <textarea
                name="description" value={formData.description} onChange={handleChange} rows={3}
                placeholder="Contale a los clientes los detalles de la promo..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Términos y Condiciones</label>
              <textarea
                name="terms" value={formData.terms} onChange={handleChange} rows={2}
                placeholder="Ej: No acumulable con otras promociones. Solo en salón..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm resize-none"
              />
            </div>
          </div>

          {/* Descuento */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                <FiPercent size={18} />
              </div>
              <h2 className="font-semibold text-gray-900">Descuento</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo</label>
                <select
                  name="discount_type" value={formData.discount_type} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                >
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Monto fijo ($)</option>
                  <option value="2x1">2x1</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              {formData.discount_type !== '2x1' && formData.discount_type !== 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {formData.discount_type === 'percentage' ? 'Porcentaje (%)' : 'Monto ($)'}
                  </label>
                  <input
                    type="number" name="discount_percentage" value={formData.discount_percentage}
                    onChange={handleChange} min="1"
                    max={formData.discount_type === 'percentage' ? '100' : undefined}
                    placeholder={formData.discount_type === 'percentage' ? 'Ej: 30' : 'Ej: 5000'}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Máximo de canjes <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="number" name="max_redemptions" value={formData.max_redemptions}
                onChange={handleChange} min="1" placeholder="Sin límite"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
              />
            </div>
          </div>

          {/* Vigencia */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                <FiCalendar size={18} />
              </div>
              <h2 className="font-semibold text-gray-900">Vigencia</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Desde</label>
                <input
                  type="date" name="valid_from" value={formData.valid_from} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hasta</label>
                <input
                  type="date" name="valid_until" value={formData.valid_until} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Oferta Flash */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500">
                  <FiZap size={18} />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Oferta Flash</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Urgencia limitada con contador visible</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox" name="is_flash" checked={formData.is_flash}
                  onChange={handleChange} className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500" />
              </label>
            </div>

            {formData.is_flash && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Duración del Flash (minutos)
                </label>
                <select
                  name="flash_duration_minutes" value={formData.flash_duration_minutes} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                >
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="120">2 horas</option>
                  <option value="180">3 horas</option>
                  <option value="360">6 horas</option>
                  <option value="720">12 horas</option>
                </select>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
              <FiAlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <Link
              href="/business/panel"
              className="flex-1 py-3.5 text-center border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 transition-colors text-sm"
            >
              Cancelar
            </Link>
            <button
              type="submit" disabled={loading}
              className="flex-1 py-3.5 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : '⚡ Enviar Promoción'
              }
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
