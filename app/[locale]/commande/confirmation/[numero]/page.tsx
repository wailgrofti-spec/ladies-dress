import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function ConfirmationPage({ params }: { params: { numero: string; locale: string } }) {
  const t = await getTranslations('confirmation');

  return (
    <div className="container-app flex flex-col items-center py-20 text-center">
      <CheckCircle2 size={56} className="text-green-500" />
      <h1 className="mt-4 font-display text-2xl font-semibold text-charcoal-900">{t('title')}</h1>
      <p className="mt-2 text-charcoal-700">{t('text')}</p>
      <p className="mt-4 rounded-full bg-blush-100 px-5 py-2 font-semibold text-rosegold-500">
        {t('orderNumber')}: {params.numero}
      </p>
      <p className="mt-4 max-w-md text-sm text-charcoal-700">{t('nextSteps')}</p>
      <Link href={`/${params.locale}`} className="btn-primary mt-6">
        {t('backHome')}
      </Link>
    </div>
  );
}
