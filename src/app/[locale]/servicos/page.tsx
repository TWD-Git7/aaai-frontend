import {getTranslations,setRequestLocale} from 'next-intl/server';
import {getServices} from '@/lib/wordpress';
import {ServiceGrid} from '@/components/service-grid';
export default async function Services({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;setRequestLocale(locale);const t=await getTranslations();const remote=await getServices(locale);
 const services=remote ?? Array.from({length:12},(_,i)=>({id:i+1,slug:String(i),title:t(`serviceNames.${i}`),description:'',locale,order:i}));
 return <main id="main-content" className="mx-auto max-w-7xl px-5 py-20"><p className="font-bold uppercase tracking-widest text-aaai-red">AAAI</p><h1 className="mb-10 mt-3 text-5xl font-black">{t('servicesTitle')}</h1>{services.length?<ServiceGrid services={services} linked={remote!==null}/>:<p>{t('emptyServices')}</p>}{remote===null && <p className="mt-8 text-sm text-neutral-500">{t('demoNotice')}</p>}</main>;
}
