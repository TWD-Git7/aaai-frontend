import {getTranslations,setRequestLocale} from 'next-intl/server';
import {BookingForm} from '@/components/booking-form';
import {RequestForm} from '@/components/request-form';
import {publicContacts} from '@/lib/public-config';
import {getServices} from '@/lib/wordpress';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {const {locale}=await params;const t=await getTranslations({locale});return {title:t('bookAppointment')};}
export default async function Appointment({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;setRequestLocale(locale);const t=await getTranslations();
 const enabled=Boolean(process.env.AAAI_ATENDIMENTO_API_KEY?.trim());const contacts=publicContacts(process.env);const remote=await getServices(locale);
 const services=remote?.length?remote:[{id:0,title:t('generalGuidance')}];
 return <main id="main-content" className="mx-auto max-w-5xl px-5 py-14 md:py-20"><p className="text-sm font-bold uppercase tracking-widest text-aaai-red">AAAI</p><h1 className="mt-3 text-4xl font-black md:text-5xl">{t('bookAppointment')}</h1><p className="mb-9 mt-5 max-w-3xl text-lg leading-8 text-neutral-600">{t(enabled?'appointments.intro':'appointmentIntro')}</p>{services.length?<>{enabled?<BookingForm services={services}/>:<RequestForm kind="appointment" email={contacts.email} whatsapp={contacts.whatsapp} services={services}/>}</>:<p className="rounded-xl bg-neutral-100 p-6">{t('emptyServices')}</p>}</main>;
}
