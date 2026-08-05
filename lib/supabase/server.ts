import { createClient } from '@supabase/supabase-js';

// Client Supabase pour le serveur (Server Components, Route Handlers, admin).
// Peut utiliser la clé "service_role" pour les actions d'administration
// qui doivent contourner les policies RLS (ex: décrémenter le stock).
// ATTENTION : SUPABASE_SERVICE_ROLE_KEY ne doit JAMAIS être exposée au client
// (pas de préfixe NEXT_PUBLIC_).
export function createServerSupabaseClient(useServiceRole = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
