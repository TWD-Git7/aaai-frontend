'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function EventosGaleria() {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [catSelecionada, setCatSelecionada] = useState('all');
  const [loading, setLoading] = useState(true);

  // ID da categoria mãe "Eventos" no WordPress (descobriremos dinamicamente ou fixando o ID)
  const WORDPRESS_URL = 'http://localhost/aaaibwewp.com';

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        
        // 1. Buscar todas as categorias para criar os botões de filtro
        const resCat = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/categories?per_page=100`);
        const dadosCat = await resCat.json();
        
        // Encontra o ID da categoria "Eventos"
        const categoriaMae = dadosCat.find(c => c.slug === 'eventos');
        const idEventos = categoriaMae ? categoriaMae.id : null;

        if (idEventos) {
          // Filtra apenas as subcategorias que pertencem a Eventos
          const subCategorias = dadosCat.filter(c => c.parent === idEventos);
          setCategorias(subCategorias);

          // 2. Buscar os posts pertencentes à categoria Eventos (e incluir dados de imagens com _embed)
          const resPosts = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?categories=${idEventos}&_embed=1&per_page=20`);
          const dadosPosts = await resPosts.json();
          setEventos(dadosPosts);
        }
      } catch (error) {
        console.error('Erro ao carregar galeria de eventos:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  // Filtragem local dos eventos com base no botão clicado
  const eventosFiltrados = catSelecionada === 'all'
    ? eventos
    : eventos.filter(evento => evento.categories.includes(parseInt(catSelecionada)));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho da Página */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Galeria de Eventos
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Acompanhe os registos fotográficos, atividades e comunicados da Associação Angolana de Apoio a Imigrantes (AAAI).
          </p>
        </div>

        {/* Filtros de Categorias (Estilo Abas/Botões) */}
        {categorias.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setCatSelecionada('all')}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                catSelecionada === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Todos os Eventos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCatSelecionada(cat.id.toString())}
                className={`px-5 py-2 rounded-full font-medium transition-all ${
                  catSelecionada === cat.id.toString()
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Estado de Carregamento */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : eventosFiltrados.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            Nenhum evento fotográfico encontrado nesta categoria.
          </div>
        ) : (
          /* Grid da Galeria de Fotos */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventosFiltrados.map((evento) => {
              // Captura a imagem destacada vinda do _embed de forma segura
              const imagemDestaque =
                evento._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                '/fallback-placeholder.jpg'; // Coloque uma imagem padrão na pasta public se falhar

              const altTexto = 
                evento._embedded?.['wp:featuredmedia']?.[0]?.alt_text || 
                evento.title.rendered;

              return (
                <div 
                  key={evento.id} 
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  {/* Container da Imagem (Efeito Zoom ao passar o rato) */}
                  <div className="relative h-64 w-full overflow-hidden bg-gray-200">
                    <img
                      src={imagemDestaque}
                      alt={altTexto}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {new Date(evento.date).toLocaleDateString('pt-PT')}
                    </div>
                  </div>

                  {/* Textos e Descrição */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 
                      className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors"
                      dangerouslySetInnerHTML={{ __html: evento.title.rendered }}
                    />
                    
                    {/* Descrição curta extraída do resumo ou conteúdo do post */}
                    <div 
                      className="text-gray-600 text-sm line-clamp-3 mb-4 mt-1 flex-grow leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: evento.excerpt?.rendered || evento.content?.rendered 
                      }}
                    />

                    {/* Botão para ver detalhes do Evento se necessário */}
                    <a
                      href={`/eventos/${evento.id}`}
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mt-auto group/btn"
                    >
                      Ver detalhes do evento
                      <svg className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}