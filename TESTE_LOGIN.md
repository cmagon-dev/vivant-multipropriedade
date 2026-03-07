# 🔐 Guia de Login - Resolução de Problemas

## ✅ Banco Populado com Sucesso!

As credenciais foram criadas:

### 👨‍💼 ADMIN (Painel Administrativo)
- **Email:** `admin@vivant.com.br`
- **Senha:** `admin123`
- **URL:** http://localhost:3000/login

### 👤 COTISTA 1
- **Email:** `joao@email.com`
- **Senha:** `cotista123`
- **URL:** http://localhost:3000/portal-cotista

### 👤 COTISTA 2
- **Email:** `maria@email.com`
- **Senha:** `cotista123`
- **URL:** http://localhost:3000/portal-cotista

---

## 🎯 Passo a Passo para Testar

### 1️⃣ Iniciar o Servidor

```bash
npm run dev
```

Aguarde até ver: `✓ Ready in XXXms`

---

### 2️⃣ Login ADMIN (Painel Administrativo)

1. Abra: **http://localhost:3000/login**
2. Digite:
   - Email: `admin@vivant.com.br`
   - Senha: `admin123`
3. Clique em **"Entrar"**
4. Você será redirecionado para: `/admin/dashboard`

✅ **Deve funcionar!** Você verá o painel administrativo.

---

### 3️⃣ Login COTISTA (Portal do Cotista)

**⚠️ IMPORTANTE: Use a URL correta!**

1. Abra: **http://localhost:3000/portal-cotista**
2. Digite:
   - Email: `joao@email.com`
   - Senha: `cotista123`
3. Clique em **"Entrar"**
4. Você será redirecionado para: `/dashboard`

✅ **Deve funcionar!** Você verá o dashboard do cotista.

---

## ❌ Problemas Comuns e Soluções

### Problema 1: "Email ou senha incorretos"

**Possíveis causas:**

✅ **Você está na URL errada?**
- Admin usa: http://localhost:3000/login
- Cotista usa: http://localhost:3000/portal-cotista

✅ **Digitou o email correto?**
- Verifique se não tem espaços
- Email é: `joao@email.com` (sem caps)

✅ **A senha está correta?**
- Senha do admin: `admin123`
- Senha do cotista: `cotista123`

---

### Problema 2: "Página não carrega"

**Solução:**

1. Verifique se o servidor está rodando:
```bash
npm run dev
```

2. Limpe o cache do navegador:
- Pressione: `Ctrl + Shift + R` (Windows/Linux)
- Pressione: `Cmd + Shift + R` (Mac)

3. Tente em janela anônima:
- Pressione: `Ctrl + Shift + N`

---

### Problema 3: "Banco vazio"

**Solução:**

Execute o seed novamente:

```bash
npm run db:seed
```

---

### Problema 4: "Erro ao fazer login"

**Solução:**

1. Abra o console do navegador (F12)
2. Veja se há erros
3. Reinicie o servidor:
```bash
# Parar: Ctrl + C
# Iniciar novamente:
npm run dev
```

---

## 🧪 Teste Rápido - Verificar se Funcionou

### Teste Admin (30 segundos)

```bash
# 1. Abrir no navegador
http://localhost:3000/login

# 2. Login
Email: admin@vivant.com.br
Senha: admin123

# 3. Você deve ver:
✅ Dashboard do Admin
✅ Menu lateral com opções
✅ Seu nome no canto superior
```

### Teste Cotista (30 segundos)

```bash
# 1. Abrir no navegador
http://localhost:3000/portal-cotista

# 2. Login
Email: joao@email.com
Senha: cotista123

# 3. Você deve ver:
✅ Dashboard do Cotista
✅ Cards com estatísticas
✅ Sidebar ou menu mobile
```

---

## 🔍 Verificar Manualmente no Banco

Se ainda não funcionar, vamos verificar o banco:

```bash
# Abrir Prisma Studio
npm run db:studio
```

Isso abre uma interface visual em: http://localhost:5555

**Verificar:**

1. Clique em **"User"** (Admin):
   - Deve ter 1 registro
   - Email: `admin@vivant.com.br`
   - Active: `true`

2. Clique em **"Cotista"**:
   - Deve ter 2 registros
   - Email: `joao@email.com` e `maria@email.com`
   - Active: `true`

---

## 🆘 Ainda Não Funciona?

### Debug Avançado

1. **Ver logs do servidor:**
   - Olhe no terminal onde rodou `npm run dev`
   - Procure por erros

2. **Testar consulta direta:**

```bash
# Abrir Prisma Studio
npm run db:studio

# Ir em "Cotista"
# Verificar se existem registros
# Verificar se "active" está como true
```

3. **Resetar tudo:**

```bash
# CUIDADO: Isso apaga tudo!
npx prisma migrate reset

# Depois popular novamente
npm run db:seed
```

---

## 📝 Checklist de Verificação

Antes de tentar fazer login, verifique:

- [ ] Servidor está rodando (`npm run dev`)
- [ ] Seed foi executado (`npm run db:seed`)
- [ ] Usando a URL correta:
  - Admin: `/login`
  - Cotista: `/portal-cotista`
- [ ] Email e senha corretos (sem espaços)
- [ ] Navegador atualizado (Ctrl+Shift+R)
- [ ] Console sem erros (F12)

---

## ✅ Credenciais - RESUMO

Copie e cole exatamente como está:

### Para ADMIN:
```
URL: http://localhost:3000/login
Email: admin@vivant.com.br
Senha: admin123
```

### Para COTISTA:
```
URL: http://localhost:3000/portal-cotista
Email: joao@email.com
Senha: cotista123
```

---

## 💡 Dica Pro

**Use janelas anônimas** para testar vários usuários:

1. Janela normal: Login como admin
2. Janela anônima: Login como cotista
3. Assim você vê os dois ao mesmo tempo!

```bash
# Windows/Linux: Ctrl + Shift + N
# Mac: Cmd + Shift + N
```

---

## 🎯 Próximos Passos Após Login

### Depois de logar como ADMIN:

1. ✅ Ir para: Admin > Cotistas > Novo Convite
2. ✅ Enviar um convite de teste
3. ✅ Ver convites em: /admin/convites-pendentes
4. ✅ Gerar cobranças em: Admin > Financeiro

### Depois de logar como COTISTA:

1. ✅ Ver dashboard com estatísticas
2. ✅ Ir para: Dashboard > Calendário
3. ✅ Confirmar uma semana
4. ✅ Ver cobranças em: Dashboard > Financeiro
5. ✅ Ver avisos em: Dashboard > Avisos

---

**🎉 Se conseguiu fazer login, está tudo funcionando perfeitamente!**

Agora você pode testar todas as funcionalidades do portal.
