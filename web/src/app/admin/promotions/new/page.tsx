'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui';
import { FiArrowLeft, FiTag, FiCheckCircle, FiCalendar, FiPercent } from 'react-icons/fi';

export default function AdminNewPromotionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '', description: '', business_id: '', discount_type: 'percentage',
    discount_value: '', start_date: '', end_date: '', terms: '',
    max_redemptions: '', category: '',
  });

  useEffect(() => {
    supabase.from('businesses').select('id, name').then(({ data }: { data: { id: string; name: string }[] | null }) => {
      if (data) setBusinesses(data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('promotions').insert({
      title: formData.title,
      description: formData.description,
      business_id: formData.business_id || null,
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      terms: formData.terms,
      max_redemptions: formData.max_redemptions ? parseInt(formData.max_redemptions) : null,
      status: 'active',
    });

    if (error) {
      alert('Error al crear la promoción: ' + error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar onLogout={handleLogout} userName="Admin" userRole="Administrador" />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header userName="Admin" onLogout={handleLogout} variant="admin" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/admin/promotions" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nueva Promoción</h1>
                <p className="text-gray-500 text-sm">Crear una nueva oferta o descuento</p>
              </div>
            </div>

            {success ? (
              <Card className="text-center py-12">
                <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle size={40} className="text-success" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">¡Promoción creada!</h2>
                <p className="text-gray-500 mb-6">La promoción ya está visible para los usuarios</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/admin/promotions" className="btn-accent">Ver Promociones</Link>
                  <button onClick={() => { setSuccess(false); setFormData({ title: '', description: '', business_id: '', discount_type: 'percentage', discount_value: '', start_date: '', end_date: '', terms: '', max_redemptions: '', category: '' }); }}
                    className="btn-outline-accent">Crear Otra</button>
                </div>
              </Card>
            ) : (
              <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center text-accent-500">
                      <FiTag size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Detalles de la Promoción</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Título de la Promoción *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required
                      placeholder="Ej: 50% OFF en Hamburguesas"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                      placeholder="Describí la promoción en detalle..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm resize-none" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Comercio *</label>
                      <select name="business_id" value={formData.business_id} onChange={handleChange} required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm">
                        <option value="">Seleccionar comercio</option>
                        {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
                      <select name="category" value={formData.category} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm">
                        <option value="">Seleccionar</option>
                        {['Gastronomía', 'Moda', 'Tecnología', 'Salud', 'Deportes', 'Hogar'].map(c =>
                          <option key={c} value={c}>{c}</option>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="flex items-center gap-3 pb-2 pt-2 border-b border-gray-100">
                    <FiPercent size={16} className="text-accent-500" />
                    <h3 className="font-medium text-gray-900">Descuento</h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Descuento *</label>
                      <select name="discount_type" value={formData.discount_type} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm">
                        <option value="percentage">Porcentaje (%)</option>
                        <option value="fixed">Monto fijo ($)</option>
                        <option value="2x1">2x1</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Valor del Descuento *</label>
                      <input type="number" name="discount_value" value={formData.discount_value} onChange={handleChange} required
                        placeholder={formData.discount_type === 'percentage' ? 'Ej: 50' : 'Ej: 5000'}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-3 pb-2 pt-2 border-b border-gray-100">
                    <FiCalendar size={16} className="text-accent-500" />
                    <h3 className="font-medium text-gray-900">Vigencia</h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Inicio</label>
                      <input type="date" name="start_date" value={formData.start_date} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Fin</label>
                      <input type="date" name="end_date" value={formData.end_date} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Máximo de canjes (opcional)</label>
                    <input type="number" name="max_redemptions" value={formData.max_redemptions} onChange={handleChange}
                      placeholder="Sin límite"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Términos y Condiciones</label>
                    <textarea name="terms" value={formData.terms} onChange={handleChange} rows={2}
                      placeholder="Ej: No acumulable con otras promociones..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm resize-none" />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Link href="/admin/promotions"
                      className="flex-1 py-3 text-center border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 transition-colors">
                      Cancelar
                    </Link>
                    <button type="submit" disabled={loading}
                      className="flex-1 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors flex items-center justify-center gap-2">
                      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Crear Promoción'}
                    </button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
