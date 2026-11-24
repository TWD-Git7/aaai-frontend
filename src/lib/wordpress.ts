import 'server-only';
import {cache} from 'react';
import {apiUrl, parseContent, parseServices, type ContentKind} from './content';
export type {Service, InstitutionalItem, ContentKind} from './content';

async function request(endpoint:string, locale:string):Promise<unknown> {
  const base = process.env.WORDPRESS_API_URL?.trim();
  if (!base) return null;
  try {
    const response = await fetch(apiUrl(base, endpoint, locale), {
      next:{revalidate:120}, signal:AbortSignal.timeout(7000)
    });
    if (!response.ok) return null;
    return await response.json();
  } catch { return null; }
}
export const getServices = cache(async (locale:string) => parseServices(await request('services', locale), locale));
export const getContent = cache(async (kind:ContentKind, locale:string) => parseContent(await request(kind, locale), locale));
