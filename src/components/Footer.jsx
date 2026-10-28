"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaLinkedinIn,
} from "react-icons/fa6";
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi"; 

export default function Footer() {
  const { language, translations } = useLanguage();

  // 1. Dicionário de Traduções locais para textos fixos e títulos do Footer
  const t = translations?.footer || {
    aboutText: {
      pt: "A AAAI é uma organização sem fins lucrativos que atua como ponte entre o Estado Angolano, representações diplomáticas e ONGs para apoiar Angolanos na diáspora e cidadãos estrangeiros residentes em Angola. O nosso compromisso é acolher, orientar e integrar.",
      en: "AAAI is a non-profit organisation acting as a bridge between the Angolan State, diplomatic missions, and NGOs to support Angolans in the diaspora and foreign citizens residing in Angola. Our commitment is to welcome, guide, and integrate.",
      fr: "L'AAAI est une organisation à but non lucratif qui sert de pont entre l'État angolais, les représentations diplomatiques et les ONG para soutenir les Angolais de la diaspora et les citoyens étrangers résidant en Angola. Notre engagement est d'accueillir, de guider et d'intégrer.",
      es: "La AAAI es una organización sin fines de lucro que atúa como puente entre el Estado Angoleño, representaciones diplomáticas y ONGs para apoyar a los angoleños en la diáspora y a los ciudadanos extranjeros residentes en Angola. Nuestro compromiso é acoger, orientar e integrar.",
      zh: "AAAI 是一家非营利组织，旨在成为安哥拉政府、外交代表机构与非政府组织（NGO）之间的桥梁，为海外安哥拉侨胞及在安居住的外国公民提供支持。我们的使命是欢迎、指导与融入。"
    }[language] || "A AAAI é uma organização sem fins lucrativos...",

    titleLinks: {
      pt: "Links Úteis",
      en: "Useful Links",
      fr: "Liens Utiles",
      es: "Enlaces Útiles",
      zh: "常用链接"
    }[language] || "Links Úteis",

    titleAreas: {
      pt: "Áreas de Atuação",
      en: "Areas of Action",
      fr: "Domaines d'Action",
      es: "Áreas de Actuación",
      zh: "业务领域"
    }[language] || "Áreas de Atuação",

    titleContact: {
      pt: "Contacto Geral",
      en: "General Contact",
      fr: "Contact Général",
      es: "Contacto General",
      zh: "综合联系"
    }[language] || "Contacto Geral",

    followUs: {
      pt: "Siga a nossa Comunidade",
      en: "Follow our Community",
      fr: "Suivez notre Communauté",
      es: "Siga a nossa Comunidad",
      zh: "关注 back 我们的社区"
    }[language] || "Siga a nossa Comunidade",

    rightsReserved: {
      pt: "Associação Angolana de Apoio a Imigrantes. Todos os direitos reservados.",
      en: "Angolan Association for Support to Immigrants. All rights reserved.",
      fr: "Association Angolaise d'Appui aux Immigrants. Tous droits réservés.",
      es: "Asociación Angoleña de Apoyo a Inmigrantes. Todos los derechos reservados.",
      zh: "安哥拉移民援助协会。版权所有。"
    }[language] || "Associação Angolana de Apoio a Imigrantes. Todos os direitos reservados."
  };

  // 2. Links Úteis Traduzidos
  const usefulLinks = [
    { 
      href: "/sobre",
      name: { pt: "Sobre Nós", en: "About Us", fr: "À Propos de Nous", es: "Sobre Nosotros", zh: "关于我们" }[language] || "Sobre Nós"
    },
    { 
      href: "/servicos",
      name: { pt: "Serviços Institucionais", en: "Institutional Services", fr: "Services Institutionnels", es: "Servicios Institucionales", zh: "机构服务" }[language] || "Serviços Institucionais"
    },
    { 
      href: "/faq",
      name: { pt: "Perguntas Frequentes (FAQ)", en: "Frequently Asked Questions (FAQ)", fr: "Foire Aux Questions (FAQ)", es: "Preguntas Frequentes (FAQ)", zh: "常见问题 (FAQ)" }[language] || "Perguntas Frequentes (FAQ)"
    },
    { 
      href: "/contactos",
      name: { pt: "Contactos", en: "Contacts", fr: "Contacts", es: "Contactos", zh: "联系我们" }[language] || "Contactos"
    }
  ];

  // 3. Áreas de Atuação Traduzidas
  const areasOfAction = [
    { pt: "Apoio Jurídico e Administrativo", en: "Legal and Administrative Support", fr: "Soutien Juridique et Administratif", es: "Soporte Jurídico y Administrativo", zh: "法律与行政支持" },
    { pt: "Apoio Humanitário e Social", en: "Humanitarian and Social Support", fr: "Soutien Humanitaire et Social", es: "Soporte Humanitario y Social", zh: "人道主义与社会援助" },
    { pt: "Informação e Sensibilização", en: "Information and Awareness", fr: "Information et Sensibilisation", es: "Información y Sensibilización", zh: "资讯与意识提升" },
    { pt: "Parcerias e Representação", en: "Partnerships and Representation", fr: "Partenariats et Représentation", es: "Alianzas y Representación", zh: "伙伴关系与代表" },
    { pt: "Integração Comunitária", en: "Community Integration", fr: "Intégration Communautaire", es: "Integración Comunitaria", zh: "社区融入" },
    { pt: "Formação e Capacitação", en: "Training and Capacity Building", fr: "Formation et Renforcement", es: "Formación y Capacitación", zh: "培训与赋能" }
  ].map(item => item[language] || item.pt);

  return (
    <footer className="bg-gray-950 text-gray-400 mt-20 border-t border-gray-900">
      {/* Secção Principal do Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Coluna 1: Sobre a Organização */}
        <div className="flex flex-col space-y-4">
          <div className="relative w-64 h-20">
            <Image 
              src="/assets/images/LogoAAAI_footer.png" 
              alt="Logotipo AAAI" 
              fill 
              sizes="(max-width: 768px) 100vw, 256px" 
              className="object-contain object-left" 
              priority 
            />
          </div>
          <p className="text-sm leading-relaxed text-gray-400 text-justify">
            {t.aboutText}
          </p>
        </div>

        {/* Coluna 2: Links Úteis */}
        <div>
          <h4 className="text-white text-xs font-semibold tracking-wider uppercase mb-6 border-l-2 border-yellow-500 pl-3">
            {t.titleLinks}
          </h4>
          <ul className="space-y-3 text-sm">
            {usefulLinks.map((link, idx) => (
              <li key={idx}>
                <Link 
                  href={link.href} 
                  className="inline-block hover:text-white transform hover:translate-x-1 transition-all duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna 3: Áreas de Atuação */}
        <div>
          <h4 className="text-white text-xs font-semibold tracking-wider uppercase mb-6 border-l-2 border-yellow-500 pl-3">
            {t.titleAreas}
          </h4>
          <ul className="space-y-3 text-sm">
            {areasOfAction.map((servico, idx) => (
              <li key={idx}>
                <Link 
                  href="/servicos" 
                  className="inline-block hover:text-white transform hover:translate-x-1 transition-all duration-300"
                >
                  {servico}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna 4: Contactos e Redes Sociais */}
        <div className="flex flex-col space-y-6">
          <div>
            <h4 className="text-white text-xs font-semibold tracking-wider uppercase mb-6 border-l-2 border-yellow-500 pl-3">
              {t.titleContact}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-yellow-500 text-lg mt-0.5 shrink-0" />
                <span className="leading-relaxed">Zango Zero, Rua 1, Condomínio das Acácias, Casa 38 - Luanda, Angola</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-yellow-500 text-base shrink-0" />
                <a href="mailto:geral@apoioimigrantes.com" className="hover:text-white transition-colors duration-300">
                  geral@apoioimigrantes.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-yellow-500 text-base shrink-0" />
                <span className="text-gray-300 font-medium">+244 924 217 955</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h5 className="text-white text-xs font-medium uppercase tracking-wider mb-3">
              {t.followUs}
            </h5>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com/apoioaimigrantes" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="bg-gray-900 hover:bg-blue-600 border border-gray-800 p-2.5 rounded-xl transition-all duration-300 group">
                <FaFacebookF className="text-gray-400 group-hover:text-white text-base" />
              </a>

              <a href="https://instagram.com/apoioaimigrantes" target="_blank" rel="noopener noreferrer" aria-label="Instagram" 
                className="bg-gray-900 hover:bg-gradient-to-tr hover:from-yellow-500 hover:to-purple-600 border border-gray-800 p-2.5 rounded-xl transition-all duration-300 group">
                <FaInstagram className="text-gray-400 group-hover:text-white text-base" />
              </a>

              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="bg-gray-900 hover:bg-black border border-gray-800 p-2.5 rounded-xl transition-all duration-300 group">
                <FaTiktok className="text-gray-400 group-hover:text-white text-base" />
              </a>

              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" 
                className="bg-gray-900 hover:bg-blue-700 border border-gray-800 p-2.5 rounded-xl transition-all duration-300 group">
                <FaLinkedinIn className="text-gray-400 group-hover:text-white text-base" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Direitos Autorais */}
      <div className="border-t border-gray-900 bg-gray-950/50 py-6 text-center text-xs text-gray-500 tracking-wide">
        &copy; {new Date().getFullYear()} &bull; {t.rightsReserved}
      </div>
    </footer>
  );
}