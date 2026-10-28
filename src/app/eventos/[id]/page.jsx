import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Função para buscar o evento individual na API do WordPress
async function getEvento(id) {
  const WP_URL = 'http://localhost/aaaibwewp.com'; // Ajuste para a URL real do seu WordPress
  
  // O parâmetro _embed=1 traz os metadados como a imagem destacada num único pedido HTTP
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts/${id}?_embed=1`, {
    next: { revalidate: 60 }, // Atualiza o cache a cada 60 segundos
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function EventoIndividualPage({ params }) {
  // CRÍTICO (Next.js 15/16): O objeto params é uma Promise, precisamos de fazer await
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const evento = await getEvento(id);

  // Se o evento não for encontrado ou não existir
  if (!evento) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Evento não encontrado</h1>
        <p className="text-gray-600 mb-6">O evento que procura não existe ou foi removido.</p>
        <Link href="/eventos" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
          Voltar para a Galeria
        </Link>
      </div>
    );
  }

  // Extração segura da Imagem Destacada (Featured Image) via _embed
  const imagemDestacada = evento._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder-evento.jpg';
  const altImagem = evento._embedded?.['wp:featuredmedia']?.[0]?.alt_text || evento.title.rendered;

  // Formatação amigável da data de publicação
  const dataEvento = new Date(evento.date).toLocaleDateString('pt-AO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        
        {/* Botão de Voltar */}
        <div className="p-6 pb-0">
          <Link href="/eventos" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition">
            ← Voltar para todos os eventos
          </Link>
        </div>

        {/* Cabeçalho do Evento */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span>Publicado em:</span>
            <time className="font-semibold text-gray-700">{dataEvento}</time>
          </div>
          
          <h1 
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6"
            dangerouslySetInnerHTML={{ __html: evento.title.rendered }}
          />
        </div>

        {/* Imagem Destacada do Evento */}
        <div className="relative w-full h-[300px] sm:h-[450px] bg-gray-100">
          <img
            src={imagemDestacada}
            alt={altImagem}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Conteúdo Completo / Descrição do Evento */}
        <div className="p-6 sm:p-8 prose prose-blue max-w-none">
          <div 
            className="text-gray-700 space-y-4 text-lg leading-relaxed antialiased"
            dangerouslySetInnerHTML={{ __html: evento.content.rendered }}
          />
        </div>

      </div>
    </main>
  );
}