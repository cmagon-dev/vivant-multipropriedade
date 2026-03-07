# MAPEAMENTO COMPLETO — Vivant Care e Painel Admin

**Objetivo:** Diagnóstico técnico para administrar o Portal do Cotista (Vivant Care) **dentro** do painel admin já existente.  
**Escopo:** Apenas mapeamento e plano; nenhuma implementação nesta etapa.

---

## 1. Visão geral da arquitetura atual

### Stack
- **Framework:** Next.js 14.2 (App Router)
- **Auth:** NextAuth.js (JWT), dois providers: `admin-credentials` (User) e `cotista-credentials` (Cotista)
- **ORM:** Prisma (PostgreSQL)
- **UI:** React, Tailwind, componentes em `components/ui` (shadcn-style) e específicos por contexto

### Estrutura de pastas relevante
- **`app/`** — Rotas por route groups: `(admin)`, `(admin-portal)`, `(dashboard)`, `(cotista)`, `(auth)`, `(public)`
- **`components/`** — `admin/`, `admin-portal/`, `cotista/`, `shell/`, `comercial/`, `ui/`, `dashboard/`
- **`lib/`** — `auth/` (auth.ts, permissions, permissionCatalog, middlewareRedirect), `navigation/menu.ts`, `prisma.ts`, `domain.ts`, `audit.ts`, `crm/`, `telemetry/`, etc.
- **`prisma/`** — `schema.prisma`, `seed.ts`
- **`middleware.ts`** — Proteção de rotas por token JWT e permissões

### Dois painéis distintos
| Painel | Rota base | Layout | Público |
|--------|-----------|--------|---------|
| **Painel administrativo principal** | `/admin/*` (e `/dashboard/comercial/*`) | AppShell único, menu por permissão | Dono (Caio), equipe (admin/comercial/staff) |
| **Portal do Cotista (Vivant Care)** | `/admin-portal/*` | Layout próprio (sidebar + header), menu fixo | Admin que gerencia cotistas/propriedades |

O **portal que o cotista usa** é o grupo `(cotista)` com rotas `/dashboard/*` e `/cotista` (redirect para `/dashboard`), com layout em `components/cotista/layout/` (Sidebar, Header, MobileNav).

---

## 2. Rotas e estrutura do painel admin

### Rotas do painel admin (`/admin/*`)
- **Layout:** `app/(admin)/layout.tsx` → `AdminProvider`; `app/(admin)/admin/layout.tsx` → `AppShell` + menu filtrado por permissão.
- **Menu:** Definido em `lib/navigation/menu.ts` (`UNIFIED_MENU_CONFIG`), filtrado por `filterMenuByPermission` com `hasPermissionKey`. OWNER/SUPER_ADMIN veem tudo.
- **Páginas:**
  - `/admin` → redirect para overview/casas/destinos conforme permissão
  - `/admin/overview` — Visão do Dono (eventos, tarefas, SLA)
  - `/admin/dashboard` — Dashboard legado
  - `/admin/crm` — Funis / CRM (tipos, etapas, ALERTA)
  - `/admin/casas` — Lista; `/admin/casas/nova`, `/admin/casas/[id]/editar`
  - `/admin/destinos` — Lista; `/admin/destinos/novo`, `/admin/destinos/[id]/editar`
  - `/admin/usuarios` — Lista (User + Cotista); novo, editar
  - `/admin/roles` — Gestão de roles
  - `/admin/permissions` — (rota existe no menu como "Permissões" → roles)
  - `/admin/tasks` — Tarefas do sistema
  - `/admin/events` — Eventos do sistema
  - `/admin/help` — Conteúdos de ajuda

### Rotas comerciais (mesmo AppShell)
- `/dashboard/comercial` — Início Comercial
- `/dashboard/comercial/leads` — Kanban de leads
- `/dashboard/comercial/propriedades` — Lista de propriedades (comercial)

### Onde o menu é definido
- **Arquivo:** `lib/navigation/menu.ts`
- **Estrutura:** `UNIFIED_MENU_CONFIG` — array de `{ label, href, iconKey, requiredPermissions, section }`
- **Seções:** dashboard, comercial, propriedades, administracao, suporte (`SECTION_TITLES`, `SECTION_ORDER`)
- **Renderização:** `AppShell` (`components/shell/AppShell.tsx`) recebe `menuItems` já filtrados; sidebar em accordion por seção
- **Controle por permissão:** Cada item tem `requiredPermissions: string[]`; `filterMenuByPermission` + `hasPermissionKey` (middleware e layout usam o mesmo token)
- **Melhor lugar para “Vivant Care”:** Nova seção (ex.: `section: "vivantCare"`) ou dentro de **Propriedades** ou **Administração**. Recomendado: nova seção "VIVANT CARE" com itens como Cotistas, Propriedades (portal), Financeiro, Convites, etc., cada um com permissões tipo `vivantCare.cotistas.view`, `vivantCare.financeiro.manage`.

---

## 3. Rotas e estrutura do Portal do Cotista

### Portal admin (Vivant Care — quem administra cotistas)
- **Base:** `/admin-portal/*`
- **Layout:** `app/(admin-portal)/admin-portal/layout.tsx` — `AdminPortalSidebar` + `AdminPortalHeader`, sessão admin obrigatória
- **Menu (fixo, sem permissão por item):** Dashboard, Propriedades, Cotistas, Financeiro, Convites Pendentes, Configurações (`components/admin-portal/sidebar.tsx`)
- **Páginas:**
  - `/admin-portal` — Dashboard (cards: total cotistas, ativos, cobranças pendentes, convites)
  - `/admin-portal/propriedades` — Lista; nova, [id], [id]/editar, [id]/calendario
  - `/admin-portal/cotistas` — Lista; `/admin-portal/cotistas/novo` (convite)
  - `/admin-portal/financeiro` — Financeiro
  - `/admin-portal/convites-pendentes` — Convites
  - `/admin-portal/configuracoes` — Configurações

### Portal do cotista (quem é cotista e acessa /dashboard)
- **Base:** `/dashboard/*` (e `/cotista` que redireciona para `/dashboard`)
- **Layout:** `app/(cotista)/layout.tsx` — Client; `Sidebar` + `Header` + `MobileNav` (`components/cotista/layout/`)
- **Páginas:**
  - `/dashboard` — Dashboard (stats, próximas reservas, pagamentos pendentes, avisos recentes)
  - `/dashboard/calendario` — Calendário/reservas
  - `/dashboard/financeiro` — Cobranças; `/dashboard/financeiro/[id]` — Detalhe
  - `/dashboard/avisos` — Avisos
  - `/dashboard/documentos` — Documentos (hoje mockado)
  - `/dashboard/assembleias` — Placeholder “Em breve”
  - `/dashboard/trocas` — Placeholder “Em breve”
  - `/dashboard/perfil` — Perfil

---

## 4. Models/tabelas existentes e reaproveitamento

Resumo por entidade (schema em `prisma/schema.prisma`).

| Item | Existe? | Model/Tabela | Relacionamentos | Reaproveitamento Vivant Care |
|------|---------|--------------|------------------|------------------------------|
| **Cotistas** | Sim | `Cotista` / cotistas | cotas, reservas, trocasSemanas, votosAssembleia, mensagens, notificacoes | Total. Já usado em admin-portal e /api/admin/cotistas. |
| **Usuários internos** | Sim | `User` / users | userRoleAssignments, userPermissions, properties, destinations, leads, etc. | Total. RBAC já usado no admin. |
| **Propriedades** | Sim | `Property` / properties | destino, cotas, assembleias, mensagens, documentos | Total. Admin tem casas; admin-portal tem propriedades (mesmo model). |
| **Unidades** | Não | — | — | Não existe “unidade” separada; propriedade é a unidade. |
| **Cotas** | Sim | `CotaPropriedade` / cotas_propriedade | cotista, property, cobrancas, reservas | Total. |
| **Reservas** | Sim | `Reserva` / reservas | cota, cotista, troca | Total. APIs cotista e admin existem. |
| **Calendário/disponibilidade** | Parcial | Reserva + CotaPropriedade.semanasConfig (JSON) | — | Lógica de semanas no seed/calendário; API admin propriedades calendário existe. |
| **Cobranças/pagamentos** | Sim | `Cobranca` / cobrancas | cota; status, valor, dataVencimento, urlBoleto, urlComprovante | Total. APIs cotista e admin (gerar). |
| **Documentos** | Sim | `Documento` / documentos | property; tipo, url, nomeArquivo, etc. | Model completo; tela cotista não consome (mock). |
| **Avisos/comunicados** | Sim | `Mensagem` / mensagens | property, autor (Cotista opcional); VisualizacaoMensagem | Total. API cotista `/api/cotistas/me/avisos` usa. |
| **Assembleias** | Sim | `Assembleia`, `PautaAssembleia`, `VotoAssembleia` | property, pautas, votos | Model completo; sem telas admin nem cotista funcionais. |
| **Troca de semanas** | Sim | `TrocaSemana` / trocas_semanas | solicitante, reservas, status, tipo | Model completo; sem API/tela para cotista listar/criar. |
| **Anexos/arquivos** | Parcial | Documento.url, Mensagem.anexosUrls (JSON), Cobranca.urlBoleto/urlComprovante | — | Upload em `/api/upload`; sem módulo documental unificado. |
| **Permissões e vínculos** | Sim | Role, Permission, UserRoleAssignment, UserPermission, Company | User ↔ Role ↔ Permission | Total. Suporta novas chaves (ex.: vivantCare.*). |

**Conclusão:** Quase tudo para Vivant Care já existe no schema. Faltam principalmente: uso real de Assembleia/TrocaSemana/Documento no portal cotista e, no admin, gestão de assembleias/trocas/documentos por propriedade.

---

## 5. Autenticação e permissões

### Autenticação
- **Arquivo:** `lib/auth.ts` — `authOptions` com dois CredentialsProviders: `admin-credentials` (User), `cotista-credentials` (Cotista por email ou CPF).
- **Sessão:** JWT; `callbacks.jwt` preenche `userType`, `roleKey`, `permissions` (admin); `session` expõe isso no client.
- **Login único:** `app/(auth)/login/page.tsx` — escolha Admin vs Cotista; `signIn(provider, { email, password, redirect: false })`.
- **Redirect pós-login:** `lib/auth/middlewareRedirect.ts` — `getPostLoginRedirectFromToken` (defaultRoute, userType, roleKey). Cotista → `/cotista` (depois redirect para `/dashboard`).

### Permissões
- **Catálogo:** `lib/auth/permissionCatalog.ts` — lista de `PermissionEntry` (key, label, module, action, riskLevel). Padrão `<modulo>.<acao>` (view, create, edit, manage, etc.).
- **Verificação:** `lib/auth/permissions.ts` — `hasPermission(session, permissionKey)` e `hasPermissionKey(permissions[], key)`. OWNER/SUPER_ADMIN têm acesso total. Aliases em `GRANTED_BY`.
- **Onde é validado:** Middleware (rotas por path e permissão); Server Components (getServerSession + hasPermission + redirect); APIs (getServerSession + hasPermission).
- **Roles padrão:** `DEFAULT_ROLE_PERMISSIONS` (OWNER, SUPER_ADMIN, COMMERCIAL, STAFF, COTISTA, ADMIN). Seed atribui RolePermission e UserRoleAssignment.

### Suporte a vivantCare.*
- **Suporta:** Sim. Basta registrar no catálogo (ex.: `vivantCare.cotistas.view`, `vivantCare.cotistas.manage`, `vivantCare.financeiro.manage`) e atribuir a uma role (ex. ADMIN ou nova “Gestor Vivant Care”). Nenhuma mudança estrutural necessária.

---

## 6. Diagnóstico do dashboard do cotista

Tela: `app/(cotista)/dashboard/page.tsx`. Componentes: `StatsCard`, `NextReservations`, `PendingPayments`, `RecentNotices`.

| Bloco | Rota/tela | API/dados | Dados reais? | O que falta para o Caio administrar |
|-------|------------|-----------|--------------|-------------------------------------|
| **Próximas Reservas** | `/dashboard` | `/api/cotistas/me/reservas?upcoming=true&limit=3` | Sim (Reserva) | Nada; admin já pode ver/gerir propriedades e calendário. |
| **Pagamentos Pendentes** | `/dashboard` | `/api/cotistas/me/cobrancas?status=PENDENTE&limit=3` | Sim (Cobranca) | Fluxo admin de gerar/registrar cobranças e comprovantes já existe (admin-portal/financeiro, API gerar). |
| **Minhas Propriedades** | `/dashboard` | `/api/cotistas/me/stats` (conta cotas ativas) | Sim (CotaPropriedade) | Nada. |
| **Status (“Em dia”)** | `/dashboard` | Hardcoded “Em dia” / “Todas obrigações ok” | **Mock** | Regra de negócio (ex.: considerar cobranças vencidas, reservas) e fonte de dados. |
| **Avisos Recentes** | `/dashboard` | `/api/cotistas/me/avisos?limit=3` | Sim (Mensagem por propertyId das cotas do cotista) | Admin precisa de tela para criar/editar Mensagem por propriedade (hoje não há CRUD no admin). |

Resumo: dashboard cotista é em grande parte real (reservas, cobranças, cotas, avisos). Pontos fracos: “Status” fixo e falta de CRUD de avisos no painel do Caio.

---

## 7. O que já existe / o que falta

### A. Já existe e pode ser reutilizado
- Estrutura de rotas e layouts do admin (AppShell, menu por permissão).
- Models: User, Cotista, Property, CotaPropriedade, Reserva, Cobranca, Mensagem, Documento, Assembleia, PautaAssembleia, VotoAssembleia, TrocaSemana, Notificacao.
- Auth (NextAuth, JWT, admin + cotista) e RBAC (Role, Permission, UserRoleAssignment, hasPermission).
- APIs: users, roles, permissions, properties, destinations; admin: cotistas, propriedades, cotas, calendário, cobranças (gerar); cotista: me/stats, me/reservas, me/cobrancas, me/avisos, me/cotas, reservas, convite.
- Componentes: tabelas (users, properties, destinations), formulários (user, property, destination), upload (`/api/upload`), AppShell, sidebar accordion, cards e listas do portal cotista (reservas, pagamentos, avisos).
- Páginas admin-portal: dashboard, propriedades (CRUD + calendário), cotistas (lista + convite), financeiro, convites-pendentes, configurações.
- Páginas cotista: dashboard (dados reais exceto Status), calendário, financeiro, avisos; placeholders: assembleias, trocas; documentos com lista mockada.

### B. Existe parcialmente e precisa adaptação
- **Menu admin:** Não tem seção “Vivant Care”; é preciso adicionar itens (e opcionalmente seção) e permissões.
- **Admin-portal:** É um painel separado (outro layout, outro menu); para “Vivant Care dentro do painel do Caio” será preciso migrar funções para rotas sob `/admin/*` (ou equivalente) com mesmo AppShell e mesmo sistema de permissões.
- **Documentos (cotista):** Model e API existem; a página cotista usa array hardcoded; falta listar por propriedade/cota e, no admin, CRUD de Documento por propriedade.
- **Assembleias:** Models e relações existem; falta CRUD no admin e listagem/votação no portal cotista.
- **Trocas:** Model existe; falta API para cotista (listar/criar ofertas) e tela admin para moderar/concluir.
- **Status no dashboard cotista:** Precisa de regra (ex.: “em dia” se sem cobrança vencida) e fonte de dados.
- **API admin cotistas:** Usa `session.user.role === "ADMIN"`; ideal padronizar para userType + hasPermission (ex.: vivantCare.cotistas.view).

### C. Não existe e precisa ser criado
- Seção/menu “Vivant Care” no painel admin (ou equivalente) com itens protegidos por permissão.
- Rotas sob o painel admin unificado que repliquem (ou substituam) as funções hoje em `/admin-portal/*`: cotistas, propriedades “portal”, financeiro, convites, configurações.
- CRUD de **Mensagem** (avisos) por propriedade no admin.
- CRUD de **Documento** por propriedade no admin (e consumo real na tela documentos do cotista).
- Módulo **Assembleias** no admin (CRUD Assembleia/Pauta) e no cotista (listar, votar).
- Módulo **Troca de semanas** no cotista (listar/criar ofertas) e fluxo admin (aprovar/concluir).
- Permissões específicas vivantCare.* no catálogo e nas roles (e middleware/páginas usando-as).
- (Opcional) Unificação de “Casas” (admin) e “Propriedades” (admin-portal) se for desejado um único conceito no painel.

---

## 8. Melhor estratégia para encaixar o Vivant Care no painel do Caio

- **Não criar novo painel:** Usar apenas o painel atual (`/admin/*` + AppShell).
- **Não duplicar usuários:** Quem hoje acessa `/admin-portal` continua como admin; passa a acessar as novas rotas sob `/admin/...` (ex.: `/admin/vivant-care/cotistas`, `/admin/vivant-care/propriedades`).
- **Menu:** Em `lib/navigation/menu.ts`, adicionar seção (ex.: “VIVANT CARE”) e itens com `requiredPermissions` (ex.: `vivantCare.cotistas.view`, `vivantCare.financeiro.manage`). Quem não tiver permissão não vê a seção/itens.
- **Reaproveitar:**
  - APIs existentes de cotistas, propriedades, cotas, calendário, cobranças (ajustar checagem de permissão onde necessário).
  - Componentes de listagem/formulário do admin-portal (cotistas, propriedades, calendário, etc.) para usar dentro de páginas do admin.
- **Substituir gradualmente:** Migrar cada funcionalidade de `/admin-portal/*` para rotas sob `/admin/*` (ex.: `/admin/vivant-care/...`). Depois, redirecionar `/admin-portal` para `/admin/vivant-care` ou para a primeira rota permitida e, por fim, desativar ou remover o layout/páginas antigas do admin-portal.
- **Permissões:** Criar vivantCare.* no catálogo e atribuir à role adequada (ex. OWNER, ADMIN ou “Gestor Vivant Care”). Validar nas novas rotas e nas APIs usadas por elas.

---

## 9. Plano de implementação em fases

### Fase 1 — Base de dados, permissões, menu, cotistas, propriedades/cotas
- **Escopo:** Permissões vivantCare.* no catálogo e em roles; nova seção/itens no menu do admin; rotas sob admin (ex. `/admin/vivant-care/cotistas`, `/admin/vivant-care/propriedades`); listagem/edição de cotistas e propriedades reutilizando lógica e APIs atuais; garantir que cotas por propriedade estejam acessíveis.
- **Dependências:** Nenhuma crítica; schema já suporta.
- **Risco:** Baixo (adição de rotas e permissões).
- **Ordem sugerida:** 1) Permissões no catálogo e seed; 2) Menu e rotas vazias; 3) Páginas de listagem (cotistas, propriedades) e links para edição/detalhe; 4) Ajuste de APIs (trocar checagem legada por hasPermission).

### Fase 2 — Financeiro, reservas, avisos, documentos
- **Escopo:** Telas no admin para cobranças (listar/gerar por propriedade/cota), reservas (consultar por propriedade/calendário), avisos (CRUD de Mensagem por propriedade), documentos (CRUD de Documento por propriedade); consumo real de documentos na tela do cotista.
- **Dependências:** Fase 1 (rotas e permissões).
- **Risco:** Médio (novos CRUDs e integração com upload/existentes).
- **Ordem sugerida:** 1) Avisos (Mensagem); 2) Documentos (Documento + upload); 3) Financeiro (telas que usam API de cobranças já existente); 4) Reservas (calendário/lista por propriedade).

### Fase 3 — Assembleias, troca de semanas, refinamentos do portal cotista
- **Escopo:** CRUD de Assembleia e Pauta no admin; listagem e voto no portal cotista; fluxo de TrocaSemana (cotista: ofertas; admin: aprovar/concluir); ajuste do bloco “Status” no dashboard cotista com regra e dados reais.
- **Dependências:** Fases 1 e 2.
- **Risco:** Maior (novos fluxos e regras).
- **Ordem sugerida:** 1) Assembleias (admin + cotista); 2) Trocas (API + cotista + admin); 3) Status e pequenos refinamentos no dashboard e navegação.

---

## 10. Lista objetiva de arquivos, rotas, models e módulos a alterar/criar (futuro)

### Configuração e auth
- `lib/auth/permissionCatalog.ts` — adicionar permissões vivantCare.*
- `lib/navigation/menu.ts` — adicionar seção e itens Vivant Care
- `middleware.ts` — regras para novas rotas (ex. `/admin/vivant-care/*`) se necessário
- `prisma/seed.ts` — atribuir novas permissões a roles

### Layout e shell
- `app/(admin)/admin/layout.tsx` — sem mudança; menu vem de `menu.ts`
- `components/shell/AppShell.tsx` — suportar nova seção se usar SECTION_ORDER/SECTION_TITLES

### Novas rotas (exemplos)
- `app/(admin)/admin/vivant-care/` — layout opcional
- `app/(admin)/admin/vivant-care/cotistas/page.tsx` (e novo/editar se necessário)
- `app/(admin)/admin/vivant-care/propriedades/page.tsx` (e [id], calendário)
- `app/(admin)/admin/vivant-care/financeiro/page.tsx`
- `app/(admin)/admin/vivant-care/avisos/page.tsx` ou por propriedade
- `app/(admin)/admin/vivant-care/documentos/page.tsx` ou por propriedade
- `app/(admin)/admin/vivant-care/convites/page.tsx`
- `app/(admin)/admin/vivant-care/assembleias/page.tsx` (fase 3)
- `app/(admin)/admin/vivant-care/trocas/page.tsx` (fase 3)

### APIs
- `app/api/admin/cotistas/route.ts` — trocar checagem para hasPermission (vivantCare.cotistas.view ou similar)
- Novas ou estendidas: avisos (Mensagem), documentos (Documento), assembleias, trocas, conforme fases

### Componentes
- Reuso/adaptação de `components/admin-portal/*` (sidebar, listas, formulários, calendário) para páginas em `app/(admin)/admin/vivant-care/*`
- Novos componentes para CRUD de Mensagem, Documento, Assembleia, TrocaSemana conforme necessidade

### Portal cotista (refinamentos)
- `app/(cotista)/dashboard/page.tsx` — bloco Status com dados reais
- `app/(cotista)/dashboard/documentos/page.tsx` — buscar de `/api/cotistas/me/documentos` ou equivalente (a criar) em vez de mock
- `app/(cotista)/dashboard/assembleias/page.tsx` — listar e votar (fase 3)
- `app/(cotista)/dashboard/trocas/page.tsx` — listar/criar ofertas (fase 3)

### Models (Prisma)
- Nenhuma alteração obrigatória para Fase 1 e 2; Assembleia/TrocaSemana/Documento/Mensagem já existem. Ajustes apenas se surgirem novos campos ou enums.

### Admin-portal (depois da migração)
- Redirecionar `app/(admin-portal)/admin-portal/page.tsx` (e layout) para `/admin/vivant-care` ou remover/desativar rotas antigas quando tudo estiver no painel unificado.

---

**Fim do mapeamento.** Nenhuma implementação foi feita; este documento serve como base para implementação segura do Vivant Care dentro do painel admin existente.
