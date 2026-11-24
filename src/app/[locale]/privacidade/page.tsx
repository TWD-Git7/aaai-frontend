import {getTranslations,setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {const {locale}=await params;const t=await getTranslations({locale});return {title:t('privacyTitle')};}
export default async function DataInfo({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;setRequestLocale(locale);const t=await getTranslations();
 return <main id="main-content" className="mx-auto max-w-4xl px-5 py-14 md:py-20"><p className="text-sm font-bold uppercase tracking-widest text-aaai-red">AAAI</p><h1 className="mt-3 text-4xl font-black">{t('dataInfo.heading')}</h1><div className="mt-8 space-y-5 text-lg leading-9 text-neutral-600">{['collection','storage','lookup','contact'].map(key=><p key={key}>{t(`dataInfo.${key}`)}</p>)}</div><Link href="/contactos" className="mt-8 inline-block font-bold text-aaai-red hover:underline">{t('contact')} →</Link></main>;
}
