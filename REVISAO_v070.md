# Revisão AAAI v0.7.0 — 30/10/2026

## Âmbito entregue

Módulo WordPress separado para pedidos privados de atendimento, formulário persistente, comprovativo com referência/código, gestão de estado/data/mensagens no painel e consulta por código. Mantidos o catálogo v0.3.1 e o layout v0.6.0. Sem alteração de tabelas: utiliza posts/metadados padrão do WordPress.

## Verificações

- ESLint e TypeScript passaram.
- 16 testes Node: contratos/URLs, validação de consentimento e datas, origem pública versus URL interna Next, sanitização, codificação de mensagens e instalação sobre dois destinos com backup/configuração/chave preservados.
- 21 verificações reais em WordPress 7.1.4 e PHP 8.3.33 através do WordPress Playground: autorização da API, consentimento, data inválida, persistência, referência, repetição idempotente, rejeição de alteração com a mesma chave, um único registo privado, hash do código, rejeição de código errado, consulta válida, ausência de dados pessoais, CPT fora da REST pública, permissões anónimas/administrador, nonce inválido, data de agendamento inválida, gravação administrativa, resposta pública e exclusão de notas internas/histórico.
- Compilação de produção Next 16.4.3 com o módulo habilitado.
- Navegador Chromium/Playwright com API de teste do mesmo contrato: envio do formulário, comprovativo, consulta com código, actualização de estado simulada, respostas filtradas, origem indevida, limite de corpo, falta de autorização directa e repetição de pedido.

Os testes PHP usam a API REST real e a base SQLite temporária do Playground. Os testes de navegador usam uma API de teste, não o WAMP nem o servidor HTTP do Playground. A tentativa de usar o servidor HTTP completo do Playground nesta sessão não produziu uma integração estável; a validação de handlers WordPress e a de interface/proxy foram executadas separadamente. Não se afirma teste integral contra a instalação real do utilizador.

## Modelo de acesso

Chave privada entre Next e WordPress, gerada apenas na instalação. Pedidos privados com painel reservado a `manage_options`. Código de consulta de 128 bits, armazenado como HMAC; referência aleatória separada. Código e dados pessoais fora de URLs. Consulta com lista explícita de campos públicos. Consentimento obrigatório. Sem ficheiros anexos e sem envio automático de comunicações.

O instalador verifica os hashes antes de alterar, testa os dois destinos, rejeita chaves divergentes e mantém backup privado. O actualizador Windows reutiliza a estrutura que o utilizador confirmou funcionar nas fases anteriores; este novo pacote requer confirmação no Windows/WAMP. A protecção `.htaccess` depende da configuração do Apache.

## Próximas fases

Autenticação/perfis de associados, equipa de atendimento com permissões próprias, calendário de vagas e notificações automáticas com canal configurado. Não fazem parte da v0.7.0.

## Referências primárias

- https://developer.wordpress.org/reference/functions/register_post_type/
- https://developer.wordpress.org/reference/functions/register_rest_route/
- https://developer.wordpress.org/reference/classes/wp_rest_request/get_header/
- https://developer.wordpress.org/playground/handbook/guides/phpunit-testing/
