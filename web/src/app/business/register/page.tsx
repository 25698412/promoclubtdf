'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogoImage } from '@/components/ui/LogoImage';
import { extractCoordsFromGoogleMapsUrl } from '@/lib/google-maps';
import { FiArrowLeft, FiShoppingBag, FiUser, FiMail, FiPhone, FiMapPin, FiFileText, FiCheckCircle, FiImage } from 'react-icons/fi';

export default function BusinessRegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Ushuaia',
    description: '',
    cuit: '',
    googleMapsUrl: '',
  });

  const categories = [
    'Gastronomía', 'Moda', 'Tecnología', 'Salud', 'Deportes',
    'Hogar', 'Entretenimiento', 'Servicios', 'Educación', 'Otros',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.businessName || !formData.category) {
        setError('Completá el nombre y categoría del negocio');
        return;
      }
    }
    if (step === 2) {
      if (!formData.ownerName || !formData.email || !formData.phone) {
        setError('Completá todos los datos del responsable');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address) {
      setError('Completá la dirección del local');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      const ownerId = session?.user?.id || null;

      // Extract coordinates from Google Maps URL if provided
      const coords = extractCoordsFromGoogleMapsUrl(formData.googleMapsUrl);

      // Insert business record (starts as inactive, pending admin approval)
      const { error: bizError } = await supabase.from('businesses').insert({
        owner_id: ownerId,
        name: formData.businessName,
        description: formData.description || null,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        category: formData.category,
        city: formData.city,
        google_maps_url: formData.googleMapsUrl || null,
        latitude: coords?.lat || null,
        longitude: coords?.lng || null,
        is_active: false, // Pending admin approval
      });

      if (bizError) {
        setError('Error al registrar: ' + bizError.message);
      } else {
        setStep(4); // Success
      }
    } catch (err) {
      setError('Error inesperado: ' + (err as Error).message);
    }
    setLoading(false);
  };

  const steps = [
    { num: 1, label: 'Negocio' },
    { num: 2, label: 'Contacto' },
    { num: 3, label: 'Ubicación' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-accent-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
        <FiArrowLeft size={18} />
        <span className="hidden sm:inline">Volver al inicio</span>
      </Link>

      <div className="relative w-full max-w-lg animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
              <LogoImage className="w-12 h-12 object-contain" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-6">Registrá tu Comercio</h1>
          <p className="text-white/70 mt-2">Unite a Promo Club TDF y atraé más clientes</p>
        </div>

        {/* Progress */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step > s.num ? 'bg-accent-500 text-white' : step === s.num ? 'bg-accent-500 text-white' : 'bg-white/20 text-white/60'
                }`}>
                  {step > s.num ? <FiCheckCircle size={16} /> : s.num}
                </div>
                <span className="text-sm text-white/80 hidden sm:inline">{s.label}</span>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 ${step > s.num ? 'bg-accent-500' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-100 rounded-xl text-sm text-error-700 animate-shake">
              {error}
            </div>
          )}

          {step === 4 ? (
            /* Success */
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle size={40} className="text-success" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h2>
              <p className="text-gray-500 mb-6">
                Nuestro equipo revisará tu solicitud en las próximas 24-48 horas. 
                Te contactaremos por email para confirmar la activación de tu cuenta.
              </p>
              <div className="space-y-3">
                <Link href="/" className="btn-accent block text-center">
                  Volver al Inicio
                </Link>
                <Link href="/pricing" className="block text-sm text-primary-500 hover:text-primary-600 font-medium">
                  Ver planes disponibles →
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 && (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500">
                      <FiShoppingBag size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Datos del Negocio</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del Comercio *</label>
                    <input
                      type="text" name="businessName" value={formData.businessName} onChange={handleChange}
                      placeholder="Ej: Mi Restaurante" required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría / Rubro *</label>
                    <select name="category" value={formData.category} onChange={handleChange} required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm transition-all">
                      <option value="">Seleccioná una categoría</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CUIT (opcional)</label>
                    <input type="text" name="cuit" value={formData.cuit} onChange={handleChange}
                      placeholder="XX-XXXXXXXX-X"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción breve</label>
                    <textarea name="description" value={formData.description} onChange={handleChange}
                      placeholder="Contanos sobre tu negocio..." rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm transition-all resize-none"
                    />
                  </div>

                  <button type="button" onClick={handleNext}
                    className="w-full py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors">
                    Continuar
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500">
                      <FiUser size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Datos del Responsable</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo *</label>
                    <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange}
                      placeholder="Juan Pérez" required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="comercio@email.com" required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      placeholder="+54 9 2901 123456" required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm transition-all"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)}
                      className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 transition-colors">
                      Atrás
                    </button>
                    <button type="button" onClick={handleNext}
                      className="flex-1 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors">
                      Continuar
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500">
                      <FiMapPin size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Ubicación del Local</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Dirección *</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange}
                      placeholder="San Martín 450" required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad *</label>
                    <select name="city" value={formData.city} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm transition-all">
                      <option value="Ushuaia">Ushuaia</option>
                      <option value="Río Grande">Río Grande</option>
                      <option value="Tolhuin">Tolhuin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      🔗 Link de Google Maps
                    </label>
                    <input
                      type="url"
                      name="googleMapsUrl"
                      value={formData.googleMapsUrl}
                      onChange={handleChange}
                      placeholder="https://maps.google.com/?q=-54.8019,-68.3030"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Pegá el link de tu local en Google Maps para que aparezca en el mapa
                    </p>
                    {formData.googleMapsUrl && (
                      <p className="text-xs text-success mt-1">
                        ✓ Las coordenadas se extraerán automáticamente
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)}
                      className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 transition-colors">
                      Atrás
                    </button>
                    <button type="submit" disabled={loading}
                      className="flex-1 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors flex items-center justify-center gap-2">
                      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Enviar Solicitud'}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>

        {step < 4 && (
          <p className="text-center mt-8 text-white/70 text-sm">
            ¿Ya tenés cuenta de comercio?{' '}
            <Link href="/login" className="text-white font-semibold hover:text-accent-400 transition-colors">
              Iniciar Sesión
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
