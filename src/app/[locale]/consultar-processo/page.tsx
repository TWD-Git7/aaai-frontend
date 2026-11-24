import {getTranslations,setRequestLocale} from 'next-intl/server';
import {TrackingForm} from '@/components/tracking-form';
import {RequestForm} from '@/components/request-form';
import {publicContacts} from '@/lib/public-config';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {const {locale}=await params;const t=await getTranslations({locale});return {title:t('checkProcess'),robots:{index:false,follow:true}};}
export default async function Process({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;setRequestLocale(locale);const t=await getTranslations();const contacts=publicContacts(process.env);const enabled=Boolean(process.env.AAAI_ATENDIMENTO_API_KEY?.trim());
 return <main id="main-content" className="mx-auto max-w-5xl px-5 py-14 md:py-20"><p className="text-sm font-bold uppercase tracking-widest text-aaai-red">AAAI</p><h1 className="mt-3 text-4xl font-black md:text-5xl">{t('checkProcess')}</h1><p className="mb-9 mt-5 max-w-3xl text-lg leading-8 text-neutral-600">{t(enabled?'appointments.trackingIntro':'processIntro')}</p><>{enabled?<TrackingForm/>:<RequestForm kind="process" email={contacts.email} whatsapp={contacts.whatsapp}/>}</></main>;
}
