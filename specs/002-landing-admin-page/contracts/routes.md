# Routes Contract

**Date**: 2026-04-06

## Public Routes (Layout público: Header + Footer)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Hero, features, integration, demo |
| `/login` | LoginPage | nauth-react LoginForm |
| `/register` | RegisterPage | nauth-react RegisterForm |

## Protected Routes (AdminLayout: Sidebar + Content)

Requerem autenticação. Redirect para `/login` se não autenticado.

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/sites` | SitesPage | CRUD de sites + Client IDs |
| `/admin/comments` | CommentsPage | Moderação de comentários |

## Navigation

### Header (público)

- Logo (→ /)
- Login (→ /login) — esconde se autenticado
- Register (→ /register) — esconde se autenticado
- Admin (→ /admin/sites) — mostra se autenticado
- Logout — mostra se autenticado

### Sidebar (admin)

- Sites (→ /admin/sites)
- Comentários (→ /admin/comments)
