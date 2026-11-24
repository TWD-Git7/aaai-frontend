import {getTranslations,setRequestLocale} from 'next-intl/server';
import {Mail,MapPin,MessageCircle,Phone} from 'lucide-react';
import {publicContacts} from '@/lib/public-config';
import {Link} from '@/i18n/navigation';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;const t=await getTranslations({locale});return {title:t('contact')};
}
export default async function Contacts({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;setRequestLocale(locale);const t=await getTranslations();
 const {email,whatsapp,address,phone}=publicContacts(process.env);
 return <main id="main-content" className="mx-auto min-h-[60vh] max-w-7xl px-5 py-20"><p className="font-bold text-aaai-red">AAAI</p><h1 className="mt-3 text-4xl font-black md:text-5xl">{t('contact')}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">{t('contactIntro')}</p><div className="mt-10 grid gap-5 md:grid-cols-3">
 {phone&&<a href={`tel:${phone.replace(/[^+\d]/g,'')}`} className="rounded-2xl border p-6 hover:border-aaai-red"><Phone className="text-aaai-red"/><h2 className="mt-4 font-bold">{phone}</h2></a>}{email&&<a href={`mailto:${email}`} className="rounded-2xl border p-6 hover:border-aaai-red"><Mail className="text-aaai-red"/><h2 className="mt-4 font-bold">{t('emailUs')}</h2><p className="mt-2 break-words">{email}</p></a>}
 {whatsapp&&<a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="rounded-2xl border p-6 hover:border-aaai-red"><MessageCircle className="text-aaai-red"/><h2 className="mt-4 font-bold">{t('whatsapp')}</h2><p className="mt-2">+{whatsapp}</p></a>}
 {address&&<section className="rounded-2xl border p-6"><MapPin className="text-aaai-red"/><h2 className="mt-4 font-bold">{t('address')}</h2><p className="mt-2 whitespace-pre-line">{address}</p></section>}
 </div>{!email&&!whatsapp&&!address&&!phone&&<p className="mt-6 rounded-xl bg-neutral-100 p-6">{t('contactPending')}</p>}<Link href="/agendar" className="mt-9 inline-block rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white">{t('bookAppointment')} →</Link></main>;
}
