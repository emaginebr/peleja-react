# Implementation Plan: Comments Widget

**Branch**: `001-comments-widget` | **Date**: 2026-04-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-comments-widget/spec.md`

## Summary

Widget de comentários React distribuído como package npm. Permite
visualização de comentários com scroll infinito (sem login), criação
de comentários com autenticação sob demanda (nauth-react), pickers
de emoji e GIF com busca, respostas (1 nível), likes, edição e
exclusão. Responsivo, herda estilos da página hospedeira.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 18.x, Vite 6.x, Bootstrap 5.x,
i18next 25.x, Fetch API, nauth-react 0.2.x, emoji-picker-react
**Storage**: N/A (frontend — auth tokens gerenciados por nauth-react
via localStorage)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web browsers (desktop + mobile responsivo)
**Project Type**: npm package (React component library)
**Performance Goals**: Carregamento inicial <2s, scroll infinito <1s
por lote
**Constraints**: Context API apenas (sem Redux/Zustand/MobX), Vite
como bundler, sem Docker local, prefixo VITE_ para env vars
**Scale/Scope**: 1 widget principal (~12 sub-componentes), 2 idiomas
(pt-BR, en)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Notas |
|-----------|--------|-------|
| I. Stack Tecnológica | ✅ Pass | React 18.x, TS 5.x, Vite 6.x, Bootstrap 5.x, i18next, Fetch API |
| II. Case Sensitivity | ✅ Pass | Contexts/, Services/ (uppercase), hooks/, types/ (lowercase) |
| III. Convenções de Código | ✅ Pass | PascalCase componentes, camelCase funções, interface (não type), arrow functions, const |
| IV. Autenticação | ✅ Pass | nauth-react gerencia auth via localStorage, sem cookies |
| V. Variáveis de Ambiente | ✅ Pass | VITE_API_URL, VITE_SITE_BASENAME com prefixo VITE_ |
| Skills Obrigatórias | ✅ Pass | react-architecture será usada para entidades (Comment, Giphy) |

**Gate result: PASS** — nenhuma violação.

## Project Structure

### Documentation (this feature)

```text
specs/001-comments-widget/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── PelejaComments.tsx       # Widget root component
│   ├── CommentList.tsx          # Lista infinita de comentários
│   ├── CommentItem.tsx          # Comentário individual + respostas
│   ├── CommentForm.tsx          # Textarea + botões emoji/gif/enviar
│   ├── ReplyForm.tsx            # Form de resposta inline
│   ├── EditForm.tsx             # Form de edição inline
│   ├── Avatar.tsx               # Foto redonda ou iniciais
│   ├── EmojiPicker.tsx          # Picker de emojis com busca
│   ├── GifPicker.tsx            # Picker de GIFs com busca
│   ├── SortSelector.tsx         # Seletor Recentes/Populares
│   ├── DeleteConfirm.tsx        # Modal de confirmação de exclusão
│   └── EmptyState.tsx           # Estado vazio (sem comentários)
├── Contexts/
│   └── CommentContext.tsx       # Estado dos comentários e ações
├── Services/
│   ├── CommentService.ts        # CRUD de comentários via API
│   ├── CommentLikeService.ts    # Toggle de likes via API
│   └── GiphyService.ts          # Busca de GIFs via API
├── hooks/
│   ├── useComments.ts           # Hook para consumir CommentContext
│   ├── useInfiniteScroll.ts     # Hook para scroll infinito
│   └── useAuthGuard.ts          # Hook para exigir auth em ações
├── types/
│   ├── comment.ts               # CommentInfo, CommentResult, etc.
│   ├── giphy.ts                 # GiphySearchResult, GiphyItem
│   └── pagination.ts            # PaginatedResult, CursorParams
├── i18n/
│   ├── index.ts                 # Configuração i18next
│   ├── pt-BR.json               # Traduções pt-BR
│   └── en.json                  # Traduções en
└── index.ts                     # Package entry point (exports)
```

**Structure Decision**: Projeto single — npm package React com Vite em
modo library. Diretórios seguem a constituição: `Contexts/` e `Services/`
uppercase, `hooks/` e `types/` lowercase. Componentes ficam em `components/`
com arquivos flat (sem subdiretórios por componente) para simplicidade.

## Complexity Tracking

> Nenhuma violação de constituição — seção não aplicável.
