# ✅ Próximos Passos - Portal do Cotista

## 🧪 OPÇÃO 1: Testar SEM Email (Recomendado para começar)

Se você quer **testar tudo agora** sem configurar email:

```bash
# 1. Popular banco de dados
npm run db:seed

# 2. Iniciar servidor
npm run dev

# 3. Seguir guia de testes
cat TESTE_SEM_EMAIL.md
```

📖 **Guia completo de testes:** `TESTE_SEM_EMAIL.md`

---

## 📧 OPÇÃO 2: Configurar Email Real (Para produção)

Siga este checklist para completar a configuração do portal:

## 📧 1. Configurar SMTP para Envio de Emails

### Opção Rápida (Gmail):

```bash
# 1. Acesse: https://myaccount.google.com/apppasswords
# 2. Crie uma senha de app para "Mail"
# 3. Edite o arquivo .env.local e substitua:
```

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # Cole a senha de app aqui
SMTP_FROM=care@vivant.com.br
```

📖 **Guia completo:** `docs/GUIA_SMTP.md`

---

## 🎨 2. Gerar Ícones PWA

### Executar script automático:

```bash
npm run icons:generate
```

Isso cria automaticamente todos os ícones necessários em `/public`

✅ Ícones criados:
- icon-192x192.png
- icon-512x512.png
- apple-touch-icon.png
- favicon.ico
- E mais 6 tamanhos adicionais

---

## 🌱 3. Popular Banco de Dados com Dados de Teste

### Executar seed:

```bash
npm run db:seed
```

✅ Isso cria:
- 1 usuário admin
- 2 cotistas de teste
- 2 propriedades de exemplo
- Cotas, reservas, cobranças e avisos

### 🔐 Credenciais Criadas:

**ADMIN:**
- Email: `admin@vivant.com.br`
- Senha: `admin123`
- URL: http://localhost:3000/login

**COTISTA 1:**
- Email: `joao@email.com`
- Senha: `cotista123`
- URL: http://localhost:3000/portal-cotista

**COTISTA 2:**
- Email: `maria@email.com`
- Senha: `cotista123`
- URL: http://localhost:3000/portal-cotista

---

## 🧪 4. Testar o Sistema

### 4.1 Iniciar servidor:

```bash
npm run dev
```

### 4.2 Testar fluxos principais:

#### ✅ Fluxo Admin:
1. Login em http://localhost:3000/login
2. Ir para Admin > Cotistas > Novo Convite
3. Enviar convite (verifique console para link)
4. Ir para Admin > Financeiro
5. Gerar cobranças em lote

#### ✅ Fluxo Cotista:
1. Login em http://localhost:3000/portal-cotista
2. Explorar dashboard
3. Ir para Calendário e confirmar uma semana
4. Ir para Financeiro e visualizar cobranças
5. Testar upload de comprovante

#### ✅ Fluxo Convite:
1. Pegar link do convite no console
2. Abrir link no navegador
3. Completar cadastro
4. Fazer login com nova conta

---

## 🌐 5. Configurar Domínio (Produção)

### 5.1 DNS Records:

No painel do seu provedor de domínio, configure:

```
# Apontar para Vercel
vivantcare.com.br      A/CNAME  →  [IP/CNAME do Vercel]

# Email (SPF para SendGrid)
vivantcare.com.br      TXT      →  "v=spf1 include:sendgrid.net ~all"

# DMARC
_dmarc.vivantcare.com.br  TXT   →  "v=DMARC1; p=none; rua=mailto:care@vivant.com.br"
```

### 5.2 Variáveis no Vercel:

```env
NEXTAUTH_URL=https://vivantcare.com.br
NEXT_PUBLIC_CARE_DOMAIN=vivantcare.com.br
```

---

## 🚀 6. Deploy em Produção

### Via Vercel CLI:

```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Via GitHub:

1. Conecte repositório ao Vercel
2. Configure variáveis de ambiente
3. Deploy automático a cada push

---

## 📋 Checklist Final

Antes de ir para produção, verifique:

### Configuração:
- [ ] SMTP configurado e testado
- [ ] Ícones PWA gerados
- [ ] Banco de dados populado
- [ ] Todos os fluxos testados

### Segurança:
- [ ] NEXTAUTH_SECRET é forte
- [ ] Senhas não estão no código
- [ ] Domínio verificado (SPF, DKIM)

### Performance:
- [ ] Build sem erros: `npm run build`
- [ ] Imagens otimizadas
- [ ] Lighthouse score > 90

---

## 📚 Documentação

- **Guia Completo:** `docs/GUIA_COMPLETO.md`
- **Configuração SMTP:** `docs/GUIA_SMTP.md`
- **Arquitetura:** Veja plan file no .cursor/plans/

---

## 🆘 Precisa de Ajuda?

### Comandos Úteis:

```bash
# Ver banco de dados visualmente
npm run db:studio

# Resetar banco (cuidado!)
npx prisma migrate reset

# Ver logs
tail -f .next/server.log

# Testar build de produção
npm run build && npm start
```

### Troubleshooting Comum:

**Emails não enviam:**
- Verifique credenciais SMTP no .env.local
- Teste em modo produção: `NODE_ENV=production npm run dev`

**Erro no Prisma:**
- Execute: `npx prisma generate`

**Build falha:**
- Limpe cache: `rm -rf .next`
- Reinstale: `npm install`

---

## 🎯 Próximas Melhorias (Versão 2.0)

Sugestões para expandir o portal:

- [ ] Gateway de pagamento (Stripe/Asaas)
- [ ] App nativo iOS/Android
- [ ] Sistema de chat
- [ ] Notificações push
- [ ] Google Calendar integration
- [ ] Relatórios em PDF
- [ ] Dashboard analytics avançado

---

**Versão:** 1.0.0  
**Status:** ✅ Pronto para produção  
**Desenvolvido com ❤️ pela equipe Vivant**
