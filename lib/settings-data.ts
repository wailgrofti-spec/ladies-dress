import { createServerSupabaseClient } from './supabase/server';

export async function getSettings(): Promise<Record<string, { fr: string; ar: string; en: string }>> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return {};

  const { data, error } = await supabase.from('site_settings').select('*');
  if (error || !data) return {};

  const settings: Record<string, { fr: string; ar: string; en: string }> = {};
  data.forEach((row: any) => {
    settings[row.key] = { fr: row.value_fr, ar: row.value_ar, en: row.value_en };
  });
  return settings;
}
