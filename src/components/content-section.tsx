import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {InstitutionalItem} from '@/lib/content';

export async function ContentSection({title,items,empty,unavailable,href,viewAll,limit=6,heading='h2',itemBase}:{title:string;items:InstitutionalItem[]|null;empty:string;unavailable:string;href?:string;viewAll?:string;limit?:number;heading?:'h1'|'h2';itemBase?:string}) {
  const Heading=heading;
  const t=await getTranslations();
  const base=itemBase??href;
  return <section className="mx-auto max-w-7xl px-5 py-16">
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4"><Heading className="text-3xl font-black md:text-4xl">{title}</Heading>{href&&<Link href={href} className="font-semibold text-aaai-red underline-offset-4 hover:underline">{viewAll} →</Link>}</div>
    {!items?.length?<p className="rounded-xl border border-dashed border-neutral-300 p-6 text-neutral-600">{items===null?unavailable:empty}</p>:<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0,limit).map(item=><article key={item.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">{item.image&&<div className="relative h-48"><Image src={item.image} alt="" fill unoptimized className="object-cover"/></div>}<div className="p-6"><h3 className="text-xl font-bold">{item.title}</h3>{item.description&&<p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-7 text-neutral-600">{item.description}</p>}{base&&item.slug&&<Link href={`${base}/${encodeURIComponent(item.slug)}`} className="mt-5 inline-block font-bold text-aaai-red hover:underline">{t('readMore')} →<span className="sr-only">: {item.title}</span></Link>}</div></article>)}</div>}
  </section>;
}
