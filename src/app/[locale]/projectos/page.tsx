import {getTranslations,setRequestLocale} from 'next-intl/server';
import {getContent} from '@/lib/wordpress';
import {ContentSection} from '@/components/content-section';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;const t=await getTranslations({locale});return {title:t('projectsTitle')};
}
export default async function Page({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;setRequestLocale(locale);const t=await getTranslations();
 const items=await getContent('projects',locale);
 return <main id="main-content"><ContentSection title={t('projectsTitle')} items={items} empty={t('emptyContent')} unavailable={t('unavailable')} limit={Number.POSITIVE_INFINITY} heading="h1" itemBase="/projectos"/></main>;
}
