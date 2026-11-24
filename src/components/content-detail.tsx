import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Link} from '@/i18n/navigation';
import {getContent,getServices} from '@/lib/wordpress';
import type {ContentKind} from '@/lib/content';

type DetailKind=Exclude<ContentKind,'slides'>|'services';
export async function loadDetail(kind:DetailKind,locale:string,slug:string) {
  const items=kind==='services'?await getServices(locale):await getContent(kind,locale);
  if (items===null) throw new Error('AAAI content is temporarily unavailable');
  const item=items.find(entry=>entry.slug===slug);
  if (!item) notFound();
  return item;
}
export async function detailMetadata(kind:DetailKind,locale:string,slug:string) {
  const item=await loadDetail(kind,locale,slug);
  return {title:item.title,description:item.description.slice(0,160),openGraph:{title:item.title,description:item.description.slice(0,160),...(item.image?{images:[item.image]}:{})}};
}
export async function ContentDetail({kind,locale,slug,back}:{kind:DetailKind;locale:string;slug:string;back:string}) {
  const t=await getTranslations();
  const item=await loadDetail(kind,locale,slug);
  const published=item.date?new Date(item.date):null;
  return <main id="main-content" className="mx-auto max-w-5xl px-5 py-12 md:py-20">
    <Link href={back} className="font-semibold text-aaai-red hover:underline">← {t('backList')}</Link>
    <article className="mt-8"><h1 className="max-w-4xl text-4xl font-black leading-tight md:text-5xl">{item.title}</h1>
      {['news','events','projects'].includes(kind)&&published&&!Number.isNaN(published.getTime())&&<p className="mt-5 text-sm text-neutral-500">{t('publishedOn')} <time dateTime={published.toISOString()}>{new Intl.DateTimeFormat(locale,{dateStyle:'long',timeZone:'UTC'}).format(published)}</time></p>}
      {item.image&&<div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100"><Image src={item.image} alt="" fill unoptimized priority className="object-cover"/></div>}
      {item.content?<div className="aaai-prose mt-10" dangerouslySetInnerHTML={{__html:item.content}}/>:<p className="mt-8 whitespace-pre-line text-lg leading-8 text-neutral-700">{item.description||t('emptyContent')}</p>}
    </article>
    {kind==='services'&&<aside className="mt-12 rounded-2xl bg-neutral-100 p-7"><h2 className="text-xl font-bold">{t('serviceHelp')}</h2><Link href="/contactos" className="mt-5 inline-block rounded-xl bg-aaai-red px-6 py-3 font-bold text-white">{t('cta')} →</Link></aside>}
  </main>;
}
