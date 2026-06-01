import type { Metadata } from 'next';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin - Promo Club TDF',
  description: 'Panel de administración de Promo Club TDF',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </div>
  );
}
