# Site API Contract (consumed)

**Date**: 2026-04-06

APIs do backend Peleja consumidas pelo admin. Referência em
`docs/site-controller.md`.

## Headers (all site requests)

| Header | Value | Required |
|--------|-------|----------|
| X-Tenant-Id | `{tenantId}` (from config/form) | Yes |
| Authorization | `Bearer {token}` (from nauth-react) | Yes |
| Content-Type | `application/json` | POST/PUT only |

## Endpoints

### POST /api/v1/sites — Create site

**Body**: `CreateSiteRequest`
**Response**: `SiteInfo` (201)
**Errors**: 400 (validation), 401 (not auth), 409 (URL exists)

### GET /api/v1/sites — List user sites

**Response**: `SiteInfo[]` (200)
**Errors**: 401 (not auth)

### PUT /api/v1/sites/{siteId} — Update site

**Body**: `UpdateSiteRequest`
**Response**: `SiteInfo` (200)
**Errors**: 400, 401, 403 (not owner), 404, 409 (URL exists)

## Comment Moderation

Para moderar comentários, o admin usa os endpoints de comentários
(docs/comment-controller.md) com o `X-Client-Id` do site selecionado:

- `GET /api/v1/comments?pageUrl={url}` — listar comentários
- `DELETE /api/v1/comments/{commentId}` — excluir comentário

O `X-Client-Id` é obtido do `clientId` do site selecionado na lista.
