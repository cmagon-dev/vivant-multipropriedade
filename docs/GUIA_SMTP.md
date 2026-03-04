# 📧 Guia de Configuração SMTP

Este guia mostra como configurar o envio de emails no Portal do Cotista.

## Opções de Serviços SMTP

### 1. Gmail (Melhor para Desenvolvimento)

**Vantagens:**
- Gratuito
- Fácil de configurar
- Bom para testes

**Configuração:**

1. Acesse sua conta Google: https://myaccount.google.com/apppasswords
2. Crie uma "Senha de app" para "Mail"
3. Copie a senha gerada (16 caracteres)
4. No arquivo `.env.local`, configure:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_FROM=care@vivant.com.br
```

**Limitações:**
- Máximo 500 emails/dia
- Pode cair em spam se não verificar domínio

---

### 2. SendGrid (Melhor para Produção)

**Vantagens:**
- 100 emails/dia grátis
- Profissional e confiável
- Dashboard com estatísticas

**Configuração:**

1. Crie conta em: https://sendgrid.com
2. Vá em Settings > API Keys
3. Crie uma API Key com permissões de "Mail Send"
4. No arquivo `.env.local`:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxx.xxx
SMTP_FROM=care@vivant.com.br
```

5. **Importante:** Verifique seu domínio em "Sender Authentication"

---

### 3. Resend (Mais Moderno)

**Vantagens:**
- Interface moderna
- 100 emails/dia grátis
- Fácil integração

**Configuração:**

1. Crie conta em: https://resend.com
2. Crie uma API Key
3. No arquivo `.env.local`:

```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASSWORD=re_xxxxx
SMTP_FROM=care@vivant.com.br
```

---

### 4. Amazon SES (Para Grande Volume)

**Vantagens:**
- Muito barato ($0.10 por 1000 emails)
- Altamente escalável
- Integrado com AWS

**Configuração:**

1. Configure no AWS Console
2. Obtenha credenciais SMTP
3. Configure no `.env.local`:

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=suas-credenciais
SMTP_PASSWORD=sua-senha
SMTP_FROM=care@vivant.com.br
```

---

## Verificação de Domínio

Para melhorar a entrega e evitar spam:

1. **SPF Record:** Adicione no DNS do domínio
```
v=spf1 include:_spf.google.com ~all  # Gmail
v=spf1 include:sendgrid.net ~all     # SendGrid
```

2. **DKIM:** Configure no provedor de email

3. **DMARC:** Configure política de email
```
_dmarc.vivant.com.br TXT "v=DMARC1; p=none; rua=mailto:care@vivant.com.br"
```

---

## Testando os Emails

### Modo Desenvolvimento

Em desenvolvimento, os emails não são enviados, apenas logados no console:

```bash
npm run dev

# No console você verá:
# 📧 [DEV] Email de convite: { to: 'teste@email.com', inviteUrl: '...' }
```

### Modo Produção

Para testar em produção local:

```bash
# 1. Remova NODE_ENV=development ou defina como production
NODE_ENV=production npm run dev

# 2. Ou teste diretamente a API
curl -X POST http://localhost:3000/api/cotistas/invite \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com","cpf":"12345678900"}'
```

---

## Troubleshooting

### Erro: "Invalid login"
- Verifique se o SMTP_USER e SMTP_PASSWORD estão corretos
- No Gmail, certifique-se de usar "Senha de app" e não sua senha normal

### Erro: "Connection timeout"
- Verifique se a SMTP_PORT está correta (587 para TLS, 465 para SSL)
- Alguns provedores de internet bloqueiam a porta 587

### Emails caindo em spam
- Verifique o domínio (SPF, DKIM, DMARC)
- Use um domínio profissional no SMTP_FROM
- Evite palavras como "ganhe", "grátis" no assunto

### Rate limit excedido
- Gmail: máx 500/dia
- SendGrid free: máx 100/dia
- Considere upgrade ou múltiplas contas

---

## Monitoramento

### SendGrid Dashboard
- Taxa de entrega
- Aberturas e cliques
- Bounces e reclamações

### Logs do Sistema
```bash
# Ver logs do servidor
tail -f .next/server.log

# Ver apenas emails
tail -f .next/server.log | grep "Email"
```

---

## Recomendação Final

**Para Desenvolvimento:**
- Use Gmail com senha de app

**Para Produção:**
- Use SendGrid (gratuito até 100/dia) ou Resend
- Configure verificação de domínio
- Monitore taxa de entrega

**Para Alto Volume:**
- Amazon SES (mais barato)
- SendGrid pago
- Mailgun
