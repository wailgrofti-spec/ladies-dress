const sizes = [
  { eu: 36, cm: 22.5 }, { eu: 37, cm: 23.5 }, { eu: 38, cm: 24 },
  { eu: 39, cm: 25 }, { eu: 40, cm: 25.5 }, { eu: 41, cm: 26.5 },
];

export default function SizeGuidePage() {
  return (
    <div className="container-app max-w-2xl py-12">
      <h1 className="font-display text-3xl font-semibold text-charcoal-900">Guide des tailles</h1>
      <p className="mt-3 text-sm text-charcoal-700">
        Mesurez la longueur de votre pied du talon jusqu'au bout de l'orteil le plus long, puis
        comparez avec le tableau ci-dessous.
      </p>
      <table className="mt-6 w-full overflow-hidden rounded-soft text-sm shadow-card">
        <thead className="bg-rosegold-400 text-white">
          <tr>
            <th className="p-3 text-start">Pointure EU</th>
            <th className="p-3 text-start">Longueur du pied (cm)</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {sizes.map((s) => (
            <tr key={s.eu} className="border-t border-blush-100">
              <td className="p-3">{s.eu}</td>
              <td className="p-3">{s.cm} cm</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
