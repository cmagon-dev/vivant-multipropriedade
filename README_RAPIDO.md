# Vivant CORE — Guia Rápido

## Como rodar

```bash
# Instalar dependências
npm install

# Variáveis de ambiente: criar .env com POSTGRES_PRISMA_URL e NEXTAUTH_SECRET

# Aplicar schema e rodar seed (escolha um):
# Opção 1 - migration (recomendado, em terminal interativo):
npm run db:migrate
# Opção 2 - push direto (sem arquivo de migration):
npm run db:push
npm run db:seed

# Desenvolvimento
npm run dev
```

## Login único

- **Rota:** `/login` (única página de login).
- Admin e cotista entram na mesma tela; escolhem o tipo de acesso (Admin ou Cotista) e usam suas credenciais.
- Após o login, o redirecionamento é automático:
  - **SUPER_ADMIN** → `/admin`
  - **ADMIN/STAFF** → `/admin/dashboard` (ou `defaultRoute` do usuário)
  - **Cotista** → `/dashboard` (portal do cotista)
- A rota raiz `/` redireciona para `/login` se não autenticado; se autenticado, usa o helper de redirect (role/defaultRoute).

## Roles e permissões (RBAC)

- **Roles de sistema:** SUPER_ADMIN, ADMIN, STAFF, COTISTA.
- **Permissões exemplos:** `users.manage`, `roles.manage`, `permissions.manage`, `help.manage`, `dashboard.view`, `properties.read`, `properties.write`, `leads.read`, `leads.write`, `cotista.view`.
- SUPER_ADMIN tem todas as permissões; ADMIN/STAFF têm subconjuntos (definidos no seed e editáveis em Admin → Roles).
- Proteção: middleware bloqueia rotas por permissão; APIs usam `withPermission("chave")` onde necessário.

## Admin Master

- **/admin/roles** — Listar e editar roles; marcar permissões por role (exige `roles.manage`).
- **/admin/permissions** — Listar permissões do sistema (exige `permissions.manage`).
- **/admin/usuarios** — Listar/editar usuários; atribuir roles e definir `defaultRoute` (exige `users.manage`).
- **/admin/help** — CRUD de conteúdos de ajuda contextual (exige `help.manage`).

## Tutorial por módulo

- Cada módulo principal pode definir passos em `TutorialTour` e exibir o botão "Rever tutorial" via `ModuleHelpBar` ou `TutorialButton`.
- Exemplo no dashboard: `<ModuleHelpBar tutorialKey="admin.dashboard" steps={DASHBOARD_STEPS} />`.
- Progresso é salvo em `UserTutorialProgress` (admin) ou localStorage (cotista).
- API: `GET/POST /api/tutorial/progress?key=xxx`.

## Ajuda contextual (HelpTip)

- Em qualquer campo ou ação: `<HelpTip helpKey="properties.name" fallbackTitle="Nome" fallbackText="..." />`.
- Conteúdo é buscado por `key` em `HelpContent`; se não existir, usa `fallbackTitle`/`fallbackText`.
- Admin Master edita em **/admin/help** (key, título, descrição, shortText, videoUrl).

## Logins e roles padrão (após seed)

| Tipo    | Email                 | Senha     | Observação                    |
|---------|------------------------|-----------|--------------------------------|
| OWNER (Dono) | caio@vivant.com.br | admin123 | OWNER, todas permissões |
| Cotista | joao@email.com         | cotista123| Portal cotista                |
| Cotista | maria@email.com        | cotista123| Portal cotista                |

## Estrutura de pastas (CORE)

- `lib/auth/` — postLoginRedirect, permissions, middlewareRedirect
- `lib/api/` — withPermission (wrapper para API routes)
- `components/help/` — TutorialTour, TutorialButton, ModuleHelpBar, HelpTip
- `app/(auth)/login/` — Página única de login
- `app/api/auth/post-login-redirect` — Retorna URL de redirect pós-login
- `app/api/tutorial/progress` — Progresso do tutorial
- `app/api/help/content` — Conteúdo de ajuda por key
- `app/api/admin/roles`, `app/api/admin/permissions`, `app/api/admin/help` — CRUD protegido por permissão

## Criar tutorial/help para um módulo novo

1. **Tutorial:** Na página do módulo, importe `ModuleHelpBar` e defina os passos (array de `{ id, title, content }`). Exemplo: `<ModuleHelpBar tutorialKey="meu-modulo" steps={STEPS} />`.
2. **HelpTip:** Onde quiser o ícone "?", use `<HelpTip helpKey="meu-modulo.campo" fallbackTitle="..." fallbackText="..." />`. Depois cadastre ou edite o conteúdo em **/admin/help** com a mesma `key`.
