import React from 'react';

// Função que busca os dados diretamente da API do WordPress
async function getNoticias() {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API;

  // Validação segura caso a variável de ambiente não esteja configurada
  if (!apiUrl) {
    console.warn("Aviso: NEXT_PUBLIC_WORDPRESS_API não está definida.");
    return [];
  }

  try {
    const res = await fetch(
      `${apiUrl}/posts?_embed`,
      {
        next: { revalidate: 60 } // Atualiza o cache a cada 60 segundos
      }
    );

    if (!res.ok) {
      console.error('Falha ao carregar notícias: Status', res.status);
      return []; // Retorna uma lista vazia para evitar quebrar o build
    }

    return await res.json();
  } catch (error) {
    console.error('Erro de conexão ao buscar notícias:', error);
    return []; // Retorna vazio em caso de falha de rede/API fora do ar
  }
}

// Força a página a rodar de forma dinâmica no servidor da Hostinger
export const dynamic = "force-dynamic";

export default async function NoticiasPage() {
  const posts = await getNoticias();

return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Título principal alinhado com a cor escura institucional */}
      <h1 className="text-3xl font-bold mb-8 text-neutral-900 border-b-4 border-amber-500 pb-2 inline-block">
        Notícias e Avisos AAAI
      </h1>
      
      {/* Fallback caso não existam posts cadastrados ou ocorra erro na API */}
      {posts.length === 0 ? (
        <div className="text-center p-12 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-neutral-500 text-lg">Nenhuma notícia ou aviso encontrado no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => {
            // Captura a imagem destacada de forma segura caso exista
            const imagemUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.png';

            return (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col border border-neutral-100 hover:shadow-lg transition duration-300">
                {/* Imagem do Post com uma leve borda inferior amarela de separação */}
                <div className="relative border-b-4 border-amber-500">
                  <img 
                    src={imagemUrl} 
                    alt={post.title?.rendered || "Notícia"} 
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-4 flex flex-col flex-grow bg-white">
                  {/* Título Dinâmico mudado para Preto/Neutro Escuro para legibilidade premium */}
                  <h2 className="text-xl font-bold mb-2 text-neutral-900 hover:text-red-600 transition-colors duration-200"
                    dangerouslySetInnerHTML={{ __html: post.title?.rendered || "" }}
                  />
                  
                  {/* Resumo/Excerto Dinâmico */}
                  <div className="text-neutral-600 text-sm mb-4 flex-grow line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered || "" }}
                  />

                  {/* Link para ler o post completo alterado para o Vermelho AAAI com hover escuro */}
                  <a href={`/noticias/${post.id}`} 
                    className="inline-block text-center bg-red-600 hover:bg-neutral-900 text-white font-bold py-2.5 px-4 rounded shadow-sm hover:shadow transition-all duration-300 uppercase text-xs tracking-wider">
                    Ler Mais
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );

}