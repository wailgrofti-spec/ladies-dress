'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

// Certaines images de démonstration (liens externes) peuvent parfois ne pas
// charger. Plutôt que de laisser apparaître l'icône d'image cassée du
// navigateur, ce composant affiche discrètement le logo de la boutique sur
// fond rosé — jamais d'icône cassée visible pour la cliente.
export default function ImageWithFallback({ alt, className, fill, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-blush-100 ${fill ? 'absolute inset-0' : ''} ${className ?? ''}`}
      >
        <Image
          src="/images/logo.png"
          alt={alt || 'Ladies Dress'}
          width={64}
          height={53}
          className="h-1/3 w-auto max-w-[60%] object-contain opacity-70"
        />
      </div>
    );
  }

  return (
    <Image
      {...props}
      fill={fill}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
