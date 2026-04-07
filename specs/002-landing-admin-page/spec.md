# Feature Specification: Landing Page, Demo & Admin

**Feature Branch**: `002-landing-admin-page`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "Página de apresentação, demonstração e admin do widget Peleja"

## Clarifications

### Session 2026-04-06

- Q: Como o admin navega até os comentários de um site (API requer pageUrl)? → A: Lista páginas do site primeiro, depois comentários por página selecionada.
- Q: Login/Registro são páginas dedicadas ou modais? → A: Páginas dedicadas com rotas (/login, /register) usando componentes do nauth-react.
- Q: Qual layout da área administrativa? → A: Sidebar fixa à esquerda com links (Sites, Comentários) + conteúdo à direita.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Landing page com apresentação do widget (Priority: P1)

Um visitante acessa o site do Peleja e encontra uma página de apresentação
profissional que descreve o widget de comentários, seus recursos (scroll
infinito, emojis, GIFs, login sob demanda, respostas, likes, i18n, responsivo)
e como integrá-lo em seu site. A página é pública e não requer autenticação.

**Why this priority**: É a porta de entrada do produto. Sem uma apresentação
clara, visitantes não entendem o valor do widget e não se convertem em
usuários.

**Independent Test**: Acessar a URL raiz do site e verificar que a página de
apresentação carrega com todas as seções de recursos visíveis.

**Acceptance Scenarios**:

1. **Given** um visitante acessa a URL raiz, **When** a página carrega,
   **Then** uma hero section com título, descrição e call-to-action é exibida.
2. **Given** o visitante rola a página, **When** chega à seção de recursos,
   **Then** vê uma lista de funcionalidades do widget (emojis, GIFs, scroll
   infinito, login sob demanda, respostas, likes, i18n, responsivo).
3. **Given** o visitante rola até a seção de integração, **When** visualiza,
   **Then** vê um exemplo de código mostrando como instalar e usar o componente
   `<PelejaComments />`.

---

### User Story 2 - Demonstração funcional do widget (Priority: P2)

Na mesma página de apresentação, abaixo das seções informativas, existe uma
demonstração funcional do widget Peleja. O visitante pode interagir com o
widget em tempo real: ler comentários, fazer login, comentar, curtir, usar
emojis e GIFs — tudo na própria landing page.

**Why this priority**: Uma demonstração ao vivo é o argumento de venda mais
eficaz. Visitantes experimentam o widget antes de decidir integrá-lo.

**Independent Test**: Rolar até a seção "Demo" da landing page e interagir com
o widget funcional (ler, comentar, curtir).

**Acceptance Scenarios**:

1. **Given** o visitante rola até a seção de demonstração, **When** visualiza,
   **Then** o widget `<PelejaComments />` está renderizado e funcional com
   comentários reais.
2. **Given** o visitante não está autenticado, **When** clica para comentar,
   **Then** o modal de login aparece (nauth-react).
3. **Given** o visitante se autenticou e enviou um comentário na demo, **When**
   o comentário é criado, **Then** aparece na lista do widget imediatamente.

---

### User Story 3 - Área administrativa: gerenciar sites e Client IDs (Priority: P3)

Um usuário autenticado acessa a área administrativa para registrar seus sites
e obter Client IDs (necessários para integrar o widget). Ele pode criar novos
sites, ver a lista de seus sites com respectivos Client IDs, atualizar a URL
de um site e alterar o status (ativo/inativo).

**Why this priority**: Sem Client IDs, ninguém pode integrar o widget.
A área admin é essencial para a autosserviço do produto.

**Independent Test**: Fazer login, acessar a página admin, registrar um novo
site e verificar que o Client ID é gerado.

**Acceptance Scenarios**:

1. **Given** um usuário não autenticado, **When** tenta acessar a área admin,
   **Then** é redirecionado para a página de login.
2. **Given** um usuário autenticado na área admin, **When** clica em "Novo
   Site", **Then** um formulário pede a URL do site e o tenant.
3. **Given** o usuário preenche o formulário e envia, **When** o servidor
   retorna sucesso, **Then** o novo site aparece na lista com seu Client ID
   gerado.
4. **Given** o usuário vê a lista de sites, **When** clica em copiar o
   Client ID, **Then** o ID é copiado para a área de transferência com
   confirmação visual.
5. **Given** o usuário edita um site, **When** altera a URL ou status e
   salva, **Then** as mudanças são persistidas e a lista atualiza.

---

### User Story 4 - Área administrativa: gerenciar comentários (Priority: P4)

Na área admin, o usuário pode visualizar e gerenciar comentários de seus sites.
Ele vê a lista de comentários de um site selecionado e pode excluir comentários
que violem regras da comunidade.

**Why this priority**: Moderação de conteúdo é importante, mas secundária
em relação ao cadastro de sites (sem sites, não há comentários para moderar).

**Independent Test**: Fazer login, selecionar um site na admin, visualizar
seus comentários e excluir um.

**Acceptance Scenarios**:

1. **Given** o usuário está na área admin, **When** seleciona um site da lista,
   **Then** as páginas (URLs) com comentários daquele site são listadas.
2. **Given** a lista de páginas do site, **When** o usuário seleciona uma página,
   **Then** os comentários daquela página são exibidos em lista paginada.
3. **Given** a lista de comentários da página, **When** o usuário clica em
   excluir um comentário, **Then** uma confirmação é exibida.
4. **Given** o usuário confirma a exclusão, **When** o servidor retorna sucesso,
   **Then** o comentário é removido da lista (soft-delete).
5. **Given** o site não tem páginas com comentários, **When** o usuário
   visualiza, **Then** um estado vazio é exibido.

---

### Edge Cases

- O que acontece quando o usuário tenta registrar um site com URL já existente?
  O sistema exibe mensagem de erro (409 Conflict) informando que a URL já está
  registrada.
- O que acontece quando o usuário tenta acessar a admin sem autenticação?
  É redirecionado para a página de login.
- O que acontece quando o backend retorna erro ao criar site? O formulário
  exibe a mensagem de erro sem perder os dados preenchidos.
- O que acontece quando o token expira durante uso da admin? O usuário é
  redirecionado para login.
- O que acontece quando um site está com status "Blocked"? O site aparece
  na lista mas com indicação de bloqueio e sem opção de editar (apenas o
  sistema pode bloquear).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir uma landing page pública com seções:
  hero, recursos do widget, exemplo de integração e demonstração ao vivo.
- **FR-002**: A seção de demonstração DEVE conter um widget `<PelejaComments />`
  funcional, conectado à API real.
- **FR-003**: O sistema DEVE fornecer uma área administrativa acessível
  somente por usuários autenticados.
- **FR-004**: A autenticação DEVE ser gerenciada pelo nauth-react (login,
  registro, sessão).
- **FR-005**: Na área admin, o usuário DEVE poder registrar um novo site
  (informando URL e tenant) e receber um Client ID gerado.
- **FR-006**: Na área admin, o usuário DEVE ver a lista de seus sites com
  Client ID, URL, status e data de criação.
- **FR-007**: O usuário DEVE poder copiar o Client ID de um site para a
  área de transferência.
- **FR-008**: O usuário DEVE poder editar a URL e o status (Ativo/Inativo)
  de seus sites.
- **FR-009**: Na área admin, o usuário DEVE poder selecionar um site, ver
  a lista de páginas (URLs) com comentários, e ao selecionar uma página,
  ver os comentários daquela página em lista paginada.
- **FR-010**: O usuário DEVE poder excluir comentários de seus sites
  (como site owner) com confirmação.
- **FR-011**: A navegação DEVE incluir: Landing Page, Login (/login),
  Registro (/register), e Admin (protegida). Login e Registro são páginas
  dedicadas com rotas próprias, usando componentes do nauth-react.
- **FR-013**: A área administrativa DEVE ter layout com sidebar fixa à
  esquerda contendo links de navegação (Sites, Comentários) e área de
  conteúdo à direita.
- **FR-012**: A página DEVE ser responsiva (desktop e mobile).

### Key Entities

- **Site**: Registro de um site que usa o widget. Possui URL, Client ID (GUID),
  tenant, status (Active/Inactive/Blocked), data de criação, e dono (userId).
- **Comment**: Comentário associado a uma página de um site. Pode ser
  visualizado e excluído pelo dono do site na admin.
- **User**: Usuário autenticado via nauth-react. Pode ser dono de sites e
  moderador de comentários.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitantes entendem o que o Peleja oferece em menos de 30
  segundos após acessar a landing page (seção hero + recursos visíveis
  sem scroll).
- **SC-002**: A demonstração ao vivo funciona sem erros para 95% dos
  visitantes que interagem com ela.
- **SC-003**: Usuários conseguem registrar um site e obter o Client ID
  em menos de 2 minutos (do login ao ID copiado).
- **SC-004**: A moderação de comentários (selecionar site + excluir
  comentário) é concluída em menos de 30 segundos.
- **SC-005**: Todas as páginas carregam em menos de 2 segundos.

## Assumptions

- Este projeto DEVE ser criado no diretório `peleja-app` na raiz do
  repositório, como uma aplicação React separada do widget (que vive
  em `src/`). O widget `peleja-react` será consumido como dependência
  local pelo `peleja-app`.
- O widget `peleja-react` (feature 001) já está implementado e disponível
  como dependência local.
- O backend Peleja API está funcional com os endpoints de sites
  (POST/GET/PUT /api/v1/sites) e comentários operacionais.
- O nauth-react já está disponível e configurado para autenticação.
- A landing page e a admin fazem parte da mesma aplicação React (SPA com
  rotas) dentro de `peleja-app/`.
- O widget na seção de demonstração usará um Client ID pré-configurado
  para um "site demo" já registrado.
- O tenant para registro de novos sites será selecionável a partir de uma
  lista fixa pré-configurada (não há criação de novos tenants pelo frontend).
