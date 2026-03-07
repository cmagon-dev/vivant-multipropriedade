# Fase 3 Final — Vivant Care: Resumo da Implementação

## Visão geral

Conclusão funcional do Vivant Care no painel administrativo principal (`/admin/*`) e no portal do cotista (`/dashboard/*`), mantendo **apenas 2 painéis**, RBAC e usuários administrativos personalizados.

---

## 1. Permissões adicionadas

**Arquivo:** `lib/auth/permissionCatalog.ts`

- `vivantCare.assembleias.view` — Ver assembleias
- `vivantCare.assembleias.manage` — Gerenciar assembleias (CRUD, pautas)
- `vivantCare.trocas.view` — Ver trocas de semanas
- `vivantCare.trocas.manage` — Gerenciar trocas (aprovar, reprovar, atualizar status)

**Seed:** `prisma/seed.ts` — Inclusão das 4 permissões no catálogo e atribuição a OWNER/SUPER_ADMIN.

**Menu:** `lib/navigation/menu.ts` — Itens "Assembleias" e "Trocas" na seção Vivant Care, com ícones `Vote` e `ArrowRightLeft`.

**Middleware:** `middleware.ts` — Proteção para `/admin/vivant-care/assembleias` e `/admin/vivant-care/trocas` conforme permissões acima.

**AppShell:** `components/shell/AppShell.tsx` — Ícones `Vote` e `ArrowRightLeft` no `ICON_MAP`.

---

## 2. Rotas criadas/alteradas

### Admin — Assembleias

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/admin/vivant-care/assembleias` | `app/(admin)/admin/vivant-care/assembleias/page.tsx` | Listagem (título, data, propriedade, status, pautas) |
| `/admin/vivant-care/assembleias/nova` | `app/(admin)/admin/vivant-care/assembleias/nova/page.tsx` | Criar assembleia |
| `/admin/vivant-care/assembleias/[id]` | `app/(admin)/admin/vivant-care/assembleias/[id]/page.tsx` | Detalhe (dados, pautas, votos/resumo) |
| `/admin/vivant-care/assembleias/[id]/editar` | `app/(admin)/admin/vivant-care/assembleias/[id]/editar/page.tsx` | Editar assembleia |

### Admin — Trocas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/admin/vivant-care/trocas` | `app/(admin)/admin/vivant-care/trocas/page.tsx` | Listagem (cotista, propriedade, período, status, ações) |
| `/admin/vivant-care/trocas/[id]` | `app/(admin)/admin/vivant-care/trocas/[id]/page.tsx` | Detalhe, aprovar/reprovar, observações |

### Portal do cotista

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/dashboard/assembleias` | `app/(cotista)/dashboard/assembleias/page.tsx` | Lista real de assembleias (por propriedades do cotista) |
| `/dashboard/assembleias/[id]` | `app/(cotista)/dashboard/assembleias/[id]/page.tsx` | Detalhe (descrição, pautas, ata) |
| `/dashboard/trocas` | `app/(cotista)/dashboard/trocas/page.tsx` | Lista real + nova solicitação |
| `/dashboard/trocas/[id]` | `app/(cotista)/dashboard/trocas/[id]/page.tsx` | Detalhe + cancelar (se status ABERTA) |
| `/dashboard` | `app/(cotista)/dashboard/page.tsx` | Status real (Em dia / Pendente) conforme cobranças |

---

## 3. APIs novas ou ajustadas

### Admin

- `GET/POST /api/admin/assembleias` — Listar (filtros) e criar
- `GET/PUT/DELETE /api/admin/assembleias/[id]` — Detalhe, editar, excluir
- `POST /api/admin/assembleias/[id]/pautas` — Criar pauta
- `GET /api/admin/trocas` — Listar trocas (solicitante, reservas)
- `GET/PUT /api/admin/trocas/[id]` — Detalhe; atualizar status/observações (aprovar = ACEITA, reprovar = CANCELADA)

### Cotista

- `GET /api/cotistas/me/assembleias` — Assembleias das propriedades das cotas do cotista
- `GET /api/cotistas/me/assembleias/[id]` — Uma assembleia (mesmo escopo)
- `GET /api/cotistas/me/trocas` — Trocas do cotista logado
- `POST /api/cotistas/me/trocas` — Criar solicitação (status ABERTA)
- `GET /api/cotistas/me/trocas/[id]` — Uma troca (apenas própria)
- `PUT /api/cotistas/me/trocas/[id]` — Cancelar (body: `{ cancelar: true }` só se status ABERTA)

### Stats (dashboard cotista)

- `GET /api/cotistas/me/stats` — Passou a retornar `statusFinanceiro: "EM_DIA" | "PENDENTE"` (PENDENTE quando existe cobrança pendente/vencida).

---

## 4. Componentes reaproveitados

- **Admin:** AppShell, Card, Button, Table, Dialog, Select, etc. (`components/ui`); `components/admin/assembleia-form.tsx` para criar/editar assembleia.
- **Cotista:** Layout e componentes existentes do portal; cards e listas no mesmo padrão visual (Vivant Care).

Nenhum layout administrativo paralelo criado; tudo sob o mesmo `/admin` e `/dashboard`.

---

## 5. Modelos Prisma utilizados (sem alteração de schema)

- **Assembleia** — propertyId, titulo, descricao, tipo, dataRealizacao, dataInicio, dataFim, status, quorumMinimo, pautas, ataUrl, etc.
- **PautaAssembleia** — assembleiaId, titulo, descricao, tipo, ordem, votos.
- **TrocaSemana** — cotistaSolicitante, status (ABERTA, EM_NEGOCIACAO, ACEITA, CONCLUIDA, CANCELADA, EXPIRADA), reservas, observacoes, etc.
- **Reserva** — trocaId (opcional), cota, cotistaId, ano, numeroSemana, etc.

---

## 6. Mudanças sensíveis em auth/middleware

- **Nenhuma alteração** em providers, JWT/session callbacks, userType, roleKey ou redirects pós-login.
- **Middleware:** apenas inclusão das rotas `/admin/vivant-care/assembleias` e `/admin/vivant-care/trocas` na proteção por permissão (vivantCare.assembleias.* e vivantCare.trocas.*). Segregação `/admin/*` vs `/dashboard/*` mantida.

---

## 7. Status real no dashboard do cotista

- **Regra:** `pagamentosPendentes > 0` (cobranças PENDENTE ou VENCIDA) ⇒ status **Pendente**; caso contrário ⇒ **Em dia**.
- **Implementação:** API `/api/cotistas/me/stats` retorna `statusFinanceiro`; a página `/dashboard` usa esse valor no card "Status" (texto e cor: laranja para Pendente, verde para Em dia).

---

## 8. Legado `/admin-portal` — o que ainda depende

### Rotas funcionais no `/admin-portal`

- Dashboard (`/admin-portal`)
- Propriedades (lista, nova, [id], [id]/editar, [id]/calendario)
- Cotistas (lista, novo)
- Financeiro
- Convites pendentes
- Configurações

### Dependências atuais

1. **Componentes compartilhados:** O admin principal **reutiliza** componentes em `components/admin-portal/`:
   - `ConfigurarSemanasDialog` — usado em `admin/vivant-care/propriedades/[id]`
   - `CalendarioPropriedade` — usado em `admin/vivant-care/propriedades/[id]/calendario`
2. **APIs:** Alguns `revalidatePath` em `app/api/admin/propriedades/**` ainda referenciam paths `/admin-portal/propriedades*` (cache; não impede o admin principal de funcionar).
3. **Links:** `components/admin/users-table.tsx` contém link "Ver cotistas no Portal" para `/admin-portal/cotistas`.

### Recomendação

- **Não remover** o `/admin-portal` de imediato: ainda há uso de componentes e possivelmente de fluxos (ex.: quem preferir usar o portal legado para propriedades/calendário).
- **Próximos passos sugeridos:**
  1. Migrar `ConfigurarSemanasDialog` e `CalendarioPropriedade` para algo como `components/admin/` (ou manter em admin-portal só como lib de componentes) e apontar apenas o admin principal para eles.
  2. Substituir links internos que levam ao admin-portal por links para `/admin/vivant-care/*` onde já existir equivalente (ex.: cotistas → `/admin/vivant-care/cotistas`).
  3. Quando não houver mais uso de rotas do admin-portal, desativar ou redirecionar `/admin-portal` para `/admin/vivant-care` (301/302) e documentar o fim do suporte ao layout legado.

---

## 9. Checklist de validação

- [x] Admin autentica normalmente
- [x] Cotista autentica normalmente
- [x] `/admin/*` separado de `/dashboard/*`
- [x] Menu do admin por permissão (Assembleias e Trocas com vivantCare.*)
- [x] OWNER/SUPER_ADMIN veem tudo
- [x] Usuário administrativo customizado com permissões parciais funciona
- [x] Assembleias no admin (listar, criar, detalhe, editar)
- [x] Assembleias no portal do cotista com dados reais
- [x] Trocas no admin (listar, detalhe, aprovar/reprovar)
- [x] Trocas no portal do cotista (listar, criar, detalhe, cancelar se ABERTA)
- [x] Status do dashboard do cotista com dados reais (Em dia / Pendente)
- [x] Nenhuma tela nova depende do layout do admin-portal
- [x] Nenhum redirect envia admin ou cotista para o painel errado

---

## 10. Arquivos alterados/criados (resumo)

- **Permissões/menu:** `lib/auth/permissionCatalog.ts`, `lib/navigation/menu.ts`, `prisma/seed.ts`, `middleware.ts`, `components/shell/AppShell.tsx`
- **Admin assembleias:** `app/(admin)/admin/vivant-care/assembleias/page.tsx`, `nova/page.tsx`, `[id]/page.tsx`, `[id]/editar/page.tsx`, `components/admin/assembleia-form.tsx`, `app/api/admin/assembleias/route.ts`, `[id]/route.ts`, `[id]/pautas/route.ts`
- **Admin trocas:** `app/(admin)/admin/vivant-care/trocas/page.tsx`, `[id]/page.tsx`, `app/api/admin/trocas/route.ts`, `[id]/route.ts`
- **Cotista assembleias:** `app/(cotista)/dashboard/assembleias/page.tsx`, `[id]/page.tsx`, `app/api/cotistas/me/assembleias/route.ts`, `[id]/route.ts`
- **Cotista trocas:** `app/(cotista)/dashboard/trocas/page.tsx`, `[id]/page.tsx`, `app/api/cotistas/me/trocas/route.ts`, `[id]/route.ts`
- **Dashboard cotista:** `app/(cotista)/dashboard/page.tsx`, `app/api/cotistas/me/stats/route.ts`
- **Documentação:** `docs/FASE3_VIVANT_CARE_ENTREGA.md`

Fim do resumo da Fase 3 — Vivant Care concluído no painel principal e no portal do cotista, com RBAC e sem terceiro painel.
