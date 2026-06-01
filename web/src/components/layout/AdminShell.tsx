'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    // MODO DEMO: Acceso público
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: { user: { user_metadata?: Record<string, string>; email?: string } } | null } }) => {
      if (session && session.user.user_metadata?.role === 'admin') {
        setUserName(
          session.user.user_metadata?.first_name ||
          session.user.email?.split('@')[0] ||
          'Admin'
        );
      } else {
        setUserName('Admin Demo');
      }
      setReady(true);
    });
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar onLogout={handleLogout} userName={userName} userRole="Administrador" />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header userName={userName} onLogout={handleLogout} variant="admin" onToggleSidebar={() => {}} homeLink="/" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminShell;
