'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, Check, X } from 'lucide-react';
import { Review } from '@/lib/types';

export default function ReviewsModeration() {
  const [pending, setPending] = useState<Review[]>([]);
  const [approved, setApproved] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/reviews?pending=true').then((r) => r.json()),
      fetch('/api/reviews').then((r) => r.json()),
    ]).then(([p, a]) => {
      setPending(p.reviews);
      setApproved(a.reviews);
      if (p.demo) setNotice('Mode démo : la modération ne sera pas sauvegardée tant que Supabase n\'est pas configuré.');
    }).finally(() => setLoading(false));
  }, []);

  async function moderate(id: string, is_approved: boolean) {
    await fetch(`/api/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_approved }),
    });
    setPending((prev) => prev.filter((r) => r.id !== id));
  }

  async function remove(id: string) {
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    setApproved((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-white">Avis clients</h1>
      {notice && <p className="mt-3 rounded-lg bg-gold-400/20 p-3 text-xs text-charcoal-800">{notice}</p>}

      <div className="mt-6">
        <p className="font-semibold text-charcoal-800">En attente de validation ({pending.length})</p>
        <div className="mt-3 space-y-3">
          {pending.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex text-gold-400">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                  </div>
                  <p className="mt-1 text-sm font-semibold">{r.customer_name}</p>
                  <p className="text-sm text-charcoal-700">{r.comment}</p>
                  {r.photos && r.photos.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {r.photos.map((url, i) => (
                        <div key={i} className="relative h-14 w-14 overflow-hidden rounded-lg">
                          <Image src={url} alt="" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => moderate(r.id, true)} className="rounded-full bg-green-500 p-2 text-white"><Check size={16} /></button>
                  <button onClick={() => moderate(r.id, false)} className="rounded-full bg-red-500 p-2 text-white"><X size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {!loading && pending.length === 0 && <p className="text-sm text-charcoal-700">Aucun avis en attente.</p>}
        </div>
      </div>

      <div className="mt-8">
        <p className="font-semibold text-charcoal-800">Publiés ({approved.length})</p>
        <div className="mt-3 space-y-3">
          {approved.map((r) => (
            <div key={r.id} className="card flex items-center justify-between p-4">
              <div>
                <div className="flex text-gold-400">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                </div>
                <p className="mt-1 text-sm font-semibold">{r.customer_name}</p>
                <p className="text-sm text-charcoal-700">{r.comment}</p>
              </div>
              <button onClick={() => remove(r.id)} className="rounded-full p-2 hover:bg-blush-100"><X size={16} className="text-red-500" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
