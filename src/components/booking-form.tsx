'use client';
import {useEffect,useRef,useState} from 'react';
import {useLocale,useTranslations} from 'next-intl';
import {CalendarDays,Download,LoaderCircle} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {appointmentToday,validReceipt} from '@/lib/appointments';
export function BookingForm({services}:{services:{id:number;title:string}[]}) {
 const t=useTranslations('appointments');const locale=useLocale();
 const [pending,setPending]=useState(false);const [error,setError]=useState('');
 const [receipt,setReceipt]=useState<{reference:string;accessCode:string}|null>(null);
 const receiptBlock=useRef<HTMLElement>(null);
 useEffect(()=>{if(receipt&&receiptBlock.current){receiptBlock.current.focus({preventScroll:true});receiptBlock.current.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}},[receipt]);
 const retry=useRef({payload:'',key:''});
 const input='mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950';
 async function submit(event:React.FormEvent<HTMLFormElement>) {
  event.preventDefault();if(pending)return;
  const form=new FormData(event.currentTarget);
  const fields={name:String(form.get('name')).trim(),email:String(form.get('email')).trim(),phone:String(form.get('phone')||'').trim(),service:String(form.get('service')),date:String(form.get('date')),period:String(form.get('period')),message:String(form.get('message')||'').trim(),locale,consent:form.get('consent')==='on'};
  const fingerprint=JSON.stringify(fields);if(retry.current.payload!==fingerprint)retry.current={payload:fingerprint,key:crypto.randomUUID()};
  setPending(true);setError('');
  try {
   const response=await fetch('/api/appointments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...fields,idempotencyKey:retry.current.key})});
   const data=await response.json();
   if(!response.ok)throw Error(['invalid','conflict','rate_limited'].includes(data.error)?data.error:'unavailable');
   if(!validReceipt(data))throw Error('unavailable');
   setReceipt(data);
  }catch(error){setError(error instanceof Error&&['invalid','conflict','rate_limited'].includes(error.message)?error.message:'unavailable');}
  finally{setPending(false);}
 }
 if(receipt)return <section ref={receiptBlock} tabIndex={-1} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 md:p-8" aria-live="polite"><h2 className="text-2xl font-black">{t('received')}</h2><p className="mt-4 leading-8">{t('receiptHelp')}</p><dl className="mt-6 grid gap-4 rounded-xl bg-white p-5"><div><dt className="text-sm text-neutral-500">{t('reference')}</dt><dd className="mt-1 break-all font-mono text-lg font-bold">{receipt.reference}</dd></div><div><dt className="text-sm text-neutral-500">{t('accessCode')}</dt><dd className="mt-1 break-all font-mono text-lg font-bold">{receipt.accessCode}</dd></div></dl><button type="button" onClick={()=>{
  const blob=new Blob([`AAAI\n${t('reference')}: ${receipt.reference}\n${t('accessCode')}: ${receipt.accessCode}\n\n${t('receiptHelp')}`],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=`${receipt.reference}.txt`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white"><Download size={18}/>{t('saveReceipt')}</button><Link href="/consultar-processo" className="ml-0 mt-4 block font-bold text-aaai-red hover:underline">{t('track')} →</Link></section>;
 return <form onSubmit={submit} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
  <p className="mb-6 text-sm leading-7 text-neutral-500">{t('required')}</p><div className="grid gap-5 sm:grid-cols-2">
   <label className="text-sm font-semibold sm:col-span-2">{t('name')} *<input name="name" required minLength={2} maxLength={100} autoComplete="name" className={input}/></label>
   <label className="text-sm font-semibold">{t('email')} *<input name="email" type="email" required maxLength={254} autoComplete="email" className={input}/></label>
   <label className="text-sm font-semibold">{t('phone')}<input name="phone" type="tel" maxLength={40} autoComplete="tel" className={input}/></label>
   <label className="text-sm font-semibold sm:col-span-2">{t('service')} *<select name="service" required defaultValue="" className={input}><option value="">{t('choose')}</option>{services.map(s=><option key={s.id}>{s.title}</option>)}</select></label>
   <label className="text-sm font-semibold">{t('date')} *<input name="date" type="date" required onFocus={event=>{event.currentTarget.min=appointmentToday();}} className={input}/></label>
   <label className="text-sm font-semibold">{t('period')} *<select name="period" required defaultValue="" className={input}><option value="">{t('choose')}</option><option value="morning">{t('morning')}</option><option value="afternoon">{t('afternoon')}</option></select></label>
   <label className="text-sm font-semibold sm:col-span-2">{t('message')}<textarea name="message" rows={4} maxLength={1200} className={input}/></label>
  </div><label className="mt-6 flex items-start gap-3 text-sm leading-7"><input name="consent" type="checkbox" required className="mt-1.5 h-5 w-5 shrink-0"/><span>{t('consent')} <Link href="/privacidade" target="_blank" rel="noopener noreferrer" className="font-semibold text-aaai-red underline">{t('privacyLink')}</Link></span></label>
  {error&&<p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">{t(`errors.${error}`)}</p>}
  <button disabled={pending} type="submit" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white disabled:cursor-wait disabled:opacity-60">{pending?<LoaderCircle className="animate-spin" size={18}/>:<CalendarDays size={18}/>} {t(pending?'sending':'submit')}</button>
 </form>;
}
