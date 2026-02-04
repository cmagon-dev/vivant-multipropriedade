# ⚡ Quick Start - Sistema Multi-Domínio Vivant

> **Guia rápido para colocar o sistema no ar em 5 minutos**

---

## 🚀 Início Rápido

### 1️⃣ Configure os Domínios Locais (2 min)

#### No Windows:
```powershell
# Execute como Administrador
notepad C:\Windows\System32\drivers\etc\hosts
```

#### No Mac/Linux:
```bash
sudo nano /etc/hosts
```

**Adicione estas linhas no final do arquivo:**

```
127.0.0.1 vivantcapital.com.br
127.0.0.1 vivantcare.com.br
127.0.0.1 vivantresidences.com.br
```

**Salve e feche** ✅

---

### 2️⃣ Instale as Dependências (1 min)

```bash
npm install
```

---

### 3️⃣ Inicie o Servidor (30 segundos)

```bash
npm run dev
```

Aguarde aparecer:

```
✓ Ready in 2.5s
○ Local:    http://localhost:3000
```

---

### 4️⃣ Teste os 3 Domínios (1 min)

Abra seu navegador e acesse:

#### 🏦 Vivant Capital
```
http://vivantcapital.com.br:3000
```
**Esperado:** Página do Simulador de Análise Financeira

---

#### 🏠 Vivant Care
```
http://vivantcare.com.br:3000
```
**Esperado:** Portal do Cotista (3 cards: Calendário, Boletos, Concierge)

---

#### 🏡 Vivant Residences
```
http://vivantresidences.com.br:3000
```
**Esperado:** Home de Marketing (página padrão)

---

## ✅ Checklist de Verificação

Confirme que você vê:

- [ ] **Capital:** Header mostra "Vivant Capital"
- [ ] **Care:** 3 cards com ícones (📅 📄 ✨)
- [ ] **Residences:** Landing page de marketing
- [ ] **Cor predominante:** Azul Navy (#1A2F4B)
- [ ] **Fonte dos títulos:** Playfair Display (serif elegante)

---

## 🎨 Visual Reference

### Vivant Capital
```
┌─────────────────────────────────────┐
│  Vivant Capital                      │
│  Análise de viabilidade...           │
├─────────────────────────────────────┤
│                                      │
│  Simulador de Análise Financeira    │
│                                      │
│  [Formulário de entrada]             │
│  [Resultados da análise]             │
│                                      │
└─────────────────────────────────────┘
```

### Vivant Care
```
┌─────────────────────────────────────┐
│  Vivant Care                         │
│  Portal exclusivo para cotistas...   │
├─────────────────────────────────────┤
│                                      │
│  Portal do Cotista                   │
│                                      │
│  ┌───────┐  ┌───────┐  ┌───────┐   │
│  │ 📅    │  │ 📄    │  │ ✨    │   │
│  │Calendá│  │Boletos│  │Concie │   │
│  │ rio   │  │       │  │ rge   │   │
│  └───────┘  └───────┘  └───────┘   │
│                                      │
└─────────────────────────────────────┘
```

### Vivant Residences
```
┌─────────────────────────────────────┐
│  [Landing Page Marketing Existente]  │
│                                      │
│  Hero Section                        │
│  Features                            │
│  CTAs                                │
│                                      │
└─────────────────────────────────────┘
```

---

## 🐛 Problemas Comuns

### ❌ Problema: Não consigo acessar vivantcapital.com.br:3000

**Solução 1:** Verifique se editou o arquivo hosts corretamente
```bash
# Teste se o DNS está resolvendo
ping vivantcapital.com.br
```
Deve retornar: `127.0.0.1`

**Solução 2:** Limpe o cache DNS
```bash
# Windows
ipconfig /flushdns

# Mac
sudo dscacheutil -flushcache

# Linux
sudo systemd-resolve --flush-caches
```

**Solução 3:** Reinicie o navegador completamente

---

### ❌ Problema: Vejo a mesma página em todos os domínios

**Causa:** Middleware não está executando

**Solução:** 
1. Pare o servidor (`Ctrl+C`)
2. Delete a pasta `.next`:
   ```bash
   # Windows
   rmdir /s .next
   
   # Mac/Linux
   rm -rf .next
   ```
3. Reinicie:
   ```bash
   npm run dev
   ```

---

### ❌ Problema: Build falha

**Causa:** Possível erro de dependências

**Solução:**
```bash
# Limpe tudo e reinstale
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📱 Teste em Mobile

### Opção 1: Usando IP Local

1. Descubra seu IP local:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
   Exemplo: `192.168.1.100`

2. Edite o arquivo hosts do seu celular (requer root/jailbreak) ou use:

### Opção 2: Usando ngrok (Recomendado)

```bash
# Instale ngrok
npm install -g ngrok

# Exponha o servidor
ngrok http 3000 --host-header=vivantcare.com.br

# Use a URL gerada no seu celular
```

---

## 🎯 Próximos Passos

Agora que está rodando:

1. **Explore o código:**
   - `middleware.ts` → Roteamento
   - `lib/domain.ts` → Detecção de marca
   - `app/(dashboard)/portal-cotista/page.tsx` → Portal novo

2. **Leia a documentação:**
   - `MULTI_DOMAIN_SETUP.md` → Visão técnica
   - `DEV_GUIDE.md` → Guia do desenvolvedor

3. **Customize:**
   - Cores em `tailwind.config.ts`
   - Adicione features no Portal do Cotista
   - Implemente as rotas de calendário/boletos/concierge

---

## 🏁 Build para Produção

Quando estiver pronto para deploy:

```bash
# 1. Teste o build local
npm run build
npm run start

# 2. Acesse para testar:
http://vivantcare.com.br:3000

# 3. Se tudo funcionar, faça deploy!
# (Vercel, Railway, DigitalOcean, etc.)
```

---

## 🆘 Precisa de Ajuda?

**Documentação completa:**
- 📘 `RESUMO_EXECUTIVO.md` → Visão geral
- 📗 `MULTI_DOMAIN_SETUP.md` → Detalhes técnicos
- 📙 `DEV_GUIDE.md` → Guia prático

**Debug:**
```bash
# Ver erros de tipo
npx tsc --noEmit

# Ver warnings de lint
npm run lint

# Build completo
npm run build
```

---

## ✨ Dicas de Ouro

1. **Use o DevTools do navegador:**
   - Inspecione o `<title>` da página
   - Veja os metadados OpenGraph
   - Console para ver erros

2. **Teste em múltiplas abas:**
   - Abra os 3 domínios simultaneamente
   - Verifique que cada um mostra conteúdo diferente

3. **Hot Reload funcionando:**
   - Edite qualquer arquivo
   - Veja as mudanças instantaneamente
   - Não precisa reiniciar o servidor

---

**Parabéns! Seu sistema multi-domínio está rodando! 🎉**

*Tempo estimado: 5 minutos | Dificuldade: ⭐⭐☆☆☆*
