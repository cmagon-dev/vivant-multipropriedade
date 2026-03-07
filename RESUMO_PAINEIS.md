# 📊 Resumo dos Painéis - Vivant

## 🏢 Estrutura Completa

```
┌─────────────────────────────────────────────────────┐
│              LOGIN ÚNICO (admin)                    │
│         http://localhost:3000/login                 │
│         Email: admin@vivant.com                     │
│         Senha: admin123                             │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────────┐         ┌───────────────────┐
│   ADMIN DO SITE   │         │  ADMIN DO PORTAL  │
│     /admin        │         │  /admin-portal    │
├───────────────────┤         ├───────────────────┤
│                   │         │                   │
│ Logo: Vivant      │         │ Logo: Vivant Care │
│ Cor: Azul Marinho │         │ Cor: Verde        │
│                   │         │                   │
│ FUNCIONALIDADES:  │         │ FUNCIONALIDADES:  │
│ • Dashboard       │         │ • Dashboard       │
│ • Casas           │         │ • Cotistas        │
│ • Destinos        │         │ • Financeiro      │
│ • Usuários        │         │ • Convites        │
│                   │         │                   │
│ PROPÓSITO:        │         │ PROPÓSITO:        │
│ Gerenciar site    │         │ Gerenciar portal  │
│ institucional e   │         │ dos cotistas e    │
│ marketing         │         │ cobranças         │
└───────────────────┘         └───────────────────┘
```

---

## 🎯 Rotas Rápidas

| O que você quer fazer | URL | Descrição |
|----------------------|-----|-----------|
| **Fazer login como admin** | `/login` | Login único para ambos painéis |
| **Gerenciar casas e destinos** | `/admin` | Admin do Site Vivant |
| **Gerenciar cotistas** | `/admin-portal` | Admin do Portal do Cotista |
| **Ver como cotista** | `/portal-cotista` | Login dos cotistas |

---

## 🔑 Credenciais

### Admin (acessa ambos painéis)
```
Email: admin@vivant.com
Senha: admin123
```

### Cotista (exemplo)
```
Email: maria.silva@email.com
Senha: senha123
```

---

## 🚀 Fluxo de Trabalho

### Para gerenciar o site Vivant:
1. Acesse `/login`
2. Faça login
3. Vá para `/admin`
4. Gerencie casas, destinos

### Para gerenciar cotistas:
1. Acesse `/login` (se não estiver logado)
2. Vá para `/admin-portal`
3. Envie convites, gere cobranças

### Testar como cotista:
1. Acesse `/portal-cotista`
2. Faça login com email de cotista
3. Veja calendário, financeiro, etc.

---

## ✅ O que está funcionando

- ✅ `/login` - Login do admin (página bonita com cores Vivant Care)
- ✅ `/admin` - Admin do Site (casas, destinos, usuários)
- ✅ `/admin-portal` - Admin do Portal (cotistas, financeiro, convites)
- ✅ `/portal-cotista` - Login e dashboard dos cotistas
- ✅ Middleware protegendo todas as rotas
- ✅ Logout funcionando em todos os painéis
- ✅ Redirecionamento automático baseado em autenticação

---

## 📱 Acessos Diretos

Após fazer login como admin, você pode acessar diretamente:

- `http://localhost:3000/admin/dashboard` - Dashboard do site
- `http://localhost:3000/admin/casas` - Gerenciar casas
- `http://localhost:3000/admin/destinos` - Gerenciar destinos
- `http://localhost:3000/admin/usuarios` - Gerenciar usuários
- `http://localhost:3000/admin-portal` - Dashboard do portal
- `http://localhost:3000/admin-portal/cotistas` - Gerenciar cotistas
- `http://localhost:3000/admin-portal/financeiro` - Gestão financeira
- `http://localhost:3000/admin-portal/convites-pendentes` - Ver convites

---

## 🎨 Diferenças Visuais

### `/admin` (Site Vivant)
- Sidebar com logo Vivant azul/dourado
- Menu: Dashboard, Casas, Destinos, Usuários
- Cor primária: `#1A2F4B` (azul marinho)

### `/admin-portal` (Portal Cotista)
- Sidebar com logo Vivant Care verde
- Menu: Dashboard, Cotistas, Financeiro, Convites
- Cor primária: `#10B981` (verde)
- Texto abaixo do logo: "Portal do Cotista"

---

## 🔄 Teste Agora!

1. Abra `http://localhost:3000/login`
2. Faça login
3. Navegue para `/admin` - você verá o painel do site (azul)
4. Navegue para `/admin-portal` - você verá o painel do cotista (verde)
5. Ambos funcionam com a mesma sessão de login!

---

**Pronto para usar!** 🎉
