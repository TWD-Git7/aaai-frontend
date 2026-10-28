'use client';

import React, { useState, useEffect } from 'react';

export default function GaleriaEventosPage() {
  const [eventos, setEventos] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [loading, setLoading] = useState(true);

  // Estados para o Lightbox / Slider Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [fotosModal, setFotosModal] = useState([]);
  const [indiceFoto, setIndiceFoto] = useState(0);
  const [eventoAtivo, setEventoAtivo] = useState(null);

  // URL base limpa da API do WordPress
  const API_URL = 'http://localhost/aaaibwewp.com/wp-json/wp/v2';

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        // 1. Procurar categorias no WordPress com tratamento de erro
        const resCat = await fetch(`${API_URL}/categories?per_page=100`, {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        
        const cats = await resCat.json();

        // Garante que 'cats' é um Array antes de procurar
        if (Array.isArray(cats)) {
          const categoriaEventos = cats.find((c) => c.slug === 'eventos');

          if (categoriaEventos) {
            // Filtrar subcategorias pertencentes a Eventos
            const subs = cats.filter((c) => c.parent === categoriaEventos.id);
            setSubcategorias(subs);

            // 2. Buscar os posts do CPT de Eventos
            const resPosts = await fetch(
              `${API_URL}/eventos?categories=${categoriaEventos.id}&_embed=1&per_page=50`,
              { cache: 'no-store' }
            );
            const posts = await resPosts.json();
            
            if (Array.isArray(posts)) {
              setEventos(posts);
            } else {
              setEventos([]);
            }
          } else {
            console.warn('A categoria "eventos" não foi encontrada no WordPress. Certifique-se de criá-la.');
          }
        } else {
          console.error('A resposta da API de categorias não é um array válido:', cats);
        }
      } catch (error) {
        console.error('Erro ao conectar com a API do WordPress:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  // Filtragem dinâmica por subcategoria
  const eventosFiltrados =
    categoriaAtiva === 'todos'
      ? eventos
      : eventos.filter((evento) =>
          evento.categories && evento.categories.includes(Number(categoriaAtiva))
        );

  // Abrir o Modal com todas as fotos do Evento selecionado
  const abrirLightbox = (evento) => {
    const fotoDestaque =
      evento._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      '/placeholder-event.jpg';

    let galeria = evento.galeria_fotos && evento.galeria_fotos.length > 0
      ? evento.galeria_fotos.map((f) => f.url)
      : [fotoDestaque];

    if (!galeria.includes(fotoDestaque)) {
      galeria = [fotoDestaque, ...galeria];
    }

    setFotosModal(galeria);
    setIndiceFoto(0);
    setEventoAtivo(evento);
    setModalAberto(true);
  };

  const fecharLightbox = () => {
    setModalAberto(false);
    setEventoAtivo(null);
  };

  const fotoAnterior = (e) => {
    e.stopPropagation();
    setIndiceFoto((prev) => (prev === 0 ? fotosModal.length - 1 : prev - 1));
  };

  const proximaFoto = (e) => {
    e.stopPropagation();
    setIndiceFoto((prev) => (prev === fotosModal.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Cabeçalho */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
          Nossa Trajetória & Ações
        </span>
        <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Galeria de Eventos AAAI
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Acompanhe os momentos marcantes, workshops, palestras e ações sociais promovidas em apoio aos imigrantes.
        </p>
      </div>

      {/* Filtros Dinâmicos de Subcategorias */}
      {!loading && subcategorias.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-7xl mx-auto">
          <button
            onClick={() => setCategoriaAtiva('todos')}
            className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
              categoriaAtiva === 'todos'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Todos os Eventos
          </button>

          {subcategorias.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setCategoriaAtiva(sub.id.toString())}
              className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                categoriaAtiva === sub.id.toString()
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid da Galeria de Eventos */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : eventosFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            Nenhum evento encontrado nesta categoria.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {eventosFiltrados.map((evento) => {
              const imagemDestaque =
                evento._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                '/placeholder-event.jpg';

              const qtdFotos = evento.galeria_fotos?.length || 1;

              return (
                <div
                  key={evento.id}
                  onClick={() => abrirLightbox(evento)}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
                    <img
                      src={imagemDestaque}
                      alt={evento.title?.rendered || 'Evento'}
                      className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Ver Galeria ({qtdFotos} foto{qtdFotos > 1 ? 's' : ''}) 🔍
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3
                        className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1"
                        dangerouslySetInnerHTML={{ __html: evento.title?.rendered || '' }}
                      />
                      <div
                        className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: evento.excerpt?.rendered || evento.content?.rendered || '' }}
                      />
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span>{evento.date ? new Date(evento.date).toLocaleDateString('pt-PT') : ''}</span>
                      <span className="text-amber-600 font-semibold">Abrir evento →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal / Lightbox com Suporte a Múltiplas Fotos */}
      {modalAberto && eventoAtivo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 transition-all duration-300"
          onClick={fecharLightbox}
        >
          <button
            onClick={fecharLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full text-xl transition-all z-50 focus:outline-none"
            title="Fechar"
          >
            ✕
          </button>

          {fotosModal.length > 1 && (
            <>
              <button
                onClick={fotoAnterior}
                className="absolute left-4 sm:left-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full text-2xl transition-all z-50 focus:outline-none shadow-lg"
                title="Anterior"
              >
                ❮
              </button>
              <button
                onClick={proximaFoto}
                className="absolute right-4 sm:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full text-2xl transition-all z-50 focus:outline-none shadow-lg"
                title="Próxima"
              >
                ❯
              </button>
            </>
          )}

          <div
            className="relative max-w-5xl w-full bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-0">
              <img
                src={fotosModal[indiceFoto]}
                alt="Foto ampliada do evento"
                className="max-w-full max-h-[50vh] md:max-h-[80vh] object-contain select-none transition-all duration-300"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 text-white/90 px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm">
                Foto {indiceFoto + 1} de {fotosModal.length}
              </div>
            </div>

            <div className="w-full md:w-[380px] p-6 sm:p-8 flex flex-col justify-between bg-white overflow-y-auto max-h-[40vh] md:max-h-none border-t border-gray-100 md:border-t-0 md:border-l">
              <div>
                <span className="inline-block text-xs font-semibold tracking-wide text-amber-600 uppercase bg-amber-50 px-2.5 py-1 rounded-md mb-4">
                  Detalhes do Evento
                </span>
                <h2
                  className="text-2xl font-extrabold text-gray-900 leading-tight"
                  dangerouslySetInnerHTML={{ __html: eventoAtivo.title?.rendered || '' }}
                />
                <div className="h-px bg-gray-200 my-4" />
                <div
                  className="text-sm text-gray-600 leading-relaxed max-h-[25vh] md:max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar"
                  dangerouslySetInnerHTML={{ __html: eventoAtivo.content?.rendered || '' }}
                />
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                <span>Associação Angolana de Apoio a Imigrantes</span>
                <span>AAAI</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}