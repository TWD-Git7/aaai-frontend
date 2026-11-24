# Portal da AAAI

Portal institucional da Associação Angolana de Apoio a Imigrantes, em português, inglês, francês e espanhol. O frontend usa Next.js e consulta o WordPress para obter o catálogo de serviços, notícias, eventos, projectos e parceiros.

## Executar

1. Use Node.js 22.20 ou superior.
2. Copie `.env.example` para `.env.local` e defina `WORDPRESS_API_URL` com a URL REST da sua instalação.
3. Execute `npm ci` e `npm run dev`. Abra http://localhost:3000.

## Publicar

O alojamento precisa de executar o servidor Next.js. Use `npm ci`, `npm run build` e `npm start`. Configure `WORDPRESS_API_URL` com a URL HTTPS do WordPress de produção, com o plugin `aaai-content` activo.

Para receber e consultar pedidos, instale `backend/aaai-atendimento.php` como MU-plugin no WordPress e configure a mesma chave privada nas duas aplicações. Consulte [o guia v0.7.0](LEIA-ME_v070.md) para a instalação, a localização da configuração privada e a gestão dos pedidos. Guarde a chave nas variáveis privadas do alojamento e na configuração privada do WordPress.

Execute `npm run verify` para validar o código e `npm run diagnose` para validar a ligação ao WordPress. Antes de apontar a produção à nova versão, valide um pedido de ponta a ponta em homologação. Se existirem pedidos da versão anterior, confirme como a equipa continuará a acompanhá-los.

A versão anterior tinha páginas próprias para FAQ, login e administração no frontend. Esta versão usa a área do associado e a administração de atendimentos do WordPress. O envio de e-mail pelo fluxo anterior precisa de avaliação antes da mudança de produção.
