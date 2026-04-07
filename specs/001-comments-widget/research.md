# Research: Comments Widget

**Date**: 2026-04-06
**Branch**: `001-comments-widget`

## 1. nauth-react Integration

**Decision**: Utilizar nauth-react 0.2.x como dependência peer.

**Rationale**: O package nauth-react (encontrado em c:\repos\Abipesca\nauth-react,
v0.2.7) já fornece:
- `NAuthProvider` — provider de contexto (a ser configurado pela app hospedeira)
- `useAuth` — hook com user, token, isAuthenticated, login, logout
- `LoginForm` — componente de formulário de login pronto
- Integração com localStorage para persistência de tokens
- Suporte i18n (pt-BR e en)

O widget NÃO gerencia o NAuthProvider. A app hospedeira configura o provider,
e o widget consome via `useAuth`. Para ações protegidas (comentar, curtir,
responder), o widget verifica `isAuthenticated` e abre modal com `LoginForm`
se necessário.

**Alternatives considered**:
- Provider interno: descartado por duplicar configuração e criar conflito
  com a instância da app hospedeira
- Auth customizada: descartado por reinventar funcionalidade existente

## 2. Emoji Picker

**Decision**: Utilizar `emoji-picker-react`.

**Rationale**: Biblioteca mais popular para React, com busca integrada,
~50-70KB, categorias nativas e suporte a Unicode. Funciona bem como popover.
Alternativas consideradas:
- `frimousse` (~5KB, composable) — mais leve mas menos maduro
- `emoji-mart` (modular) — mais complexo, melhor para apps onde emoji é feature
  central

Para um widget de comentários, `emoji-picker-react` oferece o melhor
equilíbrio entre funcionalidade e facilidade de integração.

## 3. GIF Picker

**Decision**: Implementar componente customizado consumindo o endpoint
`GET /api/v1/giphy/search` do backend Peleja.

**Rationale**: O backend já faz proxy para o Giphy API com credenciais
server-side, então não há necessidade de SDK Giphy no frontend. O picker
será um componente simples com input de busca + grid de resultados.

**Alternatives considered**:
- `@giphy/react-components` — descartado porque requer API key no frontend
  e duplica o proxy do backend

## 4. Infinite Scroll

**Decision**: Implementar com IntersectionObserver via hook customizado
`useInfiniteScroll`.

**Rationale**: A API retorna `nextCursor` e `hasMore` na resposta paginada.
O hook observa um elemento sentinel no final da lista e dispara o fetch
do próximo lote quando visível. IntersectionObserver é nativo, sem
dependência externa.

**Alternatives considered**:
- `react-infinite-scroll-component` — dependência desnecessária para
  funcionalidade simples
- Scroll event listener — menos performático que IntersectionObserver

## 5. Vite Library Mode

**Decision**: Configurar Vite em modo library (`build.lib`) para gerar
o package npm.

**Rationale**: A constituição exige Vite como bundler. O modo library gera
ESM + CJS, externaliza React e outras peer dependencies, e produz
type declarations via `vite-plugin-dts`.

**Configuration key points**:
- `build.lib.entry`: `src/index.ts`
- `build.lib.formats`: `['es', 'cjs']`
- `build.rollupOptions.external`: react, react-dom, nauth-react
- `vite-plugin-dts` para gerar `.d.ts`

## 6. Styling Strategy

**Decision**: CSS Modules com variáveis CSS customizáveis para herdar
estilos da página hospedeira.

**Rationale**: CSS Modules evitam conflito de estilos com a página
hospedeira (nomes de classes com hash). Variáveis CSS (custom properties)
permitem que a app hospedeira customize cores, fontes e espaçamentos
sem override direto. Bootstrap será usado apenas para layout/grid
utilitário, não para componentes visuais completos.

**Alternatives considered**:
- Styled-components: adiciona runtime CSS-in-JS e peer dependency
- Tailwind CSS: requer configuração do consumidor
- CSS plano: risco de conflito de nomes

## 7. Responsividade (Mobile/Desktop)

**Decision**: Media queries em CSS Modules com breakpoint em 768px.
Pickers abrem como popover em desktop (posicionamento relativo ao botão)
e bottom sheet em mobile (fixed bottom com overlay).

**Rationale**: 768px é o breakpoint padrão tablet/mobile. O comportamento
popover vs bottom sheet é o padrão de UX em widgets de chat e comentários
(WhatsApp Web, Slack, Discord).

## 8. HTTP Client

**Decision**: Fetch API nativo para todos os serviços.

**Rationale**: A constituição especifica Fetch API para novos serviços
(Axios apenas para legado). Como este é um projeto novo, todos os
services usarão Fetch. Um wrapper leve será criado para injetar
headers (`X-Client-Id`, `Authorization`) automaticamente.
