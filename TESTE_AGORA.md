# 🧪 Teste Imediato - Verificar Logins

## ⚠️ IMPORTANTE: Limpe o Cache Primeiro!

Antes de testar, faça isso:

### 1. Pare o servidor
```bash
Ctrl + C (no terminal onde está rodando npm run dev)
```

### 2. Limpe o cache do Next.js
```bash
Remove-Item -Recurse -Force .next
```

### 3. Reinicie o servidor
```bash
npm run dev
```

### 4. Limpe o cache do navegador
- Pressione `Ctrl + Shift + Delete`
- Ou abra uma **aba anônima/privada**

---

## ✅ Teste 1: Login Admin

### Passo a passo:
1. Abra: `http://localhost:3000/login`

### O que você DEVE ver:
- ✅ **Fundo ESCURO** (azul marinho/cinza escuro)
- ✅ **Logo "VIVANT"** (não Vivant Care)
- ✅ **Badge DOURADO** escrito "Painel Administrativo"
- ✅ **Título**: "Bem-vindo ao Painel Vivant"
- ✅ **Card com gradiente AZUL MARINHO**
- ✅ **Título do card**: "Login Administrativo"
- ✅ **Botão AZUL MARINHO**

### O que você NÃO deve ver:
- ❌ Fundo claro/branco
- ❌ Logo Vivant Care
- ❌ Cores verdes
- ❌ Texto "Portal do Cotista"
- ❌ Texto "Vivant Care"

### Credenciais:
```
Email: admin@vivant.com
Senha: admin123
```

### Após login:
- Você será redirecionado para `/admin/dashboard`

---

## ✅ Teste 2: Portal do Cotista

### Passo a passo:
1. Se estiver logado, clique em "Sair"
2. Abra: `http://localhost:3000/portal-cotista`

### O que você DEVE ver:
- ✅ **Fundo CLARO** (branco/cinza claro)
- ✅ **Logo "VIVANT CARE"**
- ✅ **Badge VERDE** escrito "Portal do Cotista"
- ✅ **Título**: "Bem-vindo ao seu Portal Vivant Care"
- ✅ **Card com gradiente VERDE**
- ✅ **Título do card**: "Acesse sua Conta"
- ✅ **Botão VERDE**

### O que você NÃO deve ver:
- ❌ Fundo escuro
- ❌ Logo Vivant (sem "Care")
- ❌ Cores azul marinho/dourado
- ❌ Texto "Painel Administrativo"

### Credenciais:
```
Email: maria.silva@email.com
Senha: senha123
```

### Após login:
- Você será redirecionado para `/dashboard` (dashboard do cotista)

---

## 🎯 Teste 3: Alternância de Painéis Admin

### Passo a passo:
1. Faça login como admin em `/login`
2. Acesse `http://localhost:3000/admin`
3. Acesse `http://localhost:3000/admin-portal`

### O que você DEVE ver:
- ✅ `/admin` → **Sidebar com logo Vivant azul**, menu: Dashboard, Casas, Destinos, Usuários
- ✅ `/admin-portal` → **Sidebar com logo Vivant Care VERDE**, menu: Dashboard, Cotistas, Financeiro, Convites

---

## 🔴 Se Algo Estiver Errado

### Se `/login` ainda mostra tela verde:
1. Pare o servidor completamente
2. Delete a pasta `.next`:
   ```bash
   Remove-Item -Recurse -Force .next
   ```
3. Limpe node_modules (opcional, se necessário):
   ```bash
   Remove-Item -Recurse -Force node_modules
   npm install
   ```
4. Reinicie:
   ```bash
   npm run dev
   ```
5. Abra em **aba anônima**

### Se o problema persistir:
1. Verifique qual arquivo está sendo carregado
2. Tire uma screenshot e mostre

---

## 📸 Comparação Visual Esperada

### `/login` (Admin) - Deve parecer:
```
┌─────────────────────────────────────────┐
│  Fundo: ESCURO (azul marinho)           │
│  ┌─────────────────────────────────┐    │
│  │ Logo: VIVANT (azul)             │    │
│  │ Badge: 🏅 Painel Administrativo │    │
│  │ Título: Bem-vindo ao Painel...  │    │
│  │ Card: AZUL MARINHO              │    │
│  │ Botão: AZUL MARINHO             │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### `/portal-cotista` (Cotista) - Deve parecer:
```
┌─────────────────────────────────────────┐
│  Fundo: CLARO (branco)                  │
│  ┌─────────────────────────────────┐    │
│  │ Logo: VIVANT CARE (verde)       │    │
│  │ Badge: 💚 Portal do Cotista     │    │
│  │ Título: Bem-vindo ao Portal...  │    │
│  │ Card: VERDE                     │    │
│  │ Botão: VERDE                    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist Final

- [ ] Limpei o cache do Next.js (`.next`)
- [ ] Reiniciei o servidor
- [ ] Abri em aba anônima
- [ ] `/login` mostra tela AZUL ESCURA
- [ ] `/portal-cotista` mostra tela VERDE CLARA
- [ ] Login admin funciona
- [ ] Login cotista funciona
- [ ] Consigo acessar `/admin` e `/admin-portal`

---

**Teste agora e me avise o resultado!** 🚀
