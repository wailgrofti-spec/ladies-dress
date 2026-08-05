'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const { login, isDemoMode } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.error) setError(res.error);
    else router.push('/admin/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card w-full max-w-sm p-8">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rosegold-400 text-white">
            <Lock size={22} />
          </div>
        </div>
        <h1 className="mt-4 text-center font-display text-xl font-semibold text-charcoal-900">
          Espace administrateur
        </h1>
        <p className="text-center text-xs text-charcoal-700">Ladies Dress</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal-800">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal-800">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
            {submitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {isDemoMode && (
          <p className="mt-5 rounded-lg bg-blush-100 p-3 text-xs text-charcoal-700">
            Mode démo (Supabase non configuré) : utilisez <strong>admin@ladiesdress.ma</strong> /
            <strong> demo1234</strong> pour tester l'interface.
          </p>
        )}
      </div>
    </div>
  );
}
