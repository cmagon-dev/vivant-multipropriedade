# 🚀 Guia Completo - Portal do Cotista Vivant Care

Este guia contém todas as instruções para configurar, testar e deployar o Portal do Cotista.

## 📋 Índice

1. [Configuração Inicial](#1-configuração-inicial)
2. [Configurar Email (SMTP)](#2-configurar-email-smtp)
3. [Gerar Ícones PWA](#3-gerar-ícones-pwa)
4. [Popular Banco de Dados](#4-popular-banco-de-dados)
5. [Testar o Sistema](#5-testar-o-sistema)
6. [Configurar Domínio](#6-configurar-domínio)
7. [Deploy em Produção](#7-deploy-em-produção)

---

## 1. Configuração Inicial

### 1.1 Verificar Instalação

```bash
# Verificar Node.js
node --version  # Deve ser >= 18.0.0

# Verificar dependências
npm install

# Verificar banco de dados
npx prisma studio  # Abre interface visual do banco
```

### 1.2 Variáveis de Ambiente

O arquivo `.env.local` já está configurado com:
- ✅ Banco de dados PostgreSQL (Neon)
- ✅ Upload de arquivos (Vercel Blob)
- ✅ Autenticação (NextAuth)
- ⚠️ Email SMTP (precisa configurar)

---

## 2. Configurar Email (SMTP)

### Opção A: Gmail (Recomendado para Testes)

**1. Criar Senha de App:**
- Acesse: https://myaccount.google.com/apppasswords
- Crie senha de app para "Mail"
- Copie a senha gerada

**2. Editar `.env.local`:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_FROM=care@vivant.com.br
```

### Opção B: SendGrid (Recomendado para Produção)

**1. Criar conta:**
- Acesse: https://sendgrid.com
- Crie API Key em Settings > API Keys

**2. Editar `.env.local`:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxx.xxx
SMTP_FROM=care@vivant.com.br
```

**3. Verificar domínio (importante!):**
- Em SendGrid, vá para "Sender Authentication"
- Verifique o domínio vivant.com.br
- Configure SPF e DKIM

📖 **Guia detalhado:** Veja `docs/GUIA_SMTP.md`

---

## 3. Gerar Ícones PWA

### Opção A: Script Automático (Recomendado)

```bash
# Gera todos os ícones automaticamente
node scripts/generate-pwa-icons.js
```

Isso cria:
- ✅ icon-192x192.png
- ✅ icon-512x512.png
- ✅ apple-touch-icon.png
- ✅ favicon.ico
- ✅ Mais 6 tamanhos adicionais

### Opção B: Criar Manualmente

1. **Criar logo base (512x512px)**
   - Fundo: Gradiente verde (#10B981 → #0D9488)
   - Logo: Letra "V" branca no centro
   - Texto "CARE" embaixo (opcional)

2. **Usar ferramenta online:**
   - PWA Asset Generator: https://www.pwabuilder.com/imageGenerator
   - Favicon Generator: https://realfavicongenerator.net/

3. **Salvar em `/public`:**
   - icon-192x192.png
   - icon-512x512.png
   - apple-touch-icon.png

---

## 4. Popular Banco de Dados

### 4.1 Executar Seed

```bash
# Popular banco com dados de teste
npx prisma db seed
```

Isso cria:
- ✅ 1 Admin
- ✅ 2 Cotistas
- ✅ 2 Destinos (Gramado e Florianópolis)
- ✅ 2 Propriedades
- ✅ 2 Cotas
- ✅ Reservas de exemplo
- ✅ Cobranças de exemplo
- ✅ Avisos

### 4.2 Credenciais Criadas

**Admin:**
- Email: `admin@vivant.com.br`
- Senha: `admin123`
- URL: http://localhost:3000/login

**Cotista 1:**
- Email: `joao@email.com`
- Senha: `cotista123`
- URL: http://localhost:3000/portal-cotista

**Cotista 2:**
- Email: `maria@email.com`
- Senha: `cotista123`
- URL: http://localhost:3000/portal-cotista

### 4.3 Adicionar no package.json

Adicione ao seu `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## 5. Testar o Sistema

### 5.1 Iniciar Servidor

```bash
npm run dev
```

Acesse: http://localhost:3000

### 5.2 Testar Fluxo Admin

1. **Login Admin:**
   - Vá para: http://localhost:3000/login
   - Use: `admin@vivant.com.br` / `admin123`

2. **Enviar Convite:**
   - Vá para: Admin > Cotistas > Novo Convite
   - Preencha dados de um novo cotista
   - Clique em "Enviar Convite"
   - Verifique console para link do convite (em dev)

3. **Gerar Cobranças:**
   - Vá para: Admin > Financeiro
   - Selecione mês, tipo e valor
   - Clique em "Gerar Cobranças"

### 5.3 Testar Fluxo Cotista

1. **Login Cotista:**
   - Vá para: http://localhost:3000/portal-cotista
   - Use: `joao@email.com` / `cotista123`

2. **Explorar Dashboard:**
   - ✅ Ver estatísticas
   - ✅ Próximas reservas
   - ✅ Pagamentos pendentes

3. **Testar Calendário:**
   - Vá para: Dashboard > Calendário
   - Clique em uma semana disponível (verde)
   - Confirme a reserva
   - Veja status mudar para "Confirmada"

4. **Testar Financeiro:**
   - Vá para: Dashboard > Financeiro
   - Visualize cobranças
   - Clique em uma cobrança
   - Teste upload de comprovante

### 5.4 Testar Convite

1. **Pegar Link do Convite:**
   ```bash
   # No terminal onde rodou npm run dev, procure por:
   📧 [DEV] Email de convite: { inviteUrl: '...' }
   ```

2. **Aceitar Convite:**
   - Cole o link no navegador
   - Crie senha
   - Complete cadastro

3. **Login com Nova Conta:**
   - Use email e senha criados
   - Explore o portal

---

## 6. Configurar Domínio

### 6.1 DNS do Domínio

Configure os seguintes registros DNS:

```
# A Record (ou CNAME para Vercel)
vivantcare.com.br       →  [IP ou CNAME do Vercel]

# MX Records (para email)
vivantcare.com.br  10   →  mx1.forwardemail.net
vivantcare.com.br  20   →  mx2.forwardemail.net

# SPF (SendGrid)
vivantcare.com.br  TXT  →  "v=spf1 include:sendgrid.net ~all"

# DKIM (fornecido pelo SendGrid)
s1._domainkey.vivantcare.com.br  CNAME  →  s1.domainkey.u12345.wl.sendgrid.net

# DMARC
_dmarc.vivantcare.com.br  TXT  →  "v=DMARC1; p=none; rua=mailto:care@vivant.com.br"
```

### 6.2 Middleware (Já Configurado)

O middleware já está configurado para redirecionar:
- `vivantcare.com.br` → `/portal-cotista`
- `vivantcapital.com.br` → `/` (home capital)
- `vivantresidences.com.br` → `/residences`

### 6.3 Variáveis no Vercel

No dashboard do Vercel, adicione:

```env
NEXTAUTH_URL=https://vivantcare.com.br
NEXT_PUBLIC_CARE_DOMAIN=vivantcare.com.br
```

---

## 7. Deploy em Produção

### 7.1 Preparar para Deploy

```bash
# 1. Verificar build
npm run build

# 2. Testar produção localmente
npm start

# 3. Verificar migrations
npx prisma migrate deploy
```

### 7.2 Deploy no Vercel

**Via CLI:**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Via Git:**

1. Conecte repositório ao Vercel
2. Configure variáveis de ambiente
3. Deploy automático a cada push

### 7.3 Variáveis de Ambiente no Vercel

Adicione todas as variáveis do `.env.local`:

```
POSTGRES_URL=...
POSTGRES_PRISMA_URL=...
BLOB_READ_WRITE_TOKEN=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://vivantcare.com.br
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM=...
```

### 7.4 Executar Seed em Produção

```bash
# Via Vercel CLI
vercel env pull .env.production
npx prisma db seed --env-file .env.production
```

### 7.5 Monitoramento

**Logs:**
```bash
# Ver logs em tempo real
vercel logs

# Filtrar por erro
vercel logs --follow | grep "ERROR"
```

**Analytics:**
- Vercel Analytics: Automático
- Sentry (opcional): Para tracking de erros
- SendGrid Dashboard: Para estatísticas de email

---

## 8. Checklist Final

Antes de ir para produção:

### Segurança
- [ ] NEXTAUTH_SECRET é forte e único
- [ ] Senhas de email não estão no código
- [ ] CORS está configurado corretamente
- [ ] Rate limiting está ativo

### Email
- [ ] SMTP está funcionando
- [ ] Domínio está verificado (SPF, DKIM)
- [ ] Emails não caem em spam
- [ ] Templates estão corretos

### PWA
- [ ] Ícones estão gerados
- [ ] Manifest.json está correto
- [ ] Lighthouse score > 90

### Funcionalidades
- [ ] Login admin funciona
- [ ] Login cotista funciona
- [ ] Convites são enviados
- [ ] Calendário funciona
- [ ] Reservas funcionam
- [ ] Cobranças aparecem
- [ ] Upload de comprovante funciona

### Performance
- [ ] Build sem erros
- [ ] Lighthouse score > 90
- [ ] Imagens otimizadas
- [ ] Cache configurado

---

## 9. Troubleshooting

### Erro: "Prisma Client not generated"

```bash
npx prisma generate
```

### Erro: "Cannot find module 'sharp'"

```bash
npm install sharp --save-dev
```

### Erro: "Email not sending"

- Verifique SMTP credentials
- Teste em modo produção: `NODE_ENV=production npm run dev`
- Veja logs: `tail -f .next/server.log`

### Erro: "Unauthorized" no login

- Limpe cookies do navegador
- Verifique NEXTAUTH_SECRET
- Regenere token: `openssl rand -base64 32`

---

## 10. Suporte

### Documentação Adicional

- `docs/GUIA_SMTP.md` - Configuração detalhada de email
- `docs/ARCHITECTURE.md` - Arquitetura do sistema
- `README.md` - Visão geral do projeto

### Contatos

- **Desenvolvimento:** dev@vivant.com.br
- **Suporte:** care@vivant.com.br
- **Comercial:** contato@vivant.com.br

---

## 11. Próximas Melhorias

Funcionalidades para versão 2.0:

- [ ] Gateway de pagamento (Stripe/Asaas)
- [ ] App nativo iOS/Android
- [ ] Sistema de chat entre cotistas
- [ ] Integração com Google Calendar
- [ ] Notificações push
- [ ] Upload de múltiplos documentos
- [ ] Sistema de reviews/avaliações
- [ ] Dashboard analytics para admin
- [ ] Relatórios financeiros em PDF
- [ ] Sistema de manutenção preventiva

---

**Versão:** 1.0.0  
**Última atualização:** Fevereiro 2024  
**Desenvolvido com ❤️ pela equipe Vivant**
