# 🔐 Credenciais de Login - Vivant Multipropriedade

**Última Atualização:** 04/03/2026 - 13:11

---

## 👨‍💼 ADMIN (Gestão de Conteúdo)

### Login
- **URL:** https://vivantresidences.com.br/login
- **Email:** `admin@vivant.com.br`
- **Senha:** `admin123`

### Acesso
- Painel Admin Site: `/admin/*`
- Portal Admin: `/admin-portal/*`

---

## 👥 COTISTAS (Portal do Cotista)

### Cotista 1 - João da Silva
- **URL:** https://vivantcare.com.br
- **Email:** `joao@email.com`
- **Senha:** `cotista123`

### Cotista 2 - Maria Oliveira
- **URL:** https://vivantcare.com.br
- **Email:** `maria@email.com`
- **Senha:** `cotista123`

### Cotista 3 - Caio Magon
- **URL:** https://vivantcare.com.br
- **Email:** `cmagon@glocon.com.br`
- **CPF:** `079.461.789-13`
- **Telefone:** `(44) 98809-7007`
- **Senha:** `cotista123`

---

## 🔍 Como Testar

### 1. Teste de Login Admin
1. Acesse: https://vivantresidences.com.br/login
2. Digite: `admin@vivant.com.br` / `admin123`
3. Deve redirecionar para: `/admin/dashboard`

### 2. Teste de Login Cotista
1. Acesse: https://vivantcare.com.br
2. Digite: `cmagon@glocon.com.br` / `cotista123`
3. Deve redirecionar para: `/dashboard`

### 3. Teste de Navegação
- Verifique se os menus funcionam
- Teste criar um novo destino/casa (admin)
- Teste visualizar cobranças (cotista)

---

## ⚠️ IMPORTANTE

### Após Primeiro Acesso
**ALTERE IMEDIATAMENTE a senha do admin!**

1. Faça login como admin
2. Vá em `/admin/usuarios`
3. Edite o usuário admin
4. Mude a senha para algo seguro

### Problemas?
Se ainda tiver problemas com login:

1. Limpe o cache do navegador (Ctrl+Shift+Del)
2. Abra uma janela anônima/privada
3. Tente novamente

---

## 📊 Dados de Teste Criados

### Destinos
- ✅ Gramado
- ✅ Florianópolis

### Propriedades
- ✅ Casa Gramado Centro (6 cotas)
- ✅ Apto Floripa Beira-mar (8 cotas)

### Cotas Alocadas
- ✅ Cota 1 de Casa Gramado → Caio Magon
- ✅ Cota 1 de Apto Floripa → Caio Magon

### Cobranças
- ✅ Condomínio Março/2024 (todos os cotistas)

### Reservas
- ✅ Semana 2 para Caio Magon

### Avisos
- ✅ Aviso de boas-vindas

---

## 🚀 URLs dos Sites

- **Residences (Marketing):** https://vivantresidences.com.br
- **Capital (Investimentos):** https://vivantcapital.com.br
- **Care (Portal Cotista):** https://vivantcare.com.br

---

## 🔧 Comandos Úteis

### Ver logs do deploy atual
```bash
vercel logs vivant-multipropriedade-g8zmxomka-caio-magons-projects.vercel.app
```

### Conectar ao banco localmente
```bash
npx prisma studio
```

### Resetar banco (CUIDADO!)
```bash
npm run db:seed
```

---

**Última URL de Deploy:** https://vivant-multipropriedade-g8zmxomka-caio-magons-projects.vercel.app
