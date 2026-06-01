'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { extractCoordsFromGoogleMapsUrl } from '@/lib/google-maps';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiArrowLeft, FiSave, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminBusinessEditPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    google_maps_url: '',
    category: '',
    city: 'Ushuaia',
    is_active: true,
    is_founder: false,
  });

  useEffect(() => {
    loadBusiness();
  }, [params.id]);

  const loadBusiness = async () => {
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', params.id)
      .single();

    if (data) {
      setFormData({
        name: data.name || '',
        description: data.description || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        google_maps_url: data.google_maps_url || '',
        category: data.category || '',
        city: data.city || 'Ushuaia',
        is_active: data.is_active,
        is_founder: data.is_founder,
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    if (!supabase) { setSaving(false); return; }

    // Extract coordinates from Google Maps URL
    const coords = extractCoordsFromGoogleMapsUrl(formData.google_maps_url);
    const updateData: Record<string, unknown> = {
      ...formData,
      latitude: coords?.lat || null,
      longitude: coords?.lng || null,
    };

    const { error } = await supabase
      .from('businesses')
      .update(updateData)
      .eq('id', params.id);

    if (!error) {
      setSuccess(true);
      setTimeout(() => router.push('/admin/businesses'), 1500);
    }
    setSaving(false);
  };

  const categories = [
    'Gastronomía', 'Moda', 'Tecnología', 'Salud', 'Deportes',
    'Hogar', 'Entretenimiento', 'Servicios', 'Educación', 'Otros',
  ];

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
          <Link href="/admin/businesses" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Local</h1>
            <p className="text-gray-500 text-sm">Actualizar información del comercio</p>
          </div>
        </div>

        {success ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm text-center py-12">
            <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle size={40} className="text-success" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Guardado!</h2>
            <p className="text-gray-500">Los cambios se han aplicado correctamente</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">🔗 Link de Google Maps</label>
              <input type="url" value={formData.google_maps_url} onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500"
                placeholder="https://maps.google.com/?q=-54.8019,-68.3030" />
              <p className="text-xs text-gray-400 mt-1">Las coordenadas se extraen automáticamente</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500">
                  <option>Ushuaia</option>
                  <option>Río Grande</option>
                  <option>Tolhuin</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-accent-500 focus:ring-accent-500" />
                <span className="text-sm text-gray-700">Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_founder} onChange={(e) => setFormData({ ...formData, is_founder: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-accent-500 focus:ring-accent-500" />
                <span className="text-sm text-gray-700">📍 Fundador (pin dorado)</span>
              </label>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="submit" disabled={saving} className="btn-accent flex items-center gap-2">
                <FiSave size={16} />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <Link href="/admin/businesses" className="btn-outline">Cancelar</Link>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}
