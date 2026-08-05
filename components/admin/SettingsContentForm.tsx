'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

const FIELDS: { key: string; label: string; placeholder?: string; group: string }[] = [
  { key: 'shop_name', label: 'Nom de la boutique', placeholder: 'Ladies Dress', group: 'Identité' },
  { key: 'logo_url', label: 'URL du logo', placeholder: 'https://...', group: 'Identité' },
  { key: 'banner_title', label: 'Titre de la bannière d\u2019accueil', group: 'Accueil' },
  { key: 'banner_subtitle', label: 'Sous-titre / offre de lancement', group: 'Accueil' },
  { key: 'whatsapp_number', label: 'Numéro WhatsApp (format 212XXXXXXXXX)', placeholder: '212657134198', group: 'Contact' },
  { key: 'phone_number', label: 'Téléphone', group: 'Contact' },
  { key: 'store_address', label: 'Adresse du magasin physique', group: 'Contact' },
  { key: 'instagram_url', label: 'Lien Instagram', group: 'Réseaux sociaux' },
  { key: 'facebook_url', label: 'Lien Facebook', group: 'Réseaux sociaux' },
  { key: 'tiktok_url', label: 'Lien TikTok', group: 'Réseaux sociaux' },
  { key: 'exchange_policy', label: 'Politique d\u2019échange (texte court)', group: 'Politiques' },
  { key: 'delivery_policy', label: 'Texte de la page Livraison', group: 'Politiques' },
  { key: 'footer_about', label: 'Texte "À propos" du footer', group: 'Footer' },
  { key: 'ga_id', label: 'Google Analytics ID', placeholder: 'G-XXXXXXX', group: 'Marketing' },
  { key: 'meta_pixel_id', label: 'Meta Pixel ID', group: 'Marketing' },
  { key: 'tiktok_pixel_id', label: 'TikTok Pixel ID', group: 'Marketing' },
];

export default function SettingsContentForm({ initial }: { initial: Record<string, any> }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map((f) => [f.key, initial[f.key]?.fr ?? '']))
  );
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const groups = Array.from(new Set(FIELDS.map((f) => f.group)));

  async function handleSave() {
    setSaving(true);
    let lastNotice = 'Paramètres enregistrés.';
    for (const f of FIELDS) {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: f.key, value_fr: values[f.key] }),
      });
      const data = await res.json();
      if (data.demo) lastNotice = data.message;
    }
    setSaving(false);
    setNotice(lastNotice);
  }

  return (
    <div className="max-w-2xl space-y-6">
      {notice && <p className="rounded-lg bg-gold-400/20 p-3 text-sm text-charcoal-800">{notice}</p>}
      {groups.map((group) => (
        <div key={group} className="card space-y-3 p-5">
          <p className="font-semibold text-charcoal-800">{group}</p>
          {FIELDS.filter((f) => f.group === group).map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-sm font-medium text-charcoal-800">{f.label}</label>
              <input
                value={values[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm"
              />
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
        <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </div>
  );
}
