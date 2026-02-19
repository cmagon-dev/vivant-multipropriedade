# 🚀 Próximos Passos - Sistema Admin Vivant

## ✅ O que foi implementado (100%)

Todo o sistema administrativo foi implementado com sucesso! Consulte `README-ADMIN.md` para detalhes completos.

---

## 📝 Ações Necessárias para Ativar o Sistema

### 1. Configurar Vercel Postgres

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Vá em "Storage" > "Create Database" > "Postgres"
3. Copie as variáveis de ambiente geradas
4. Cole em `.env.local`:

```env
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

### 2. Configurar Vercel Blob (Upload de Imagens)

1. No Dashboard da Vercel, vá em "Storage" > "Create Database" > "Blob"
2. Copie o token gerado
3. Adicione em `.env.local`:

```env
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

### 3. Gerar NextAuth Secret

```bash
# No terminal, execute:
openssl rand -base64 32

# Adicione o resultado em .env.local:
NEXTAUTH_SECRET="resultado_aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Inicializar o Banco

```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas no banco
npx prisma db push

# Popular dados iniciais (usuário admin + dados de exemplo)
npx prisma db seed
```

### 5. Testar o Sistema

```bash
# Rodar o projeto
npm run dev

# Acessar:
# http://localhost:3000/admin

# Credenciais:
# Email: admin@vivant.com.br
# Senha: vivant@2024
```

---

## 🧪 Testes Recomendados

### Login e Autenticação
- [ ] Login com credenciais corretas
- [ ] Login com credenciais incorretas
- [ ] Logout
- [ ] Acesso negado a rotas protegidas sem login
- [ ] Redirecionamento após login

### Gestão de Casas
- [ ] Listar todas as casas
- [ ] Criar nova casa com todas as informações
- [ ] Upload de múltiplas imagens
- [ ] Editar casa existente
- [ ] Publicar/despublicar casa
- [ ] Deletar casa (apenas ADMIN)
- [ ] Validações de campos obrigatórios

### Gestão de Destinos
- [ ] Listar destinos
- [ ] Criar novo destino com 4 features
- [ ] Editar destino
- [ ] Publicar/despublicar
- [ ] Tentar deletar destino com propriedades vinculadas (deve falhar)
- [ ] Deletar destino sem propriedades

### Gestão de Usuários (ADMIN)
- [ ] Listar usuários
- [ ] Criar novo usuário
- [ ] Editar usuário
- [ ] Alterar senha
- [ ] Ativar/desativar usuário
- [ ] Deletar usuário
- [ ] Tentar acessar /admin/usuarios como EDITOR (deve bloquear)

### Permissões
- [ ] VIEWER não pode editar nada
- [ ] EDITOR pode criar/editar mas não deletar
- [ ] EDITOR não acessa /admin/usuarios
- [ ] ADMIN tem acesso total

---

## 🔄 Migrar Páginas Públicas (Opcional)

As páginas públicas (`/casas` e `/destinos`) ainda usam dados hardcoded.

Para migrar para o banco:

### `/app/(marketing)/casas/page.tsx`

Substitua:
```typescript
const allProperties = [ /* array hardcoded */ ];
```

Por:
```typescript
const allProperties = await prisma.property.findMany({
  where: { published: true },
  include: { destino: true },
  orderBy: { createdAt: "desc" }
});
```

### `/app/(marketing)/destinos/page.tsx`

Substitua:
```typescript
const destinations = [ /* array hardcoded */ ];
```

Por:
```typescript
const destinations = await prisma.destination.findMany({
  where: { published: true },
  orderBy: { order: "asc" }
});
```

---

## 🚀 Deploy para Produção

### 1. Push do Código

```bash
git add .
git commit -m "feat: adicionar sistema administrativo completo"
git push origin main
```

### 2. Configurar na Vercel

1. Acesse o projeto no Dashboard da Vercel
2. Vá em "Settings" > "Environment Variables"
3. Adicione todas as variáveis de `.env.local`:
   - `POSTGRES_*` (já configurado ao criar o banco)
   - `NEXTAUTH_SECRET` (gerar novo para produção!)
   - `NEXTAUTH_URL` (URL de produção, ex: https://vivantresidences.com.br)
   - `BLOB_READ_WRITE_TOKEN` (já configurado)

### 3. Rodar Migrations em Produção

```bash
# Localmente, conectado ao banco de produção:
npx prisma db push

# Rodar seed (apenas na primeira vez):
npx prisma db seed
```

### 4. Testar em Produção

- Acesse: `https://seudominio.com.br/admin`
- Faça login
- Teste as funcionalidades principais

---

## 🔒 Segurança Pós-Deploy

1. [ ] Alterar senha do admin (`vivant@2024` para uma senha forte)
2. [ ] Criar usuários individuais para cada membro da equipe
3. [ ] Não compartilhar credenciais de ADMIN
4. [ ] Revisar permissões regularmente
5. [ ] Ativar HTTPS (já ativo na Vercel)

---

## 📚 Recursos Adicionais

- **Documentação completa:** `docs/ADMIN.md`
- **Detalhes técnicos:** `README-ADMIN.md`
- **Plano original:** `.cursor/plans/sistema_admin_vivant_*.plan.md`

---

## 🆘 Troubleshooting

### Erro ao conectar no banco
- Verifique se as variáveis `POSTGRES_*` estão corretas
- Confirme que o banco foi criado na Vercel

### Erro ao fazer upload de imagens
- Verifique se `BLOB_READ_WRITE_TOKEN` está configurado
- Confirme que o Blob Storage foi criado

### Erro "Unauthorized" no admin
- Gere um novo `NEXTAUTH_SECRET`
- Limpe cookies e faça login novamente

### Prisma não encontra o banco
- Rode `npx prisma generate` novamente
- Verifique a URL de conexão

---

## 🎉 Sistema Pronto!

Após seguir estes passos, o sistema estará 100% funcional e pronto para uso em produção!

**Última atualização:** Fevereiro 2026
