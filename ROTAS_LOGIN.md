# 🔐 Guia de Rotas de Login

## Rotas Disponíveis

### 1. **Login Administrativo (Admin)**
```
URL: http://localhost:3000/login
```
- **Para quem**: Administradores do sistema
- **Provider**: `admin-credentials`
- **Credenciais de teste**:
  - Email: `admin@vivant.com`
  - Senha: `admin123`
- **Após login**: Redireciona para `/admin/dashboard`
- **Acesso aos painéis**:
  - `/admin` - Admin do Site Vivant (casas, destinos)
  - `/admin-portal` - Admin do Portal do Cotista (cotistas, financeiro)

---

### 2. **Portal do Cotista**
```
URL: http://localhost:3000/portal-cotista
```
- **Para quem**: Cotistas/proprietários
- **Provider**: `cotista-credentials`
- **Credenciais de teste** (use qualquer um dos cotistas do seed):
  - Email: `maria.silva@email.com` | Senha: `senha123`
  - Email: `joao.santos@email.com` | Senha: `senha123`
  - Email: `ana.oliveira@email.com` | Senha: `senha123`
- **Após login**: Redireciona para `/dashboard` (dashboard do cotista)

---

## Comportamento do Middleware

### Se você **NÃO** está autenticado:
- `/login` → Mostra página de login do admin ✅
- `/portal-cotista` → Mostra página de login do cotista ✅

### Se você **JÁ** está autenticado:
- **Admin acessando `/login`** → Redireciona para `/admin/dashboard`
- **Cotista acessando `/portal-cotista`** → Redireciona para `/dashboard`

---

## Troubleshooting

### "Não consigo acessar /login"
1. Limpe o cache do navegador (Ctrl + Shift + Delete)
2. Abra em aba anônima
3. Verifique se o servidor está rodando (`npm run dev`)
4. Certifique-se de que está acessando `http://localhost:3000/login` (não `/admin/login`)

### "Sou redirecionado automaticamente"
- Isso é esperado! Significa que você já está autenticado
- **Solução**: Clique em "Sair" no dashboard atual, ou limpe os cookies do navegador

### "Email ou senha incorretos"
- Verifique se está usando as credenciais corretas
- **Admin**: Use `/login` com `admin@vivant.com`
- **Cotista**: Use `/portal-cotista` com um dos emails de cotista

---

## Comandos Úteis

### Resetar banco de dados com dados de teste:
```bash
npm run db:push
npm run db:seed
```

### Ver banco de dados:
```bash
npm run db:studio
```

### Ver logs do servidor:
Observe o terminal onde `npm run dev` está rodando para ver erros de autenticação.
