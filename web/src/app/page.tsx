import Link from 'next/link';
import { FiSmartphone, FiTag, FiShoppingBag, FiTrendingUp, FiMapPin, FiStar, FiUsers, FiAward, FiNavigation } from 'react-icons/fi';
import { MobileNavBar } from '@/components/layout/MobileNavBar';
import { LogoImage } from '@/components/ui/LogoImage';

export default function Home() {
  // Datos de ejemplo para mostrar el diseño
  const stats = [
    { icon: <FiShoppingBag size={24} />, value: '150+', label: 'Locales Adheridos' },
    { icon: <FiTag size={24} />, value: '500+', label: 'Promociones Activas' },
    { icon: <FiUsers size={24} />, value: '10K+', label: 'Usuarios Activos' },
    { icon: <FiAward size={24} />, value: '$50M+', label: 'Ahorrado por Usuarios' },
  ];

  const categories = [
    { name: 'Gastronomía', icon: '🍔', count: 45 },
    { name: 'Moda', icon: '👗', count: 32 },
    { name: 'Tecnología', icon: '💻', count: 28 },
    { name: 'Salud', icon: '💊', count: 22 },
    { name: 'Deportes', icon: '⚽', count: 18 },
    { name: 'Hogar', icon: '🏠', count: 15 },
  ];

  const featuredPromos = [
    {
      title: '50% OFF en Hamburguesas',
      business: 'Burger House',
      discount: 50,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      category: 'Gastronomía',
      distance: '1.2 km',
    },
    {
      title: '30% OFF en Zapatillas',
      business: 'Sport Center',
      discount: 30,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      category: 'Deportes',
      distance: '2.5 km',
    },
    {
      title: '40% OFF en Celulares',
      business: 'Tech Store',
      discount: 40,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      category: 'Tecnología',
      distance: '3.1 km',
    },
  ];

  const testimonials = [
    {
      name: 'María García',
      role: 'Usuario desde 2024',
      text: 'Gracias a Promo Club TDF ahorré más de $50.000 el último mes. ¡Las promociones son increíbles!',
      avatar: 'MG',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Usuario desde 2025',
      text: 'La app es súper fácil de usar y siempre encuentro ofertas en mis locales favoritos.',
      avatar: 'CR',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      role: 'Comercio adherido',
      text: 'Desde que nos unimos, nuestras ventas aumentaron un 35%. Excelente plataforma.',
      avatar: 'AM',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-50 border-b border-white/10" style={{ boxShadow: '0 4px 24px rgba(27, 58, 92, 0.08)' }}>
        <div className="glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-accent-200" style={{ boxShadow: '0 2px 8px rgba(27,58,92,0.1), 0 0 0 0 rgba(245,130,32,0)' }}>
                <LogoImage className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xl font-bold text-gradient hidden sm:block">Promo Club TDF</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/map"
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-accent-500 transition-colors rounded-lg hover:bg-gray-50 hidden sm:inline-flex items-center gap-1.5"
              >
                <FiMapPin size={14} />
                Mapa
              </Link>
              <Link
                href="/businesses"
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-accent-500 transition-colors rounded-lg hover:bg-gray-50 hidden sm:inline-flex items-center gap-1.5"
              >
                Comercios
              </Link>
              <Link
                href="/admin"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg hover:shadow-md transition-all hidden sm:inline-flex items-center gap-1.5"
                style={{ boxShadow: '0 2px 8px rgba(27,58,92,0.2)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Admin
              </Link>
              <Link
                href="/business/panel"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-success to-emerald-600 rounded-lg hover:shadow-md transition-all hidden sm:inline-flex items-center gap-1.5"
                style={{ boxShadow: '0 2px 8px rgba(34,197,94,0.2)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                Comercio
              </Link>
              <Link
                href="/profile"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg hover:shadow-md transition-all hidden sm:inline-flex items-center gap-1.5"
                style={{ boxShadow: '0 2px 8px rgba(245,130,32,0.2)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Perfil
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors rounded-lg hover:bg-gray-50"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="btn-accent text-sm"
                style={{ boxShadow: '0 4px 12px rgba(245,130,32,0.3)' }}
              >
                Registrarse
              </Link>
            </nav>
          </div>
        </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 sm:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(245,130,32,0.2) 0%, transparent 50%)',
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent-500/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90 mb-6">
                <FiTrendingUp className="text-accent-400" />
                <span>+500 promociones activas esta semana</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Descuentos exclusivos en
                <span className="text-gradient-accent"> Tierra del Fuego</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
                Accedé a las mejores promociones en locales comerciales adheridos.
                Ahorrá en tus compras diarias con Promo Club TDF.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register" className="btn-accent btn-lg">
                  <FiSmartphone size={20} />
                  Quiero mis descuentos
                </Link>
                <Link href="/business/register" className="btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary-500">
                  <FiShoppingBag size={20} />
                  Soy comercio
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-white/70">
                  <FiStar className="text-accent-400 fill-current" />
                  <span className="text-sm">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <FiMapPin size={14} />
                  <span className="text-sm">Ushuaia, Río Grande, Tolhuin</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image/Card */}
            <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center text-white font-bold">
                      -50%
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Burger House</h3>
                      <p className="text-sm text-gray-500">Gastronomía</p>
                    </div>
                  </div>
                  <div className="h-48 rounded-xl mb-4 overflow-hidden shadow-inner bg-gray-100 relative">
                    <img 
                      src="/burger-promo.png" 
                      alt="Burger House Promo" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiMapPin size={14} />
                      <span>1.2 km de distancia</span>
                    </div>
                    <span className="badge-accent">Activa</span>
                  </div>
                </div>

                {/* Floating Mini Cards */}
                <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-3 animate-bounce-soft">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                      <FiTag className="text-success" size={14} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">¡Nueva promo!</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-bounce-soft" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center text-accent-600 font-bold text-xs">
                      30%
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Sport Center</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F0F4F8"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="card text-center animate-fade-in-up group cursor-default"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl flex items-center justify-center text-primary-500 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <p className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge-primary mb-4 inline-block">Simple y Rápido</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-500 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              En solo 3 pasos empezá a ahorrar en todas tus compras
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                icon: <FiSmartphone size={28} />,
                title: 'Descargá la app',
                description: 'Disponible gratis en App Store y Google Play. Creá tu cuenta en segundos.',
                color: 'from-primary-500 to-secondary-500',
              },
              {
                step: '02',
                icon: <FiTag size={28} />,
                title: 'Elegí promociones',
                description: 'Explorá las ofertas disponibles y activá los cupones que te interesen.',
                color: 'from-secondary-500 to-accent-500',
              },
              {
                step: '03',
                icon: <FiShoppingBag size={28} />,
                title: 'Mostrá y ahorrá',
                description: 'Presentá tu cupón QR en el local y disfrutá del descuento automáticamente.',
                color: 'from-accent-500 to-success',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                  {item.step}
                </div>

                <div className="card text-center h-full group-hover:shadow-xl transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary-500 mb-3">{item.title}</h3>
                  <p className="text-gray-500">{item.description}</p>
                </div>

                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-accent-400 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-500 mb-4">
              Explorá por Categorías
            </h2>
            <p className="text-lg text-gray-500">
              Encontrá promociones en todos los rubros que te interesan
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href="/promotions"
                className="card text-center group animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 origin-center">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">{category.count} ofertas</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-up">
              <span className="badge-accent mb-4 inline-block">
                <FiMapPin size={14} className="inline -mt-0.5" /> Ubicación
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-500 mb-4">
                Encontrá comercios cerca tuyo
              </h2>
              <p className="text-lg text-gray-500 mb-6">
                Explorá el mapa interactivo y descubrí todos los locales adheridos a Promo Club TDF en Tierra del Fuego. Filtrá por categoría, conocé las promociones activas y planificá tu próxima compra.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMapPin size={12} className="text-accent-500" />
                  </div>
                  <span className="text-sm">Mapa interactivo con todos los comercios adheridos</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiTag size={12} className="text-accent-500" />
                  </div>
                  <span className="text-sm">Promociones flash visibles directamente desde el mapa</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiNavigation size={12} className="text-accent-500" />
                  </div>
                  <span className="text-sm">Ubicá tu posición y encontrá locales cercanos</span>
                </li>
              </ul>
              <Link href="/map" className="btn-accent inline-flex items-center gap-2" style={{ boxShadow: '0 4px 12px rgba(245,130,32,0.3)' }}>
                <FiMapPin size={18} />
                Abrir Mapa
              </Link>
            </div>

            {/* Right - Map Preview Card */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/map" className="block group">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 group-hover:shadow-2xl transition-shadow duration-300">
                  {/* Static map preview */}
                  <div className="w-full h-80 bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 relative flex items-center justify-center">
                    {/* Decorative map pins */}
                    <div className="absolute top-12 left-16 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform" style={{ animationDelay: '0.1s' }}>🏪</div>
                    <div className="absolute top-20 right-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform" style={{ animationDelay: '0.3s' }}>📍</div>
                    <div className="absolute bottom-16 left-24 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform" style={{ animationDelay: '0.5s' }}>🏪</div>
                    <div className="absolute bottom-24 right-16 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform" style={{ animationDelay: '0.2s' }}>🏪</div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📍</div>

                    {/* Grid lines */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-400" />
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400" />
                      <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-400" />
                      <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-400" />
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400" />
                      <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gray-400" />
                    </div>

                    {/* Center label */}
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2">
                      <p className="text-sm font-bold text-primary-500 flex items-center gap-2">
                        <FiMapPin size={16} className="text-accent-500" />
                        Tierra del Fuego
                      </p>
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="bg-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                        <FiMapPin size={14} className="text-accent-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Mapa de Comercios</p>
                        <p className="text-xs text-gray-400">Ushuaia • Río Grande • Tolhuin</p>
                      </div>
                    </div>
                    <span className="text-accent-500 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Ver mapa →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Promotions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <span className="badge-accent mb-3 inline-block">🔥 Destacadas</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-500">
                Promociones Destacadas
              </h2>
              <p className="text-lg text-gray-500 mt-2">
                Las ofertas más populares de la semana
              </p>
            </div>
            <Link href="/promotions" className="btn-outline-accent">
              Ver todas
              <FiTag size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPromos.map((promo, index) => (
              <div
                key={index}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-promo">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="badge-accent text-sm" style={{ boxShadow: '0 2px 8px rgba(245,130,32,0.4)' }}>
                        -{promo.discount}%
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="badge-primary text-xs">
                        {promo.category}
                      </span>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {promo.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{promo.business}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <FiMapPin size={12} />
                        <span>{promo.distance}</span>
                      </div>
                      <button className="text-accent-500 hover:text-accent-600 font-semibold transition-colors group/btn flex items-center gap-1">
                        Ver más
                        <span className="group-hover/btn:translate-x-0.5 transition-transform inline-block">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm mb-4 inline-block">
              Testimonios
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Miles de personas ya disfrutan de descuentos exclusivos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <FiStar key={i} className="text-accent-400 fill-current" size={16} />
                  ))}
                </div>

                {/* Text */}
                <p className="text-white/90 mb-6 italic">"{testimonial.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-white/60">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-elevated text-center bg-gradient-to-br from-primary-500 to-secondary-500 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent-400 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                ¿Tenés un comercio?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Unite a Promo Club TDF y atraé más clientes con promociones exclusivas.
                Aumentá tus ventas hasta un 35%.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/business/register" className="btn-accent btn-lg">
                  Registrar mi negocio
                </Link>
                <Link href="/contact" className="btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary-500">
                  Más información
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                  <LogoImage className="w-8 h-8 object-contain" fallbackBg="transparent" fallbackText="PC" />
                </div>
                <span className="text-xl font-bold">Promo Club TDF</span>
              </div>
              <p className="text-gray-400 text-sm">
                La plataforma de descuentos más grande de Tierra del Fuego.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Usuarios</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/promotions" className="hover:text-accent-400 transition-colors">Promociones</Link></li>
                <li><Link href="/map" className="hover:text-accent-400 transition-colors">Mapa de Comercios</Link></li>
                <li><Link href="/businesses" className="hover:text-accent-400 transition-colors">Comercios</Link></li>
                <li><Link href="/coupons" className="hover:text-accent-400 transition-colors">Mis Cupones</Link></li>
                <li><Link href="/favorites" className="hover:text-accent-400 transition-colors">Favoritos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Comercios</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/business/register" className="hover:text-accent-400 transition-colors">Registrar negocio</Link></li>
                <li><Link href="/business/panel" className="hover:text-accent-400 transition-colors">Panel de comercio</Link></li>
                <li><Link href="/pricing" className="hover:text-accent-400 transition-colors">Planes y precios</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>info@promoclubtdf.com</li>
                <li>Ushuaia, Tierra del Fuego</li>
                <li className="flex gap-3 mt-4">
                  <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col items-center justify-center gap-4">
            <div className="text-sm text-gray-400 flex flex-col gap-2 text-center">
              <p>
                © {new Date().getFullYear()} Promo Club TDF. Todos los derechos reservados.
              </p>
              <p>
                Desarrollado por <a href="https://www.patagoniatechlab.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent-400 transition-colors font-medium">PatagoniaTECHLAB</a>
              </p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400 mt-2">
              <Link href="/privacy" className="hover:text-accent-400 transition-colors">Privacidad</Link>
              <Link href="/terms" className="hover:text-accent-400 transition-colors">Términos</Link>
            </div>
          </div>
        </div>
      </footer>
      {/* Mobile Bottom Navigation */}
      <MobileNavBar />
    </div>
  );
}
