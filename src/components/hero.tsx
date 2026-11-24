'use client';
import {useState} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {ArrowLeft,ArrowRight,FileText,Info,Search} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {InstitutionalItem} from '@/lib/content';
export function Hero({slides}:{slides:InstitutionalItem[]}) {
 const t=useTranslations();const [index,setIndex]=useState(0);
 const active=index%Math.max(slides.length,1);const slide=slides[active];
 return <section aria-roledescription="carousel" aria-label={t('highlight')} className="relative isolate overflow-hidden bg-slate-950 px-5 py-20 text-center text-white md:py-24 lg:py-28">
  {slide?.image&&<Image key={slide.image} src={slide.image} alt="" fill unoptimized priority className="-z-20 object-cover"/>}
  <div className={`absolute inset-0 -z-10 ${slide?.image?'bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-orange-950/85':'bg-gradient-to-r from-slate-900 via-neutral-800 to-orange-950'}`}/>
  <div className="mx-auto max-w-7xl">
   <p className="mb-6 inline-flex rounded-full bg-amber-500 px-4 py-2 text-xs font-black uppercase tracking-[.14em] text-slate-950">{t('eyebrow')}</p>
   <div aria-live="polite" aria-atomic="true"><h1 className="mx-auto max-w-5xl text-4xl font-black leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">{slide?.title||<>{t('heroLead')}<span className="mt-2 block text-amber-500">{t('heroAccent')}</span></>}</h1><p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">{slide?.description||t('subtitle')}</p></div>
   <div className="mx-auto mt-9 grid max-w-4xl gap-3 sm:flex sm:flex-wrap sm:justify-center"><Link href="/servicos" className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-aaai-red px-6 py-4 text-sm font-extrabold shadow-sm transition hover:bg-red-700"><Info size={17}/>{t('viewServices')}</Link><Link href="/guia" className="inline-flex items-center justify-center gap-2.5 rounded-lg border border-white/35 bg-white/10 px-6 py-4 text-sm font-extrabold backdrop-blur transition hover:bg-white/20"><FileText size={17}/>{t('direGuide')}</Link><Link href="/consultar-processo" className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-aaai-gold px-6 py-4 text-sm font-extrabold text-neutral-950 shadow-sm transition hover:bg-yellow-400"><Search size={17}/>{t('checkProcess')}</Link></div>
   {slides.length>1&&<div className="mt-9 flex items-center justify-center gap-4"><button type="button" aria-label={t('previous')} className="rounded-full border border-white/40 p-3 hover:bg-white/10" onClick={()=>setIndex((active-1+slides.length)%slides.length)}><ArrowLeft size={18}/></button><span className="text-sm tabular-nums">{active+1} / {slides.length}</span><button type="button" aria-label={t('next')} className="rounded-full border border-white/40 p-3 hover:bg-white/10" onClick={()=>setIndex((active+1)%slides.length)}><ArrowRight size={18}/></button></div>}
  </div>
 </section>;
}
