import Link from 'next/link';
import { LogoImage } from '@/components/ui/LogoImage';
import { FiArrowLeft, FiShield } from 'react-icons/fi';

export const metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de Promo Club TDF. Conocé cómo protegemos tus datos personales.',
};

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Información que recopilamos',
      content: `Al registrarte en Promo Club TDF, recopilamos la siguiente información personal:
      
• **Nombre y apellido**: Para personalizar tu experiencia en la plataforma.
• **Dirección de correo electrónico**: Para la creación de tu cuenta, comunicaciones y recuperación de contraseña.
• **Número de teléfono** (opcional): Para notificaciones y atención al cliente.
• **Ciudad de residencia** (opcional): Para mostrarte promociones relevantes en tu zona.
• **Datos de uso**: Información sobre cómo interactuás con la plataforma, incluyendo promociones visualizadas, cupones activados y preferencias de categorías.`,
    },
    {
      title: '2. Cómo utilizamos tu información',
      content: `Utilizamos la información recopilada para:

• Proporcionarte acceso a promociones y descuentos personalizados.
• Gestionar tu cuenta y cupones activos.
• Enviarte notificaciones sobre nuevas promociones relevantes.
• Mejorar nuestros servicios y la experiencia del usuario.
• Generar estadísticas anónimas de uso de la plataforma.
• Comunicarnos con vos sobre actualizaciones del servicio.`,
    },
    {
      title: '3. Compartición de datos',
      content: `No vendemos ni compartimos tu información personal con terceros, excepto en los siguientes casos:

• **Comercios adheridos**: Cuando canjeás un cupón, el comercio recibe únicamente la información necesaria para validar el descuento (nombre y código de cupón).
• **Proveedores de servicios**: Utilizamos servicios de terceros (hosting, email) que procesan datos según sus propias políticas de privacidad.
• **Requerimientos legales**: Cuando sea necesario para cumplir con obligaciones legales vigentes en la República Argentina.`,
    },
    {
      title: '4. Seguridad de los datos',
      content: `Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:

• Encriptación de datos en tránsito y en reposo.
• Autenticación segura con contraseñas hasheadas.
• Acceso restringido a datos personales solo al personal autorizado.
• Monitoreo continuo de posibles vulnerabilidades.
• Copias de seguridad regulares y encriptadas.`,
    },
    {
      title: '5. Tus derechos',
      content: `Conforme a la Ley 25.326 de Protección de Datos Personales de Argentina, tenés derecho a:

• **Acceder** a tus datos personales almacenados.
• **Rectificar** información incorrecta o desactualizada.
• **Eliminar** tu cuenta y todos los datos asociados.
• **Revocar** el consentimiento para el uso de tus datos.

Podés ejercer estos derechos desde la sección "Mi Perfil" o contactándonos a info@promoclubtdf.com.`,
    },
    {
      title: '6. Cookies y tecnologías similares',
      content: `Utilizamos cookies y tecnologías similares para:

• Mantener tu sesión activa.
• Recordar tus preferencias de navegación.
• Analizar el uso de la plataforma de forma anónima.

Podés configurar tu navegador para rechazar cookies, aunque esto puede afectar la funcionalidad de la plataforma.`,
    },
    {
      title: '7. Modificaciones a esta política',
      content: `Nos reservamos el derecho de actualizar esta política de privacidad. Cualquier cambio será notificado a través de la plataforma y/o por correo electrónico. La fecha de última actualización se encuentra al final de este documento.`,
    },
    {
      title: '8. Contacto',
      content: `Si tenés preguntas sobre nuestra política de privacidad, podés contactarnos:

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
              <h1 className="font-bold text-gray-900">Política de Privacidad</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiShield size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Política de Privacidad</h2>
              <p className="text-white/70">Última actualización: Abril 2026</p>
            </div>
          </div>
          <p className="text-white/80">
            En Promo Club TDF nos comprometemos a proteger tu privacidad y tus datos personales. 
            Esta política explica cómo recopilamos, utilizamos y protegemos tu información.
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
            <Link href="/terms" className="hover:text-accent-500 transition-colors">Términos y Condiciones</Link>
            <Link href="/contact" className="hover:text-accent-500 transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
