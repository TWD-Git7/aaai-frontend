import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Service} from '@/lib/wordpress';
export async function ServiceGrid({services,linked=false}:{services:Service[];linked?:boolean}) {
 const t=await getTranslations();
 return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{services.map((s,i)=><article key={s.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="text-2xl font-black text-aaai-red">{String(i+1).padStart(2,'0')}</span><h3 className="mt-4 text-lg font-bold">{s.title}</h3>{s.description&&<p className="mt-3 line-clamp-4 text-sm leading-6 text-neutral-600">{s.description}</p>}{linked&&s.slug&&<Link href={`/servicos/${encodeURIComponent(s.slug)}`} className="mt-5 inline-block font-bold text-aaai-red hover:underline">{t('readMore')} →<span className="sr-only">: {s.title}</span></Link>}<div className="mt-5 h-1 w-12 rounded bg-aaai-gold"/></article>)}</div>;
}
