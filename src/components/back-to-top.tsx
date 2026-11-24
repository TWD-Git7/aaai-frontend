'use client';
import {useEffect,useState} from 'react';
import {ArrowUp} from 'lucide-react';
import {useTranslations} from 'next-intl';
export function BackToTop() {
 const [visible,setVisible]=useState(false);
 const t=useTranslations();
 useEffect(()=>{const update=()=>setVisible(window.scrollY>400);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);
 if(!visible)return null;
 return <button type="button" aria-label={t('backToTop')} title={t('backToTop')} onClick={()=>{
   window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
   const heading=document.querySelector<HTMLElement>('#main-content h1');
   if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
 }} className="fixed bottom-6 right-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-aaai-red text-white shadow-xl transition hover:-translate-y-1 hover:bg-red-700 print:hidden"><ArrowUp size={22}/></button>;
}
