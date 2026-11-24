'use client';
import {useEffect,useRef,useState} from 'react';
import {useTranslations} from 'next-intl';
import {Mail,MessageCircle,Send} from 'lucide-react';
import {localDate,requestLinks} from '@/lib/request-links';

export function RequestForm({kind,email,whatsapp,services=[]}:{kind:'appointment'|'process';email:string;whatsapp:string;services?:{id:number;title:string}[]}) {
 const t=useTranslations('requests');
 const [prepared,setPrepared]=useState(false);
 const [body,setBody]=useState('');
 const summary=useRef<HTMLDivElement>(null);
 const form=useRef<HTMLFormElement>(null);
 useEffect(()=>{if(prepared&&summary.current){summary.current.focus({preventScroll:true});summary.current.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}},[prepared]);
 const subject=t(kind==='appointment'?'subjectAppointment':'subjectProcess');
 const links=requestLinks({email,whatsapp,subject,body});
 const input='mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 focus:border-aaai-red';
 function prepare(event:React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const formElement=event.currentTarget;
  const data=new FormData(formElement);
  if(kind==='appointment'){
   const date=formElement.elements.namedItem('date') as HTMLInputElement;
   date.setCustomValidity(date.value<localDate()?t('dateError'):'');
   if(!formElement.reportValidity())return;
  }
  const fields=kind==='appointment'?['name','service','date','time','message']:['name','reference','message'];
  const text=fields.map(field=>[t(field),String(data.get(field)||'').trim()]).filter(([,value])=>value).map(([label,value])=>`${label}: ${value}`).join('\n');
  setBody(text);setPrepared(true);
 }
 return <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
  <form ref={form} onSubmit={prepare} hidden={prepared}>
   <p className="mb-6 text-sm leading-6 text-neutral-500">{t('requiredNote')}</p>
   <div className="grid gap-5 sm:grid-cols-2">
    <label className="block text-sm font-semibold sm:col-span-2">{t('name')} *<input name="name" autoComplete="name" required minLength={2} maxLength={100} className={input}/></label>
    {kind==='appointment'?<><label className="block text-sm font-semibold sm:col-span-2">{t('service')} *<select name="service" required className={input} defaultValue=""><option value="">{t('chooseService')}</option>{services.map(service=><option key={service.id} value={service.title}>{service.title}</option>)}</select></label><label className="block text-sm font-semibold">{t('date')} *<input name="date" type="date" required onFocus={event=>{event.currentTarget.min=localDate();}} onChange={event=>event.currentTarget.setCustomValidity('')} className={input}/></label><label className="block text-sm font-semibold">{t('time')} *<select name="time" required defaultValue="" className={input}><option value="">{t('chooseTime')}</option><option>{t('morning')}</option><option>{t('afternoon')}</option></select></label></>:<label className="block text-sm font-semibold sm:col-span-2">{t('reference')} *<input name="reference" required minLength={3} maxLength={80} autoComplete="off" className={input}/></label>}
    <label className="block text-sm font-semibold sm:col-span-2">{t('message')}<textarea name="message" rows={4} maxLength={1200} className={input}/></label>
   </div>
   <button type="submit" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-emerald-700"><Send size={17}/>{t('prepare')}</button>
  </form>
  {prepared&&<div ref={summary} tabIndex={-1}>
   <h2 className="text-2xl font-black">{t('summary')}</h2><pre className="mt-5 whitespace-pre-wrap break-words rounded-xl bg-neutral-50 p-5 font-sans text-sm leading-7">{body}</pre><p className="mt-5 text-sm leading-7 text-neutral-600">{t('handoff')}</p>
   <div className="mt-6 flex flex-wrap gap-3">{links.email&&<a href={links.email} className="inline-flex items-center gap-2 rounded-xl bg-aaai-red px-5 py-3 text-sm font-bold text-white"><Mail size={17}/>{t('email')}</a>}{links.whatsapp&&<a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"><MessageCircle size={17}/>{t('whatsapp')}</a>}<button type="button" onClick={()=>{setPrepared(false);requestAnimationFrame(()=>form.current?.querySelector<HTMLInputElement>('input')?.focus());}} className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-bold">{t('edit')}</button></div>
  </div>}
 </div>;
}
