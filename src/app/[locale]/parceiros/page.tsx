import {getTranslations,setRequestLocale} from 'next-intl/server';
import {getContent} from '@/lib/wordpress';
import {ContentSection} from '@/components/content-section';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;const t=await getTranslations({locale});return {title:t('partnersTitle')};
}
export default async function Page({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;setRequestLocale(locale);const t=await getTranslations();
 const items=await getContent('partners',locale);
 return <main id="main-content"><ContentSection title={t('partnersTitle')} items={items} empty={t('emptyContent')} unavailable={t('unavailable')} limit={Number.POSITIVE_INFINITY} heading="h1" itemBase="/parceiros"/></main>;
}
