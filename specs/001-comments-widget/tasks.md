# Tasks: Comments Widget

**Input**: Design documents from `/specs/001-comments-widget/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Não solicitados explicitamente na spec. Tarefas de teste omitidas.

**Organization**: Tasks agrupadas por user story para implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story associada (US1, US2, US3)
- Caminhos exatos incluídos nas descrições

---

## Phase 1: Setup

**Purpose**: Inicialização do projeto e estrutura base

- [x] T001 Inicializar package.json com name "peleja-react", configurar scripts (dev, build, lint), definir peerDependencies (react, react-dom, nauth-react) e dependencies (emoji-picker-react, i18next, react-i18next, bootstrap) em package.json
- [x] T002 Configurar TypeScript com tsconfig.json (strict, jsx react-jsx, paths, moduleResolution bundler, declaration true)
- [x] T003 [P] Configurar Vite em modo library em vite.config.ts (build.lib entry src/index.ts, formats es/cjs, rollupOptions.external react/react-dom/nauth-react, plugin vite-plugin-dts)
- [x] T004 [P] Criar estrutura de diretórios: src/components/, src/Contexts/, src/Services/, src/hooks/, src/types/, src/i18n/ (respeitando case sensitivity da constituição)
- [x] T005 [P] Configurar ESLint e Prettier com regras para TypeScript/React em .eslintrc.cjs e .prettierrc

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura base que DEVE estar pronta antes de qualquer user story

**⚠️ CRITICAL**: Nenhuma user story pode iniciar antes desta fase estar completa

- [x] T006 [P] Criar interfaces de tipos base em src/types/comment.ts: CommentResult, PaginatedResult<T>, CommentLikeResult, CreateCommentRequest, UpdateCommentRequest, PelejaCommentsProps (conforme data-model.md)
- [x] T007 [P] Criar interfaces de tipos Giphy em src/types/giphy.ts: GiphyItem, GiphySearchResult (conforme data-model.md)
- [x] T008 [P] Criar interfaces de paginação em src/types/pagination.ts: CursorParams com pageUrl, sortBy, cursor, pageSize
- [x] T009 [P] Criar HTTP client wrapper em src/Services/HttpClient.ts: função createHttpClient(apiUrl, clientId) que retorna métodos get/post/put/delete com injeção automática de headers X-Client-Id e Authorization (via useAuth token), usando Fetch API nativo
- [x] T010 [P] Configurar i18n em src/i18n/index.ts com i18next e react-i18next, criar traduções pt-BR em src/i18n/pt-BR.json e en em src/i18n/en.json (labels: comentar, responder, editar, excluir, curtir, recentes, populares, pesquisar, enviar, cancelar, salvar, carregando, nenhum comentário, ser o primeiro, comentário removido, tentar novamente, gif indisponível)
- [x] T011 [P] Criar CSS base com variáveis customizáveis em src/components/PelejaComments.module.css (--peleja-font-family, --peleja-border-color, --peleja-accent-color, --peleja-bg-color, --peleja-text-color, breakpoint 768px)
- [x] T012 Criar package entry point em src/index.ts: export { PelejaComments } from components e export type { PelejaCommentsProps } from types

**Checkpoint**: Fundação pronta — implementação de user stories pode começar

---

## Phase 3: User Story 1 — Visualizar comentários sem autenticação (Priority: P1) 🎯 MVP

**Goal**: Visitantes visualizam comentários com scroll infinito, avatars, ordenação e respostas aninhadas, sem login.

**Independent Test**: Montar widget com clientId válido → comentários carregam com scroll infinito, seletor de ordenação funciona, avatars exibem foto ou iniciais.

### Implementation for User Story 1

- [x] T013 [P] [US1] Criar CommentService em src/Services/CommentService.ts: métodos getComments(params: CursorParams) retornando PaginatedResult<CommentResult>, usando HttpClient (apenas GET nesta fase)
- [x] T014 [P] [US1] Criar hook useInfiniteScroll em src/hooks/useInfiniteScroll.ts: IntersectionObserver em elemento sentinel, callbacks onLoadMore e hasMore, cleanup do observer
- [x] T015 [US1] Criar CommentContext em src/Contexts/CommentContext.tsx: state (comments, nextCursor, hasMore, isLoading, error, sortBy), actions loadComments e loadMore e setSortBy, provider recebendo apiUrl/clientId/pageUrl como props
- [x] T016 [US1] Criar hook useComments em src/hooks/useComments.ts: consumir CommentContext, expor state e actions
- [x] T017 [P] [US1] Criar componente Avatar em src/components/Avatar.tsx: exibir imagem redonda (imageUrl) ou círculo com iniciais (derivadas de name), CSS Module com avatar circular responsivo
- [x] T018 [P] [US1] Criar componente SortSelector em src/components/SortSelector.tsx: seletor com opções "Recentes" e "Populares", i18n labels, dispara setSortBy
- [x] T019 [P] [US1] Criar componente EmptyState em src/components/EmptyState.tsx: mensagem convidando a ser o primeiro a comentar, i18n
- [x] T020 [US1] Criar componente CommentItem em src/components/CommentItem.tsx: exibir Avatar, nome do autor, data relativa (createdAt), conteúdo (texto plano), gifUrl (se presente como imagem), likeCount, badge "editado" se isEdited, "[Comment removed]" se isDeleted, renderizar replies recursivamente (1 nível), CSS Module responsivo
- [x] T021 [US1] Criar componente CommentList em src/components/CommentList.tsx: mapear comments do context em CommentItem, elemento sentinel para scroll infinito via useInfiniteScroll, loading spinner, error state
- [x] T022 [US1] Criar componente raiz PelejaComments em src/components/PelejaComments.tsx: receber props (clientId, pageUrl, apiUrl, language, className), inicializar i18n com language, wrapping com CommentContext provider, renderizar SortSelector + CommentList (ou EmptyState se vazio), CSS Module container

**Checkpoint**: US1 completa — widget exibe comentários com scroll infinito sem login

---

## Phase 4: User Story 2 — Criar comentário com autenticação sob demanda (Priority: P2)

**Goal**: Usuário pode comentar após login sob demanda, com pickers de emoji e GIF.

**Independent Test**: Clicar "Comentar" sem login → modal aparece → login → digitar texto → inserir emoji → anexar GIF → enviar → comentário aparece na lista.

### Implementation for User Story 2

- [x] T023 [P] [US2] Criar hook useAuthGuard em src/hooks/useAuthGuard.ts: verificar isAuthenticated (useAuth de nauth-react), state showLoginModal, função guardAction(callback) que abre modal se não autenticado ou executa callback se autenticado
- [x] T024 [P] [US2] Criar GiphyService em src/Services/GiphyService.ts: método searchGifs(query, limit, offset) retornando GiphySearchResult, usando HttpClient
- [x] T025 [US2] Adicionar método createComment(data: CreateCommentRequest) ao CommentService em src/Services/CommentService.ts e action addComment ao CommentContext em src/Contexts/CommentContext.tsx (POST + prepend à lista)
- [x] T026 [P] [US2] Criar componente EmojiPicker em src/components/EmojiPicker.tsx: wrapper de emoji-picker-react com busca, popover em desktop (position absolute) e bottom sheet em mobile (position fixed bottom), botão toggle, inserir emoji no textarea via callback onSelect, CSS Module com media query 768px
- [x] T027 [P] [US2] Criar componente GifPicker em src/components/GifPicker.tsx: input de busca, grid de previews (previewUrl), seleção retorna url completa via callback onSelect, usar GiphyService para busca com debounce, popover/bottom-sheet responsivo, loading e error states (503 → "GIF service unavailable"), CSS Module
- [x] T028 [US2] Criar componente CommentForm em src/components/CommentForm.tsx: textarea (texto plano, max 2000 chars), botões emoji e GIF (abrem pickers), preview de GIF selecionado com opção de remover, botão enviar (desabilitado se vazio), integrar useAuthGuard para abrir modal login ao clicar no textarea/enviar quando não autenticado, modal login usando LoginForm de nauth-react, CSS Module responsivo
- [x] T029 [US2] Integrar CommentForm ao PelejaComments em src/components/PelejaComments.tsx: adicionar CommentForm acima da CommentList, passar addComment do context

**Checkpoint**: US1 + US2 completas — visitantes visualizam e criam comentários

---

## Phase 5: User Story 3 — Responder, curtir, editar e excluir comentários (Priority: P3)

**Goal**: Usuários autenticados podem responder, curtir, editar e excluir comentários.

**Independent Test**: Responder a um comentário raiz → resposta aparece aninhada. Curtir → contagem atualiza. Editar → conteúdo atualiza. Excluir → exibe "[Comment removed]".

### Implementation for User Story 3

- [x] T030 [P] [US3] Criar CommentLikeService em src/Services/CommentLikeService.ts: método toggleLike(commentId) retornando CommentLikeResult, usando HttpClient
- [x] T031 [US3] Adicionar métodos updateComment(commentId, data) e deleteComment(commentId) ao CommentService em src/Services/CommentService.ts e actions editComment, deleteComment, toggleLike ao CommentContext em src/Contexts/CommentContext.tsx (update in-place, mark as deleted in-place, update likeCount/isLikedByUser)
- [x] T032 [P] [US3] Criar componente ReplyForm em src/components/ReplyForm.tsx: textarea inline abaixo do comentário pai, botão enviar e cancelar, integrar useAuthGuard, enviar com parentCommentId, CSS Module
- [x] T033 [P] [US3] Criar componente EditForm em src/components/EditForm.tsx: textarea inline preenchida com conteúdo atual, botão salvar e cancelar, validação max 2000 chars, CSS Module
- [x] T034 [P] [US3] Criar componente DeleteConfirm em src/components/DeleteConfirm.tsx: modal de confirmação "Tem certeza que deseja excluir?", botões confirmar e cancelar, i18n, CSS Module
- [x] T035 [US3] Integrar ações no CommentItem em src/components/CommentItem.tsx: botão "Responder" (abre ReplyForm, somente em comentários raiz), botão "Curtir" com toggle e contagem (useAuthGuard), botão "Editar" (apenas se userId === currentUser, abre EditForm), botão "Excluir" (se userId === currentUser ou isAdmin, abre DeleteConfirm), todos os botões de ação protegidos por useAuthGuard
- [x] T036 [US3] Adicionar handler de erro 401 no HttpClient em src/Services/HttpClient.ts: interceptar respostas 401 para disparar re-autenticação (abrir modal login), handler de 429 para exibir mensagem rate limit

**Checkpoint**: Todas as user stories completas e independentemente funcionais

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas user stories

- [x] T037 [P] Tratar error states globalmente no PelejaComments em src/components/PelejaComments.tsx: estado de erro para clientId inválido/site bloqueado (403), loading state inicial com skeleton/spinner
- [x] T038 [P] Revisar e completar todas as traduções i18n em src/i18n/pt-BR.json e src/i18n/en.json: verificar cobertura de todos os textos visíveis no widget
- [x] T039 [P] Revisar CSS Modules de todos os componentes para responsividade: testar breakpoint 768px, verificar que pickers funcionam como popover (desktop) e bottom sheet (mobile)
- [x] T040 Validar build do package: executar npm run build, verificar que dist/ contém ESM + CJS + .d.ts, verificar que peer dependencies não estão bundled
- [x] T041 Executar validação do quickstart.md: seguir os 5 passos de verificação documentados em specs/001-comments-widget/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — iniciar imediatamente
- **Foundational (Phase 2)**: Depende de Setup — BLOQUEIA todas as user stories
- **User Story 1 (Phase 3)**: Depende de Foundational
- **User Story 2 (Phase 4)**: Depende de Foundational (pode rodar em paralelo com US1, mas integra CommentForm ao PelejaComments criado em US1)
- **User Story 3 (Phase 5)**: Depende de Foundational (pode rodar em paralelo, mas integra ações ao CommentItem de US1)
- **Polish (Phase 6)**: Depende de todas as user stories completas

### Recommended Execution Order

US1 → US2 → US3 (sequencial por prioridade)

### User Story Dependencies

- **US1 (P1)**: Pode iniciar após Foundational — sem dependência de outras stories
- **US2 (P2)**: Depende de US1 (integra CommentForm ao PelejaComments)
- **US3 (P3)**: Depende de US1 (integra ações ao CommentItem)

### Within Each User Story

- Services antes de Context
- Context antes de hooks consumidores
- Hooks antes de componentes que os utilizam
- Componentes filhos antes de componentes pais que os integram

### Parallel Opportunities

- Setup: T003, T004, T005 em paralelo
- Foundational: T006, T007, T008, T009, T010, T011 em paralelo
- US1: T013+T014 em paralelo, depois T015→T016, T017+T018+T019 em paralelo, depois T020→T021→T022
- US2: T023+T024 em paralelo, depois T025, T026+T027 em paralelo, depois T028→T029
- US3: T030 em paralelo com T032+T033+T034, depois T031→T035→T036
- Polish: T037+T038+T039 em paralelo, depois T040→T041

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Widget exibe comentários com scroll infinito sem login
5. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Validate → Demo (MVP!)
3. Add User Story 2 → Validate → Demo (comentários + criação)
4. Add User Story 3 → Validate → Demo (interações completas)
5. Polish → Build final do package npm

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia task à user story para rastreabilidade
- Cada user story deve ser independentemente completável e testável
- Commit após cada task ou grupo lógico
- Parar em qualquer checkpoint para validar story independentemente
- Skill `react-architecture` deve ser usada ao implementar Services, Contexts e hooks (constituição)
