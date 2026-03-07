# Fase 2 — Vivant Care — Resumo da Entrega

## Objetivo

Completar os fluxos principais do Vivant Care dentro do `/admin`, reduzindo a dependência do `/admin-portal`, mantendo **apenas 2 painéis**: admin (`/admin/*`) e portal do cotista (`/dashboard/*`).

---

## 1. Rotas e telas criadas/alteradas

### Bloco 1 — Convites
- **Rotas:** `/admin/vivant-care/convites`, `/admin/vivant-care/convites/novo`
- Listagem de convites pendentes (e-mail, status, propriedade/cota, data, copiar link, abrir link).
- Página "Novo convite" com formulário (nome, e-mail, CPF, telefone) e redirect para `/admin/vivant-care/convites`.

### Bloco 2 — Propriedades
- **Rotas:**  
  - `/admin/vivant-care/propriedades/nova`  
  - `/admin/vivant-care/propriedades/[id]` (detalhe + cotas)  
  - `/admin/vivant-care/propriedades/[id]/editar`  
  - `/admin/vivant-care/propriedades/[id]/calendario`
- Reutilização: `PropertyForm`, `CalendarioPropriedade`, `ConfigurarSemanasDialog`, APIs `/api/admin/propriedades`, `/api/admin/propriedades/[id]/cotas`, `/api/admin/cotas/[id]`.

### Bloco 3 — Financeiro
- **Alterações em** `/admin/vivant-care/financeiro`:
  - Card "Gerar cobranças em lote" na própria página (sem link para admin-portal).
  - Filtros por status: Todas, Pendente, Vencida, Paga, Cancelada (links com query `?status=`).

### Bloco 4 — CRUD Avisos (Mensagem)
- **Rotas:** `/admin/vivant-care/avisos/novo`, `/admin/vivant-care/avisos/[id]`, `/admin/vivant-care/avisos/[id]/editar`
- Listagem passa a exibir todos os avisos (ativos e inativos), com links para detalhe e edição.
- Componente `AvisoForm` (propriedade, título, conteúdo, tipo, prioridade, fixada, ativo).

### Bloco 5 — CRUD Documentos (Documento)
- **Rotas:** `/admin/vivant-care/documentos/novo`, `/admin/vivant-care/documentos/[id]`, `/admin/vivant-care/documentos/[id]/editar`
- API de criação com upload (multipart) para Vercel Blob; tipos permitidos: PDF, imagens, Word, texto.
- Componente `DocumentoForm` (propriedade, título, descrição, tipo, categoria, arquivo no create, ativo no edit).

### Bloco 6 — Documentos no portal do cotista
- **Rota:** `/dashboard/documentos` (já existia; conteúdo alterado).
- Nova API: `GET /api/cotistas/me/documentos` — retorna documentos ativos das propriedades das cotas do cotista.
- Página deixa de usar array mock e passa a consumir essa API; estado vazio quando não houver documentos.

---

## 2. APIs criadas ou alteradas

| API | Alteração |
|-----|-----------|
| `GET/POST /api/cotistas/invite` | Autorização por `vivantCare.convites.view` / `vivantCare.convites.manage` (e fallback ADMIN). |
| `POST /api/admin/cobrancas/gerar` | Autorização por `vivantCare.financeiro.manage` (e fallback ADMIN). |
| `GET/POST /api/admin/avisos` | **Novo.** Listagem e criação de avisos (Mensagem). |
| `GET/PUT/DELETE /api/admin/avisos/[id]` | **Novo.** Detalhe, atualização e exclusão. |
| `GET/POST /api/admin/documentos` | **Novo.** Listagem e criação com upload (multipart). |
| `GET/PUT/DELETE /api/admin/documentos/[id]` | **Novo.** Detalhe, atualização de metadados e exclusão. |
| `GET /api/cotistas/me/documentos` | **Novo.** Documentos do cotista (por propriedades das cotas). |

---

## 3. Permissões adicionadas

- `vivantCare.convites.view` — Ver convites.
- `vivantCare.convites.manage` — Criar/gerenciar convites.

Registradas em:
- `lib/auth/permissionCatalog.ts`
- `prisma/seed.ts` (array de permissões; OWNER/SUPER_ADMIN recebem todas via loop existente).
- Menu: item "Convites" em Vivant Care (`lib/navigation/menu.ts`).
- Middleware: proteção de `/admin/vivant-care/convites` (`middleware.ts`).
- Ícone `Mail` em `components/shell/AppShell.tsx`.

---

## 4. Componentes reaproveitados

- **Admin:** `PropertyForm`, `ImageUpload`, `FeaturesInput`, etc. (já existentes).
- **Admin-portal (apenas componentes, não rotas):** `CalendarioPropriedade`, `ConfigurarSemanasDialog` — usados nas páginas de propriedade e calendário em `/admin/vivant-care`.
- **Novos:** `GerarCobrancasCard`, `AvisoForm`, `DocumentoForm`.

---

## 5. Links que deixaram de apontar para admin-portal

- **Convites:** "Novo convite" em `/admin/vivant-care/cotistas` → `/admin/vivant-care/convites/novo`. Dashboard Vivant Care "Convites Pendentes" → `/admin/vivant-care/convites`.
- **Propriedades:** "Nova propriedade" → `/admin/vivant-care/propriedades/nova`. "Ver detalhes" e "Calendário" → `/admin/vivant-care/propriedades/[id]` e `/[id]/calendario`.
- **Financeiro:** Removido link "Gerar cobranças em lote" para `/admin-portal/financeiro`; ação de gerar cobranças ficou na própria página `/admin/vivant-care/financeiro`.

---

## 6. Auth, middleware e segregação

- **Nenhuma alteração** em providers, JWT, callbacks de session, `userType`, `roleKey` ou redirects pós-login.
- **Middleware:** apenas inclusão da verificação para `/admin/vivant-care/convites` (permissões `vivantCare.convites.view` / `.manage`).
- Segregação mantida: `/admin/*` para internos (RBAC), `/dashboard/*` para cotistas.

---

## 7. O que ainda depende do legado (admin-portal)

- **Componentes:** `CalendarioPropriedade` e `ConfigurarSemanasDialog` continuam em `components/admin-portal/`; são apenas importados pelas páginas do `/admin/vivant-care`. Não há dependência de layout ou rotas do admin-portal para os fluxos descritos acima.
- **Rotas:** Os fluxos de convites, propriedades (nova/detalhe/edição/calendário), gerar cobranças, CRUD de avisos e CRUD de documentos passam a ser feitos **somente** em `/admin/vivant-care`. O `/admin-portal` continua existindo para outros usos, mas não é mais necessário para esses fluxos.

---

## 8. Checklist de validação

- [x] Admin e cotista continuam autenticando normalmente.
- [x] `/admin/*` e `/dashboard/*` permanecem separados.
- [x] Menu do admin filtrado por permissão; Convites incluído.
- [x] Convites funcionam em `/admin/vivant-care/convites` (listagem + novo).
- [x] Nova propriedade, detalhe, edição e calendário em `/admin/vivant-care/propriedades/*`.
- [x] Gerar cobranças na própria página `/admin/vivant-care/financeiro`; filtros por status.
- [x] CRUD de avisos em `/admin/vivant-care/avisos` (novo, [id], editar).
- [x] CRUD de documentos em `/admin/vivant-care/documentos` (novo, [id], editar).
- [x] `/dashboard/documentos` usa dados reais via `/api/cotistas/me/documentos`.
- [x] Nenhuma tela desses fluxos depende do layout do admin-portal.
- [x] RBAC e usuários administrativos personalizados preservados; novas permissões no catálogo e no seed.

---

## 9. Arquivos principais alterados/criados

**Novos:**  
`app/(admin)/admin/vivant-care/convites/page.tsx`, `convites/novo/page.tsx`  
`app/(admin)/admin/vivant-care/propriedades/nova/page.tsx`, `propriedades/[id]/page.tsx`, `[id]/editar/page.tsx`, `[id]/calendario/page.tsx`  
`app/(admin)/admin/vivant-care/avisos/novo/page.tsx`, `avisos/[id]/page.tsx`, `avisos/[id]/editar/page.tsx`  
`app/(admin)/admin/vivant-care/documentos/novo/page.tsx`, `documentos/[id]/page.tsx`, `documentos/[id]/editar/page.tsx`  
`app/api/admin/avisos/route.ts`, `app/api/admin/avisos/[id]/route.ts`  
`app/api/admin/documentos/route.ts`, `app/api/admin/documentos/[id]/route.ts`  
`app/api/cotistas/me/documentos/route.ts`  
`components/admin/gerar-cobrancas-card.tsx`, `components/admin/aviso-form.tsx`, `components/admin/documento-form.tsx`

**Alterados:**  
`lib/auth/permissionCatalog.ts`, `lib/navigation/menu.ts`, `prisma/seed.ts`, `middleware.ts`, `components/shell/AppShell.tsx`  
`app/api/cotistas/invite/route.ts`, `app/api/admin/cobrancas/gerar/route.ts`  
`app/(admin)/admin/vivant-care/page.tsx`, `cotistas/page.tsx`, `propriedades/page.tsx`, `financeiro/page.tsx`, `avisos/page.tsx`, `documentos/page.tsx`  
`app/(cotista)/dashboard/documentos/page.tsx`

---

Fim do resumo da Fase 2.
