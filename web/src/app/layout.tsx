import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { AuthProvider } from '@/lib/auth-context';


const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Promo Club TDF - Descuentos exclusivos en Tierra del Fuego',
    template: '%s | Promo Club TDF',
  },
  description: 'Accedé a las mejores promociones y descuentos en locales comerciales adheridos de Tierra del Fuego. Ahorrá en tus compras diarias con Promo Club TDF.',
  keywords: ['promociones', 'descuentos', 'Tierra del Fuego', 'comercios', 'ofertas', 'cupones'],
  authors: [{ name: 'Promo Club TDF' }],
  creator: 'Promo Club TDF',
  publisher: 'Promo Club TDF',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://promoclubtdf.com'),
  openGraph: {
    title: 'Promo Club TDF',
    description: 'Descuentos exclusivos en Tierra del Fuego',
    url: '/',
    siteName: 'Promo Club TDF',
    locale: 'es_AR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const mode = localStorage.getItem('theme');
                  if (mode === 'dark' || (!mode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-gray-900 dark:bg-background-dark dark:text-gray-100 transition-colors duration-300`}>
        <AuthProvider>
          <SplashScreen />
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-500 focus:text-white focus:rounded-md"
          >
            Saltar al contenido principal
          </a>
          
          {/* Main Content */}
          <main id="main-content" className="min-h-screen">
            {children}
          </main>

          {/* Footer - Solo en landing */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
              Dev Mode
            </div>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
