import type {MetadataRoute} from 'next';
import {routing} from '@/i18n/routing';

const publicPages = ['', '/sobre', '/servicos', '/noticias', '/eventos',
  '/projectos', '/parceiros', '/guia', '/contactos', '/agendar', '/privacidade'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    publicPages.map((page) => ({url: `https://apoioimigrantes.com/${locale}${page}`})),
  );
}
