'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiArrowLeft, FiSave, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminBannerEditPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_type: 'promotion',
    link_url: '',
    is_active: true,
    display_order: 0,
    valid_from: '',
    valid_until: '',
  });

  useEffect(() => { loadBanner(); }, [params.id]);

  const loadBanner = async () => {
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('banners').select('*').eq('id', params.id).single();
    if (data) {
      setFormData({
        title: data.title || '',
        image_url: data.image_url || '',
        link_type: data.link_type || 'promotion',
        link_url: data.link_url || '',
        is_active: data.is_active,
        display_order: data.display_order || 0,
        valid_from: data.valid_from ? new Date(data.valid_from).toISOString().slice(0, 16) : '',
        valid_until: data.valid_until ? new Date(data.valid_until).toISOString().slice(0, 16) : '',
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    if (!supabase) { setSaving(false); return; }
    const { error } = await supabase.from('banners').update({
      ...formData,
      valid_from: formData.valid_from || null,
      valid_until: formData.valid_until || null,
    }).eq('id', params.id);
    if (!error) { setSuccess(true); setTimeout(() => router.push('/admin/banners'), 1500); }
    setSaving(false);
  };

  if (loading) return <AdminShell><div className="text-center py-16"><div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" /></div></AdminShell>;

  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/banners" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FiArrowLeft size={20} className="text-gray-600" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Banner</h1>
            <p className="text-gray-500 text-sm">Actualizar banner destacado</p>
          </div>
        </div>

        {success ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm text-center py-12">
            <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4"><FiCheckCircle size={40} className="text-success" /></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Guardado!</h2>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
              <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" required />
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de enlace</label>
                <select value={formData.link_type} onChange={(e) => setFormData({ ...formData, link_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500">
                  <option value="promotion">Promoción</option>
                  <option value="business">Comercio</option>
                  <option value="external">Externo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de enlace</label>
                <input type="url" value={formData.link_url} onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Válido desde</label>
                <input type="datetime-local" value={formData.valid_from} onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Válido hasta</label>
                <input type="datetime-local" value={formData.valid_until} onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-accent-500" />
              <span className="text-sm text-gray-700">Activo</span>
            </label>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="submit" disabled={saving} className="btn-accent flex items-center gap-2"><FiSave size={16} />{saving ? 'Guardando...' : 'Guardar'}</button>
              <Link href="/admin/banners" className="btn-outline">Cancelar</Link>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}
