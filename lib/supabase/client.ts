import { createClient } from '@supabase/supabase-js';

// Client Supabase pour le navigateur (composants "use client").
// Utilise la clé publique "anon" — sans danger à exposer côté client
// car les permissions sont contrôlées par les policies RLS (voir schema.sql).
export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Permet au site de fonctionner avec les données de démo tant que
    // Supabase n'est pas encore configuré (voir lib/data.ts).
    return null;
  }

  return createClient(url, anonKey);
}
