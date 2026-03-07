# Reativação do site institucional (marketing) — Entrega

## Objetivo

Reativar o site institucional completo que estava em `_disabled/(marketing)/`, recolocando-o no App Router como `app/(marketing)/`, de forma que `/` exiba a home institucional completa e as subrotas públicas voltem a funcionar, sem quebrar os dois painéis (`/admin/*`, `/dashboard/*`), auth ou middleware.

---

## 1. Arquivos movidos / criados / alterados

### Criados

| Caminho | Descrição |
|--------|-----------|
| `app/(marketing)/layout.tsx` | Layout do grupo de rotas (apenas `children`) |
| `app/(marketing)/page.tsx` | Home institucional completa + verificação de sessão (redirect se logado) |
| `app/(marketing)/modelo/page.tsx` | Página “O Modelo Vivant” |
| `app/(marketing)/destinos/page.tsx` | Lista de destinos (server) |
| `app/(marketing)/destinos/destinos-client.tsx` | Cliente de destinos (carrossel, abas) |
| `app/(marketing)/casas/page.tsx` | Lista de casas (server) |
| `app/(marketing)/casas/casas-client.tsx` | Cliente de casas (filtros, grid) |
| `app/(marketing)/casas/[slug]/page.tsx` | Detalhe de casa por slug |
| `app/(marketing)/casas/[slug]/not-found.tsx` | 404 de casa não encontrada |
| `app/(marketing)/contato/page.tsx` | Página de contato (form + WhatsApp) |
| `app/(marketing)/parceiros/page.tsx` | Vivant Partners – cadastro de imóvel |
| `app/(marketing)/capital/page.tsx` | Vivant Capital |
| `app/(marketing)/care/page.tsx` | Vivant Care |
| `app/(marketing)/simulador-investimentos/page.tsx` | Simulador de investimentos |
| `app/(marketing)/apresentacao/page.tsx` | Apresentação (com print) |
| `app/(marketing)/apresentacao/print-styles.css` | Estilos de impressão |

### Removidos

| Caminho | Motivo |
|--------|--------|
| `app/page.tsx` | Substituído por `app/(marketing)/page.tsx` como única rota `/` |

### Alterados (compatibilidade)

| Arquivo | Ajuste |
|--------|--------|
| `app/(marketing)/page.tsx` | Verificação de sessão no início: se logado → `redirect(getPostLoginRedirectRoute(session))`; senão → render da home institucional. Uso de `images: []` para destinos (model `Destination` não tem campo `images`). |
| `app/(marketing)/casas/[slug]/page.tsx` | `prisma.property.findUnique` trocado por `prisma.property.findFirst` com `where: { slug, published: true }` (findUnique não aceita `published` no where). |
| `app/(marketing)/destinos/page.tsx` | Formato de destino para o cliente: `images: []` (Destination sem `images` no schema). |

### Não alterados (conforme combinado)

- `middleware.ts` — sem mudanças
- `lib/auth/*` — sem mudanças (providers, callbacks, JWT, session)
- Rotas `/login`, `/admin/*`, `/dashboard/*` — intactas
- `_disabled/(marketing)/` — mantido no repositório como legado/referência

---

## 2. Rotas reativadas

| Rota | Arquivo | Observação |
|------|---------|------------|
| `/` | `app/(marketing)/page.tsx` | Home institucional completa; se logado → redirect para painel |
| `/modelo` | `app/(marketing)/modelo/page.tsx` | O Modelo Vivant |
| `/destinos` | `app/(marketing)/destinos/page.tsx` | Nossos destinos (Prisma + DestinosClient) |
| `/casas` | `app/(marketing)/casas/page.tsx` | Lista de casas (Prisma + CasasClient) |
| `/casas/[slug]` | `app/(marketing)/casas/[slug]/page.tsx` | Detalhe da casa (findFirst por slug + published) |
| `/contato` | `app/(marketing)/contato/page.tsx` | Contato (client, WhatsApp) |
| `/parceiros` | `app/(marketing)/parceiros/page.tsx` | Vivant Partners |
| `/capital` | `app/(marketing)/capital/page.tsx` | Vivant Capital |
| `/care` | `app/(marketing)/care/page.tsx` | Vivant Care |
| `/simulador-investimentos` | `app/(marketing)/simulador-investimentos/page.tsx` | Simulador (investment components) |
| `/apresentacao` | `app/(marketing)/apresentacao/page.tsx` | Apresentação + print-styles.css |

Links da navbar e do footer para essas URLs deixam de retornar 404.

---

## 3. Fluxo de entrada (confirmado)

- **Visitante sem login acessa `/`** → middleware faz `next()` → `app/(marketing)/page.tsx` não tem sessão → renderiza a home institucional completa.
- **Admin logado acessa `/`** → middleware redireciona para `getPostLoginRedirectFromToken` (ex.: `/admin/overview`).
- **Cotista logado acessa `/`** → middleware redireciona para `/cotista` (ou rota configurada para cotista).
- **`/login`** → continua em `app/(auth)/login/page.tsx`; se já logado, middleware redireciona.
- **`/admin/*`** e **`/dashboard/*`** → protegidos e redirecionados como antes; sem alteração.

---

## 4. Componentes e dados reaproveitados

- **Componentes:** `components/marketing/navbar.tsx`, `footer.tsx`, `whatsapp-button.tsx`, `destination-card.tsx`, `share-button.tsx`, `image-lightbox.tsx`, `print-button.tsx`, `validation-timeline.tsx`, `partner-lead-form.tsx`
- **Investment:** `components/investment/*` (form, chart, KPIs, cash-flow, liquidez, lead-capture) para `/simulador-investimentos`
- **Prisma:** `prisma.property` (published, highlight, slug, destino, etc.) e `prisma.destination` (published, order); schema não foi alterado
- **Asset:** `public/images/hero-home.png` (hero da home)

---

## 5. Compatibilidade (Prisma e tipos)

- **Property:** `published`, `highlight`, `slug`, `destino`, `images`, `features`, `status`, etc. — utilizados conforme schema atual.
- **Destination:** `published`, `order`, `slug`, `name`, `features`, etc.; **não** existe campo `images` no schema — nas páginas que passam destino para o cliente, foi usado `images: []`.
- **Casas [slug]:** uso de `findFirst({ where: { slug, published: true } })` para respeitar restrição do Prisma em `findUnique`.

---

## 6. Build e validação

- **Build:** `npm run build` concluído com sucesso (exit 0).
- **Rotas no build:** `/`, `/modelo`, `/destinos`, `/casas`, `/casas/[slug]`, `/contato`, `/parceiros`, `/capital`, `/care`, `/simulador-investimentos`, `/apresentacao` aparecem na saída do Next.
- Apenas warnings de lint (hooks, `img` vs `Image`); nenhuma alteração funcional feita por causa deles.

---

## 7. Resumo

- Site institucional completo reativado em `app/(marketing)/`.
- `/` passou a ser a home institucional completa (com redirect para painel se logado).
- Subrotas públicas listadas acima estão ativas; links da navbar/footer funcionando.
- `/login`, `/admin/*` e `/dashboard/*` permanecem intactos; auth e middleware não foram alterados.
- Conteúdo e fluxo que estavam em `_disabled/(marketing)/` foram integrados ao App Router sem duplicar a landing antiga em `app/page.tsx` (arquivo removido).
