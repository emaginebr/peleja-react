# Quickstart: Peleja App

## Pré-requisitos

- Node.js 18+
- Widget `peleja-react` buildado (`npm run build` na raiz)
- Backend Peleja API rodando
- nauth-react disponível

## Instalação

```bash
cd peleja-app
npm install
```

## Variáveis de Ambiente

Criar `peleja-app/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_TENANT_ID=emagine
VITE_DEMO_CLIENT_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
VITE_NAUTH_API_URL=http://localhost:5001
```

## Desenvolvimento

```bash
npm run dev
```

## Validação

1. Abrir `http://localhost:5173` → landing page com hero, features,
   integração e demo funcional
2. Rolar até a demo → widget de comentários funcional
3. Clicar "Começar Agora" → redireciona para /register
4. Registrar/login → redireciona para /admin/sites
5. Criar um site → Client ID gerado e copiável
6. Ir para Comentários → selecionar site → inserir pageUrl → ver
   comentários → excluir um

## Estrutura de Rotas

| URL | Descrição | Auth |
|-----|-----------|------|
| / | Landing page | Não |
| /login | Login | Não |
| /register | Registro | Não |
| /admin/sites | Gerenciar sites | Sim |
| /admin/comments | Moderar comentários | Sim |
