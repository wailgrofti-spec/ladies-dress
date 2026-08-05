export default function ShippingPage() {
  return (
    <div className="container-app max-w-2xl py-12">
      <h1 className="font-display text-3xl font-semibold text-charcoal-900">Livraison</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-charcoal-700">
        <p>Nous livrons partout au Maroc, sous 24 à 72h selon votre ville.</p>
        <ul className="list-disc space-y-1 ps-5">
          <li>Casablanca, Rabat, Kénitra : 25 DH</li>
          <li>Marrakech, Fès, Tanger : 35 DH</li>
          <li>Agadir et autres villes : 40 à 45 DH</li>
          <li>Livraison gratuite dès 500 DH d'achat</li>
        </ul>
        <p>Le paiement à la livraison est disponible dans toutes les villes desservies.</p>
      </div>
    </div>
  );
}
