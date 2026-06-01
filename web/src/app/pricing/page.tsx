import Link from 'next/link';
import { LogoImage } from '@/components/ui/LogoImage';
import { FiArrowLeft, FiCheck, FiStar, FiZap, FiAward, FiShoppingBag } from 'react-icons/fi';

export const metadata = {
  title: 'Planes y Precios',
  description: 'Conocé los planes disponibles para comercios en Promo Club TDF.',
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Básico',
      price: 'Gratis',
      period: '',
      description: 'Ideal para empezar a publicar tus promociones',
      color: 'from-gray-500 to-gray-600',
      badge: '',
      features: [
        { text: 'Hasta 3 promociones activas', included: true },
        { text: 'Perfil básico del comercio', included: true },
        { text: 'Estadísticas básicas de canjes', included: true },
        { text: 'Soporte por email', included: true },
        { text: 'Banner destacado', included: false },
        { text: 'Promociones flash', included: false },
        { text: 'Analíticas avanzadas', included: false },
        { text: 'Soporte prioritario', included: false },
      ],
      cta: 'Comenzar Gratis',
      ctaVariant: 'outline',
    },
    {
      name: 'Profesional',
      price: '$15.000',
      period: '/mes',
      description: 'Para comercios que quieren crecer rápidamente',
      color: 'from-accent-500 to-accent-600',
      badge: 'Más Popular',
      features: [
        { text: 'Hasta 15 promociones activas', included: true },
        { text: 'Perfil premium del comercio', included: true },
        { text: 'Estadísticas detalladas', included: true },
        { text: 'Soporte por email y teléfono', included: true },
        { text: '1 banner destacado por mes', included: true },
        { text: 'Promociones flash', included: true },
        { text: 'Analíticas avanzadas', included: false },
        { text: 'Soporte prioritario', included: false },
      ],
      cta: 'Elegir Profesional',
      ctaVariant: 'accent',
    },
    {
      name: 'Enterprise',
      price: '$35.000',
      period: '/mes',
      description: 'Para cadenas y grandes comercios',
      color: 'from-primary-500 to-secondary-500',
      badge: 'Premium',
      features: [
        { text: 'Promociones ilimitadas', included: true },
        { text: 'Perfil premium personalizado', included: true },
        { text: 'Estadísticas en tiempo real', included: true },
        { text: 'Soporte 24/7 dedicado', included: true },
        { text: 'Banners ilimitados', included: true },
        { text: 'Promociones flash ilimitadas', included: true },
        { text: 'Analíticas avanzadas + Exports', included: true },
        { text: 'Account Manager dedicado', included: true },
      ],
      cta: 'Contactar Ventas',
      ctaVariant: 'primary',
    },
  ];

  const faqs = [
    { q: '¿Puedo cambiar de plan en cualquier momento?', a: 'Sí, podés actualizar o bajar tu plan cuando quieras. Los cambios se aplican en el próximo ciclo de facturación.' },
    { q: '¿Hay algún contrato de permanencia?', a: 'No. Todos los planes son mensuales y podés cancelar en cualquier momento sin penalidad.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjetas de crédito/débito, transferencia bancaria y Mercado Pago.' },
    { q: '¿El plan Básico tiene algún costo oculto?', a: 'No. El plan Básico es 100% gratuito, con todas las funcionalidades listadas sin costo alguno.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                <LogoImage className="w-6 h-6 object-contain" />
              </div>
              <h1 className="font-bold text-gray-900">Planes y Precios</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <span className="badge-accent mb-4 inline-block">💰 Planes para Comercios</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-500 mb-4">
            Elegí el plan perfecto para tu negocio
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Publicá tus promociones y llegá a miles de clientes en Tierra del Fuego.
            Sin contratos, cancelá cuando quieras.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 ${
                plan.badge === 'Más Popular' ? 'border-accent-500 scale-[1.02]' : 'border-gray-100'
              }`}
            >
              {plan.badge && (
                <div className={`absolute top-0 right-0 bg-gradient-to-r ${plan.color} text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl`}>
                  {plan.badge}
                </div>
              )}

              {/* Plan Header */}
              <div className={`bg-gradient-to-br ${plan.color} p-6 text-white`}>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-white/70 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-white/70">{plan.period}</span>}
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        feature.included ? 'bg-success-50 text-success' : 'bg-gray-100 text-gray-300'
                      }`}>
                        <FiCheck size={12} />
                      </div>
                      <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/business/register"
                  className={`block text-center w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.ctaVariant === 'accent'
                      ? 'bg-accent-500 text-white hover:bg-accent-600'
                      : plan.ctaVariant === 'primary'
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'border-2 border-gray-200 text-gray-700 hover:border-accent-500 hover:text-accent-500'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Features comparison */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-16">
          <h3 className="text-2xl font-bold text-primary-500 text-center mb-8">¿Por qué elegir Promo Club TDF?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FiShoppingBag size={24} />, title: '+150 Comercios', desc: 'Ya confían en nosotros' },
              { icon: <FiStar size={24} />, title: '4.9 Estrellas', desc: 'Calificación promedio' },
              { icon: <FiZap size={24} />, title: 'Resultados rápidos', desc: 'Empezá a vender más hoy' },
              { icon: <FiAward size={24} />, title: 'Sin riesgos', desc: 'Cancelá cuando quieras' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 mx-auto mb-3">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-primary-500 text-center mb-8">Preguntas Frecuentes</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">¿Listo para impulsar tus ventas?</h3>
          <p className="text-white/80 mb-6">Unite a los +150 comercios que ya confían en Promo Club TDF</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/business/register" className="btn-accent btn-lg">
              Registrar mi comercio
            </Link>
            <Link href="/contact" className="btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary-500">
              Hablar con ventas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
