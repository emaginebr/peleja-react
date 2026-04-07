# Peleja React

Widget de comentários em React para integração em sites multi-tenant.

## Stack

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 18.x | Framework UI |
| TypeScript | 5.x | Tipagem estática |
| React Router | 6.x | Roteamento SPA |
| Vite | 6.x | Build toolchain |
| Bootstrap | 5.x | Grid e componentes base |
| i18next | 25.x | Internacionalização |

## Estrutura do Projeto

```
src/
├── Contexts/        # Context providers (uppercase C obrigatório)
├── Services/        # Serviços de API (uppercase S obrigatório)
├── hooks/           # Custom hooks
├── types/           # Interfaces TypeScript
├── components/      # Componentes reutilizáveis
└── pages/           # Páginas/rotas
```

> O casing dos diretórios `Contexts/` e `Services/` é **inviolável** por
> compatibilidade com Linux/Docker. Veja a
> [constituição](.specify/memory/constitution.md) para todos os princípios.

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_API_URL` | Sim | URL base da API backend |
| `VITE_SITE_BASENAME` | Não | Base path do React Router |

## Documentação

- [API Reference](docs/README.md) — Endpoints da API backend consumida
- [Constituição do Projeto](.specify/memory/constitution.md) — Princípios e convenções obrigatórias
