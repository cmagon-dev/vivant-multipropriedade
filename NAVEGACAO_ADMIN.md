# 🧭 Navegação Entre os Painéis Admin

Agora você pode **alternar facilmente** entre os dois painéis administrativos!

---

## 📍 No Admin do Site (`/admin`)

Quando você está em `/admin` (gerenciando casas e destinos), você encontra **DOIS locais** para acessar o Admin Portal:

### 1️⃣ **No Header (topo da página)**
- ✅ Botão **VERDE** escrito **"Admin Portal"**
- Localização: **Canto superior direito**, ao lado de "Ver Site" e "Sair"

### 2️⃣ **Na Sidebar (menu lateral esquerdo)**
- ✅ Card **VERDE** destacado no final do menu
- Título: **"Portal Cotistas"**
- Subtítulo: "Gestão de cotistas"
- Ícone: Usuários
- Localização: **Após o separador**, no final da lista de menu

---

## 📍 No Admin Portal (`/admin-portal`)

Quando você está em `/admin-portal` (gerenciando cotistas), você encontra **DOIS locais** para voltar ao Admin do Site:

### 1️⃣ **No Header (topo da página)**
- ✅ Botão com borda **AZUL** escrito **"Admin Site"**
- Localização: **Canto superior direito**, antes das notificações

### 2️⃣ **Na Sidebar (menu lateral esquerdo)**
- ✅ Card **AZUL MARINHO** destacado no final do menu
- Título: **"Admin Site"**
- Subtítulo: "Casas e destinos"
- Ícone: Prédio
- Localização: **Após o separador**, no final da lista de menu

---

## 🎯 Visualização

### Admin do Site → Admin Portal

```
┌────────────────────────────────────────────┐
│  [Admin do Site]  [Admin Portal] [Sair]    │ ← No header
└────────────────────────────────────────────┘
┌──────────┐
│ Vivant   │
│          │
│ • Dashboard
│ • Casas
│ • Destinos
│ • Usuários
│ ──────────
│ ┌────────────────┐
│ │ 🟢 Portal Cotistas │  ← Na sidebar
│ │ Gestão de cotistas │
│ └────────────────┘
│
│ [Usuário]
└──────────┘
```

### Admin Portal → Admin do Site

```
┌────────────────────────────────────────────┐
│  [Admin Site] [Notif] [Usuário] [Sair]     │ ← No header
└────────────────────────────────────────────┘
┌──────────────┐
│ Vivant Care  │
│ Portal       │
│              │
│ • Dashboard
│ • Cotistas
│ • Financeiro
│ • Convites
│ ──────────────
│ ┌────────────────┐
│ │ 🔵 Admin Site    │  ← Na sidebar
│ │ Casas e destinos │
│ └────────────────┘
│
│ [Usuário]
└──────────────┘
```

---

## 🚀 Como Usar

### Cenário 1: Você está gerenciando casas e precisa verificar cotistas

1. Você está em `/admin/casas`
2. Clique no botão verde **"Admin Portal"** (header) ou no card verde da sidebar
3. Será levado para `/admin-portal`
4. Gerencie cotistas, financeiro, convites
5. Clique em **"Admin Site"** para voltar

### Cenário 2: Você está gerenciando cotistas e precisa adicionar uma casa

1. Você está em `/admin-portal/cotistas`
2. Clique no botão **"Admin Site"** (header) ou no card azul da sidebar
3. Será levado para `/admin`
4. Acesse `/admin/casas` para gerenciar casas
5. Clique em **"Admin Portal"** para voltar aos cotistas

---

## ✅ Checklist Visual

Quando estiver em **Admin do Site** (`/admin`), você deve ver:
- [ ] Logo "Vivant" (azul) no topo da sidebar
- [ ] Menu: Dashboard, Casas, Destinos, Usuários
- [ ] Card verde "Portal Cotistas" no final da sidebar
- [ ] Botão verde "Admin Portal" no header

Quando estiver em **Admin Portal** (`/admin-portal`), você deve ver:
- [ ] Logo "Vivant Care" (verde) no topo da sidebar
- [ ] Texto "Portal do Cotista" abaixo do logo
- [ ] Menu: Dashboard, Cotistas, Financeiro, Convites
- [ ] Card azul "Admin Site" no final da sidebar
- [ ] Botão "Admin Site" no header

---

## 🎨 Diferenças Visuais Rápidas

| Elemento | Admin Site | Admin Portal |
|----------|-----------|--------------|
| **Logo** | Vivant (azul) | Vivant Care (verde) |
| **Cor tema** | Azul marinho | Verde |
| **Botão de alternância** | Verde "Admin Portal" | Azul "Admin Site" |
| **Card na sidebar** | Verde (Portal Cotistas) | Azul (Admin Site) |
| **Menu** | Casas, Destinos | Cotistas, Financeiro |

---

## 📝 Resumo

- ✅ **No header**: Sempre tem um botão para alternar
- ✅ **Na sidebar**: Card destacado no final do menu
- ✅ **Cores diferentes**: Verde = Portal, Azul = Site
- ✅ **Navegação fácil**: Um clique para alternar

**Agora você pode gerenciar tudo facilmente!** 🎉
