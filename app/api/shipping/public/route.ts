import { NextResponse } from 'next/server';
import { getShippingZones } from '@/lib/data';
import { getSettings } from '@/lib/settings-data';

export async function GET() {
  const [zones, settings] = await Promise.all([getShippingZones(), getSettings()]);

  return NextResponse.json({
    zones,
    paymentMethods: {
      cod: true, // toujours actif, non désactivable (méthode principale au Maroc)
      online: settings.payment_online_enabled?.fr === '1',
      bankTransfer: settings.payment_bank_transfer_enabled?.fr !== '0', // actif par défaut
    },
  });
}
