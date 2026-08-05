'use client';

import { useState } from 'react';
import { buildWhatsappLink } from '@/lib/whatsapp';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');

  const whatsappHref = buildWhatsappLink(
    `Bonjour Ladies Dress 👋, je souhaite suivre ma commande N°${orderNumber || '...'}`
  );

  return (
    <div className="container-app max-w-md py-12">
      <h1 className="font-display text-3xl font-semibold text-charcoal-900">Suivi de commande</h1>
      <p className="mt-3 text-sm text-charcoal-700">
        Entrez votre numéro de commande (reçu par SMS ou WhatsApp) pour connaître son statut,
        ou contactez-nous directement.
      </p>

      <div className="mt-6 space-y-3">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Ex: LD-260803-1234"
          className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm"
        />
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
          Suivre sur WhatsApp
        </a>
      </div>
    </div>
  );
}
