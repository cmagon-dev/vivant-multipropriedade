# CORE Definitivo — Entrega

## 1) Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `lib/auth/getUserContext.ts` | Retorna `{ userId, role, permissions, homeRoute, displayName, userType, email, defaultRoute }` (server-side) |
| `lib/telemetry/trackEvent.ts` | `trackEvent({ type, message, actorUserId, severity, status, entityType, entityId, meta })` |
| `lib/telemetry/createTask.ts` | `createTask({ title, description, dueAt, status, priority, assignedToUserId, relatedEntityType, relatedEntityId, meta })` |
| `lib/navigation/menu.ts` | `menuConfig` (admin, dashboard, comercial, cotista) + `filterMenuByPermission()` |
| `app/api/telemetry/event/route.ts` | POST registra evento (usado após login no client) |
| `app/api/admin/events/route.ts` | GET lista eventos (protegido `events.view`) |
| `app/api/admin/tasks/route.ts` | GET lista tarefas, PATCH atualiza status (protegido `tasks.view`) |
| `app/(admin)/admin/overview/page.tsx` | Visão do Dono: cards eventos hoje, críticos, tarefas abertas, atrasadas |
| `app/(admin)/admin/events/page.tsx` | Lista filtrável de eventos |
| `app/(admin)/admin/tasks/page.tsx` | Lista de tarefas com filtro e botão Concluir |
| `app/(dashboard)/dashboard/comercial/layout.tsx` | Layout comercial com nav e “Logado como: COMMERCIAL” |
| `app/(dashboard)/dashboard/comercial/page.tsx` | Painel comercial (cards + HelpTip + MicroOnboarding) |
| `app/(dashboard)/dashboard/comercial/leads/page.tsx` | Stub Leads + HelpTip |
| `app/(dashboard)/dashboard/comercial/propriedades/page.tsx` | Stub Propriedades + HelpTip |
| `app/(cotista)/cotista/page.tsx` | Redireciona /cotista → /dashboard |
| `components/admin/events-list.tsx` | Tabela de eventos com filtros |
| `components/admin/tasks-list.tsx` | Lista de tarefas com Concluir |
| `components/help/MicroOnboarding.tsx` | Micro tutorial (3–5 passos) + botão “Rever” |

## 2) Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `prisma/schema.prisma` | Modelos `SystemEvent`, `SystemTask` e enums |
| `prisma/seed.ts` | Roles OWNER, COMMERCIAL; permissões admin.view, comercial.view, events.view, tasks.view; admin atribuído a OWNER |
| `lib/auth/postLoginRedirect.ts` | OWNER/SUPER_ADMIN→/admin, COMMERCIAL→/dashboard/comercial, COTISTA→/cotista, STAFF→/dashboard |
| `lib/auth/middlewareRedirect.ts` | Incluído COMMERCIAL→/dashboard/comercial, cotista→/cotista |
| `lib/auth/permissions.ts` | FULL_ACCESS_ROLES = ["OWNER", "SUPER_ADMIN"] |
| `middleware.ts` | /admin exige admin.view; /dashboard/comercial exige comercial.view; /cotista só cotista; /admin → /admin/overview; eventos/tarefas por permissão |
| `app/page.tsx` | Usa getServerSession + getPostLoginRedirectRoute(session) para redirect pós-login |
| `app/(admin)/admin/page.tsx` | redirect para /admin/overview |
| `app/(auth)/login/page.tsx` | Chamada a `/api/telemetry/event` com type auth.login após login OK |
| `app/api/users/route.ts` | trackEvent("user.created") após criar usuário |
| `app/api/properties/route.ts` | trackEvent("property.created") após criar propriedade |
| `components/admin/sidebar.tsx` | OWNER no canAccess; itens “Visão do Dono”, “Eventos”, “Tarefas” |

## 3) Rotas novas

| Rota | Quem acessa |
|------|-------------|
| `/admin/overview` | Quem tem admin.view (Dono) |
| `/admin/events` | Quem tem events.view |
| `/admin/tasks` | Quem tem tasks.view |
| `/dashboard/comercial` | Quem tem comercial.view (COMMERCIAL / OWNER) |
| `/dashboard/comercial/leads` | Idem |
| `/dashboard/comercial/propriedades` | Idem |
| `/cotista` | Cotistas (redireciona para /dashboard) |

## 4) Como rodar migrate/seed

```bash
# Aplicar schema (escolha um)
npm run db:push
# ou, em terminal interativo:
npm run db:migrate

# Seed (roles, permissions, admin como OWNER, dados iniciais)
npm run db:seed
```

## 5) Roles e permissões iniciais / redirect pós-login

| Role | Redirect | Permissões (resumo) |
|------|----------|----------------------|
| **OWNER** | /admin | Todas (admin.view, events.view, tasks.view, users.manage, roles.manage, help.manage, dashboard.view, comercial.view, cotista.view, properties.*, leads.*) |
| **SUPER_ADMIN** | /admin | Todas |
| **COMMERCIAL** | /dashboard/comercial | comercial.view, dashboard.view, leads.read/write, properties.read |
| **ADMIN** | /admin/dashboard | dashboard.view, properties.read/write, leads.*, cotista.view |
| **STAFF** | /dashboard | dashboard.view, properties.read, leads.read |
| **COTISTA** (userType) | /cotista | Portal cotista |

**Login padrão após seed**

- OWNER (Dono): `caio@vivant.com.br` / `admin123` → role **OWNER** → redirect **/admin** (depois /admin/overview).

## 6) Onde foram adicionados trackEvent / createTask e HelpTip / MicroOnboarding

- **trackEvent**
  - Login: em `app/(auth)/login/page.tsx` (fetch `/api/telemetry/event` com type `auth.login` após sucesso).
  - Criar usuário: em `app/api/users/route.ts` (POST), tipo `user.created`.
  - Criar propriedade: em `app/api/properties/route.ts` (POST), tipo `property.created`.
- **createTask**
  - Nenhum ponto obrigatório; use `createTask()` onde houver SLA/pendência (ex.: “Aprovar usuário”, “Revisar propriedade”). O Dono vê em /admin/tasks.
- **HelpTip**
  - `/admin/overview`: título “Visão do Dono” (helpKey `admin.overview`).
  - `/dashboard/comercial`: título “Painel Comercial” (helpKey `comercial.overview`).
  - `/dashboard/comercial/leads`: título “Leads” (helpKey `comercial.leads`).
  - `/dashboard/comercial/propriedades`: título “Propriedades” (helpKey `comercial.propriedades`).
- **MicroOnboarding**
  - `/admin/overview`: 3 passos (Visão do Dono, Eventos, Tarefas), key `admin.overview`.
  - `/dashboard/comercial`: 3 passos (Comercial, Leads, Propriedades), key `dashboard.comercial`.

---

- Um único login em `/login` (admin e cotista na mesma página).
- Raiz `/`: não logado → `/login`; logado → redirect por `getPostLoginRedirectRoute(session)`.
- Segurança: middleware por rota; APIs com `hasPermission`/`withPermission` onde aplicável.
- Nenhuma funcionalidade existente removida; apenas integração, proteção e organização.
