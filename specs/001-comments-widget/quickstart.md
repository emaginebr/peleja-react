# Quickstart: Peleja React Comments Widget

## Instalação

```bash
npm install peleja-react
```

## Peer Dependencies

```bash
npm install react react-dom nauth-react
```

## Uso Básico

```tsx
import { NAuthProvider } from 'nauth-react'
import { PelejaComments } from 'peleja-react'

const App = () => (
  <NAuthProvider config={{ apiUrl: 'https://auth.mysite.com' }}>
    <PelejaComments
      clientId="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
      pageUrl={window.location.href}
      apiUrl="https://api.peleja.com"
    />
  </NAuthProvider>
)
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| clientId | string | Yes | Client ID do site (obtido ao registrar via API) |
| pageUrl | string | Yes | URL da página para associar comentários |
| apiUrl | string | Yes | URL base da API Peleja |
| language | "pt-BR" \| "en" | No | Idioma (padrão: "pt-BR") |
| className | string | No | Classe CSS no container raiz |

## Funcionalidades

- Visualização de comentários sem autenticação
- Scroll infinito com paginação por cursor
- Login sob demanda (modal aparece apenas ao comentar/curtir/responder)
- Picker de emojis com busca
- Picker de GIFs com busca
- Respostas (1 nível)
- Likes com toggle
- Edição e exclusão de comentários próprios
- Seletor de ordenação (Recentes / Populares)
- Responsivo (mobile + desktop)
- i18n (pt-BR e en)

## Pré-requisitos

1. Site registrado na API Peleja (para obter o `clientId`)
2. `NAuthProvider` configurado na app hospedeira (acima do widget)
3. React 18.x

## Customização de Estilos

O widget herda fontes e cores da página hospedeira. Para customizar,
use CSS custom properties no container pai:

```css
.my-comments {
  --peleja-font-family: inherit;
  --peleja-border-color: #e0e0e0;
  --peleja-accent-color: #007bff;
  --peleja-bg-color: transparent;
  --peleja-text-color: inherit;
}
```

## Validação

Para verificar que o widget funciona:

1. Abra a página — comentários devem carregar sem login
2. Role até o final — mais comentários devem carregar (scroll infinito)
3. Clique em "Comentar" — modal de login deve aparecer
4. Faça login — campo de texto deve ficar acessível
5. Envie um comentário — deve aparecer no topo da lista
