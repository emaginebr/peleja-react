# Feature Specification: Comments Widget

**Feature Branch**: `001-comments-widget`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "Crie um widget de comentários em react"

## Clarifications

### Session 2026-04-06

- Q: O usuário pode alternar a ordenação dos comentários (recentes/populares)? → A: Sim, seletor visível para alternar entre "Recentes" e "Populares".
- Q: O widget gerencia o NAuthProvider internamente ou espera um provider externo? → A: Widget espera NAuthProvider externo da aplicação hospedeira.
- Q: Comentários de outros usuários atualizam em tempo real? → A: Não. Lista atualiza apenas no carregamento inicial e após ações do próprio usuário.
- Q: O conteúdo dos comentários suporta formatação rica ou é texto plano? → A: Texto plano com emojis inline e GIF como anexo visual separado.
- Q: Como o widget se comporta em telas pequenas (mobile)? → A: 100% do container pai, responsivo com breakpoints para mobile/desktop. Pickers abrem como popover em desktop e bottom sheet em mobile.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualizar comentários sem autenticação (Priority: P1)

Um visitante acessa uma página que contém o widget de comentários. Sem precisar
fazer login, ele consegue ver todos os comentários existentes com scroll infinito
carregando mais comentários conforme rola a página. Um seletor permite alternar
entre ordenação por "Recentes" e "Populares". Cada comentário exibe o avatar do
autor (foto redonda ou iniciais), nome, data, conteúdo, contagem de likes e
respostas aninhadas.

**Why this priority**: É a experiência base do widget — sem visualização não
há valor para nenhum visitante. Representa a grande maioria do tráfego.

**Independent Test**: Incorporar o widget em uma página de teste com `clientId`
válido e verificar que comentários aparecem com scroll infinito sem login.

**Acceptance Scenarios**:

1. **Given** uma página com comentários existentes, **When** o visitante abre a
   página, **Then** os comentários mais recentes são exibidos com avatar, nome,
   data e conteúdo, e um seletor de ordenação (Recentes/Populares) está visível.
2. **Given** mais de 15 comentários na página, **When** o visitante rola até o
   final da lista, **Then** o próximo lote de comentários é carregado
   automaticamente.
3. **Given** um comentário com respostas, **When** o visitante visualiza o
   comentário, **Then** as respostas aparecem aninhadas abaixo do comentário pai.
4. **Given** um comentário de um autor sem foto de perfil, **When** o visitante
   visualiza o comentário, **Then** um avatar circular com as iniciais do autor é
   exibido.
5. **Given** um comentário deletado, **When** o visitante visualiza a lista,
   **Then** o comentário aparece com texto "[Comment removed]" e sem informações
   do autor.

---

### User Story 2 - Criar comentário com autenticação sob demanda (Priority: P2)

Um visitante deseja comentar em uma página. Ao clicar no botão para comentar,
um modal de login é exibido (via nauth-react, cujo provider é gerenciado pela
aplicação hospedeira). Após autenticar, o visitante pode escrever seu comentário
em texto plano, adicionar emojis inline ou anexar um GIF através de pickers com
busca integrada, e enviar. O comentário aparece imediatamente na lista.

**Why this priority**: Comentar é a ação principal do widget. A autenticação
sob demanda (lazy) garante que visitantes não sejam intimidados por um login
antes de explorar o conteúdo.

**Independent Test**: Abrir o widget sem login, clicar em "Comentar", verificar
que o modal de login aparece, autenticar e enviar um comentário com sucesso.

**Acceptance Scenarios**:

1. **Given** um visitante não autenticado, **When** clica no botão para
   comentar, **Then** um modal de login (nauth-react) é exibido.
2. **Given** o visitante completa o login no modal, **When** o modal fecha,
   **Then** o visitante está autenticado e pode digitar seu comentário.
3. **Given** um visitante autenticado no campo de texto, **When** clica no
   botão de emoji, **Then** um picker de emojis com busca aparece.
4. **Given** um visitante autenticado no campo de texto, **When** clica no
   botão de GIF, **Then** um picker de GIFs com busca (via API Giphy do
   backend) aparece.
5. **Given** um visitante autenticado digita um comentário e clica em enviar,
   **When** o servidor retorna sucesso, **Then** o novo comentário aparece no
   topo da lista imediatamente.
6. **Given** um visitante autenticado, **When** tenta enviar um comentário
   vazio, **Then** o botão de envio permanece desabilitado.

---

### User Story 3 - Responder, curtir, editar e excluir comentários (Priority: P3)

Um usuário autenticado pode interagir com comentários existentes: responder a
um comentário (apenas ao comentário raiz, não a respostas), curtir/descurtir
comentários com toggle, editar seus próprios comentários e excluir seus próprios
comentários.

**Why this priority**: São interações complementares que enriquecem a
experiência, mas o widget já entrega valor apenas com visualização e criação.

**Independent Test**: Autenticar, responder a um comentário, curtir outro,
editar o próprio e excluir — verificar que cada ação funciona independentemente.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado visualizando um comentário raiz, **When**
   clica em "Responder", **Then** um campo de texto para resposta aparece abaixo
   do comentário.
2. **Given** um usuário autenticado, **When** clica no botão de like de um
   comentário, **Then** o like é toggled e a contagem atualiza imediatamente.
3. **Given** o autor de um comentário, **When** clica em "Editar", **Then** o
   conteúdo vira um campo editável com botões de salvar e cancelar.
4. **Given** o autor de um comentário (ou admin), **When** clica em "Excluir"
   e confirma, **Then** o comentário é soft-deleted e exibe "[Comment removed]".
5. **Given** um usuário não autenticado, **When** clica em like ou responder,
   **Then** o modal de login é exibido.

---

### Edge Cases

- O que acontece quando a API retorna erro 429 (rate limit)? O widget exibe
  uma mensagem amigável pedindo para aguardar.
- O que acontece quando a API do Giphy está indisponível (503)? O picker de GIF
  exibe mensagem de indisponibilidade temporária.
- O que acontece quando o `clientId` é inválido ou o site está bloqueado (403)?
  O widget exibe mensagem de erro e não renderiza comentários.
- O que acontece quando a página não tem comentários? O widget exibe um estado
  vazio convidando o visitante a ser o primeiro a comentar.
- O que acontece quando o token de autenticação expira durante uso? O widget
  detecta o 401 e reabre o modal de login.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O widget DEVE ser distribuído como um package npm React, instalável
  via `npm install` e utilizável como componente `<PelejaComments />`.
- **FR-002**: O widget DEVE receber `clientId` como prop obrigatória,
  enviando-o como header `X-Client-Id` em todas as requisições à API.
- **FR-003**: O widget DEVE receber `pageUrl` como prop obrigatória para
  identificar a página cujos comentários serão exibidos.
- **FR-004**: O widget DEVE receber `apiUrl` como prop obrigatória indicando
  a URL base da API backend.
- **FR-005**: O widget DEVE exibir comentários em lista com scroll infinito
  (cursor-based pagination) sem exigir autenticação, com seletor visível para
  alternar entre ordenação "Recentes" e "Populares".
- **FR-006**: O widget DEVE exibir avatar circular com foto do autor ou iniciais
  quando não houver foto.
- **FR-007**: O widget DEVE exibir o modal de login (nauth-react) somente quando
  o usuário tenta uma ação que requer autenticação (comentar, responder, curtir).
  O widget espera que a aplicação hospedeira forneça o NAuthProvider — não
  gerencia o provider internamente.
- **FR-008**: O campo de texto de comentário DEVE incluir botão para picker de
  emojis com funcionalidade de busca.
- **FR-009**: O campo de texto de comentário DEVE incluir botão para picker de
  GIFs com funcionalidade de busca, consumindo o endpoint de busca de GIFs do
  backend.
- **FR-010**: O widget DEVE permitir respostas apenas a comentários raiz (não
  respostas a respostas).
- **FR-011**: O widget DEVE permitir que o autor edite seu próprio comentário.
- **FR-012**: O widget DEVE permitir que o autor (ou admin) exclua seu próprio
  comentário com confirmação.
- **FR-013**: O widget DEVE permitir toggle de like em comentários para
  usuários autenticados.
- **FR-014**: O widget DEVE herdar estilos da página hospedeira na medida do
  possível (fontes, cores base), aplicando apenas estilos estruturais mínimos.
- **FR-015**: O widget DEVE exibir comentários deletados como "[Comment removed]"
  sem informações do autor.
- **FR-016**: O widget DEVE ocupar 100% da largura do container pai e ser
  responsivo com breakpoints para mobile e desktop. Pickers de emoji e GIF
  DEVEM abrir como popover em desktop e bottom sheet em mobile.
- **FR-017**: O conteúdo dos comentários DEVE ser texto plano com emojis inline.
  GIFs são anexados como elemento visual separado abaixo do texto.
- **FR-018**: A lista de comentários NÃO atualiza em tempo real. Novos
  comentários de outros usuários só aparecem no carregamento inicial ou após
  ações do próprio usuário (postar, editar, excluir).

### Key Entities

- **Comment**: Conteúdo textual postado por um usuário em uma página. Pode ter
  respostas (1 nível), GIF anexado, contagem de likes, status de edição/exclusão.
- **User**: Autor de um comentário. Possui nome, avatar (URL ou iniciais),
  status de admin.
- **Page**: URL da página hospedeira, criada automaticamente pelo backend no
  primeiro comentário.
- **GIF**: Resultado de busca do Giphy, com URL de preview e URL completa.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitantes conseguem visualizar comentários existentes em menos de
  2 segundos após o carregamento da página.
- **SC-002**: O scroll infinito carrega o próximo lote de comentários em menos
  de 1 segundo após o visitante atingir o final da lista.
- **SC-003**: O fluxo completo de login + envio de comentário é concluído em
  menos de 30 segundos pelo usuário.
- **SC-004**: 100% das ações que requerem autenticação exibem o modal de login
  quando o usuário não está autenticado — nenhuma tela de login aparece antes
  de uma ação explícita do usuário.
- **SC-005**: O widget renderiza corretamente em qualquer página que utilize
  React 18.x, sem conflitos de estilo com a página hospedeira.
- **SC-006**: Emojis e GIFs podem ser pesquisados e inseridos no comentário em
  menos de 3 interações (abrir picker → buscar → selecionar).

## Assumptions

- O backend Peleja API já está funcional e acessível, com todos os endpoints
  documentados em `docs/` operacionais.
- O package `nauth-react` já existe e fornece componentes de login reutilizáveis
  (modal de autenticação). A aplicação hospedeira é responsável por configurar
  o NAuthProvider na árvore de componentes.
- O widget será usado em aplicações React 18.x — não há requisito de
  compatibilidade com versões anteriores do React.
- A busca de emojis será implementada no frontend (client-side) sem dependência
  de API externa — apenas o picker de GIFs utiliza a API do backend.
- O `clientId` é fornecido pelo site integrador (obtido ao registrar o site via
  endpoint de sites da API).
- Internacionalização (i18n) será implementada mas o escopo inicial contempla
  apenas português (pt-BR) e inglês (en).
