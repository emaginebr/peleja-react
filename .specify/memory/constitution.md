<!--
  Sync Impact Report
  ===================
  Version change: N/A → 1.0.0 (initial ratification)
  Modified principles: N/A (first version)
  Added sections:
    - Core Principles: I–V (Stack, Case Sensitivity, Code Conventions,
      Auth & Security, Environment Variables)
    - Skills Obrigatórias
    - Checklist para Novos Contribuidores
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no update needed
      (Constitution Check section is dynamic, filled at plan time)
    - .specify/templates/spec-template.md ✅ no update needed
      (no constitution-specific constraints embedded)
    - .specify/templates/tasks-template.md ✅ no update needed
      (task phases are generic; no principle-specific types required)
    - .specify/templates/commands/ ✅ no command files exist
  Follow-up TODOs: none
-->

# Peleja React Constitution

## Skills Obrigatórias

Para implementação de novas funcionalidades frontend, a seguinte skill
**DEVE** ser utilizada:

| Skill | Quando usar | Invocação |
|---|---|---|
| **react-architecture** | Criar Types, Service, Context, Hook e registrar Provider | `/react-architecture` |

A skill cobre em detalhe:

- Padrões de arquivos frontend (Types, Services, Contexts, Hooks)
- Provider chain e registro de novos providers
- Padrões de tratamento de erros (handleError, clearError, loading state)

**NÃO** reimplemente esses padrões manualmente — siga a skill.

## Core Principles

### I. Stack Tecnológica

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 18.x | Framework UI |
| TypeScript | 5.x | Tipagem estática |
| React Router | 6.x | Roteamento SPA |
| Vite | 6.x | Build toolchain |
| Bootstrap | 5.x | Grid e componentes base |
| i18next | 25.x | Internacionalização |
| Axios | 1.x | HTTP client (legado) |
| Fetch API | Nativo | HTTP client (novos serviços) |

**Regras invioláveis:**

- Vite é o bundler obrigatório — **NÃO** usar CRA, Webpack manual
  ou outros bundlers.
- **NÃO** adicionar bibliotecas de state management (Redux, Zustand,
  MobX) — Context API é o padrão.
- **NÃO** executar comandos `docker` ou `docker compose` no ambiente
  local — Docker não está acessível.
- Variáveis de ambiente frontend DEVEM usar prefixo `VITE_` (padrão
  Vite). **NÃO** usar `REACT_APP_`.

### II. Case Sensitivity de Diretórios (Inviolável)

| Diretório | Casing | Motivo |
|---|---|---|
| `Contexts/` | Uppercase C | Compatibilidade Docker/Linux |
| `Services/` | Uppercase S | Compatibilidade Docker/Linux |
| `hooks/` | Lowercase h | Convenção React |
| `types/` | Lowercase t | Convenção TypeScript |

Todos os imports DEVEM corresponder exatamente ao casing no disco.
Violações causam falhas em builds Linux/CI.

### III. Convenções de Código (TypeScript/React)

| Elemento | Convenção | Exemplo |
|---|---|---|
| Componentes | PascalCase | `LoginPage`, `CampaignCard` |
| Interfaces | PascalCase | `CampaignContextType` |
| Variáveis / Funções | camelCase | `getHeaders`, `loadCampaigns` |
| Constantes | UPPER_CASE | `AUTH_STORAGE_KEY` |
| Tipos | `interface` (não `type`) | `interface CampaignInfo {}` |
| Funções | Arrow functions | `const fn = () => {}` |
| Variáveis | `const` por padrão | `const campaigns = []` |

### IV. Autenticação e Segurança

| Aspecto | Padrão |
|---|---|
| Header | `Authorization: Basic {token}` |
| Storage | localStorage key `"login-with-metamask:auth"` |

**Regras de segurança:**

- **NUNCA** armazenar tokens em cookies — usar localStorage.
- **NUNCA** expor connection strings ou secrets no frontend.

### V. Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_API_URL` | Sim | URL base da API backend |
| `VITE_SITE_BASENAME` | Não | Base path do React Router |

Prefixo obrigatório `VITE_`. Acessar via `import.meta.env.VITE_*`.

## Checklist para Novos Contribuidores

Antes de submeter qualquer código, verifique:

- [ ] Utilizou a skill `react-architecture` para novas entidades
- [ ] Imports respeitam o casing exato dos diretórios
- [ ] Variáveis de ambiente frontend usam prefixo `VITE_`
- [ ] Nenhuma biblioteca de state management foi adicionada
- [ ] Tokens e secrets não estão expostos no código frontend

## Governance

- Esta constituição é o documento normativo máximo do projeto frontend.
  Em caso de conflito com outras práticas, a constituição prevalece.
- Emendas DEVEM ser documentadas com justificativa, revisadas e
  aprovadas antes de merge.
- Toda emenda DEVE incluir plano de migração quando aplicável.
- Todos os PRs e revisões DEVEM verificar conformidade com os
  princípios acima.
- Versionamento segue SemVer: MAJOR para remoções/redefinições de
  princípios, MINOR para adições, PATCH para clarificações.

**Version**: 1.0.0 | **Ratified**: 2026-04-02 | **Last Amended**: 2026-04-06
