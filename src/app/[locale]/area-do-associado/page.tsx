import {getTranslations,setRequestLocale} from 'next-intl/server';
import {UsersRound} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {publicContacts} from '@/lib/public-config';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {const {locale}=await params;const t=await getTranslations({locale});return {title:t('memberArea'),robots:{index:false,follow:true}};}
export default async function Member({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;setRequestLocale(locale);const t=await getTranslations();const {memberUrl}=publicContacts(process.env);
 return <main id="main-content" className="mx-auto min-h-[60vh] max-w-5xl px-5 py-14 md:py-20"><UsersRound className="text-aaai-red" size={38}/><h1 className="mt-5 text-4xl font-black md:text-5xl">{t('memberArea')}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600">{t('memberIntro')}</p>{memberUrl?<a href={memberUrl} className="mt-8 inline-block rounded-xl bg-aaai-red px-6 py-4 font-bold text-white">{t('memberArea')} →</a>:<p className="mt-8 rounded-2xl bg-neutral-100 p-6 leading-8 text-neutral-700">{t('memberPending')}</p>}<Link href="/contactos" className="mt-7 inline-block font-bold text-aaai-red hover:underline">{t('memberSupport')} →</Link></main>;
}
