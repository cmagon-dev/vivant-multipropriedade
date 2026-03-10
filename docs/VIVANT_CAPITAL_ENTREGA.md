# Vivant Capital — Documentação do Módulo

## Resumo

O **Vivant Capital** foi implementado como um módulo de investimentos sobre os **imóveis já existentes** no sistema. Não há duplicação de propriedades: os imóveis continuam cadastrados em **Casas** (admin) e o Capital apenas adiciona a camada de configuração financeira (cotas, taxa de administração, distribuições, etc.).

---

## 1. O que foi criado

### 1.1 Modelos de dados (Prisma)

- **CapitalAssetConfig** — Configuração do imóvel no Capital (vinculado a `Property` existente)
- **CapitalInvestorProfile** — Perfil de investidor (vinculado a `User` existente)
- **CapitalParticipation** — Participação investidor × ativo (cotas, percentual, valor aportado)
- **CapitalDistribution** — Distribuição de resultados por competência (receita, custos, resultado distribuível)
- **CapitalDistributionItem** — Item da distribuição por investidor (valor devido/pago)
- **CapitalValuation** — Avaliação do imóvel por data de referência
- **CapitalLiquidityRequest** — Solicitação de antecipação/resgate do investidor

Relacionamentos obrigatórios: `CapitalAssetConfig.propertyId` → `Property`; `CapitalInvestorProfile.userId` → `User`.

### 1.2 Permissões

- **capital.view** — Acesso ao módulo Capital no admin
- **capital.manage** — Gerenciar ativos, investidores, distribuições e solicitações
- **capital.portal** — Acesso ao portal do investidor (`/capital`)

Role **INVESTOR** criada no seed, com permissão `capital.portal`. OWNER/SUPER_ADMIN recebem todas as permissões via seed.

### 1.3 Área Admin (`/admin/capital/*`)

| Rota | Descrição |
|------|-----------|
| `/admin/capital` | Dashboard: total captado, distribuído, investidores ativos, ativos vinculados, solicitações pendentes |
| `/admin/capital/ativos` | Lista de imóveis vinculados ao Capital; link "Vincular imóvel" |
| `/admin/capital/ativos/novo` | Formulário para vincular imóvel (select de Property + config de cotas, taxa, reserva) |
| `/admin/capital/ativos/[id]` | Editar configuração do ativo |
| `/admin/capital/investidores` | Lista de perfis de investidor |
| `/admin/capital/participacoes` | Lista participações (investidor × ativo) |
| `/admin/capital/distribuicoes` | Lista distribuições por competência |
| `/admin/capital/distribuicoes/[id]` | Detalhe da distribuição; aprovar / marcar como paga |
| `/admin/capital/solicitacoes` | Lista solicitações de liquidez |
| `/admin/capital/solicitacoes/[id]` | Detalhe; aprovar, recusar ou marcar como paga |
| `/admin/capital/relatorios` | Placeholder para relatórios (em breve) |

Menu do admin: nova seção **VIVANT CAPITAL** com os itens acima (ícones TrendingUp, Building2, Users, PieChart, DollarSign, FileText, BarChart3).

### 1.4 Portal do investidor (`/capital/*`)

| Rota | Descrição |
|------|-----------|
| `/capital` | Dashboard: patrimônio investido, valor estimado, rendimento acumulado, último recebimento, ativos, solicitações em aberto |
| `/capital/portfolio` | Lista de ativos em que o investidor participa |
| `/capital/ativos/[id]` | Detalhe do ativo (dados do imóvel + sua participação + última avaliação) |
| `/capital/rendimentos` | Histórico de distribuições (itens pagos/pendentes) |
| `/capital/documentos` | Documentos dos imóveis em que participa (reaproveita `Documento` do Property) |
| `/capital/solicitacoes` | Lista de solicitações do investidor; formulário "Nova solicitação" (antecipação/resgate) |
| `/capital/solicitacoes/[id]` | Detalhe da solicitação e status |

Layout do portal: sidebar (Dashboard, Portfólio, Rendimentos, Documentos, Solicitações) + header com nome do usuário; mesmo padrão visual do ecossistema (cards, cores vivant-navy).

### 1.5 APIs

**Admin**

- `GET/POST /api/admin/capital/ativos` — Listar / criar ativo
- `GET/PUT /api/admin/capital/ativos/[id]` — Detalhe / atualizar ativo
- `GET /api/admin/capital/stats` — Estatísticas do dashboard
- `GET /api/admin/capital/investidores` — Listar investidores
- `GET/POST /api/admin/capital/participacoes` — Listar / criar participação
- `GET/POST /api/admin/capital/distribuicoes` — Listar / criar distribuição (com itens por investidor)
- `GET/PUT /api/admin/capital/distribuicoes/[id]` — Detalhe / atualizar status (aprovar/paga)
- `GET /api/admin/capital/solicitacoes` — Listar solicitações
- `GET/PUT /api/admin/capital/solicitacoes/[id]` — Detalhe / aprovar, recusar, paga

**Investidor**

- `GET /api/capital/me/stats` — Stats do dashboard (patrimônio, rendimento, etc.)
- `GET /api/capital/me/portfolio` — Participações ativas
- `GET /api/capital/me/rendimentos` — Itens de distribuição
- `GET /api/capital/me/ativos/[id]` — Detalhe do ativo (só se tiver participação)
- `GET /api/capital/me/documentos` — Documentos dos imóveis em que participa
- `GET/POST /api/capital/me/solicitacoes` — Listar / criar solicitação
- `GET /api/capital/me/solicitacoes/[id]` — Detalhe da própria solicitação

Cálculos financeiros (distribuição: receita - custos - taxa - reserva = resultado distribuível; itens por percentual do investidor) são feitos no backend.

---

## 2. O que foi reaproveitado

- **Property** — Nenhum cadastro duplicado; Capital só adiciona `CapitalAssetConfig` por `propertyId`.
- **User** — Investidor é `User` com role INVESTOR e `CapitalInvestorProfile` opcional.
- **Documento** — Documentos do investidor vêm dos `Documento` dos imóveis em que ele participa.
- **Layout admin** — AppShell, menu único filtrado por permissão, seção "VIVANT CAPITAL".
- **Auth** — NextAuth, RBAC (roles/permissions), middleware e redirect pós-login (INVESTOR → `/capital`).
- **Componentes UI** — Card, Button, Input, Select, Table, etc.

---

## 3. Regras de negócio

1. **Investidor é apenas investidor** — Não mistura com portal do cotista; role INVESTOR acessa somente `/capital`.
2. **Imóvel único** — Property já existe; Capital só adiciona configuração (cotas, valor/cota, taxa, reserva).
3. **Cálculos no backend** — Distribuições e itens calculados no servidor.
4. **Investidor vê só os próprios dados** — Todas as APIs `/api/capital/me/*` filtram por `CapitalInvestorProfile` do usuário logado.
5. **Distribuições** — Criadas e aprovadas no admin; itens gerados por participação ativa.
6. **Solicitações de liquidez** — Investidor solicita; admin aprova, recusa ou marca como paga; histórico e status registrados.

---

## 4. Ponto de atenção: página institucional Capital

A página **institucional** do Vivant Capital (conteúdo de marketing) estava em `(marketing)/capital/page.tsx` e gerava conflito de rota com o portal do investidor `/capital`. Foi movida para **`/sobre-capital`**. Links na navbar e no footer do site público foram atualizados para `/sobre-capital`. O portal do investidor permanece em **`/capital`** (acesso apenas para usuários com role INVESTOR ou permissão capital.portal).

---

## 5. Migration

Foi criada a migration **`20260305000000_add_vivant_capital`** em `prisma/migrations/`. Para aplicar em ambiente local/produção:

```bash
npx prisma migrate deploy
```

(Em desenvolvimento interativo pode-se usar `npx prisma migrate dev`.)

---

## 6. Validação

- Nenhuma rota antiga foi alterada (Vivant Care, cotista, admin geral intactos).
- Não há duplicação de imóveis: Capital usa `Property` existente.
- Investidor só acessa dados próprios (APIs filtram por `investorProfileId` do session).
- Gestão do Capital está centralizada no admin (`/admin/capital/*`).
- Vivant Care não foi modificado.

---

## 7. Expansão futura

- **Relatórios** — Página `/admin/capital/relatorios` preparada para relatórios financeiros e exportação.
- **CapitalValuation** — Modelo e relações prontos para histórico de avaliação do imóvel.
- **Criação de participação** — Admin pode criar participações manualmente via API/CRUD; tela de “Nova participação” no admin pode ser adicionada reutilizando o mesmo padrão.
- **Criação de distribuição** — POST de distribuição já gera itens por participação ativa; tela “Nova distribuição” no admin pode ser implementada com formulário (competência, receita, custos, etc.).
