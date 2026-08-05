import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  // Applique le middleware partout sauf /admin, /api, fichiers statiques
  matcher: ['/((?!admin|api|_next|images|favicon.ico).*)'],
};
