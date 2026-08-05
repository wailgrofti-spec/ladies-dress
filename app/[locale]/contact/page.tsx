import { MessageCircle, Phone, MapPin } from 'lucide-react';
import { buildWhatsappLink, getWhatsappNumber } from '@/lib/whatsapp';

export default function ContactPage() {
  const whatsappHref = buildWhatsappLink('Bonjour Ladies Dress 👋, j\u2019ai une question.');
  const number = getWhatsappNumber();
  const displayNumber = '0' + number.slice(3);

  return (
    <div className="container-app max-w-2xl py-12">
      <h1 className="font-display text-3xl font-semibold text-charcoal-900">Contact</h1>
      <p className="mt-3 text-sm text-charcoal-700">
        Une question sur un produit, une commande, une pointure ? Nous sommes disponibles
        du lundi au samedi, de 9h à 19h.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="card flex flex-col items-center gap-2 p-5 text-center">
          <MessageCircle className="text-[#25D366]" size={28} />
          <p className="text-sm font-semibold">WhatsApp</p>
          <p className="text-xs text-charcoal-700">{displayNumber}</p>
        </a>
        <a href={`tel:${number}`} className="card flex flex-col items-center gap-2 p-5 text-center">
          <Phone className="text-rosegold-400" size={28} />
          <p className="text-sm font-semibold">Téléphone</p>
          <p className="text-xs text-charcoal-700">{displayNumber}</p>
        </a>
        <div className="card flex flex-col items-center gap-2 p-5 text-center">
          <MapPin className="text-rosegold-400" size={28} />
          <p className="text-sm font-semibold">Magasin</p>
          <p className="text-xs text-charcoal-700">Kénitra, Maroc</p>
        </div>
      </div>
    </div>
  );
}
