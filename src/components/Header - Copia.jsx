/* components/Header.jsx */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Verificar se o usuário está logado (simulação - substituir com sua lógica de autenticação)
  useEffect(() => {
    // Exemplo: verificar token no localStorage
    const token = localStorage.getItem('aaai_token');
    const nome = localStorage.getItem('aaai_user_name');
    if (token) {
      setIsLoggedIn(true);
      setUserName(nome || 'Admin');
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem('aaai_token');
    localStorage.removeItem('aaai_user_name');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  // Links do menu principal
  const menuLinks = [
    { href: '/', label: 'Início', icon: '🏠' },
    { href: '/quem-somos', label: 'Quem Somos', icon: '🤝' },
    { href: '/servicos', label: 'Serviços', icon: '📋' },
    { href: '/documentacao-sme', label: 'Documentação & SME', icon: '📄' },
    { href: '/guia-dire-vistos', label: 'Guias e Vistos', icon: '🛂' },
    { href: '/eventos', label: 'Eventos', icon: '📅' },
    { href: '/noticias', label: 'Notícias', icon: '📰' },
    { href: '/faq', label: 'FAQ', icon: '❓' },
    { href: '/contacto', label: 'Contacto', icon: '📞' },
  ];

  // Links da área do associado
  const associadoLinks = [
    { href: '/minha-conta', label: 'Minha Conta', icon: '👤' },
    { href: '/meus-pedidos', label: 'Meus Pedidos', icon: '📋' },
    { href: '/consultar-status', label: 'Consultar Status', icon: '🔍' },
    { href: '/editar-perfil', label: 'Editar Perfil', icon: '✏️' },
    { href: '/historico', label: 'Histórico', icon: '📜' },
  ];

  // Links administrativos
  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/utentes', label: 'Gerenciar Utentes', icon: '👤' },
    { href: '/admin/pedidos', label: 'Gerenciar Pedidos', icon: '📋' },
    { href: '/admin/recibos', label: 'Recibos & Fichas', icon: '📄' },
    { href: '/admin/configuracoes', label: 'Configurações', icon: '⚙️' },
  ];

  // Verificar se link está ativo
  const isActive = (href) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition group">
            <div className="w-12 h-12 bg-gradient-to-br from-angola-red to-angola-yellow rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-angola-yellow shadow-md group-hover:scale-105 transition">
              AAAI
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-tight text-gray-900">AAAI</h1>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Apoio a Imigrantes em Angola
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-gray-700">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-angola-red transition flex items-center gap-1 ${
                  isActive(link.href) 
                    ? 'text-angola-red border-b-2 border-angola-red pb-1' 
                    : 'hover:border-b-2 hover:border-angola-red/50 pb-1'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3">
            {/* Consulta de Status - Botão Rápido */}
            <Link
              href="/consultar-status"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-angola-red transition bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg"
            >
              <span>🔍</span>
              <span className="hidden lg:inline">Consultar Status</span>
            </Link>

            {/* Área do Associado */}
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-medium text-white bg-angola-red px-4 py-2 rounded-lg hover:bg-angola-red/90 transition">
                  <span>👤</span>
                  <span>{userName}</span>
                  <span className="text-xs">▼</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 hidden group-hover:block">
                  {associadoLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-angola-red transition"
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition"
                  >
                    <span>🚪</span>
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 text-sm font-medium text-white bg-angola-red px-4 py-2 rounded-lg hover:bg-angola-red/90 transition"
              >
                <span>🔑</span>
                Entrar
              </Link>
            )}

            {/* Botão Agendamento - Destaque */}
            <Link
              href="/guia-dire-vistos" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2 px-4 rounded-lg shadow-md transition flex items-center gap-2 whitespace-nowrap"
            >
              <span>📝</span>
              <span className="hidden sm:inline">Formulário de Inscrição</span>
              <span className="sm:hidden">Inscrição</span>
            </Link>

            {/* Menu Mobile Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-2">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition ${
                    isActive(link.href) ? 'text-angola-red bg-angola-red/5' : 'text-gray-700'
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              
              <hr className="my-2 border-gray-200" />
              
              {/* Links do Associado no Mobile */}
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    👤 Área do Associado
                  </div>
                  {associadoLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition w-full text-left"
                  >
                    <span>🚪</span>
                    Sair
                  </button>
                </>
              ) : (
                <Link href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-angola-red rounded-lg hover:bg-angola-red/90 transition"
                >
                  <span>🔑</span>
                  Entrar
                </Link>
              )}

              {/* Links Admin no Mobile (visível apenas para admin) */}
              {isLoggedIn && (
                <>
                  <hr className="my-2 border-gray-200" />
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    ⚙️ Administração
                  </div>
                  {adminLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </>
              )}

              {/* Botão de Agendamento no Mobile */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Link
                  href="/guia-dire-vistos"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition w-full"
                >
                  <span>📝</span>
                  Formulário de Inscrição
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Barra de Status Rápido (opcional) */}
      <div className="bg-gray-50 border-t border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>📌 <strong>Horário:</strong> Seg-Sex, 8h-17h</span>
              <span>📞 <strong>WhatsApp:</strong> +244 900 000 000</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/consultar-status" className="hover:text-angola-red transition">
                🔍 Consultar Processo
              </Link>
              <Link href="/faq" className="hover:text-angola-red transition">
                ❓ FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}