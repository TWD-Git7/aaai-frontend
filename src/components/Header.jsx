/* components/Header.jsx */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { formTranslations } from '@/constants/translations';

export default function Header() {
  const pathname = usePathname();
  const { language } = useLanguage();

  // Fallback seguro de traduções
  const t = formTranslations[language] || formTranslations.pt || {};

  // Menu dinâmico baseado no idioma selecionado
  const menuItems = [
    { name: t.navHome || 'Início', href: '/' },
    { name: t.navAbout || 'Quem Somos', href: '/sobrenos' },
    { name: t.navServices || 'Serviços', href: '/servicos' },
    { name: t.navEvents || 'Eventos', href: '/eventos' },
    { name: t.navNews || 'Notícias', href: '/noticias' },
    { name: t.navContact || 'Contacto', href: '/contactos' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="relative w-12 h-12 flex items-center justify-center rounded-full border-2 border-angola-yellow overflow-hidden bg-gray-50">
            <Image 
              src="/assets/images/Logo_AAAIred.png" 
              alt={t.altLogo || "Logotipo AAAI"} 
              fill 
              sizes="48px" 
              className="object-cover" 
              priority
            />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-gray-900">AAAI</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {t.subtitleLogo || "Apoio a Imigrantes em Angola"}
            </p>
          </div>
        </Link>

        {/* Menu Expandido Dinâmico */}
        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link key={item.href}
                href={item.href}
                className={`pb-1 transition duration-200 ${
                  isActive
                    ? 'text-angola-red border-b-2 border-angola-red font-bold'
                    : 'text-gray-700 hover:text-angola-red'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Botão de Agendamento Crítico */}
        <div className="hidden sm:block">
          <Link 
            href="/agendamento" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2 px-4 rounded-lg shadow transition flex items-center gap-2"
          >
            <i className="fas fa-calendar-check"></i> {t.btnSchedule || "Agendar Atendimento"}
          </Link>
        </div>

      </div>
    </header>
  );
}