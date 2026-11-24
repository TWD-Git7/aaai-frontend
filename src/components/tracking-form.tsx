'use client';
import {useEffect,useRef,useState} from 'react';
import {useTranslations} from 'next-intl';
import {Search} from 'lucide-react';
import {validTracking,type AppointmentState} from '@/lib/appointments';
export function TrackingForm() {
 const t=useTranslations('appointments');
 const [pending,setPending]=useState(false),[error,setError]=useState('');
 const [result,setResult]=useState<{reference:string;state:AppointmentState;scheduledAt:string;publicMessage:string;updatedAt:string}|null>(null);
 const resultBlock=useRef<HTMLElement>(null);
 useEffect(()=>{if(result&&resultBlock.current){resultBlock.current.focus({preventScroll:true});resultBlock.current.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}},[result]);
 async function submit(event:React.FormEvent<HTMLFormElement>) {
  event.preventDefault();if(pending)return;const data=new FormData(event.currentTarget);setPending(true);setError('');setResult(null);
  try {
   const response=await fetch('/api/appointments/lookup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reference:String(data.get('reference')).trim().toUpperCase(),accessCode:String(data.get('accessCode')).trim().toLowerCase()})});
   const json=await response.json();if(!response.ok)throw Error(['not_found','rate_limited','invalid'].includes(json.error)?json.error:'unavailable');
   if(!validTracking(json))throw Error('unavailable');setResult(json);
  }catch(error){setError(error instanceof Error&&['not_found','rate_limited','invalid'].includes(error.message)?error.message:'unavailable');}finally{setPending(false);}
 }
 return <div><form onSubmit={submit} className="rounded-2xl border bg-white p-6 shadow-sm md:p-8"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">{t('reference')} *<input name="reference" required maxLength={30} placeholder="AAAI-2026-ABCDEF123456" autoComplete="off" className="mt-2 w-full rounded-xl border px-4 py-3 font-mono"/></label><label className="text-sm font-bold">{t('accessCode')} *<input name="accessCode" type="password" required minLength={32} maxLength={32} autoComplete="off" className="mt-2 w-full rounded-xl border px-4 py-3 font-mono"/></label></div><p className="mt-5 text-sm leading-7 text-neutral-500">{t('trackingHelp')}</p><button type="submit" disabled={pending} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-aaai-gold px-6 py-4 font-bold text-neutral-950 disabled:opacity-60"><Search size={18}/>{t(pending?'searching':'track')}</button>{error&&<p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">{t(`errors.${error}`)}</p>}</form>
 {result&&<section ref={resultBlock} tabIndex={-1} aria-live="polite" className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-6"><p className="break-all font-mono text-sm">{result.reference}</p><h2 className="mt-3 text-2xl font-black">{t(`states.${result.state}`)}</h2>{result.scheduledAt&&<p className="mt-4 font-semibold">{t('confirmedDate')}: {result.scheduledAt.replace('T',' ')} (UTC+1)</p>}{result.publicMessage&&<p className="mt-4 whitespace-pre-wrap leading-8">{result.publicMessage}</p>}</section>}</div>;
}
