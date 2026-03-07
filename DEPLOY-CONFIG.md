# 🚀 Configuração de Deploy - Vercel

## ✅ Passos Concluídos

- [x] Build local testado com sucesso
- [x] Código commitado e enviado para GitHub
- [x] NEXTAUTH_SECRET de produção gerado

## 📋 Variáveis de Ambiente para Configurar na Vercel

Acesse: **Vercel Dashboard → Seu Projeto → Settings → Environment Variables**

### 1. Banco de Dados (Neon Postgres)

```
POSTGRES_URL=postgresql://neondb_owner:npg_vVwpk7DxjNt4@ep-broad-surf-acw33r2t-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_vVwpk7DxjNt4@ep-broad-surf-acw33r2t-pooler.sa-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_vVwpk7DxjNt4@ep-broad-surf-acw33r2t.sa-east-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_USER=neondb_owner

POSTGRES_HOST=ep-broad-surf-acw33r2t-pooler.sa-east-1.aws.neon.tech

POSTGRES_PASSWORD=npg_vVwpk7DxjNt4

POSTGRES_DATABASE=neondb
```

### 2. Autenticação NextAuth (⚠️ IMPORTANTE)

**NEXTAUTH_SECRET de PRODUÇÃO (novo, diferente do local):**
```
NEXTAUTH_SECRET=0qIrVOvqadzgz+1V3jZB03gH4ESth3noeiqHQL0U1LM=
```

**NEXTAUTH_URL (atualizar com a URL de produção):**
```
NEXTAUTH_URL=https://[SEU-DOMINIO].vercel.app
```

### 3. Upload de Imagens (Vercel Blob)

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_pwEuLXKeX9iN0BLb_4ilqSQPjXxLlQetMsTbneurovwfUWs
```

### 4. Domínios Públicos

```
NEXT_PUBLIC_CAPITAL_DOMAIN=vivantcapital.com.br
NEXT_PUBLIC_RESIDENCES_DOMAIN=vivantresidences.com.br
NEXT_PUBLIC_CARE_DOMAIN=vivantcare.com.br
```

## 🔄 Próximos Passos

1. **Configurar as variáveis acima na Vercel**
   - Copie e cole cada variável
   - Aplique a "Production", "Preview" e "Development" (ou só Production)

2. **Deploy será automático**
   - A Vercel detectou o push e já deve estar fazendo o build
   - Ou você pode forçar um novo deploy no Dashboard

3. **Após o deploy, testar:**
   - Acesso à URL de produção
   - Login no admin: `/admin`
   - Credenciais: `admin@vivant.com.br` / `vivant@2024`

4. **CRÍTICO - Primeira ação após testar:**
   - ⚠️ TROCAR a senha padrão `vivant@2024` para uma senha forte!
   - Admin → Usuários → Editar admin

## 📝 Informações Importantes

- **Repositório:** https://github.com/cmagon-dev/vivant-multipropriedade.git
- **Branch:** main
- **Último commit:** feat: sistema administrativo completo
- **NEXTAUTH_SECRET local:** T1k2Vb/n8D3sR7mYxZqW+A5fC9eH4uJ8vP2aL6kM0cQ= (NÃO usar em produção)
- **NEXTAUTH_SECRET produção:** 0qIrVOvqadzgz+1V3jZB03gH4ESth3noeiqHQL0U1LM=

## ✅ Build Verificado

O build local foi testado e passou com sucesso:
- ✓ Compiled successfully
- ✓ 30 páginas geradas
- ✓ Sem erros de TypeScript
- ⚠️ Apenas warnings sobre `<img>` vs `<Image>` (não bloqueante)

---

**Última atualização:** 19 de Fevereiro de 2026
