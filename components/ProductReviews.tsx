'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, Camera } from 'lucide-react';
import { Review } from '@/lib/types';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?product_id=${productId}`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews))
      .finally(() => setLoading(false));
  }, [productId]);

  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex text-gold-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} fill={i < Math.round(average) ? 'currentColor' : 'none'} strokeWidth={1.5} />
              ))}
            </div>
            <span className="text-sm font-semibold text-charcoal-800">
              {average > 0 ? average.toFixed(1) : '—'} ({reviews.length} avis)
            </span>
          </div>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="btn-secondary !px-4 !py-2 text-xs">
          Laisser un avis
        </button>
      </div>

      {showForm && <ReviewForm productId={productId} onSubmitted={() => setShowForm(false)} />}

      <div className="mt-6 space-y-4">
        {!loading && reviews.length === 0 && (
          <p className="text-sm text-charcoal-700">Aucun avis pour ce produit pour le moment. Soyez la première !</p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-blush-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex text-gold-400">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <span className="text-sm font-semibold text-charcoal-800">{r.customer_name}</span>
            </div>
            <p className="mt-1 text-sm text-charcoal-700">{r.comment}</p>
            {r.photos && r.photos.length > 0 && (
              <div className="mt-2 flex gap-2">
                {r.photos.map((url, i) => (
                  <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg">
                    <Image src={url} alt="Photo cliente" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewForm({ productId, onSubmitted }: { productId: string; onSubmitted: () => void }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const supabase = createBrowserSupabaseClient();
    if (supabase) {
      const path = `reviews/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        setPhotos((p) => [...p, data.publicUrl]);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => setPhotos((p) => [...p, reader.result as string]);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, customer_name: name, rating, comment, photos }),
    });
    setSubmitting(false);
    setDone(true);
    setTimeout(onSubmitted, 1500);
  }

  if (done) {
    return (
      <p className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
        Merci pour votre avis ! Il sera publié après validation par notre équipe.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-soft bg-blush-50 p-4">
      <input required placeholder="Votre prénom" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-blush-200 px-3 py-2 text-sm" />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)}>
            <Star size={22} className={n <= rating ? 'fill-gold-400 text-gold-400' : 'text-charcoal-700/30'} />
          </button>
        ))}
      </div>
      <textarea required placeholder="Votre avis..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="w-full rounded-lg border border-blush-200 px-3 py-2 text-sm" />
      <label className="btn-secondary inline-flex w-fit cursor-pointer !px-3 !py-1.5 text-xs">
        <Camera size={14} /> Ajouter une photo
        <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
      </label>
      {photos.length > 0 && <p className="text-xs text-charcoal-700">{photos.length} photo(s) ajoutée(s)</p>}
      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
        {submitting ? 'Envoi...' : 'Envoyer mon avis'}
      </button>
    </form>
  );
}
