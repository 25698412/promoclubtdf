import Link from 'next/link';
import { LogoImage } from '@/components/ui/LogoImage';
import { FiArrowLeft, FiFileText } from 'react-icons/fi';

export const metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de Promo Club TDF.',
};

export default function TermsPage() {
  const sections = [
    {
      title: '1. Aceptación de los términos',
      content: `Al acceder y utilizar la plataforma Promo Club TDF, aceptás estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte de estos términos, te pedimos que no utilices nuestros servicios.

Promo Club TDF se reserva el derecho de modificar estos términos en cualquier momento, notificando a los usuarios registrados a través de la plataforma o por correo electrónico.`,
    },
    {
      title: '2. Descripción del servicio',
      content: `Promo Club TDF es una plataforma digital que conecta a usuarios con promociones y descuentos ofrecidos por comercios adheridos en la provincia de Tierra del Fuego, Argentina.

El servicio incluye:
• Visualización y búsqueda de promociones activas.
• Activación y gestión de cupones de descuento digitales.
• Sistema de puntos y recompensas por uso de la plataforma.
• Información sobre comercios adheridos y sus ubicaciones.`,
    },
    {
      title: '3. Registro de usuarios',
      content: `Para acceder a todas las funcionalidades de la plataforma, debés crear una cuenta proporcionando información veraz y actualizada. Sos responsable de:

• Mantener la confidencialidad de tus credenciales de acceso.
• Toda la actividad realizada desde tu cuenta.
• Notificar inmediatamente cualquier uso no autorizado de tu cuenta.

Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos o que proporcionen información falsa.`,
    },
    {
      title: '4. Uso de cupones y promociones',
      content: `Los cupones y promociones están sujetos a las siguientes condiciones:

• Cada cupón es personal e intransferible.
• Los descuentos son válidos únicamente durante el período indicado.
• Un cupón puede ser utilizado una sola vez, salvo que se indique lo contrario.
• Los comercios se reservan el derecho de verificar la identidad del titular del cupón.
• Las promociones pueden ser modificadas o canceladas por el comercio sin previo aviso.
• Promo Club TDF no es responsable de la calidad de los productos o servicios ofrecidos por los comercios adheridos.`,
    },
    {
      title: '5. Obligaciones de los comercios adheridos',
      content: `Los comercios que se adhieren a Promo Club TDF se comprometen a:

• Respetar los descuentos publicados durante el período de vigencia.
• Aceptar los cupones válidos presentados por los usuarios.
• Proporcionar información veraz sobre sus productos, servicios y promociones.
• Mantener actualizada la información de su establecimiento.
• Cumplir con todas las regulaciones comerciales aplicables en Tierra del Fuego.`,
    },
    {
      title: '6. Sistema de puntos y recompensas',
      content: `El sistema de puntos funciona de la siguiente manera:

• Los usuarios acumulan puntos por cada cupón canjeado exitosamente.
• Los puntos tienen un valor determinado por la plataforma y pueden ser canjeados por premios o descuentos adicionales.
• Los puntos tienen una validez de 12 meses desde su obtención.
• Promo Club TDF se reserva el derecho de modificar el valor y las condiciones del sistema de puntos.
• Los puntos no son transferibles ni canjeables por dinero.`,
    },
    {
      title: '7. Propiedad intelectual',
      content: `Todo el contenido de la plataforma, incluyendo pero no limitado a:

• Diseño, logotipos y marcas.
• Textos, imágenes y gráficos.
• Software y código fuente.
• Base de datos y compilaciones.

Es propiedad de Promo Club TDF o de sus licenciantes y está protegido por las leyes de propiedad intelectual de la República Argentina.`,
    },
    {
      title: '8. Limitación de responsabilidad',
      content: `Promo Club TDF no será responsable por:

• Interrupciones temporales del servicio por mantenimiento o causas de fuerza mayor.
• Daños directos o indirectos derivados del uso de la plataforma.
• La exactitud de la información proporcionada por los comercios adheridos.
• Problemas técnicos en dispositivos o conexiones de los usuarios.
• Cambios en las condiciones de las promociones realizados por los comercios.`,
    },
    {
      title: '9. Legislación aplicable',
      content: `Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa será sometida a los tribunales competentes de la ciudad de Ushuaia, Tierra del Fuego.`,
    },
    {
      title: '10. Contacto',
      content: `Para consultas sobre estos términos y condiciones:

• **Email**: info@promoclubtdf.com
• **Dirección**: Ushuaia, Tierra del Fuego, Argentina
• **Teléfono**: +54 9 2901 000000`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                <LogoImage className="w-6 h-6 object-contain" />
              </div>
              <h1 className="font-bold text-gray-900">Términos y Condiciones</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiFileText size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Términos y Condiciones</h2>
              <p className="text-white/70">Última actualización: Abril 2026</p>
            </div>
          </div>
          <p className="text-white/80">
            Estos términos y condiciones regulan el uso de la plataforma Promo Club TDF 
            y establecen los derechos y obligaciones de todos los usuarios.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-primary-500 mb-4">{section.title}</h3>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-400 pb-8">
          <p>© {new Date().getFullYear()} Promo Club TDF. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/privacy" className="hover:text-accent-500 transition-colors">Política de Privacidad</Link>
            <Link href="/contact" className="hover:text-accent-500 transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
