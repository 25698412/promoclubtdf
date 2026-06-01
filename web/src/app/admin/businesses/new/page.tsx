'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui';
import { FiArrowLeft, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';

export default function AdminNewBusinessPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: '', description: '', address: '',
    city: 'Ushuaia', phone: '', email: '', owner_name: '', cuit: '',
  });

  const categories = [
    'Gastronomía', 'Moda', 'Tecnología', 'Salud', 'Deportes',
    'Hogar', 'Entretenimiento', 'Servicios', 'Educación', 'Otros',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('businesses').insert({
      name: formData.name,
      category: formData.category,
      description: formData.description,
      address: formData.address,
      city: formData.city,
      phone: formData.phone,
      email: formData.email,
      owner_name: formData.owner_name,
      status: 'active',
    });

    if (error) {
      alert('Error al crear el local: ' + error.message);
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
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/admin/businesses" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nuevo Local</h1>
                <p className="text-gray-500 text-sm">Registrar un nuevo comercio en la plataforma</p>
              </div>
            </div>

            {success ? (
              <Card className="text-center py-12">
                <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle size={40} className="text-success" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">¡Local creado exitosamente!</h2>
                <p className="text-gray-500 mb-6">El comercio ya está visible en la plataforma</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/admin/businesses" className="btn-accent">Ver Locales</Link>
                  <button onClick={() => { setSuccess(false); setFormData({ name: '', category: '', description: '', address: '', city: 'Ushuaia', phone: '', email: '', owner_name: '', cuit: '' }); }}
                    className="btn-outline-accent">Crear Otro</button>
                </div>
              </Card>
            ) : (
              <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500">
                      <FiShoppingBag size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Información del Comercio</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del Local *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required
                        placeholder="Ej: Burger House"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría *</label>
                      <select name="category" value={formData.category} onChange={handleChange} required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm">
                        <option value="">Seleccionar</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                      placeholder="Descripción breve del comercio..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm resize-none" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del Responsable *</label>
                      <input type="text" name="owner_name" value={formData.owner_name} onChange={handleChange} required
                        placeholder="Juan Pérez"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">CUIT</label>
                      <input type="text" name="cuit" value={formData.cuit} onChange={handleChange}
                        placeholder="XX-XXXXXXXX-X"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required
                        placeholder="comercio@email.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                        placeholder="+54 9 2901 123456"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Dirección *</label>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} required
                        placeholder="San Martín 450"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad *</label>
                      <select name="city" value={formData.city} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm">
                        <option value="Ushuaia">Ushuaia</option>
                        <option value="Río Grande">Río Grande</option>
                        <option value="Tolhuin">Tolhuin</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Link href="/admin/businesses"
                      className="flex-1 py-3 text-center border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 transition-colors">
                      Cancelar
                    </Link>
                    <button type="submit" disabled={loading}
                      className="flex-1 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors flex items-center justify-center gap-2">
                      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Crear Local'}
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
