import {cleanHtml,plainText} from './rich-text.ts';
/** Pure boundary validation for the AAAI WordPress contract. */
export type Service = {id:number;slug:string;title:string;description:string;locale:string;order:number;content?:string;image?:string|null;date?:string};
export type InstitutionalItem = {id:number;slug:string;title:string;description:string;image:string|null;date:string;locale:string;content?:string};
export type ContentKind = 'news'|'events'|'projects'|'partners'|'slides';
export const locales = ['pt', 'en', 'fr', 'es'] as const;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function text(value: unknown): string { return typeof value === 'string' ? value.trim() : ''; }
export function safeImage(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
function common(value: unknown, locale: string) {
  if (!record(value) || !Number.isSafeInteger(value.id) || Number(value.id) <= 0 || !text(value.title)) return null;
  if (value.locale != null && value.locale !== locale) return null;
  return {id:Number(value.id), slug:text(value.slug), title:plainText(value.title), description:plainText(value.description), content:cleanHtml(value.content), locale};
}
function collection<T>(data: unknown, parse: (value: unknown) => T | null): T[] | null {
  if (!Array.isArray(data)) return null;
  const parsed = data.map(parse);
  // A malformed response must never masquerade as an empty published collection.
  if (parsed.some(item => item === null)) return null;
  return parsed as T[];
}
export function parseServices(data: unknown, locale: string): Service[] | null {
  const result = collection(data, value => {
    const item = common(value, locale);
    if (!item || !record(value)) return null;
    return {...item, image:safeImage(value.image), date:text(value.date), order: typeof value.order === 'number' && Number.isFinite(value.order) ? value.order : 0};
  });
  return result?.sort((a,b) => a.order - b.order || a.id - b.id) ?? null;
}
export function parseContent(data: unknown, locale: string): InstitutionalItem[] | null {
  return collection(data, value => {
    const item = common(value, locale);
    if (!item || !record(value)) return null;
    return {...item, image:safeImage(value.image), date:text(value.date)};
  });
}
export function apiUrl(base: string, endpoint: string, locale: string): URL {
  if (!locales.some(item => item === locale)) throw new Error('Unsupported locale');
  const url = new URL(base);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid API URL');
  // Supports both pretty permalinks and WordPress ?rest_route=/ installations.
  if (url.searchParams.has('rest_route')) {
    const prefix = url.searchParams.get('rest_route')?.replace(/\/+$/, '') ?? '';
    url.searchParams.set('rest_route', `${prefix}/aaai/v1/${endpoint}`);
  } else {
    url.pathname = `${url.pathname.replace(/\/+$/, '')}/aaai/v1/${endpoint}`;
  }
  url.searchParams.set('lang', locale);
  return url;
}
