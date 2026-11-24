import type {Metadata} from 'next';
import {NextIntlClientProvider,hasLocale} from 'next-intl';
import {getMessages,getTranslations,setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {BackToTop} from '@/components/back-to-top';
import {publicContacts} from '@/lib/public-config';
import '../globals.css';
export const metadata:Metadata={title:{default:'AAAI | Associação Angolana de Apoio a Imigrantes',template:'%s | AAAI'},description:'Portal institucional da Associação Angolana de Apoio a Imigrantes'};
export function generateStaticParams(){return routing.locales.map(locale=>({locale}));}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!hasLocale(routing.locales,locale))notFound();setRequestLocale(locale);const messages=await getMessages();const t=await getTranslations();return <html lang={locale} data-scroll-behavior="smooth"><body><NextIntlClientProvider messages={messages}><a href="#main-content" className="skip-link">{t('skipContent')}</a><Header contacts={publicContacts(process.env)}/>{children}<Footer/><BackToTop/></NextIntlClientProvider></body></html>}
