import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
export default async function NotFound() {
 const t=await getTranslations();
 return <main id="main-content" className="mx-auto min-h-[60vh] max-w-7xl px-5 py-20"><p className="font-bold text-aaai-red">404</p><h1 className="mt-3 text-4xl font-black">{t('notFound')}</h1><Link href="/" className="mt-6 inline-flex rounded-xl bg-aaai-red px-6 py-3 font-bold text-white">{t('backHome')}</Link></main>;
}
