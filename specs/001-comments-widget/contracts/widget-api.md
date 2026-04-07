# Widget Public API Contract

**Date**: 2026-04-06

## Component: PelejaComments

Entry point do widget. Exportado como named export do package.

```tsx
import { PelejaComments } from 'peleja-react'

<PelejaComments
  clientId="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  pageUrl="https://mysite.com/blog/post-1"
  apiUrl="https://api.peleja.com"
  language="pt-BR"
  className="my-comments"
/>
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| clientId | string | Yes | — | Site Client ID (GUID), sent as X-Client-Id header |
| pageUrl | string | Yes | — | URL da página para carregar comentários |
| apiUrl | string | Yes | — | URL base da API backend |
| language | "pt-BR" \| "en" | No | "pt-BR" | Idioma do widget |
| className | string | No | — | Classe CSS adicional no container raiz |

### Peer Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.0.0 | Framework |
| react-dom | ^18.0.0 | DOM rendering |
| nauth-react | ^0.2.0 | Authentication provider |

### Requirements

A aplicação hospedeira DEVE:

1. Ter `NAuthProvider` configurado acima de `PelejaComments` na árvore
2. Ter `react` e `react-dom` 18.x instalados
3. Fornecer um `clientId` válido (obtido ao registrar site via API)

### Exports

```typescript
// Named exports
export { PelejaComments } from './components/PelejaComments'
export type { PelejaCommentsProps } from './types/comment'
```
