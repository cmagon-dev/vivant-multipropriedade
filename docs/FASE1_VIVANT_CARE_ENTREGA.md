# Fase 1 — Vivant Care: Resumo da Implementação

## 1. Permissões adicionadas ao catálogo

**Arquivo:** `lib/auth/permissionCatalog.ts`

- `vivantCare.view` — Ver Vivant Care (acesso ao módulo no admin)
- `vivantCare.cotistas.view` — Ver cotistas
- `vivantCare.cotistas.manage` — Gerenciar cotistas (CRUD e convites)
- `vivantCare.propriedades.view` — Ver propriedades (Vivant Care)
- `vivantCare.propriedades.manage` — Gerenciar propriedades (Vivant Care)
- `vivantCare.financeiro.view` — Ver financeiro
- `vivantCare.financeiro.manage` — Gerenciar financeiro
- `vivantCare.avisos.view` — Ver avisos
- `vivantCare.avisos.manage` — Gerenciar avisos
- `vivantCare.documentos.view` — Ver documentos
- `vivantCare.documentos.manage` — Gerenciar documentos

OWNER e SUPER_ADMIN continuam com acesso total (`*`). Nenhuma alteração em `hasPermission`, `getKeysThatGrant` nem em providers/callbacks de auth.

---

## 2. Seção Vivant Care no menu principal do admin

**Arquivo:** `lib/navigation/menu.ts`

- Nova seção: `vivantcare` com título **"VIVANT CARE"** em `SECTION_TITLES` e `SECTIONS_ORDER`.
- Itens do menu (todos com `section: "vivantcare"`):
  - **Dashboard** — `/admin/vivant-care` — `requiredPermissions: ["vivantCare.view"]`
  - **Cotistas** — `/admin/vivant-care/cotistas` — `vivantCare.cotistas.view` ou `vivantCare.cotistas.manage`
  - **Propriedades** — `/admin/vivant-care/propriedades` — `vivantCare.propriedades.view` ou `vivantCare.propriedades.manage`
  - **Financeiro** — `/admin/vivant-care/financeiro` — `vivantCare.financeiro.view` ou `vivantCare.financeiro.manage`
  - **Avisos** — `/admin/vivant-care/avisos` — `vivantCare.avisos.view` ou `vivantCare.avisos.manage`
  - **Documentos** — `/admin/vivant-care/documentos` — `vivantCare.documentos.view` ou `vivantCare.documentos.manage`

**Arquivo:** `components/shell/AppShell.tsx`  
- Inclusão dos ícones `DollarSign`, `Bell`, `FileText` no `ICON_MAP` para os novos itens.

---

## 3. Rotas criadas em /admin/vivant-care/*

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/admin/vivant-care` | `app/(admin)/admin/vivant-care/page.tsx` | Dashboard com cards (cotistas, propriedades, cobranças, convites, avisos, documentos) |
| `/admin/vivant-care/cotistas` | `app/(admin)/admin/vivant-care/cotistas/page.tsx` | Lista de cotistas com busca (nome, e-mail, CPF, telefone, propriedade) |
| `/admin/vivant-care/propriedades` | `app/(admin)/admin/vivant-care/propriedades/page.tsx` | Lista de propriedades com cotas e cotistas vinculados |
| `/admin/vivant-care/financeiro` | `app/(admin)/admin/vivant-care/financeiro/page.tsx` | Lista de cobranças (totais pendentes/vencidas + últimas 150) |
| `/admin/vivant-care/avisos` | `app/(admin)/admin/vivant-care/avisos/page.tsx` | Lista de mensagens/avisos por propriedade |
| `/admin/vivant-care/documentos` | `app/(admin)/admin/vivant-care/documentos/page.tsx` | Lista de documentos por propriedade |

Todas usam o layout existente do admin (`app/(admin)/admin/layout.tsx` → AppShell). Nenhum layout novo foi criado.

---

## 4. Middleware

**Arquivo:** `middleware.ts`

- Proteção para `pathname.startsWith("/admin/vivant-care")`:
  - Base/dashboard: exige `vivantCare.view` (ou OWNER).
  - Sub-rotas: exige a permissão correspondente (ex.: cotistas → `vivantCare.cotistas.view` ou `.manage`).
  - Sem acesso → redirect para `/403`.

Nenhuma alteração em regras de `/dashboard/*`, `/admin-portal`, login ou redirect pós-login.

---

## 5. Seed (banco)

**Arquivo:** `prisma/seed.ts`

- Inclusão das 11 permissões Vivant Care no array `permissions` (group: `vivantCare`).
- O loop que atribui **todas** as permissões a OWNER e SUPER_ADMIN passa a incluir essas chaves; nenhum código extra para roles.

Não foi alterado schema do Prisma.

---

## 6. API ajustada

**Arquivo:** `app/api/admin/cotistas/route.ts`

- Antes: acesso com `session.user.role === "ADMIN"`.
- Agora: `userType === "admin"` e (`vivantCare.cotistas.view` ou `vivantCare.cotistas.manage` ou `role === "ADMIN"`).
- Continua compatível com o uso do admin-portal (quem já tem role ADMIN segue acessando).

---

## 7. Componentes reaproveitados do /admin-portal

- **Lógica de dados:** Dashboard Vivant Care espelha as contagens do dashboard do admin-portal (cotistas, cobranças, etc.), usando Prisma nas server components.
- **Cotistas:** Listagem inspirada na do admin-portal (cards com nome, e-mail, cotas, propriedade), adaptada para o shell do admin (vivant-navy, links para `/admin-portal/...` onde ainda não existe tela em vivant-care).
- **Propriedades / Financeiro / Avisos / Documentos:** Listagens novas, usando os mesmos models (Property, Cobranca, Mensagem, Documento), sem duplicar componentes do admin-portal; links “Ver detalhes” e “Gerar cobranças” apontam para `/admin-portal/...` para não quebrar fluxos existentes.

Nenhum componente do admin-portal foi movido nem duplicado em pasta nova; apenas reuso de padrões e de APIs/models.

---

## 8. Alterações sensíveis em auth / middleware / redirects

- **Auth:** Nenhuma alteração em `lib/auth.ts`, providers, callbacks JWT/session, `userType`, `roleKey` ou `permissions`.
- **Middleware:** Apenas inclusão do bloco de proteção para `/admin/vivant-care/*` descrito acima; regras para `/admin`, `/dashboard`, `/admin-portal`, `/login` e cotista inalteradas.
- **Redirects:** Nenhum redirect novo para `/admin/vivant-care`; acesso apenas pelo menu ou URL direta.

---

## 9. Checklist de validação

- Admin segue autenticando com o fluxo atual.
- Cotista segue autenticando e acessando `/dashboard/*`.
- `/admin/*` continua protegido para usuários internos (middleware + layout).
- `/dashboard/*` continua acessível para cotistas (middleware inalterado).
- Menu do admin mostra a seção “VIVANT CARE” apenas para quem tem pelo menos uma permissão `vivantCare.*`.
- OWNER e SUPER_ADMIN mantêm acesso completo (incluindo Vivant Care) via `*`.
- Usuário interno com permissões limitadas (ex.: só vivantCare) não recebe itens que não tenha permissão.
- Novas rotas usam o layout do admin (AppShell); nenhuma usa layout do admin-portal.
- Nenhuma rota nova depende do admin-portal para renderizar (apenas links opcionais para fluxos ainda lá).
- Nenhum redirect envia admin ou cotista para o painel errado.

---

## 10. O que ainda depende do /admin-portal (não removido)

- **Novo convite de cotista:** link “Novo convite” em Vivant Care Cotistas → `/admin-portal/cotistas/novo`.
- **Nova propriedade:** link em Vivant Care Propriedades → `/admin-portal/propriedades/nova`.
- **Detalhe/edição de propriedade e calendário:** “Ver detalhes” e “Calendário” → `/admin-portal/propriedades/[id]` e `.../calendario`.
- **Gerar cobranças em lote:** link em Vivant Care Financeiro → `/admin-portal/financeiro`.

Isso foi mantido de propósito: primeiro consolidar as telas de listagem/visão em `/admin/vivant-care`; em uma fase seguinte pode-se migrar esses fluxos para dentro do admin e, se desejado, desativar ou redirecionar o admin-portal.

---

## 11. Para a Fase 2

- CRUD de **avisos** (Mensagem) no admin (criar/editar por propriedade).
- CRUD de **documentos** (Documento) no admin (upload, edição, exclusão).
- Ajustes no **financeiro** (filtros por cotista/status, registro de pagamento).
- Uso real de **documentos** na tela do cotista (remover mock).
- (Opcional) Migrar “Novo convite”, “Nova propriedade”, “Gerar cobranças” e detalhes de propriedade para rotas sob `/admin/vivant-care` e reduzir dependência do admin-portal.

---

**Build:** `npm run build` executado com sucesso; rotas Vivant Care aparecem na build.  
**Seed:** Rodar `npm run db:seed` para criar as novas permissões no banco e atribuí-las a OWNER/SUPER_ADMIN.
