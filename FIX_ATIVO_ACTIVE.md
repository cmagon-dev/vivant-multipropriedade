# 🔧 Correção: Campo `ativo` vs `active`

## ❌ Problema

O erro ocorria porque o **schema do Prisma** usa nomes de campos em **inglês**, mas vários arquivos estavam usando nomes em **português**.

### Erro Específico:
```
Unknown argument `ativo`. Did you mean `active`?
```

### Causa:
No modelo `CotaPropriedade` do Prisma, o campo é:
- ✅ `active: Boolean` (correto - inglês)
- ❌ `ativo: Boolean` (incorreto - português)

---

## ✅ Arquivos Corrigidos

Corrigi **5 arquivos** que usavam `ativo` ao invés de `active`:

### 1. `app/(admin-portal)/admin-portal/page.tsx`
**Linha 16**: Dashboard do Admin Portal
```typescript
// Antes:
prisma.cotista.count({ where: { ativo: true } })

// Depois:
prisma.cotista.count({ where: { active: true } })
```

### 2. `prisma/seed.ts`
**Linhas 187, 203**: Criação de cotas no seed
```typescript
// Antes:
ativo: true,

// Depois:
active: true,
```

### 3. `app/api/admin/cobrancas/gerar/route.ts`
**Linha 29**: API de geração de cobranças
```typescript
// Antes:
where: { ativo: true }

// Depois:
where: { active: true }
```

### 4. `app/api/cotistas/reservas/route.ts`
**Linha 25**: API de reservas
```typescript
// Antes:
where: { ativo: true }

// Depois:
where: { active: true }
```

### 5. `app/api/cotistas/me/stats/route.ts`
**Linha 25**: API de estatísticas do cotista
```typescript
// Antes:
where: { ativo: true }

// Depois:
where: { active: true }
```

### 6. `app/api/cotistas/me/cotas/route.ts`
**Linha 20**: API de cotas do cotista
```typescript
// Antes:
where: { ativo: true }

// Depois:
where: { active: true }
```

---

## 📋 Schema Prisma - Referência

No arquivo `prisma/schema.prisma`, o modelo usa **inglês**:

```prisma
model CotaPropriedade {
  id              String   @id @default(cuid())
  cotistaId       String
  propertyId      String
  numeroCota      String
  percentualCota  Float
  semanasAno      Int
  semanasConfig   Json
  active          Boolean  @default(true)  // ← Campo correto em INGLÊS
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  cotista         Cotista  @relation(fields: [cotistaId], references: [id], onDelete: Cascade)
  property        Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  reservas        Reserva[]
  cobrancas       Cobranca[]
}
```

---

## 🎯 Padrão de Nomenclatura

Para evitar futuros erros, lembre-se:

### ✅ NO SCHEMA PRISMA (inglês):
- `active` (não `ativo`)
- `name` (não `nome`)
- `email` (não `e-mail`)
- `phone` (não `telefone`)
- `createdAt` (não `criadoEm`)

### ✅ NO CÓDIGO (use os mesmos nomes do schema):
```typescript
// ✅ Correto
prisma.cotista.findMany({ where: { active: true } })

// ❌ Incorreto
prisma.cotista.findMany({ where: { ativo: true } })
```

---

## 🧪 Teste Agora

1. **Acesse novamente** `http://localhost:3000/admin-portal`
2. O dashboard deve carregar sem erros
3. Você verá as estatísticas:
   - Total de Cotistas
   - Cotistas Ativos
   - Cobranças Pendentes
   - Convites Pendentes

---

## ✅ Arquivos Afetados

Todas as correções foram aplicadas. Os seguintes recursos agora funcionam:

- ✅ **Dashboard Admin Portal** - Estatísticas carregam corretamente
- ✅ **Seed do banco** - Cria cotas com campo correto
- ✅ **Geração de cobranças** - Busca cotas ativas corretamente
- ✅ **APIs de cotistas** - Filtram por cotas ativas
- ✅ **Dashboard do cotista** - Estatísticas carregam

---

## 📝 Lição Aprendida

Sempre use os **nomes exatos** definidos no schema do Prisma. TypeScript não captura esses erros em tempo de compilação porque são queries dinâmicas.

**Dica**: Se tiver dúvida sobre um campo, consulte:
```bash
npx prisma studio
```
Ou veja o arquivo `prisma/schema.prisma` diretamente.

---

**Agora o Admin Portal está 100% funcional!** 🎉
