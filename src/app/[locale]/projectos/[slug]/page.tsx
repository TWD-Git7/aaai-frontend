import {setRequestLocale} from 'next-intl/server';
import {ContentDetail,detailMetadata} from '@/components/content-detail';
type Props={params:Promise<{locale:string;slug:string}>};
export async function generateMetadata({params}:Props) {
 const {locale,slug}=await params;return detailMetadata('projects',locale,slug);
}
export default async function DetailPage({params}:Props) {
 const {locale,slug}=await params;setRequestLocale(locale);
 return <ContentDetail kind="projects" locale={locale} slug={slug} back="/projectos"/>;
}
