import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    // Durante el build estático las variables no están disponibles
    // Retorna un cliente mock para evitar errores en pre-render
    return null as any;
  }

  return createBrowserClient(url, key);
}
