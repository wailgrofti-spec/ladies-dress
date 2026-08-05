import { getSettings } from '@/lib/settings-data';
import SettingsContentForm from '@/components/admin/SettingsContentForm';

export default async function AdminContentPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-white">Contenu du site</h1>
      <p className="mt-1 text-sm text-charcoal-700">
        Modifiez le logo, le nom, la bannière, vos coordonnées et vos identifiants marketing —
        sans toucher au code.
      </p>
      <div className="mt-6">
        <SettingsContentForm initial={settings} />
      </div>
    </div>
  );
}
