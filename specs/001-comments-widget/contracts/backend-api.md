# Backend API Contract (consumed)

**Date**: 2026-04-06

APIs do backend Peleja consumidas pelo widget. Referência completa em
`docs/`.

## Headers (all requests)

| Header | Value | Required |
|--------|-------|----------|
| X-Client-Id | `{clientId}` prop | Yes |
| Authorization | `Bearer {token}` (from nauth-react) | Auth endpoints only |
| Content-Type | `application/json` | POST/PUT only |

## Endpoints Used

### GET /api/v1/comments

List comments with cursor pagination.

**Query**: `pageUrl` (required), `sortBy` (recent|popular),
`cursor`, `pageSize` (default 15)

**Response**: `PaginatedResult<CommentResult>`

### POST /api/v1/comments

Create comment/reply. Auth required.

**Body**: `CreateCommentRequest`
**Response**: `CommentResult` (201)

### PUT /api/v1/comments/{commentId}

Edit comment. Auth required (author only).

**Body**: `UpdateCommentRequest`
**Response**: `CommentResult` (200)

### DELETE /api/v1/comments/{commentId}

Soft-delete. Auth required (author/admin/site-owner).

**Response**: 204 No Content

### POST /api/v1/comments/{commentId}/like

Toggle like. Auth required.

**Response**: `CommentLikeResult` (200)

### GET /api/v1/giphy/search

Search GIFs. Auth required.

**Query**: `q` (required), `limit` (default 20), `offset`
**Response**: `GiphySearchResult`

## Error Responses

All errors follow RFC 7807 ProblemDetails format.

| Status | Meaning | Widget Behavior |
|--------|---------|-----------------|
| 400 | Validation error | Show field-level error |
| 401 | Not authenticated | Open login modal |
| 403 | Forbidden (site inactive/blocked) | Show error state |
| 404 | Not found | Show error message |
| 429 | Rate limited | Show "try again later" |
| 503 | Giphy unavailable | Show "GIF service unavailable" |
