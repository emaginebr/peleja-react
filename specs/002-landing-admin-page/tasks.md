# Tasks: Landing Page, Demo & Admin

**Input**: Design documents from `/specs/002-landing-admin-page/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Não solicitados. Tarefas de teste omitidas.

**Organization**: Tasks agrupadas por user story para implementação independente.

**Skills obrigatórias**:
- `/frontend-design` — DEVE ser usada para criar layout e páginas visuais
- `/react-architecture` — DEVE ser usada para criar Types, Services, Contexts e Hooks

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo
- **[Story]**: User story associada (US1, US2, US3, US4)

---

## Phase 1: Setup

**Purpose**: Inicialização do projeto peleja-app

- [x] T001 Criar diretório peleja-app/ e inicializar package.json com name "peleja-app", scripts (dev, build, lint), dependencies (react-router-dom, bootstrap, i18next, react-i18next, peleja-react via file:..), peerDependencies (react, react-dom, nauth-react), devDependencies (vite, typescript, @vitejs/plugin-react, vite-plugin-dts, @types/react, @types/react-dom, eslint, prettier) em peleja-app/package.json
- [x] T002 [P] Criar peleja-app/tsconfig.json (strict, jsx react-jsx, moduleResolution bundler, paths @/*)
- [x] T003 [P] Criar peleja-app/vite.config.ts (Vite SPA mode, plugin react, alias @/ → src/)
- [x] T004 [P] Criar peleja-app/index.html com root div e script src="/src/main.tsx"
- [x] T005 [P] Criar estrutura de diretórios: peleja-app/src/components/, peleja-app/src/pages/admin/, peleja-app/src/Contexts/, peleja-app/src/Services/, peleja-app/src/hooks/, peleja-app/src/types/, peleja-app/src/i18n/ (respeitando case sensitivity da constituição)
- [x] T006 [P] Criar peleja-app/.env.example com VITE_API_URL, VITE_TENANT_ID, VITE_DEMO_CLIENT_ID, VITE_NAUTH_API_URL
- [x] T007 [P] Configurar ESLint e Prettier em peleja-app/.eslintrc.cjs e peleja-app/.prettierrc (mesma config do widget)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura base que DEVE estar pronta antes de qualquer user story

**⚠️ CRITICAL**: Nenhuma user story pode iniciar antes desta fase estar completa

- [x] T008 [P] Criar interfaces de tipos em peleja-app/src/types/site.ts: SiteInfo, CreateSiteRequest, UpdateSiteRequest, SiteStatus (enum) conforme data-model.md
- [x] T009 [P] Criar HTTP client em peleja-app/src/Services/HttpClient.ts: createHttpClient(apiUrl, tenantId, getToken) com Fetch API, injeção automática de headers X-Tenant-Id e Authorization Bearer
- [x] T010 [P] Configurar i18n em peleja-app/src/i18n/index.ts, criar traduções pt-BR em peleja-app/src/i18n/pt-BR.json e en em peleja-app/src/i18n/en.json (labels: landing page, features, admin, sites, comentários, login, registro, criar, editar, excluir, copiar, status, ativo, inativo, bloqueado, salvar, cancelar, confirmar, carregando, erro, pesquisar URL, nenhum site, nenhum comentário)
- [x] T011 [P] Criar componente ProtectedRoute em peleja-app/src/components/ProtectedRoute.tsx: verificar isAuthenticated (useAuth de nauth-react), redirecionar para /login se não autenticado, renderizar children se autenticado
- [x] T012 Criar entry point peleja-app/src/main.tsx: NAuthProvider (config com VITE_NAUTH_API_URL), I18nextProvider, BrowserRouter, renderizar App
- [x] T013 Criar router em peleja-app/src/App.tsx: configurar React Router 6.x com rotas públicas (/ → LandingPage, /login → LoginPage, /register → RegisterPage) dentro de Layout, e rotas protegidas (/admin/sites → SitesPage, /admin/comments → CommentsPage) dentro de AdminLayout com ProtectedRoute

**Checkpoint**: Fundação pronta — user stories podem começar

---

## Phase 3: User Story 1 — Landing page com apresentação (Priority: P1) 🎯 MVP

**Goal**: Visitantes veem landing page profissional com hero, features, integração e CTA.

**Independent Test**: Acessar / → hero visível, rolar → features e código de integração visíveis.

**⚠️ SKILL**: Usar `/frontend-design` para implementar T014, T015, T016, T017, T018, T019.

### Implementation for User Story 1

- [x] T014 [P] [US1] Criar componente Navbar em peleja-app/src/components/Navbar.tsx usando `/frontend-design`: logo Peleja, links Landing/Login/Register (se não autenticado) ou Admin/Logout (se autenticado), responsivo com hamburger em mobile, CSS Module
- [x] T015 [P] [US1] Criar componente Footer em peleja-app/src/components/Footer.tsx usando `/frontend-design`: links, copyright, CSS Module
- [x] T016 [US1] Criar componente Layout em peleja-app/src/components/Layout.tsx: wrapper com Navbar + Outlet (React Router) + Footer, CSS Module
- [x] T017 [US1] Criar seção HeroSection em peleja-app/src/pages/sections/HeroSection.tsx usando `/frontend-design`: título "Peleja", subtítulo descrevendo o widget, botão CTA "Começar Agora" (→ /register), design profissional e impactante, CSS Module responsivo
- [x] T018 [US1] Criar seção FeaturesSection em peleja-app/src/pages/sections/FeaturesSection.tsx usando `/frontend-design`: grid de cards com ícones para cada feature (emojis, GIFs, scroll infinito, login sob demanda, respostas, likes, i18n, responsivo), i18n labels, CSS Module responsivo
- [x] T019 [US1] Criar seção IntegrationSection em peleja-app/src/pages/sections/IntegrationSection.tsx usando `/frontend-design`: bloco de código estilizado com exemplo npm install + uso do <PelejaComments />, syntax highlighting, CSS Module
- [x] T020 [US1] Criar LandingPage em peleja-app/src/pages/LandingPage.tsx: compor HeroSection + FeaturesSection + IntegrationSection, CSS Module

**Checkpoint**: US1 completa — landing page com apresentação funcional

---

## Phase 4: User Story 2 — Demonstração funcional do widget (Priority: P2)

**Goal**: Widget funcional na landing page com comentários reais.

**Independent Test**: Rolar até seção Demo → widget carrega comentários → clicar comentar → modal login aparece → autenticar → enviar comentário.

### Implementation for User Story 2

- [x] T021 [US2] Criar seção DemoSection em peleja-app/src/pages/sections/DemoSection.tsx usando `/frontend-design`: título "Experimente", container estilizado com widget <PelejaComments /> funcional usando VITE_DEMO_CLIENT_ID e VITE_API_URL, import peleja-react/style.css, CSS Module
- [x] T022 [US2] Integrar DemoSection à LandingPage em peleja-app/src/pages/LandingPage.tsx: adicionar DemoSection após IntegrationSection

**Checkpoint**: US1 + US2 completas — landing page com demo funcional

---

## Phase 5: User Story 3 — Admin: gerenciar sites e Client IDs (Priority: P3)

**Goal**: Usuário autenticado cria sites, vê Client IDs, edita e copia IDs.

**Independent Test**: Login → /admin/sites → criar site → Client ID aparece → copiar ID → editar URL/status.

**⚠️ SKILL**: Usar `/react-architecture` para T023, T024, T025.

### Implementation for User Story 3

- [x] T023 [P] [US3] Criar SiteService em peleja-app/src/Services/SiteService.ts usando `/react-architecture`: métodos createSite(data), getSites(), updateSite(siteId, data) usando HttpClient com X-Tenant-Id
- [x] T024 [US3] Criar SiteContext em peleja-app/src/Contexts/SiteContext.tsx usando `/react-architecture`: state (sites, isLoading, error), actions loadSites, createSite, updateSite, provider com HttpClient
- [x] T025 [US3] Criar hook useSites em peleja-app/src/hooks/useSites.ts usando `/react-architecture`: consumir SiteContext
- [x] T026 [P] [US3] Criar componente Sidebar em peleja-app/src/components/Sidebar.tsx usando `/frontend-design`: links fixos (Sites com ícone globe, Comentários com ícone message), active state baseado em rota atual, colapsável em mobile, CSS Module
- [x] T027 [US3] Criar componente AdminLayout em peleja-app/src/components/AdminLayout.tsx: Sidebar fixa à esquerda + Outlet à direita, CSS Module responsivo (sidebar colapsa em mobile)
- [x] T028 [P] [US3] Criar LoginPage em peleja-app/src/pages/LoginPage.tsx: usar LoginForm de nauth-react, redirect para /admin/sites após login, link "Não tem conta? Registre-se" → /register, CSS Module centralizado
- [x] T029 [P] [US3] Criar RegisterPage em peleja-app/src/pages/RegisterPage.tsx: usar RegisterForm de nauth-react, redirect para /admin/sites após registro, link "Já tem conta? Faça login" → /login, CSS Module centralizado
- [x] T030 [P] [US3] Criar SiteFormModal em peleja-app/src/pages/admin/SiteFormModal.tsx: formulário com campos siteUrl (input text) e tenant (select com lista fixa de VITE_TENANT_ID), botões salvar/cancelar, modo criar e editar (preenchido), validação, exibir erro 409 sem perder dados, CSS Module
- [x] T031 [US3] Criar SitesPage em peleja-app/src/pages/admin/SitesPage.tsx usando `/frontend-design`: tabela/lista de sites com colunas (URL, Client ID, Status, Data, Ações), botão "Novo Site" abre SiteFormModal, botão copiar Client ID (navigator.clipboard + toast), botão editar abre SiteFormModal em modo edição, badge de status (Active=verde, Inactive=amarelo, Blocked=vermelho sem editar), loading e empty states, i18n, CSS Module
- [x] T032 [US3] Registrar SiteProvider no main.tsx em peleja-app/src/main.tsx: adicionar SiteContext.Provider na árvore de providers

**Checkpoint**: US1 + US2 + US3 completas — landing + demo + admin sites

---

## Phase 6: User Story 4 — Admin: gerenciar comentários (Priority: P4)

**Goal**: Admin seleciona site, digita pageUrl, vê comentários e pode excluir.

**Independent Test**: Admin → Comentários → selecionar site → digitar pageUrl → comentários carregam → excluir um → confirmação → removido.

### Implementation for User Story 4

- [x] T033 [US4] Criar CommentList em peleja-app/src/pages/admin/CommentList.tsx: lista de comentários de uma pageUrl usando GET /api/v1/comments com X-Client-Id do site selecionado, exibir conteúdo/autor/data/status, botão excluir com confirmação, DELETE /api/v1/comments/{id}, loading/empty states, paginação cursor, i18n, CSS Module
- [x] T034 [US4] Criar CommentsPage em peleja-app/src/pages/admin/CommentsPage.tsx usando `/frontend-design`: dropdown para selecionar site (da lista useSites), campo de input para digitar/colar pageUrl, botão buscar, renderizar CommentList quando site e pageUrl selecionados, empty state se nenhum site, CSS Module

**Checkpoint**: Todas as user stories completas

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas user stories

- [x] T035 [P] Revisar e completar todas as traduções i18n em peleja-app/src/i18n/pt-BR.json e peleja-app/src/i18n/en.json: verificar cobertura de todos os textos visíveis
- [x] T036 [P] Revisar responsividade de todas as páginas: testar breakpoint 768px, sidebar colapsa, tabelas scrollam horizontalmente, formulários full-width em mobile
- [x] T037 Instalar dependências e validar build: cd peleja-app && npm install && npm run build, verificar que dist/ é gerado sem erros
- [x] T038 Executar validação do quickstart.md: seguir os 6 passos de verificação documentados em specs/002-landing-admin-page/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — iniciar imediatamente
- **Foundational (Phase 2)**: Depende de Setup — BLOQUEIA todas as user stories
- **US1 (Phase 3)**: Depende de Foundational
- **US2 (Phase 4)**: Depende de US1 (integra DemoSection à LandingPage)
- **US3 (Phase 5)**: Depende de Foundational (pode rodar em paralelo com US1, mas login pages e admin layout são pré-requisito para uso completo)
- **US4 (Phase 6)**: Depende de US3 (usa useSites para listar sites)
- **Polish (Phase 7)**: Depende de todas as user stories

### Recommended Execution Order

US1 → US2 → US3 → US4 (sequencial por prioridade)

### Within Each User Story

- Services/Types antes de Context
- Context antes de hooks
- Hooks antes de componentes
- Componentes filhos antes de pais
- Usar `/frontend-design` para componentes visuais
- Usar `/react-architecture` para Services/Contexts/Hooks

### Parallel Opportunities

- Setup: T002, T003, T004, T005, T006, T007 em paralelo
- Foundational: T008, T009, T010, T011 em paralelo
- US1: T014+T015 em paralelo, depois T016, T017+T018+T019 em paralelo, depois T020
- US3: T023+T026+T028+T029+T030 em paralelo, depois T024→T025→T031→T032
- Polish: T035+T036 em paralelo, depois T037→T038

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Landing page com hero, features e integração
5. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Landing page (MVP!)
3. Add US2 → Demo funcional
4. Add US3 → Admin com sites
5. Add US4 → Moderação de comentários
6. Polish → Build final

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia task à user story
- **OBRIGATÓRIO**: Usar `/frontend-design` para componentes visuais/layout
- **OBRIGATÓRIO**: Usar `/react-architecture` para Services, Contexts e Hooks
- Commit após cada task ou grupo lógico
- Parar em qualquer checkpoint para validar story independentemente
