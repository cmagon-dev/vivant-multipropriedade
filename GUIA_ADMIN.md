# 🎯 Guia dos Painéis Administrativos

Você agora tem **DOIS painéis admin separados**, cada um com sua função específica:

---

## 1️⃣ Admin do Site Vivant

### 🔗 URL: `/admin`
**Exemplo**: `http://localhost:3000/admin`

### 📋 Função:
Gerenciar o **site institucional da Vivant** (marketing, casas, destinos)

### 🛠️ Funcionalidades:
- **Dashboard**: Visão geral do site
- **Casas**: Gerenciar propriedades para venda/divulgação
- **Destinos**: Gerenciar destinos turísticos
- **Usuários**: Gerenciar usuários do painel admin

### 🎨 Identidade Visual:
- **Logo**: Vivant (logo principal)
- **Cor primária**: Azul marinho (`#1A2F4B`)

### 👤 Acesso:
```
URL de Login: http://localhost:3000/login
Email: admin@vivant.com
Senha: admin123
```

---

## 2️⃣ Admin do Portal do Cotista

### 🔗 URL: `/admin-portal`
**Exemplo**: `http://localhost:3000/admin-portal`

### 📋 Função:
Gerenciar o **portal exclusivo dos cotistas** (multipropriedade)

### 🛠️ Funcionalidades:
- **Dashboard**: Estatísticas de cotistas e cobranças
- **Cotistas**: Gerenciar cotistas e enviar convites
- **Financeiro**: Gerar cobranças mensais (condomínio, limpeza, etc.)
- **Convites Pendentes**: Ver convites não aceitos

### 🎨 Identidade Visual:
- **Logo**: Vivant Care
- **Cor primária**: Verde (`#10B981`)

### 👤 Acesso:
```
URL de Login: http://localhost:3000/login (mesmo login!)
Email: admin@vivant.com
Senha: admin123
```

> **Nota**: Os dois painéis usam o **mesmo sistema de autenticação**. Após fazer login, você pode acessar ambos livremente.

---

## 📊 Resumo das Rotas

| Painel | URL | Função | Cor Tema |
|--------|-----|--------|----------|
| **Admin Site** | `/admin` | Gerenciar site Vivant (casas, destinos) | Azul Marinho |
| **Admin Portal** | `/admin-portal` | Gerenciar portal cotistas (cobranças, convites) | Verde |
| **Login** | `/login` | Login único para ambos os painéis | - |
| **Portal Cotista** | `/portal-cotista` | Área do cotista (usuário final) | Verde |

---

## 🚀 Como Usar

### Para gerenciar o site Vivant:
1. Acesse `http://localhost:3000/login`
2. Faça login com `admin@vivant.com`
3. Navegue até `/admin` ou use o menu lateral
4. Gerencie casas, destinos e usuários

### Para gerenciar o portal de cotistas:
1. Acesse `http://localhost:3000/login` (se não estiver logado)
2. Navegue até `/admin-portal`
3. Envie convites, gere cobranças, veja estatísticas

### Alternar entre painéis:
- Basta digitar `/admin` ou `/admin-portal` na barra de endereços
- Você permanecerá autenticado em ambos

---

## 🔐 Segurança

- **Middleware protege ambas as rotas**: Apenas admins autenticados podem acessar
- **Redirecionamento automático**: Se não estiver logado, será redirecionado para `/login`
- **Sessão única**: Uma sessão de admin funciona para ambos os painéis

---

## 🎨 Diferenças Visuais

### Admin Site (`/admin`)
```
┌─────────────────┐
│  [Logo Vivant]  │  ← Logo azul/dourado
│                 │
│  Dashboard      │
│  Casas          │  ← Menu com foco em marketing
│  Destinos       │
│  Usuários       │
└─────────────────┘
```

### Admin Portal (`/admin-portal`)
```
┌─────────────────────┐
│  [Vivant Care]      │  ← Logo verde
│  Portal do Cotista  │
│                     │
│  Dashboard          │
│  Cotistas           │  ← Menu com foco em gestão
│  Financeiro         │
│  Convites Pendentes │
└─────────────────────┘
```

---

## 📝 Notas Importantes

1. **Não confunda os painéis**:
   - `/admin` = Site institucional
   - `/admin-portal` = Gestão de cotistas

2. **Mesmo login, propósitos diferentes**:
   - Ambos usam a mesma conta admin
   - Mas gerenciam áreas completamente separadas do negócio

3. **APIs separadas**:
   - Admin Site: `/api/admin/...` (existentes)
   - Admin Portal: Usa `/api/cotistas/...` e `/api/admin/...`

---

## 🔄 Mudanças Realizadas

### O que mudou:
1. ✅ Movido `cotistas`, `financeiro` e `convites-pendentes` de `/admin` para `/admin-portal`
2. ✅ Criado sidebar e header específicos para Admin Portal (cores Vivant Care)
3. ✅ Atualizado middleware para proteger ambas as rotas
4. ✅ Corrigido todos os links internos das páginas movidas

### O que permaneceu em `/admin`:
- Dashboard do site
- Gestão de casas
- Gestão de destinos
- Gestão de usuários

---

## 🆘 Troubleshooting

### "Não consigo acessar /admin"
- Verifique se está logado como admin
- Tente limpar o cache do navegador

### "Não consigo acessar /admin-portal"
- Verifique se está logado como admin
- Certifique-se de que está usando `/admin-portal`, não `/admin/portal`

### "As páginas estão misturadas"
- Limpe o cache do Next.js: `rm -rf .next` e reinicie o servidor

---

**Tudo pronto!** Agora você tem dois painéis admin completamente separados e funcionais. 🎉
