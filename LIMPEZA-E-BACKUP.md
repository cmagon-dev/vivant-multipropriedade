# 🧹 Limpeza e Backup do Sistema Vivant

## 📊 Análise de Arquivos do Projeto

### ✅ Arquivos em Uso (Manter)

#### Sistema Admin (Novo - Manter Tudo)
- `app/(admin)/` - Todo o sistema administrativo
- `components/admin/` - Todos os componentes do admin
- `app/api/` - Todas as APIs CRUD
- `lib/auth.ts`, `lib/prisma.ts`, `lib/permissions.ts`, `lib/audit.ts`
- `lib/validations/property-admin.ts`, `destination-admin.ts`, `user.ts`
- `prisma/` - Schema e seed

#### Sistema Marketing (Em uso)
- `app/(marketing)/` - Todas as páginas públicas
- `components/marketing/` - Componentes de marketing
- `middleware.ts` - Roteamento multi-domínio

#### Simulador Financeiro (Em uso)
- `app/(dashboard)/dashboard/simulador/page.tsx` - ATIVO
- `components/dashboard/` - ATIVOS
- `components/investment/` - ATIVOS
- `lib/math/calculator.ts` e `investment-calculator.ts` - ATIVOS
- `lib/validations/property.ts` e `investment.ts` - ATIVOS

#### Portal do Cotista (Em uso)
- `app/(dashboard)/portal-cotista/` - ATIVO

### ⚠️ Arquivos para Revisão

#### 1. Componentes de Debug (Possível Remoção)
```
components/debug/client-logger.tsx
components/debug/style-checker.tsx
```

**Análise:** Esses arquivos de debug não são importados em nenhum lugar.
**Recomendação:** REMOVER (são apenas para desenvolvimento)

#### 2. Arquivo de Teste
```
lib/math/calculator.test.ts
```

**Análise:** Arquivo de testes unitários
**Recomendação:** MANTER (bom ter testes) ou REMOVER se não usar testes

#### 3. Páginas Antigas Dashboard (Verificar)
```
app/(dashboard)/capital/page.tsx
app/(dashboard)/dashboard/simulador-investimentos/page.tsx (DELETADA)
```

**Análise:** 
- `capital/page.tsx` foi movida para `app/(marketing)/capital/page.tsx`
- Verificar se a antiga ainda existe

#### 4. Documentos de Guia (Não commitados)
```
CORRIGIR-ERRO-NEXTAUTH.md
DEPLOY-CONFIG.md
GUIA-VERCEL-PASSO-A-PASSO.md
TESTES-PRODUCAO.md
```

**Análise:** Documentação de deploy criada hoje
**Recomendação:** COMMITAR para referência futura

### 🗑️ Arquivos para Remover

#### Categoria 1: Debug (Não utilizados)
- [ ] `components/debug/client-logger.tsx`
- [ ] `components/debug/style-checker.tsx`

#### Categoria 2: Testes (Opcional)
- [ ] `lib/math/calculator.test.ts` (se não usar testes unitários)

#### Categoria 3: Logs e Cache
- [ ] `.cursor/debug.log` (arquivo de log)
- [ ] `.next/` (build cache - regenerado automaticamente)
- [ ] `node_modules/` (dependências - já ignorado pelo git)

---

## 🧹 Plano de Limpeza

### Passo 1: Remover Componentes de Debug

```bash
# Remover pasta de debug (não utilizada)
rm -rf components/debug
```

### Passo 2: Remover Arquivo de Teste (Opcional)

```bash
# Se não usar testes unitários
rm lib/math/calculator.test.ts
```

### Passo 3: Limpar Logs e Cache

```bash
# Limpar logs do Cursor
rm .cursor/debug.log

# Limpar build cache (será regenerado)
rm -rf .next
```

### Passo 4: Organizar Documentação

```bash
# Commitar os novos guias de documentação
git add CORRIGIR-ERRO-NEXTAUTH.md
git add DEPLOY-CONFIG.md
git add GUIA-VERCEL-PASSO-A-PASSO.md
git add TESTES-PRODUCAO.md
git add LIMPEZA-E-BACKUP.md
git commit -m "docs: adicionar guias de deploy e configuração"
git push origin main
```

---

## 💾 Plano de Backup Completo

### Estratégia de Backup em 3 Camadas

#### 🔵 Camada 1: Backup Git (Já está feito!)

**Status:** ✅ Completo
- Repositório: https://github.com/cmagon-dev/vivant-multipropriedade.git
- Branch: main
- Último commit: feat: sistema administrativo completo

**O que está protegido:**
- Todo o código-fonte
- Configurações do projeto
- Schema do banco
- Documentação

**O que NÃO está protegido:**
- `.env` (credenciais - correto, não deve estar no git)
- `node_modules/` (dependências - regenerável)
- `.next/` (build - regenerável)
- Dados do banco de dados

#### 🟢 Camada 2: Backup do Banco de Dados (Neon)

**Ação necessária:**

1. **Backup Manual via Prisma Studio**
   ```bash
   npx prisma studio
   ```
   - Abrir cada tabela
   - Exportar dados (se houver funcionalidade)

2. **Backup via SQL Dump** (Recomendado)
   ```bash
   # Conectar ao banco e fazer dump
   pg_dump "postgresql://neondb_owner:npg_vVwpk7DxjNt4@ep-broad-surf-acw33r2t.sa-east-1.aws.neon.tech/neondb?sslmode=require" > backup-vivant-$(date +%Y%m%d).sql
   ```

3. **Backup Automático Neon**
   - Acesse: https://console.neon.tech/
   - Vá para seu projeto
   - Configure backups automáticos (se disponível no plano)

#### 🟡 Camada 3: Backup de Imagens (Vercel Blob)

**Status:** Protegido pela Vercel
- Vercel Blob mantém seus próprios backups
- Considere exportar imagens importantes manualmente

**Ação opcional:**
1. Listar todas as imagens no Blob
2. Fazer download local das mais importantes
3. Guardar em cloud storage adicional (Google Drive, Dropbox, etc.)

#### 🔴 Camada 4: Backup Local (Recomendado)

**Criar snapshot completo do projeto:**

```bash
# Na pasta do projeto, criar zip com data
tar -czf vivant-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  .
```

Ou no Windows:
```powershell
# Criar ZIP manualmente incluindo:
# - Todos os arquivos do projeto
# - Excluir: node_modules, .next
# - Incluir: .env (guardar em local SEGURO!)
```

---

## 📋 Checklist de Backup Completo

### Antes de Qualquer Mudança Importante

- [ ] Código no GitHub atualizado (git push)
- [ ] Backup do banco de dados exportado
- [ ] Lista de variáveis de ambiente salva em local seguro
- [ ] Documentação atualizada
- [ ] ZIP local do projeto criado

### Backup Regular (Semanal/Mensal)

- [ ] Export SQL do banco de dados
- [ ] Verificar se commits estão no GitHub
- [ ] Conferir se deploy da Vercel está funcionando
- [ ] Testar restauração do backup (importante!)

### Informações Críticas para Guardar

```
📁 Guardar em local SEGURO (não no repositório):

1. Arquivo .env completo
2. Credenciais do Neon (banco)
3. Credenciais da Vercel
4. NEXTAUTH_SECRET de produção
5. Tokens do Vercel Blob
6. Acessos de admin do sistema
```

---

## 🔄 Estratégia de Restauração

### Cenário 1: Perda de Código

**Solução:** Clone do GitHub
```bash
git clone https://github.com/cmagon-dev/vivant-multipropriedade.git
cd vivant-multipropriedade
npm install
```

### Cenário 2: Perda de Banco de Dados

**Solução:** Restaurar do dump SQL
```bash
psql "sua-connection-string" < backup-vivant-20260219.sql
```

### Cenário 3: Perda de Deploy

**Solução:** Reconectar projeto na Vercel
1. Import do GitHub na Vercel
2. Configurar variáveis de ambiente
3. Deploy automático

### Cenário 4: Perda Total

**Solução:** Restauração completa
1. Clone do GitHub
2. Restaurar banco do dump
3. Configurar Vercel novamente
4. Restaurar imagens do Blob (se necessário)

---

## 🎯 Ações Imediatas Recomendadas

### 1. Limpeza (Executar agora)
```bash
# Remover componentes não utilizados
rm -rf components/debug

# Commitar documentação nova
git add *.md
git commit -m "docs: adicionar documentação de deploy e backup"
git push origin main
```

### 2. Backup do Banco (Executar agora)
```bash
# Fazer primeiro backup do banco de dados
pg_dump "postgresql://neondb_owner:npg_vVwpk7DxjNt4@ep-broad-surf-acw33r2t.sa-east-1.aws.neon.tech/neondb?sslmode=require" > backup-vivant-20260219.sql
```

### 3. Backup das Credenciais (Executar agora)
- Copiar o arquivo `.env` para um local seguro
- Documentar todas as credenciais em um gerenciador de senhas

### 4. Tag de Release (Executar agora)
```bash
# Criar tag no git para marcar versão estável
git tag -a v1.0.0 -m "Versão 1.0 - Sistema admin completo e deployado"
git push origin v1.0.0
```

---

## 📊 Resumo

### Arquivos do Projeto
- **Total:** ~120 arquivos de código
- **Em uso:** ~115 arquivos
- **Para remover:** 2-3 arquivos (debug)
- **Para commitar:** 5 arquivos de documentação

### Tamanho Estimado
- **Código-fonte:** ~5 MB
- **node_modules:** ~300 MB (não fazer backup)
- **Build (.next):** ~50 MB (não fazer backup)
- **Backup recomendado:** Código + .env + DB dump = ~10-20 MB

### Status de Backup
- ✅ Git/GitHub: Protegido
- ✅ Deploy Vercel: Protegido
- ⚠️ Banco de dados: Precisa backup manual
- ⚠️ Credenciais: Precisa guardar em local seguro
- ⚠️ Backup local: Recomendado fazer

---

**Última atualização:** 19 de Fevereiro de 2026
