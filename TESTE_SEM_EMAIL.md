# 🧪 Testando o Portal SEM Configurar Email

Este guia mostra como testar **todo o sistema** sem precisar configurar SMTP!

## 🎯 Como Funciona

Em modo de desenvolvimento, o sistema **NÃO envia emails reais**. Em vez disso:

1. ✅ Os convites são salvos no banco de dados
2. ✅ Os links aparecem no console e em uma página especial
3. ✅ Você pode copiar/abrir os links diretamente
4. ✅ Todo o fluxo funciona normalmente!

---

## 🚀 Passo a Passo para Testar

### 1. Popular o Banco de Dados

```bash
npm run db:seed
```

**Credenciais criadas:**
- **Admin:** `admin@vivant.com.br` / `admin123`
- **Cotista 1:** `joao@email.com` / `cotista123`
- **Cotista 2:** `maria@email.com` / `cotista123`

---

### 2. Iniciar o Servidor

```bash
npm run dev
```

Aguarde até ver: `✓ Ready in XXXms`

---

### 3. Testar Fluxo de Convite (SEM EMAIL!)

#### A. Fazer Login como Admin

1. Acesse: http://localhost:3000/login
2. Use: `admin@vivant.com.br` / `admin123`

#### B. Enviar Convite

1. Vá para: **Admin > Cotistas > Novo Convite**
2. Preencha:
   - Nome: `Pedro Santos`
   - Email: `pedro@teste.com`
   - CPF: `11122233344`
   - Telefone: `(11) 98888-7777`
3. Clique em **"Enviar Convite"**

#### C. Pegar o Link do Convite

Você tem **2 opções** para pegar o link:

**Opção 1: Via Console (Terminal)**

No terminal onde rodou `npm run dev`, você verá:

```
================================================================================
📧 EMAIL DE CONVITE (MODO TESTE - NÃO ENVIADO)
================================================================================

👤 Para: pedro@teste.com
📝 Nome: Pedro Santos

🔗 Link do Convite:
   http://localhost:3000/convite/abc123xyz...

💡 Para aceitar o convite:
   1. Copie o link acima
   2. Cole no navegador
   3. Ou acesse: http://localhost:3000/admin/convites-pendentes

================================================================================
```

**Opção 2: Via Página de Convites Pendentes**

1. No painel admin, vá para: http://localhost:3000/admin/convites-pendentes
2. Você verá todos os convites pendentes
3. Clique em **"Copiar Link"** ou **"Abrir Link"**

#### D. Aceitar o Convite

1. Copie o link do convite
2. Cole em uma nova aba (ou janela anônima)
3. Você verá a página de aceite do convite
4. Crie uma senha
5. Complete o cadastro

#### E. Fazer Login com Nova Conta

1. Acesse: http://localhost:3000/portal-cotista
2. Use o email e senha que você criou
3. Explore o portal! 🎉

---

## 🧪 Testes Completos

### ✅ Teste 1: Dashboard do Cotista

1. Faça login como cotista
2. Verifique:
   - Cards de estatísticas
   - Próximas reservas
   - Pagamentos pendentes
   - Avisos recentes

### ✅ Teste 2: Calendário

1. Vá para: **Dashboard > Calendário**
2. Veja as semanas disponíveis (verde)
3. Clique em uma semana
4. Confirme a reserva
5. Veja o status mudar

### ✅ Teste 3: Financeiro

1. Vá para: **Dashboard > Financeiro**
2. Veja as cobranças pendentes
3. Clique em uma cobrança
4. Teste o botão de upload de comprovante

### ✅ Teste 4: Admin - Gerar Cobranças

1. Faça login como admin
2. Vá para: **Admin > Financeiro**
3. Selecione:
   - Mês: Março
   - Ano: 2024
   - Tipo: Condomínio
   - Valor: 800
4. Clique em **"Gerar Cobranças"**
5. Vá no portal do cotista
6. Veja as novas cobranças

---

## 📊 Dados de Teste Disponíveis

Após rodar `npm run db:seed`, você tem:

### 👤 Usuários:
- **3 usuários** (1 admin + 2 cotistas)

### 🏠 Propriedades:
- **Casa Gramado Centro** (Gramado/RS)
- **Apto Floripa Beira-mar** (Florianópolis/SC)

### 📅 Reservas:
- **1 reserva confirmada** para o cotista João

### 💰 Cobranças:
- **2 cobranças pendentes** (uma para cada cotista)

### 📢 Avisos:
- **1 aviso de boas-vindas**

---

## 🔄 Resetar Banco (Se Necessário)

Se quiser começar do zero:

```bash
# CUIDADO: Isso apaga TUDO!
npx prisma migrate reset

# Depois popular novamente
npm run db:seed
```

---

## 🎨 Ver Banco Visualmente

```bash
npm run db:studio
```

Isso abre uma interface visual onde você pode:
- Ver todas as tabelas
- Editar dados manualmente
- Explorar relacionamentos
- Criar/deletar registros

---

## 🐛 Troubleshooting

### Problema: "Convite não encontrado"

**Solução:**
1. Vá para: http://localhost:3000/admin/convites-pendentes
2. Copie o link do convite de lá
3. Ou gere um novo convite

### Problema: "Link expirado"

**Solução:**
Convites expiram em 7 dias. Para testar:
1. Envie um novo convite
2. Ou edite manualmente no Prisma Studio:
   ```bash
   npm run db:studio
   ```
3. Vá em "Cotista"
4. Encontre o registro
5. Edite `inviteTokenExpiry` para uma data futura

### Problema: "Não vejo o link no console"

**Solução:**
1. Certifique-se que `NODE_ENV` não está setado como "production"
2. Ou acesse: http://localhost:3000/admin/convites-pendentes

---

## 📝 Checklist de Testes

Marque conforme for testando:

- [ ] Rodar seed do banco
- [ ] Login como admin
- [ ] Enviar convite
- [ ] Ver convite em "Convites Pendentes"
- [ ] Copiar link do convite
- [ ] Aceitar convite (criar senha)
- [ ] Login com nova conta
- [ ] Ver dashboard do cotista
- [ ] Confirmar uma reserva no calendário
- [ ] Ver cobranças no financeiro
- [ ] Testar upload de comprovante
- [ ] Login admin > Gerar cobranças
- [ ] Ver novas cobranças no portal cotista

---

## 🚀 Quando Estiver Pronto para Email Real

Depois de testar tudo, configure o SMTP:

```bash
# Ver guia completo
cat docs/GUIA_SMTP.md
```

Edite `.env.local`:

```env
# Gmail (Rápido)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=senha-de-app

# Ou SendGrid (Profissional)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxx
```

---

## 💡 Dicas

1. **Use janelas anônimas** para testar múltiplos usuários ao mesmo tempo
2. **Mantenha o console aberto** para ver os links de convite
3. **Use Prisma Studio** para explorar o banco
4. **Teste no mobile** - Abra localhost no seu celular
5. **Grave vídeos** dos testes para documentação

---

## ✅ Tudo Funcionando?

Se todos os testes passarem, seu portal está **100% funcional**!

Próximos passos:
1. [ ] Configurar SMTP para emails reais
2. [ ] Gerar ícones PWA: `npm run icons:generate`
3. [ ] Fazer deploy: `vercel --prod`

---

**🎉 Aproveite para testar à vontade sem preocupação com email!**

Quando estiver satisfeito com os testes, configure o SMTP e vá para produção.
