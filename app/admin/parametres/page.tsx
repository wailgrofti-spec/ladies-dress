import { getShippingZones } from '@/lib/data';
import { getSettings } from '@/lib/settings-data';

export default async function AdminSettingsPage() {
  const zones = await getShippingZones();
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-white">Paramètres</h1>
      <p className="mt-1 text-sm text-charcoal-700 dark:text-gray-400">Paramètres de la boutique.</p>
      <div className="mt-6 max-w-2xl">
        {/* Les paramètres ont été retirés volontairement. */}
      </div>
    </div>
  );
}
