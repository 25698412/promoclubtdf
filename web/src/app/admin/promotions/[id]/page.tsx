'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiArrowLeft, FiSave, FiCheckCircle, FiZap } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminPromotionEditPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    discount_text: '',
    business_id: '',
    is_flash: false,
    flash_duration_minutes: '',
    scheduled_start: '',
    scheduled_end: '',
    valid_from: '',
    valid_until: '',
    is_active: true,
    moderation_status: 'pending',
  });

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    const [promoRes, bizRes] = await Promise.all([
      supabase.from('promotions').select('*').eq('id', params.id).single(),
      supabase.from('businesses').select('id, name').order('name'),
    ]);

    if (promoRes.data) {
      const p = promoRes.data;
      setFormData({
        title: p.title || '',
        description: p.description || '',
        discount_percentage: p.discount_percentage?.toString() || '',
        discount_text: p.discount_text || '',
        business_id: p.business_id || '',
        is_flash: p.is_flash,
        flash_duration_minutes: p.flash_duration_minutes?.toString() || '',
        scheduled_start: p.scheduled_start ? new Date(p.scheduled_start).toISOString().slice(0, 16) : '',
        scheduled_end: p.scheduled_end ? new Date(p.scheduled_end).toISOString().slice(0, 16) : '',
        valid_from: p.valid_from ? new Date(p.valid_from).toISOString().slice(0, 10) : '',
        valid_until: p.valid_until ? new Date(p.valid_until).toISOString().slice(0, 10) : '',
        is_active: p.is_active,
        moderation_status: p.moderation_status || 'pending',
      });
    }
    setBusinesses(bizRes.data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    if (!supabase) { setSaving(false); return; }

    const updateData: Record<string, unknown> = {
      title: formData.title,
      description: formData.description,
      discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : null,
      discount_text: formData.discount_text || null,
      business_id: formData.business_id || null,
      is_flash: formData.is_flash,
      flash_duration_minutes: formData.flash_duration_minutes ? parseInt(formData.flash_duration_minutes) : null,
      scheduled_start: formData.scheduled_start || null,
      scheduled_end: formData.scheduled_end || null,
      valid_from: formData.valid_from || null,
      valid_until: formData.valid_until || null,
      is_active: formData.is_active,
      moderation_status: formData.moderation_status,
    };

    const { error } = await supabase
      .from('promotions')
      .update(updateData)
      .eq('id', params.id);

    if (!error) {
      setSuccess(true);
      setTimeout(() => router.push('/admin/promotions'), 1500);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/promotions" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Promoción</h1>
            <p className="text-gray-500 text-sm">Actualizar detalles y configuración</p>
          </div>
        </div>

        {success ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm text-center py-12">
            <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle size={40} className="text-success" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Guardado!</h2>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comercio</label>
                <select value={formData.business_id} onChange={(e) => setFormData({ ...formData, business_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500">
                  <option value="">Seleccionar comercio</option>
                  {businesses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
                <input type="number" value={formData.discount_percentage} onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" min="0" max="100" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" rows={3} />
              </div>
            </div>

            {/* Flash Offer */}
            <div className="border-t border-gray-100 pt-4">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input type="checkbox" checked={formData.is_flash} onChange={(e) => setFormData({ ...formData, is_flash: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-warning focus:ring-warning" />
                <FiZap size={14} className="text-warning" />
                <span className="text-sm font-medium text-gray-700">Oferta Flash</span>
              </label>
              {formData.is_flash && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos)</label>
                  <input type="number" value={formData.flash_duration_minutes} onChange={(e) => setFormData({ ...formData, flash_duration_minutes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" min="5" max="1440" />
                </div>
              )}
            </div>

            {/* Scheduling */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Programación</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Inicio programado</label>
                  <input type="datetime-local" value={formData.scheduled_start} onChange={(e) => setFormData({ ...formData, scheduled_start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Fin programado</label>
                  <input type="datetime-local" value={formData.scheduled_end} onChange={(e) => setFormData({ ...formData, scheduled_end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="border-t border-gray-100 pt-4 flex items-center gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Moderación</label>
                <select value={formData.moderation_status} onChange={(e) => setFormData({ ...formData, moderation_status: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500">
                  <option value="pending">⏳ Pendiente</option>
                  <option value="approved">✅ Aprobada</option>
                  <option value="rejected">❌ Rechazada</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-accent-500 focus:ring-accent-500" />
                <span className="text-sm text-gray-700">Activa</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="submit" disabled={saving} className="btn-accent flex items-center gap-2">
                <FiSave size={16} />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <Link href="/admin/promotions" className="btn-outline">Cancelar</Link>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}
