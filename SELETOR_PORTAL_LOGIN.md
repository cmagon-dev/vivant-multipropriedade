# 🎯 Seletor de Portal no Login

Agora a página de login `/login` permite **selecionar qual painel** você quer acessar antes de fazer login!

---

## 🆕 Nova Funcionalidade

### 📍 Local: `/login`

Quando você acessa `http://localhost:3000/login`, verá:

```
┌─────────────────────────────────────────┐
│           Login Administrativo           │
├─────────────────────────────────────────┤
│                                          │
│  Selecione o Painel:                    │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ 🏢 Admin Site│  │ 👥 Admin Portal│   │
│  │ Casas e     │  │ Gestão de      │   │
│  │ destinos    │  │ cotistas       │   │
│  └──────────────┘  └──────────────┘    │
│                                          │
│  E-mail: [__________________]           │
│  Senha:  [__________________]           │
│                                          │
│  [Entrar no Admin Site/Portal] →        │
│                                          │
│  ℹ️ Você será redirecionado para...     │
│     → /admin/dashboard ou /admin-portal │
└─────────────────────────────────────────┘
```

---

## 🎨 Como Funciona

### 1️⃣ **Seleção de Portal**

Você verá **dois cards** para escolher:

#### 🏢 **Admin Site** (Padrão - AZUL)
- **Ícone**: Prédio
- **Título**: "Admin Site"
- **Subtítulo**: "Casas e destinos"
- **Cor**: Azul marinho quando selecionado
- **Redireciona para**: `/admin/dashboard`

#### 👥 **Admin Portal** (VERDE)
- **Ícone**: Usuários
- **Título**: "Admin Portal"
- **Subtítulo**: "Gestão de cotistas"
- **Cor**: Verde quando selecionado
- **Redireciona para**: `/admin-portal`

### 2️⃣ **Indicadores Visuais**

O sistema mostra claramente qual painel você selecionou:

#### Quando **Admin Site** está selecionado:
- ✅ Card do Admin Site com **borda azul** e fundo azul claro
- ✅ Botão de login **AZUL** com texto "Entrar no Admin Site"
- ✅ Info box **AZUL** mostrando "→ /admin/dashboard"

#### Quando **Admin Portal** está selecionado:
- ✅ Card do Admin Portal com **borda verde** e fundo verde claro
- ✅ Botão de login **VERDE** com texto "Entrar no Admin Portal"
- ✅ Info box **VERDE** mostrando "→ /admin-portal"

### 3️⃣ **Após o Login**

- Se selecionou **Admin Site** → Vai para `/admin/dashboard`
- Se selecionou **Admin Portal** → Vai para `/admin-portal`

---

## 🚀 Como Usar

### Cenário 1: Gerenciar Casas e Destinos

1. Acesse `http://localhost:3000/login`
2. **Clique no card "Admin Site"** (ícone de prédio)
3. Digite email: `admin@vivant.com`
4. Digite senha: `admin123`
5. Clique em **"Entrar no Admin Site"** (botão azul)
6. ✅ Será redirecionado para `/admin/dashboard`
7. Gerencie casas, destinos, usuários

### Cenário 2: Gerenciar Cotistas

1. Acesse `http://localhost:3000/login`
2. **Clique no card "Admin Portal"** (ícone de usuários)
3. Digite email: `admin@vivant.com`
4. Digite senha: `admin123`
5. Clique em **"Entrar no Admin Portal"** (botão verde)
6. ✅ Será redirecionado para `/admin-portal`
7. Gerencie cotistas, financeiro, convites

---

## 🎯 Vantagens

### ✅ Clareza
- Você sabe exatamente para onde será redirecionado
- Cores diferentes ajudam a identificar rapidamente

### ✅ Flexibilidade
- Mesmo login serve para ambos os painéis
- Escolha qual área quer acessar sem precisar lembrar URLs diferentes

### ✅ Experiência Visual
- Botão muda de cor baseado na seleção
- Info box mostra a URL de destino
- Cards interativos com hover e seleção clara

---

## 📊 Comparação Visual

### Seleção: Admin Site
```
┌───────────────────────┐
│ [🏢 Admin Site]       │ ← AZUL (selecionado)
│ Casas e destinos      │
└───────────────────────┘
┌───────────────────────┐
│  👥 Admin Portal      │ ← Cinza (não selecionado)
│  Gestão de cotistas   │
└───────────────────────┘

Botão: [🏢 Entrar no Admin Site →] (AZUL)
Info:  🏢 Admin do Site
       → /admin/dashboard
```

### Seleção: Admin Portal
```
┌───────────────────────┐
│  🏢 Admin Site        │ ← Cinza (não selecionado)
│  Casas e destinos     │
└───────────────────────┘
┌───────────────────────┐
│ [👥 Admin Portal]     │ ← VERDE (selecionado)
│ Gestão de cotistas    │
└───────────────────────┘

Botão: [👥 Entrar no Admin Portal →] (VERDE)
Info:  👥 Admin do Portal
       → /admin-portal
```

---

## 🔄 Alternar Depois do Login

Se você fez login no painel errado, não tem problema!

### Dentro de `/admin`:
- Clique em **"Admin Portal"** (botão verde no header)
- Ou clique no card verde na sidebar

### Dentro de `/admin-portal`:
- Clique em **"Admin Site"** (botão no header)
- Ou clique no card azul na sidebar

---

## 📝 Resumo

| Elemento | Admin Site | Admin Portal |
|----------|-----------|--------------|
| **Cor do card selecionado** | Azul marinho | Verde |
| **Ícone** | 🏢 Prédio | 👥 Usuários |
| **Texto do botão** | "Entrar no Admin Site" | "Entrar no Admin Portal" |
| **Cor do botão** | Azul | Verde |
| **Redireciona para** | `/admin/dashboard` | `/admin-portal` |
| **Gerencia** | Casas, destinos | Cotistas, financeiro |

---

## ✅ Benefícios

1. **Não precisa lembrar URLs diferentes** → Sempre use `/login`
2. **Visual claro** → Cores diferentes para cada painel
3. **Confirmação antes de entrar** → Info box mostra para onde vai
4. **Flexibilidade** → Mesmo usuário, múltiplos painéis
5. **Fácil alternância** → Links dentro dos painéis para trocar

---

## 🧪 Teste Agora!

1. Acesse `http://localhost:3000/login`
2. Veja os dois cards (Admin Site e Admin Portal)
3. Clique em um deles e veja o botão mudar de cor
4. Faça login e veja o redirecionamento correto!

**A experiência está muito mais intuitiva agora!** 🎉
