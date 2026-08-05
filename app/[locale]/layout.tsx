import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/lib/wishlist-context';
import { RecentlyViewedProvider } from '@/lib/recently-viewed-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappFloatButton from '@/components/WhatsappFloatButton';

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) notFound();

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div dir={dir} lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <Header />
              <main className="min-h-[60vh]">{children}</main>
              <Footer />
              <WhatsappFloatButton />
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </NextIntlClientProvider>
    </div>
  );
}
