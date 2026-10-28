"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

// 1. Definimos os idiomas estritos aceites pelo sistema
type SupportedLanguages = "pt" | "en" | "fr" | "es" | "zh";

function isSupportedLanguage(
  value: unknown
): value is SupportedLanguages {
  return (
    typeof value === "string" &&
    ["pt", "en", "fr", "es", "zh"].includes(value)
  );
}

export default function Home() {
  const { language, translations } = useLanguage();

  // 2. Garantimos que o 'language' seja tratado rigorosamente como um dos 5 idiomas suportados
  const activeLang: SupportedLanguages = isSupportedLanguage(language) ? language : "pt";


  // 3. Dicionário de Traduções locais tipado
  const t = translations?.home || {
    heroBadge: {
      pt: "Bem-vindo a Angola",
      en: "Welcome to Angola",
      fr: "Bienvenue en Angola",
      es: "Bienvenido a Angola",
      zh: "欢迎来到安哥拉"
    }[activeLang],

    heroTitle: {
      pt: <>Seu parceiro seguro para a integração e <span className="text-amber-500">legalização em Angola</span></>,
      en: <>Your secure partner for integration and <span className="text-amber-500">legalization in Angola</span></>,
      fr: <>Votre partenaire de confiance pour l'intégration et la <span className="text-amber-500">légalisation en Angola</span></>,
      es: <>Su socio seguro para la integración y <span className="text-amber-500">legalización en Angola</span></>,
      zh: <>您在安哥拉融入与<span className="text-amber-500">合法化身份</span>的安全合作伙伴</>
    }[activeLang],

    heroDesc: {
      pt: "Apoiamos imigrantes, expatriados e a diáspora com agendamentos, tradução, suporte jurídico e orientação em coordenação com as políticas migratórias vigentes.",
      en: "We support immigrants, expats, and the diaspora with appointments, translation, legal support, and guidance in coordination with current migration policies.",
      fr: "Nous accompagnons les immigrants, les expatriés et la diaspora pour les rendez-vous, la traduction, l'assistance juridique et l'orientation selon les politiques migratoires en vigueur.",
      es: "Apoyamos a inmigrantes, expatriados y la diáspora con citas, traducción, soporte jurídico y orientación en coordinación con las políticas migratorias vigentes.",
      zh: "我们配合现行移民政策，为移民、外籍人士及海外侨胞提供预约、翻译、法律支持和指导服务。"
    }[activeLang],

    btnServices: {
      pt: "Ver Serviços Disponíveis",
      en: "View Available Services",
      fr: "Voir les Services Disponibles",
      es: "Ver Servicios Disponibles",
      zh: "查看可用服务"
    }[activeLang],

    btnGuide: {
      pt: "Guia do DIRE e Vistos",
      en: "DIRE & Visa Guide",
      fr: "Guide du DIRE et Visas",
      es: "Guía del DIRE y Visados",
      zh: "DIRE 与签证指南"
    }[activeLang],

    btnConsult: {
      pt: "🔍 Consultar Processo",
      en: "🔍 Check Process Status",
      fr: "🔍 Consulter le Dossier",
      es: "🔍 Consultar Proceso",
      zh: "🔍 查询进度"
    }[activeLang],

    sectionTitle: {
      pt: "Nossos Principais Serviços",
      en: "Our Main Services",
      fr: "Nos Principaux Services",
      es: "Nuestros Principales Servicios",
      zh: "我们的核心服务"
    }[activeLang],

    sectionDesc: {
      pt: "Suporte completo para a sua transição e estadia segura no país.",
      en: "Full support for your transition and secure stay in the country.",
      fr: "Un accompagnement complet pour votre transition et un séjour en toute sécurité dans le pays.",
      es: "Soporte completo para su transición y estancia segura en el país.",
      zh: "为您在安哥拉过渡与安全居留提供全方位支持。"
    }[activeLang],

    learnMore: {
      pt: "Saber mais",
      en: "Learn more",
      fr: "En savoir plus",
      es: "Saber más",
      zh: "了解更多"
    }[activeLang]
  };

  // 4. Mapeamento dos 12 Cards com indexação segura
  const servicesList = [
    {
      icon: "fas fa-passport",
      bgIcon: "bg-red-100 text-red-600",
      link: "/servicos/vistos",
      title: { pt: "Vistos e DIRE", en: "Visas & DIRE", fr: "Visas et DIRE", es: "Visados y DIRE", zh: "签证与 DIRE" }[activeLang],
      desc: {
        pt: "Orientação passo a passo para emissão, renovação e regularização junto ao SME.",
        en: "Step-by-step guidance for issuance, renewal, and regularisation with SME.",
        fr: "Orientation étape par étape pour l'obtention, le renouvellement et la régularisation auprès du SME.",
        es: "Orientación passo a paso para la emisión, renovación y regularización ante el SME.",
        zh: "为您在移民局（SME）办理签证发放、续签及合规化提供逐步指导。"
      }[activeLang]
    },
    {
      icon: "fas fa-language",
      bgIcon: "bg-amber-100 text-amber-600",
      link: "/servicos/traducoes",
      title: { pt: "Tradução de Documentos", en: "Document Translation", fr: "Traduction de Documents", es: "Traducción de Documentos", zh: "文件翻译" }[activeLang],
      desc: {
        pt: "Tradução oficial e legalização de documentos estrangeiros para conformidade legal.",
        en: "Official translation and legalisation of foreign documents for legal compliance.",
        fr: "Traduction officielle et légalisation de documents étrangers pour la conformité légale.",
        es: "Traducción oficial y legalización de documentos extranjeros para cumplimiento legal.",
        zh: "外国文件的官方翻译与双认证，确保法律合规性。"
      }[activeLang]
    },
    {
      icon: "fas fa-scale-balanced",
      bgIcon: "bg-blue-100 text-blue-600",
      link: "/servicos/apoio-juridico",
      title: { pt: "Apoio Jurídico", en: "Legal Support", fr: "Assistance Juridique", es: "Soporte Jurídico", zh: "法律支持" }[activeLang],
      desc: {
        pt: "Orientação jurídica em processos migratórios, direitos dos imigrantes e regularização documental.",
        en: "Legal guidance in migration processes, immigrant rights, and document regularisation.",
        fr: "Orientation juridique dans les procédures migratoires, droits des immigrants et régularisation.",
        es: "Orientación jurídica en procesos migratorios, derechos de los inmigrantes y regularización.",
        zh: "针对移民流程、移民权利和文件合规化提供专业的法律指导。"
      }[activeLang]
    },
    {
      icon: "fas fa-people-roof",
      bgIcon: "bg-green-100 text-green-600",
      link: "/servicos/reagrupamento-familiar",
      title: { pt: "Reagrupamento Familiar", en: "Family Reintegration", fr: "Regroupement Familial", es: "Reagrupamiento Familiar", zh: "家庭团聚" }[activeLang],
      desc: {
        pt: "Assistência na preparação e acompanhamento dos processos de reunificação familiar.",
        en: "Assistance in preparing and monitoring family reunification processes.",
        fr: "Assistance dans la préparation et le suivi des procédures de regroupement familial.",
        es: "Asistencia en la preparación y seguimiento de los procesos de reunificación familiar.",
        zh: "协助准备并全程跟进家庭团聚申请流程。"
      }[activeLang]
    },
    {
      icon: "fas fa-home",
      bgIcon: "bg-emerald-100 text-emerald-600",
      link: "/servicos/moradia",
      title: { pt: "Moradia Segura", en: "Secure Housing", fr: "Logement Sécurisé", es: "Vivienda Segura", zh: "安全住房" }[activeLang],
      desc: {
        pt: "Guia de bairros seguros, contratos de arrendamento e prevenção contra fraudes.",
        en: "Safe neighborhood guide, lease agreements, and fraud prevention.",
        fr: "Guide des quartiers sécurisés, contrats de location et prévention des fraudes.",
        es: "Guía de barrios seguros, contratos de alquiler y prevención contra fraudes.",
        zh: "安全社区指南、租房合同审核及防范租房诈骗提示。"
      }[activeLang]
    },
    {
      icon: "fas fa-globe-africa",
      bgIcon: "bg-purple-100 text-purple-600",
      link: "/servicos/consultoria-migratoria",
      title: { pt: "Consultoria Migratória", en: "Migration Consultancy", fr: "Conseil en Migration", es: "Consultoría Migratoria", zh: "移民咨询" }[activeLang],
      desc: {
        pt: "Informações sobre vistos, residência, legislação migratória e oportunidades de mobilidade internacional.",
        en: "Information on visas, residence, migration legislation, and international mobility opportunities.",
        fr: "Informations sur les visas, la résidence, la législation et les opportunités de mobilité.",
        es: "Información sobre visados, residencia, legislación migratoria y oportunidades de movilidad.",
        zh: "提供关于签证、居留、移民法令和国际流动机会的专业资讯。"
      }[activeLang]
    },
    {
      icon: "fas fa-building-columns",
      bgIcon: "bg-cyan-100 text-cyan-600",
      link: "/servicos/apoio-consular",
      title: { pt: "Apoio Consular", en: "Consular Support", fr: "Soutien Consulaire", es: "Apoyo Consular", zh: "领事协助" }[activeLang],
      desc: {
        pt: "Orientação para serviços consulares, emissão de documentos e contacto com embaixadas.",
        en: "Guidance for consular services, document issuance, and embassy contact.",
        fr: "Orientation pour les services consulaires, délivrance de documents et contact avec les ambassades.",
        es: "Orientación para servicios consulares, emisión de documentos y contacto con embajadas.",
        zh: "领事业务办理指导、证件签发以及协助联系各大使馆。"
      }[activeLang]
    },
    {
      icon: "fas fa-briefcase",
      bgIcon: "bg-orange-100 text-orange-600",
      link: "/servicos/emprego",
      title: { pt: "Emprego e Integração", en: "Employment & Integration", fr: "Emploi et Intégration", es: "Empleo e Integración", zh: "就业与融入" }[activeLang],
      desc: {
        pt: "Apoio na integração ao mercado de trabalho, elaboração de CV e encaminhamento para oportunidades.",
        en: "Support for integration into the labor market, CV drafting, and opportunity referral.",
        fr: "Soutien à l'intégration sur le marché du travail, rédaction de CV et orientation.",
        es: "Apoyo en la integración al mercado laboral, redacción de CV y derivación a oportunidades.",
        zh: "协助融入当地就业市场、简历修改撰写及推荐合适的工作机会。"
      }[activeLang]
    },
    {
      icon: "fas fa-graduation-cap",
      bgIcon: "bg-indigo-100 text-indigo-600",
      link: "/servicos/formacao",
      title: { pt: "Formação e Capacitação", en: "Training & Capacity Building", fr: "Formation et Renforcement", es: "Formación y Capacitación", zh: "培训与赋能" }[activeLang],
      desc: {
        pt: "Workshops, cursos e palestras sobre integração social, direitos dos migrantes e desenvolvimento.",
        en: "Workshops, courses, and lectures on social integration, migrants' rights, and development.",
        fr: "Ateliers, cours et conférences sur l'intégration sociale, les droits des migrants et le développement.",
        es: "Talleres, cursos y conferencias sobre integración social, derechos de migrantes y desarrollo.",
        zh: "关于社会融入、移民权益及个人职业发展的工作坊、课程和讲座。"
      }[activeLang]
    },
    {
      icon: "fas fa-user-graduate",
      bgIcon: "bg-pink-100 text-pink-600",
      link: "/servicos/estudantes",
      title: { pt: "Estudantes Internacionais", en: "International Students", fr: "Étudiants Internationaux", es: "Estudiantes Internacionales", zh: "国际学生服务" }[activeLang],
      desc: {
        pt: "Apoio a estudantes estrangeiros com documentação, integração académica e orientação.",
        en: "Support for foreign students with documentation, academic integration, and institutional guidance.",
        fr: "Soutien aux étudiants étrangers pour les documents, l'intégration académique et l'orientation.",
        es: "Apoyo a estudantes extranjeros con documentación, integración académica y orientación.",
        zh: "为外国留学生在学籍注册、学术融入以及院校指南上提供全方位文件支持。"
      }[activeLang]
    },
    {
      icon: "fas fa-hand-holding-heart",
      bgIcon: "bg-red-100 text-red-600",
      link: "/servicos/atendimento-humanitario",
      title: { pt: "Atendimento Humanitário", en: "Humanitarian Aid", fr: "Assistance Humanitaire", es: "Atención Humanitaria", zh: "人道主义援助" }[activeLang],
      desc: {
        pt: "Encaminhamento para apoio social, assistência emergencial e serviços de proteção aos migrantes vulneráveis.",
        en: "Referral to social support, emergency assistance, and protection services for vulnerable migrants.",
        fr: "Orientation vers un soutien social, une aide d'urgence et des services de protection.",
        es: "Derivación a apoyo social, asistencia de emergencia y servicios de protección para migrantes.",
        zh: "为弱势移民群体提供对接社会救助、紧急援助及人道主义安全保护服务。"
      }[activeLang]
    },
    {
      icon: "fas fa-users",
      bgIcon: "bg-blue-100 text-blue-600",
      link: "/servicos/cultura",
      title: { pt: "Cursos & Cultura", en: "Courses & Culture", fr: "Cours et Culture", es: "Cursos y Cultura", zh: "语言课程与文化" }[activeLang],
      desc: {
        pt: "Aulas de Língua Portuguesa e workshops de aculturação e networking corporativo.",
        en: "Portuguese language classes and corporate acculturation and networking workshops.",
        fr: "Cours de langue portugaise et ateliers d'acculturation et de réseautage d'entreprise.",
        es: "Clases de idioma portugués y talleres de aculturación y networking empresarial.",
        zh: "葡萄牙语语言培训、文化适应工作坊以及企业人脉拓展活动。"
      }[activeLang]
    }
  ];

  return (
    <main>
      <section className="relative bg-gradient-to-r from-gray-900 to-amber-950 text-white py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0')] bg-cover bg-center"></div>
        <div className="relative max-w-4xl mx-auto">
          <span className="bg-amber-500 text-gray-900 font-bold text-xs uppercase px-3 py-1 rounded-full tracking-widest">
            {t.heroBadge}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-4 mb-6 leading-tight">
            {t.heroTitle}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            {t.heroDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/servicos" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition duration-200">
              <i className="fas fa-info-circle mr-2"></i> {t.btnServices}
            </Link>
            <Link href="/guia-dire-vistos" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-6 py-3 rounded-lg backdrop-blur transition duration-200">
              <i className="fas fa-file-invoice mr-2"></i> {t.btnGuide}
            </Link>
            <Link href="/consulta" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg shadow-lg text-md transition inline-block">
              {t.btnConsult}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{t.sectionTitle}</h2>
          <p className="text-gray-600 mt-2">{t.sectionDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 ${service.bgIcon} rounded-lg flex items-center justify-center text-xl mb-4`}>
                  <i className={service.icon}></i>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
              <Link href={service.link} className="text-red-600 font-semibold text-xs mt-4 inline-flex items-center gap-1 hover:underline">
                {t.learnMore} <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}