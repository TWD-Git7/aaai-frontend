'use client';

import {useRef,useState} from 'react';
import Image from 'next/image';
import {CalendarDays,Globe,Mail,Menu,Phone,UsersRound,X} from 'lucide-react';
import {useLocale,useTranslations} from 'next-intl';
import {Link,usePathname,useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import type {PublicContacts} from '@/lib/public-config';

export function Header({contacts}:{contacts:PublicContacts}) {
  const [open,setOpen]=useState(false);
  const toggle=useRef<HTMLButtonElement>(null);
  const t=useTranslations();
  const locale=useLocale();
  const pathname=usePathname();
  const router=useRouter();
  const languages={pt:'Português',en:'English',fr:'Français',es:'Español'};
  const links=[['/',t('home')],['/sobre',t('aboutPage')],['/servicos',t('services')],['/eventos',t('eventsTitle')],['/noticias',t('newsTitle')],['/contactos',t('contact')]];
  const memberClass='inline-flex shrink-0 items-center gap-1.5 rounded-md bg-aaai-red px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700';
  return <>
    <div id="site-topbar" className="site-topbar sticky top-0 z-50 bg-aaai-black text-white">
      <div className="mx-auto flex h-full max-w-7xl flex-wrap items-center justify-between gap-x-5 px-4 md:flex-nowrap md:px-5">
        <div className="flex w-full min-w-0 items-center justify-between gap-3 text-[11px] md:w-auto md:justify-start md:gap-6 md:text-xs">
          {contacts.phone&&<a href={`tel:${contacts.phone.replace(/[^+\d]/g,'')}`} className="inline-flex shrink-0 items-center gap-2 hover:text-aaai-gold"><Phone size={13} className="text-aaai-gold"/>{contacts.phone}</a>}
          {contacts.email&&<a href={`mailto:${contacts.email}`} className="inline-flex min-w-0 items-center gap-2 hover:text-aaai-gold"><Mail size={13} className="shrink-0 text-aaai-gold"/><span className="truncate">{contacts.email}</span></a>}
        </div>
        <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-end">
          <label className="inline-flex min-w-0 items-center gap-2 text-xs"><Globe size={14} aria-hidden="true" className="text-aaai-gold"/><span className="hidden text-neutral-300 sm:inline">{t('language')}:</span><span className="sr-only sm:hidden">{t('language')}</span><select value={locale} onChange={e=>{setOpen(false);router.replace(pathname,{locale:e.target.value as (typeof routing.locales)[number]});}} className="min-w-0 rounded-md border border-white/20 bg-neutral-800 px-2 py-1 text-xs text-white">{routing.locales.map(l=><option key={l} value={l}>{languages[l]}</option>)}</select></label>
          {contacts.memberUrl?<a href={contacts.memberUrl} className={memberClass}><UsersRound size={14}/>{t('memberArea')}</a>:<Link href="/area-do-associado" onClick={()=>setOpen(false)} className={memberClass}><UsersRound size={14}/>{t('memberArea')}</Link>}
        </div>
      </div>
    </div>
    <header className="site-navbar fixed inset-x-0 z-40 border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur" onKeyDown={event=>{if(event.key==='Escape'&&open){setOpen(false);toggle.current?.focus();}}}>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 md:px-5">
        <Link href="/" onClick={()=>setOpen(false)} className="flex shrink-0 items-center gap-2.5"><Image src="/logo-aaai.png" alt="AAAI" width={52} height={52} priority/><span className="text-lg font-black leading-tight">AAAI<small className="mt-1 hidden max-w-52 text-[10px] font-semibold uppercase tracking-wide text-neutral-500 xl:block">{t('brandSubtitle')}</small></span></Link>
        <nav id="main-nav" aria-label={t('mainNavigation')} className={`${open?'flex':'hidden'} site-main-nav absolute inset-x-0 top-full flex-col gap-1 overflow-y-auto border-b bg-white p-4 shadow-lg lg:static lg:flex lg:flex-row lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>{links.map(([href,label])=>{
          const active=href==='/'?pathname==='/':pathname===href||pathname.startsWith(href+'/');
          return <Link key={href} href={href} onClick={()=>setOpen(false)} aria-current={active?'page':undefined} className={`rounded-lg px-3 py-3 text-sm font-semibold transition hover:bg-neutral-50 lg:rounded-none lg:border-b-2 lg:px-1.5 lg:py-2 ${active?'border-aaai-red text-aaai-red':'border-transparent text-slate-700'}`}>{label}</Link>;
        })}<Link href="/agendar" onClick={()=>setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white lg:hidden"><CalendarDays size={17}/>{t('bookAppointment')}</Link></nav>
        <div className="flex shrink-0 items-center gap-2"><Link href="/agendar" onClick={()=>setOpen(false)} aria-label={t('bookAppointment')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 sm:px-4"><CalendarDays size={17}/><span className="hidden sm:inline">{t('bookAppointment')}</span></Link><button ref={toggle} type="button" className="rounded-lg border border-neutral-200 p-2.5 lg:hidden" aria-expanded={open} aria-controls="main-nav" aria-label={t(open?'closeMenu':'openMenu')} onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button></div>
      </div>
    </header>
    <div className="site-navbar-spacer" aria-hidden="true"/>
  </>;
}
