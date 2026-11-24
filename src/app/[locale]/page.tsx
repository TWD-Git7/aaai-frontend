import {getTranslations,setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getServices,getContent} from '@/lib/wordpress';
import {ContentSection} from '@/components/content-section';
import {ServiceGrid} from '@/components/service-grid';
import {Hero} from '@/components/hero';

export default async function Home({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;
  setRequestLocale(locale);
  const t=await getTranslations();
  const [remote,news,events,projects,partners,slides]=await Promise.all([getServices(locale),getContent('news',locale),getContent('events',locale),getContent('projects',locale),getContent('partners',locale),getContent('slides',locale)]);
  const services=remote??Array.from({length:12},(_,i)=>({id:i+1,slug:String(i),title:t(`serviceNames.${i}`),description:'',locale,order:i}));
  return <main id="main-content"><Hero slides={slides??[]}/>
    <section className="mx-auto max-w-7xl px-5 py-20"><p className="text-sm font-bold uppercase tracking-widest text-aaai-red">AAAI</p><h2 className="mt-3 text-4xl font-black">{t('about')}</h2><p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">{t('description')}</p><Link href="/sobre" className="mt-6 inline-block font-bold text-aaai-red">{t('aboutPage')} →</Link></section>
    <section className="bg-neutral-50 px-5 py-20"><div className="mx-auto max-w-7xl"><h2 className="mb-8 text-4xl font-black">{t('servicesTitle')}</h2>{remote===null&&<p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">{t('demoNotice')}</p>}{services.length?<ServiceGrid services={services} linked={remote!==null}/>:<p>{t('emptyServices')}</p>}</div></section>
    {([{title:'newsTitle',items:news,href:'/noticias'},{title:'eventsTitle',items:events,href:'/eventos'},{title:'projectsTitle',items:projects,href:'/projectos'},{title:'partnersTitle',items:partners,href:'/parceiros'}] as const).map((section,i)=><div key={section.href} className={i%2?'bg-neutral-50':''}><ContentSection title={t(section.title)} items={section.items} empty={t('emptyContent')} unavailable={t('unavailable')} href={section.href} viewAll={t('viewAll')}/></div>)}
  </main>;
}
