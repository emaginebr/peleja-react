# Data Model: Comments Widget

**Date**: 2026-04-06
**Branch**: `001-comments-widget`

## Entities

### CommentResult (from API)

Representa um comentário retornado pela API.

| Field | Type | Description |
|-------|------|-------------|
| commentId | number | ID único do comentário |
| content | string | Texto plano do comentário (max 2000 chars) |
| gifUrl | string \| null | URL do GIF anexado |
| isEdited | boolean | Se o comentário foi editado |
| isDeleted | boolean | Se o comentário foi soft-deleted |
| likeCount | number | Total de likes |
| isLikedByUser | boolean | Se o usuário atual curtiu (false se não autenticado) |
| createdAt | string | ISO 8601 timestamp |
| parentCommentId | number \| null | ID do comentário pai (null = raiz) |
| userId | number | ID do autor (0 se deletado) |
| replies | CommentResult[] \| null | Respostas aninhadas (apenas 1 nível) |

### PaginatedResult\<T\>

Resposta paginada com cursor.

| Field | Type | Description |
|-------|------|-------------|
| items | T[] | Lista de itens da página atual |
| nextCursor | string \| null | Cursor para a próxima página |
| hasMore | boolean | Se há mais itens |

### CommentLikeResult (from API)

Resultado do toggle de like.

| Field | Type | Description |
|-------|------|-------------|
| commentId | number | ID do comentário |
| likeCount | number | Contagem atualizada |
| isLikedByUser | boolean | Estado atual do like |

### GiphyItem (from API)

Item de resultado da busca Giphy.

| Field | Type | Description |
|-------|------|-------------|
| id | string | ID do GIF no Giphy |
| title | string | Título do GIF |
| url | string | URL completa do GIF |
| previewUrl | string | URL do preview (menor) |
| width | number | Largura em pixels |
| height | number | Altura em pixels |

### GiphySearchResult (from API)

Resposta da busca Giphy.

| Field | Type | Description |
|-------|------|-------------|
| items | GiphyItem[] | Lista de GIFs |
| totalCount | number | Total de resultados |
| offset | number | Offset atual |
| limit | number | Limite por página |

### CreateCommentRequest (to API)

Payload para criar comentário.

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| pageUrl | string | Yes | Max 2000 chars |
| content | string | Yes | 1-2000 chars |
| gifUrl | string | No | Max 500 chars |
| parentCommentId | number \| null | No | Must be root comment |

### UpdateCommentRequest (to API)

Payload para editar comentário.

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| content | string | Yes | 1-2000 chars |
| gifUrl | string | No | Max 500 chars |

### UserInfo (from nauth-react)

Usuário autenticado via useAuth.

| Field | Type | Description |
|-------|------|-------------|
| userId | number | ID do usuário |
| name | string | Nome de exibição |
| email | string | Email |
| isAdmin | boolean | Se é admin |
| imageUrl | string \| null | URL do avatar |

## State Model

### CommentContext State

| Field | Type | Description |
|-------|------|-------------|
| comments | CommentResult[] | Lista de comentários carregados |
| nextCursor | string \| null | Cursor para próxima página |
| hasMore | boolean | Se há mais comentários |
| isLoading | boolean | Se está carregando |
| error | string \| null | Mensagem de erro |
| sortBy | "recent" \| "popular" | Ordenação atual |

### Actions

| Action | Trigger | Effect |
|--------|---------|--------|
| loadComments | Mount / sort change | Fetch primeira página, reset state |
| loadMore | Infinite scroll | Fetch próxima página, append |
| addComment | Form submit | POST + prepend à lista |
| editComment | Save click | PUT + update in-place |
| deleteComment | Confirm click | DELETE + mark as deleted in-place |
| toggleLike | Like click | POST + update likeCount/isLikedByUser |
| setSortBy | Sort selector | Change sortBy + reload |

## Relationships

```
PelejaComments (widget root)
  └─ provides CommentContext
       ├─ CommentList
       │    └─ CommentItem (many)
       │         ├─ Avatar
       │         ├─ ReplyForm (conditional)
       │         ├─ EditForm (conditional)
       │         └─ CommentItem (replies, 1 level)
       ├─ CommentForm
       │    ├─ EmojiPicker (popover/bottom-sheet)
       │    └─ GifPicker (popover/bottom-sheet)
       └─ SortSelector
```
