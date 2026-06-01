'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui';
import { FiArrowLeft, FiImage, FiCheckCircle, FiUpload } from 'react-icons/fi';

export default function AdminNewBannerPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', link_url: '', position: 'home_top',
    start_date: '', end_date: '', is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('banners').insert({
      title: formData.title,
      description: formData.description,
      link_url: formData.link_url,
      position: formData.position,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      is_active: formData.is_active,
    });

    if (error) {
      alert('Error al crear el banner: ' + error.message);
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
              <Link href="/admin/banners" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nuevo Banner</h1>
                <p className="text-gray-500 text-sm">Crear un banner promocional para la plataforma</p>
              </div>
            </div>

            {success ? (
              <Card className="text-center py-12">
                <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle size={40} className="text-success" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">¡Banner creado!</h2>
                <p className="text-gray-500 mb-6">El banner ya está configurado en la plataforma</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/admin/banners" className="btn-accent">Ver Banners</Link>
                  <button onClick={() => { setSuccess(false); setFormData({ title: '', description: '', link_url: '', position: 'home_top', start_date: '', end_date: '', is_active: true }); }}
                    className="btn-outline-accent">Crear Otro</button>
                </div>
              </Card>
            ) : (
              <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-success-50 rounded-xl flex items-center justify-center text-success">
                      <FiImage size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Información del Banner</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Título del Banner *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required
                      placeholder="Ej: Ofertas de Invierno"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={2}
                      placeholder="Texto que acompaña el banner..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm resize-none" />
                  </div>

                  {/* Image Upload Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagen del Banner</label>
                    <div className="w-full h-48 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-500 hover:bg-accent-50/30 transition-all">
                      <FiUpload size={32} className="text-gray-300 mb-2" />
                      <p className="text-sm font-medium text-gray-500">Arrastrá o hacé click para subir</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB · Recomendado: 1200×400px</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">URL de destino</label>
                      <input type="url" name="link_url" value={formData.link_url} onChange={handleChange}
                        placeholder="https://..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Posición *</label>
                      <select name="position" value={formData.position} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm">
                        <option value="home_top">Inicio - Superior</option>
                        <option value="home_middle">Inicio - Medio</option>
                        <option value="promotions_top">Promociones - Superior</option>
                        <option value="sidebar">Sidebar</option>
                      </select>
                    </div>
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

                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="is_active" checked={formData.is_active}
                      onChange={handleChange} id="is_active"
                      className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500" />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                      Activar banner inmediatamente
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Link href="/admin/banners"
                      className="flex-1 py-3 text-center border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 transition-colors">
                      Cancelar
                    </Link>
                    <button type="submit" disabled={loading}
                      className="flex-1 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors flex items-center justify-center gap-2">
                      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Crear Banner'}
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
