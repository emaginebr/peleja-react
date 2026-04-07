# Implementation Plan: Landing Page, Demo & Admin

**Branch**: `002-landing-admin-page` | **Date**: 2026-04-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-landing-admin-page/spec.md`

## Summary

Aplicação React (SPA) no diretório `peleja-app/` com landing page de
apresentação do widget Peleja, demonstração funcional ao vivo, e área
administrativa protegida para gerenciar sites (CRUD + Client IDs) e
moderar comentários. Autenticação via nauth-react com rotas dedicadas.
Admin com sidebar fixa.

## Skills Obrigatórias

Para implementação do layout e páginas do site, a seguinte skill **DEVE**
ser utilizada:

| Skill | Quando usar | Invocação |
|---|---|---|
| **frontend-design** | Criar layout, páginas e componentes visuais do site | `/frontend-design` |
| **react-architecture** | Criar Types, Service, Context, Hook e registrar Provider | `/react-architecture` |

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 18.x, React Router 6.x, Vite 6.x,
Bootstrap 5.x, i18next 25.x, Fetch API, nauth-react 0.2.x,
peleja-react (local dependency)
**Storage**: N/A (frontend — auth via nauth-react/localStorage)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web browsers (desktop + mobile responsivo)
**Project Type**: Web application (SPA)
**Performance Goals**: Todas as páginas <2s para carregar
**Constraints**: Context API (sem Redux/Zustand), Vite bundler, sem
Docker local, prefixo VITE_ para env vars
**Scale/Scope**: ~8 páginas/views, 2 idiomas (pt-BR, en)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Notas |
|-----------|--------|-------|
| I. Stack Tecnológica | ✅ Pass | React 18.x, TS 5.x, Vite 6.x, Bootstrap 5.x, i18next, Fetch API |
| II. Case Sensitivity | ✅ Pass | Contexts/, Services/ (uppercase), hooks/, types/ (lowercase) |
| III. Convenções de Código | ✅ Pass | PascalCase componentes, camelCase funções, interface, arrow functions, const |
| IV. Autenticação | ✅ Pass | nauth-react via localStorage, sem cookies |
| V. Variáveis de Ambiente | ✅ Pass | VITE_API_URL, VITE_SITE_BASENAME com prefixo VITE_ |
| Skills Obrigatórias | ✅ Pass | react-architecture + frontend-design serão usadas |

**Gate result: PASS**

## Project Structure

### Documentation (this feature)

```text
specs/002-landing-admin-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (peleja-app/)

```text
peleja-app/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx                  # Entry point + providers
│   ├── App.tsx                   # Router config
│   ├── components/
│   │   ├── Layout.tsx            # Header + Footer (public)
│   │   ├── AdminLayout.tsx       # Sidebar + content (admin)
│   │   ├── ProtectedRoute.tsx    # Auth guard for routes
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   └── Sidebar.tsx           # Admin sidebar navigation
│   ├── pages/
│   │   ├── LandingPage.tsx       # Hero + Features + Integration + Demo
│   │   ├── LoginPage.tsx         # nauth-react LoginForm
│   │   ├── RegisterPage.tsx      # nauth-react RegisterForm
│   │   ├── admin/
│   │   │   ├── SitesPage.tsx     # CRUD de sites
│   │   │   ├── SiteFormModal.tsx # Formulário criar/editar site
│   │   │   ├── CommentsPage.tsx  # Seletor de site + páginas + comentários
│   │   │   └── CommentList.tsx   # Lista de comentários de uma página
│   ├── Contexts/
│   │   └── SiteContext.tsx       # Estado dos sites do usuário
│   ├── Services/
│   │   ├── SiteService.ts        # CRUD sites via API
│   │   └── HttpClient.ts         # Fetch wrapper com headers
│   ├── hooks/
│   │   └── useSites.ts           # Hook para consumir SiteContext
│   ├── types/
│   │   └── site.ts               # SiteInfo, CreateSiteRequest, etc.
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── pt-BR.json
│   │   └── en.json
│   └── index.ts
```

**Structure Decision**: Aplicação separada em `peleja-app/` com Vite SPA.
Consome `peleja-react` como dependência local (`file:../`). Diretórios
seguem a constituição: `Contexts/`, `Services/` uppercase; `hooks/`,
`types/` lowercase. Páginas organizadas em `pages/` com subdiretório
`admin/` para rotas protegidas.

## Complexity Tracking

> Nenhuma violação de constituição — seção não aplicável.
