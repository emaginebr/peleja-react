# Research: Landing Page, Demo & Admin

**Date**: 2026-04-06
**Branch**: `002-landing-admin-page`

## 1. Projeto Separado em peleja-app/

**Decision**: Criar aplicação React independente em `peleja-app/` com
Vite SPA, consumindo `peleja-react` como dependência local via
`"peleja-react": "file:.."`.

**Rationale**: O widget (`src/`) é um package npm publicável. A app
(`peleja-app/`) é uma aplicação de demonstração e administração. Separá-los
mantém o widget independente e a app como consumidor real.

**Alternatives considered**:
- Monorepo com workspaces: complexidade desnecessária para 2 projetos
- Mesmo diretório src/: mistura package com app, conflita com build.lib

## 2. Routing e Layout

**Decision**: React Router 6.x com layouts aninhados.

**Rationale**:
- Layout público (Header + Footer) para landing, login, register
- Layout admin (Sidebar + Content) para rotas protegidas
- `ProtectedRoute` wrapper que verifica `isAuthenticated` e redireciona
  para `/login` se necessário

**Routes**:
- `/` → LandingPage (Layout público)
- `/login` → LoginPage (Layout público)
- `/register` → RegisterPage (Layout público)
- `/admin/sites` → SitesPage (AdminLayout, protegida)
- `/admin/comments` → CommentsPage (AdminLayout, protegida)

## 3. Site Service

**Decision**: Consumir endpoints `POST/GET/PUT /api/v1/sites` com
header `X-Tenant-Id`.

**Rationale**: A API de sites usa `X-Tenant-Id` (não `X-Client-Id`).
O SiteService precisa do tenant do usuário para autenticar. O tenant
será configurável via variável de ambiente `VITE_TENANT_ID` ou
selecionável no formulário de criação de site.

**Endpoints utilizados**:
- `POST /api/v1/sites` → criar site (body: siteUrl, tenant)
- `GET /api/v1/sites` → listar sites do usuário
- `PUT /api/v1/sites/{siteId}` → atualizar site (body: siteUrl, status)

## 4. Moderação de Comentários

**Decision**: Navegação site → pageUrl (input manual) → comentários.

**Rationale**: A API não possui endpoint para listar páginas de um site.
O GET /api/v1/comments requer `pageUrl`. O admin inserirá ou selecionará
a pageUrl manualmente para filtrar comentários. Futuramente, um endpoint
de listagem de páginas pode ser adicionado ao backend.

**Workaround**: O admin pode ver os comentários de uma página digitando
a URL no campo de busca. O `X-Client-Id` do site será usado para
autenticar a requisição de comentários.

**Alternatives considered**:
- Listar todas as páginas automaticamente: requer endpoint backend
  inexistente
- Cache local de URLs comentadas: complexo e incompleto

## 5. Landing Page Design

**Decision**: Usar a skill `/frontend-design` para criar layout
profissional da landing page com seções: hero, features, integração
e demo.

**Rationale**: A skill `frontend-design` produz designs de alta qualidade
que evitam estética genérica de IA. Garantir que a landing page tenha
aparência profissional e distintiva é crucial para conversão.

**Sections planejadas**:
1. Hero: título, subtítulo, CTA ("Começar Agora" → /register)
2. Features: grid de cards com ícones (emojis, GIFs, scroll, login
   sob demanda, respostas, likes, i18n, responsivo)
3. Integration: bloco de código com exemplo de uso
4. Demo: widget PelejaComments funcional com clientId demo

## 6. Admin Sidebar

**Decision**: Sidebar fixa com links para Sites e Comentários.
Colapsável em mobile (hamburger menu).

**Rationale**: Padrão consolidado em painéis admin (Stripe, Vercel).
Permite adicionar seções futuras sem redesign.

**Links**:
- Sites (ícone: globe) → /admin/sites
- Comentários (ícone: message) → /admin/comments

## 7. Dependência Local peleja-react

**Decision**: Referenciar via `"peleja-react": "file:.."` no
package.json do peleja-app.

**Rationale**: Permite desenvolvimento local sem publicar o package.
O Vite resolve o link local e faz hot-reload das mudanças no widget.

**Configuration**:
- `peleja-app/package.json`: `"peleja-react": "file:.."`
- Import: `import { PelejaComments } from 'peleja-react'`
- CSS: `import 'peleja-react/style.css'`

## 8. HttpClient para Site API

**Decision**: Criar HttpClient próprio no peleja-app que injeta
`X-Tenant-Id` (não `X-Client-Id`) para endpoints de sites. Reutilizar
o HttpClient do peleja-react para chamadas de comentários (via widget).

**Rationale**: Os endpoints de sites usam `X-Tenant-Id` (definido pelo
tenant do usuário autenticado), diferente dos endpoints de comentários
que usam `X-Client-Id`. Cada domínio precisa do seu próprio client.
