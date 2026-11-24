'use client';
import {useTranslations} from 'next-intl';
export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}) {
 const t=useTranslations();
 return <main id="main-content" className="mx-auto min-h-[60vh] max-w-7xl px-5 py-20"><h1 className="text-3xl font-bold">{t('errorMessage')}</h1><button onClick={reset} className="mt-6 rounded-xl bg-aaai-red px-6 py-3 font-bold text-white">{t('retry')}</button></main>;
}
