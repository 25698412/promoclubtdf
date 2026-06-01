'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiArrowLeft, FiCheckCircle, FiGift } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminNewRewardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points_cost: '',
    stock: '',
    business_id: '',
    image_url: '',
  });

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.from('businesses').select('id, name').order('name').then(({ data }: { data: { id: string; name: string }[] | null }) => {
      if (data) setBusinesses(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    const { error } = await supabase.from('rewards').insert({
      name: formData.name,
      description: formData.description || null,
      points_cost: parseInt(formData.points_cost),
      stock: parseInt(formData.stock) || 0,
      business_id: formData.business_id || null,
      image_url: formData.image_url || null,
    });
    if (!error) setSuccess(true);
    setLoading(false);
  };

  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/rewards" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FiArrowLeft size={20} className="text-gray-600" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nuevo Premio</h1>
            <p className="text-gray-500 text-sm">Crear un premio canjeable por puntos</p>
          </div>
        </div>

        {success ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm text-center py-12">
            <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4"><FiCheckCircle size={40} className="text-success" /></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Premio creado!</h2>
            <div className="flex gap-3 justify-center mt-4">
              <Link href="/admin/rewards" className="btn-accent">Ver Premios</Link>
              <button onClick={() => { setSuccess(false); setFormData({ name: '', description: '', points_cost: '', stock: '', business_id: '', image_url: '' }); }}
                className="btn-outline-accent">Crear Otro</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-400"><FiGift size={20} /></div>
              <div><p className="font-medium text-gray-900">Información del Premio</p><p className="text-xs text-gray-500">Datos básicos del premio</p></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" required placeholder="Ej: Café Gratis" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" rows={2} placeholder="Descripción breve del premio" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo en puntos</label>
                <input type="number" value={formData.points_cost} onChange={(e) => setFormData({ ...formData, points_cost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" required min="1" placeholder="100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock disponible</label>
                <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" min="0" placeholder="10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comercio asociado</label>
              <select value={formData.business_id} onChange={(e) => setFormData({ ...formData, business_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500">
                <option value="">Sin comercio específico</option>
                {businesses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen (opcional)</label>
              <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500" placeholder="https://..." />
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="submit" disabled={loading} className="btn-accent flex items-center gap-2">
                <FiGift size={16} />{loading ? 'Creando...' : 'Crear Premio'}
              </button>
              <Link href="/admin/rewards" className="btn-outline">Cancelar</Link>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}
