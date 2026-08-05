import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getProducts, getCategories, getReviews } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { buildWhatsappLink } from '@/lib/whatsapp';
import { Truck, RefreshCw, MessageCircle, ShieldCheck, Star } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ladiesdress.ma';
  return {
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: { fr: `${siteUrl}/fr`, ar: `${siteUrl}/ar`, en: `${siteUrl}/en` },
    },
  };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('home');
  const tCat = await getTranslations('categories');
  const products = await getProducts();
  const categories = await getCategories();
  const reviews = await getReviews();

  const newArrivals = products.filter((p) => p.is_new).slice(0, 4);
  const bestsellers = products.filter((p) => p.is_bestseller).slice(0, 4);

  const icons = [Truck, MessageCircle, RefreshCw, ShieldCheck];
  const whyItems = t.raw('whyUsItems') as { title: string; text: string }[];

  const categoryLabel = (slug: string) => {
    try {
      return tCat(slug as any);
    } catch {
      return slug;
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-blush-100">
        <div className="container-app grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <div className="order-2 md:order-1">
            <span className="badge bg-rosegold-400 text-white">{t('heroSubtitle')}</span>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-charcoal-900 sm:text-4xl md:text-5xl">
              {t('heroTitle')}
            </h1>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${locale}/boutique`} className="btn-primary">
                {t('heroCta')}
              </Link>
              <a
                href={buildWhatsappLink('Bonjour Ladies Dress 👋, je souhaite passer une commande.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <MessageCircle size={18} /> {t('whatsappCta')}
              </a>
            </div>
          </div>
          <div className="order-1 aspect-square overflow-hidden rounded-soft md:order-2">
            <Image
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80"
              alt="Chaussures Ladies Dress"
              width={800}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Delivery info bar */}
      <div className="bg-charcoal-800 py-2 text-center text-xs text-white sm:text-sm">
        {t('deliveryInfo')}
      </div>

      {/* Categories */}
      <section className="container-app py-12">
        <h2 className="font-display text-2xl font-semibold text-charcoal-900">{t('categoriesTitle')}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/${locale}/boutique/${c.slug}`}
              className="group text-center"
            >
              <div className="aspect-square overflow-hidden rounded-soft bg-blush-100">
                {c.image_url && (
                  <Image
                    src={c.image_url}
                    alt={c.name_fr}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-charcoal-800">{categoryLabel(c.slug)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="container-app py-8">
          <h2 className="font-display text-2xl font-semibold text-charcoal-900">{t('newArrivals')}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="container-app py-8">
          <h2 className="font-display text-2xl font-semibold text-charcoal-900">{t('bestsellers')}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Why us */}
      <section className="bg-white py-14">
        <div className="container-app">
          <h2 className="font-display text-2xl font-semibold text-charcoal-900">{t('whyUs')}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {whyItems.map((item, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div key={item.title} className="rounded-soft bg-blush-50 p-5">
                  <Icon className="text-rosegold-400" size={26} />
                  <p className="mt-3 font-semibold text-charcoal-800">{item.title}</p>
                  <p className="mt-1 text-sm text-charcoal-700">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container-app py-14">
        <h2 className="font-display text-2xl font-semibold text-charcoal-900">{t('reviewsTitle')}</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex gap-0.5 text-gold-400">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-3 text-sm text-charcoal-700">{r.comment}</p>
              <p className="mt-3 text-xs font-semibold text-charcoal-800">{r.customer_name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-rosegold-400 py-14">
        <div className="container-app text-center">
          <h2 className="font-display text-2xl font-semibold text-white">{t('newsletterTitle')}</h2>
          <p className="mt-2 text-sm text-white/90">{t('newsletterText')}</p>
          <form className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder={t('newsletterPlaceholder')}
              className="flex-1 rounded-full border-0 px-5 py-3 text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button type="submit" className="rounded-full bg-charcoal-800 px-6 py-3 text-sm font-semibold text-white hover:bg-charcoal-900">
              {t('newsletterCta')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
