import { getShippingZones } from '@/lib/data';
import { getSettings } from '@/lib/settings-data';
import ShippingSettings from '@/components/admin/ShippingSettings';

export default async function AdminSettingsPage() {
  const zones = await getShippingZones();
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-white">Paramètres</h1>
      <p className="mt-1 text-sm text-charcoal-700 dark:text-gray-400">Livraison et modes de paiement.</p>
      <div className="mt-6 max-w-2xl">
        <ShippingSettings
          zones={zones as any}
          initialOnlinePayment={settings.payment_online_enabled?.fr === '1'}
          initialBankTransfer={settings.payment_bank_transfer_enabled?.fr !== '0'}
        />
      </div>
    </div>
  );
}
