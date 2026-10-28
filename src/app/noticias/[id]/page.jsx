import React from 'react';

// Função para buscar a notícia individual na API do WordPress
async function getPostData(id) {
  // Ajuste a URL se o seu WordPress estiver noutra pasta ou se usar um Custom Post Type
  const res = await fetch(`http://localhost/aaaibwewp.com/wp-json/wp/v2/posts/${id}?_embed`, {
    next: { revalidate: 60 } // Atualiza o cache a cada 60 segundos
  });

  if (!res.ok) {
    return null;
  }

  // O WordPress devolve um OBJETO direto ao buscar por ID
  const post = await res.json();
  return post;
}

// No Next.js 15/16, a função da página recebe params como uma Promise
export default async function NoticiaDetalhePage({ params }) {
  // CORREÇÃO CRÍTICA: Aguardar a Promise do params resolver
  const { id } = await params;

  const post = await getPostData(id);

  // Se a API falhar ou o post não existir
  if (!post) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Erro 404</h1>
        <p className="text-gray-600 mt-2">Notícia não encontrada ou removida.</p>
      </div>
    );
  }

  // Capturar a imagem destacada de forma segura (via _embed)
  const imagemDestaque = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg';

  return (
    <article className="container mx-auto max-w-3xl p-6">
      {/* Título da Notícia */}
      <h1 
        className="text-3xl font-bold mb-4 text-gray-900"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />
      
      {/* Imagem Destacada */}
      {imagemDestaque && (
        <img 
          src={imagemDestaque} 
          alt={post.title.rendered} 
          className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
        />
      )}

      {/* Conteúdo Renderizado Dinamicamente */}
      <div 
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </article>
  );
}