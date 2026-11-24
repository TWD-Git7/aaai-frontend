import {getTranslations,setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;const t=await getTranslations({locale});return {title:t('aboutPage')};
}
export default async function About({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;setRequestLocale(locale);const t=await getTranslations();
 return <main id="main-content" className="mx-auto min-h-[60vh] max-w-7xl px-5 py-20"><p className="font-bold text-aaai-red">AAAI</p><h1 className="mt-3 text-4xl font-black md:text-5xl">{t('about')}</h1><p className="mt-8 max-w-3xl text-xl leading-9 text-neutral-600">{t('description')}</p><p className="mt-5 max-w-3xl text-lg leading-8">{t('subtitle')}</p><Link href="/servicos" className="mt-8 inline-flex rounded-xl bg-aaai-red px-6 py-4 font-bold text-white">{t('servicesTitle')} →</Link></main>;
}
