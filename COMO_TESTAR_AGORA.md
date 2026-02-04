# ✅ COMO TESTAR O SISTEMA (ATUALIZADO)

## 🚀 STATUS ATUAL

✅ **Servidor rodando na porta 3001**  
✅ **Middleware corrigido**  
✅ **Pronto para testar**

---

## 📍 TESTE RÁPIDO - SEM CONFIGURAR DOMÍNIOS

### 1. Acesse a Home (Vivant Residences)

Abra seu navegador e vá para:

```
http://localhost:3001
```

**Esperado:** Landing page de marketing da Vivant Residences

---

### 2. Acesse o Simulador (Vivant Capital)

```
http://localhost:3001/dashboard/simulador
```

**Esperado:** Simulador de Análise Financeira

---

### 3. Acesse o Portal do Cotista (Vivant Care)

```
http://localhost:3001/portal-cotista
```

**Esperado:** 3 cards (📅 Calendário, 📄 Boletos, ✨ Concierge)

---

## 🌐 TESTE COMPLETO - COM DOMÍNIOS PERSONALIZADOS

Se quiser testar o sistema multi-domínio completo:

### Passo 1: Configure o arquivo hosts

**Windows:**
1. Abra o Bloco de Notas como **Administrador**
2. Abra o arquivo: `C:\Windows\System32\drivers\etc\hosts`
3. Adicione no final:

```
127.0.0.1 vivantcapital.com.br
127.0.0.1 vivantcare.com.br
127.0.0.1 vivantresidences.com.br
```

4. Salve e feche

### Passo 2: Acesse os domínios

```
http://vivantcapital.com.br:3001    → Simulador
http://vivantcare.com.br:3001       → Portal do Cotista
http://vivantresidences.com.br:3001 → Home Marketing
```

---

## 🔍 VERIFICANDO SE ESTÁ FUNCIONANDO

### ✅ Checklist Visual

Quando acessar cada página, confirme:

#### Home (localhost:3001)
- [ ] Vê a navbar do Vivant
- [ ] Hero section com imagem de casa de luxo
- [ ] Texto sobre multipropriedade

#### Simulador (/dashboard/simulador)
- [ ] Header mostra "Vivant Capital"
- [ ] Formulário de entrada à esquerda
- [ ] Área de resultados à direita
- [ ] Cores em azul navy (#1A2F4B)

#### Portal do Cotista (/portal-cotista)
- [ ] Título "Portal do Cotista"
- [ ] 3 cards com ícones
- [ ] Card 1: 📅 Calendário de Uso
- [ ] Card 2: 📄 Meus Boletos/Extrato
- [ ] Card 3: ✨ Solicitar Concierge
- [ ] Botão "Acessar" em cada card
- [ ] Rodapé com "Suporte Premium"

---

## 🐛 SE NÃO FUNCIONAR

### Problema: Página não carrega

**Solução 1:** Pare e reinicie o servidor

No terminal onde o servidor está rodando:
- Pressione `Ctrl + C` para parar
- Execute: `npm run dev`

**Solução 2:** Limpe o cache do Next.js

```powershell
# Pare o servidor (Ctrl + C)
Remove-Item -Recurse -Force .next
npm run dev
```

**Solução 3:** Limpe cache do navegador

- Pressione `Ctrl + Shift + Delete`
- Limpe cache dos últimos minutos
- Recarregue a página com `Ctrl + F5`

---

### Problema: Erro 404

Se vir erro 404, verifique:

1. **URL correta?**
   - ✅ `http://localhost:3001/portal-cotista`
   - ❌ `http://localhost:3000/portal-cotista` (porta errada)

2. **Servidor rodando?**
   - Olhe o terminal, deve mostrar: `✓ Ready in Xms`

3. **Middleware atualizado?**
   - O arquivo `middleware.ts` foi corrigido
   - Reinicie o servidor para aplicar mudanças

---

### Problema: Porta 3001 em uso

Se o Next.js tentar usar porta 3002 ou outra:

```
⚠ Port 3001 is in use, trying 3002 instead.
```

**Solução:** Use a porta que o Next.js escolheu (ex: 3002)

---

## 📱 TESTAR NO CELULAR

### Método 1: Usar IP Local (mesma rede Wi-Fi)

1. Descubra seu IP:
   ```powershell
   ipconfig
   ```
   Procure por "Endereço IPv4" (ex: 192.168.1.100)

2. No celular, acesse:
   ```
   http://192.168.1.100:3001
   ```

### Método 2: Usar Túnel (ngrok)

Se não funcionar com IP, use túnel:

```powershell
# Instalar ngrok (se não tiver)
winget install ngrok

# Expor servidor
ngrok http 3001
```

Use a URL gerada (ex: `https://abc123.ngrok.io`)

---

## 🎨 O QUE VOCÊ DEVE VER

### Portal do Cotista (Visual Reference)

```
┌──────────────────────────────────────────────────┐
│  Vivant Care                                     │
│  Portal exclusivo para cotistas Vivant          │
├──────────────────────────────────────────────────┤
│                                                   │
│            Portal do Cotista                      │
│  Bem-vindo ao seu espaço exclusivo. Gerencie    │
│  sua propriedade fracionada com elegância        │
│                                                   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │    📅     │  │    📄     │  │    ✨     │   │
│  │           │  │           │  │           │   │
│  │Calendário │  │   Meus    │  │ Solicitar │   │
│  │  de Uso   │  │  Boletos/ │  │ Concierge │   │
│  │           │  │  Extrato  │  │           │   │
│  │  Agende   │  │ Acompanhe │  │ Serviços  │   │
│  │   seus    │  │pagamentos │  │  premium  │   │
│  │ períodos  │  │ e taxas   │  │    sob    │   │
│  │           │  │           │  │  demanda  │   │
│  │           │  │           │  │           │   │
│  │ [Acessar] │  │ [Acessar] │  │ [Acessar] │   │
│  └───────────┘  └───────────┘  └───────────┘   │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## ✅ CONFIRMAÇÃO FINAL

Teste estas 3 URLs e confirme:

```bash
# 1. Home
http://localhost:3001
→ Deve mostrar: Landing page marketing

# 2. Simulador
http://localhost:3001/dashboard/simulador
→ Deve mostrar: Formulário + análise financeira

# 3. Portal
http://localhost:3001/portal-cotista
→ Deve mostrar: 3 cards elegantes
```

---

## 🎯 PRÓXIMO PASSO

Se tudo funcionar:

1. ✅ Faça commit das mudanças
2. ✅ Configure os domínios reais no servidor de produção
3. ✅ Deploy na Vercel/Cloudflare

---

## 🆘 PRECISA DE AJUDA?

**Terminal mostrando erros?**
- Tire um print e compartilhe
- Ou copie o texto do erro

**Página em branco?**
- Abra o DevTools (F12)
- Vá em "Console"
- Veja se há erros em vermelho

**Ainda com dúvidas?**
- Revise `MULTI_DOMAIN_SETUP.md` para detalhes técnicos
- Veja `DEV_GUIDE.md` para troubleshooting

---

**Status:** ✅ Servidor rodando na porta **3001**  
**Próximo teste:** Acesse http://localhost:3001 agora mesmo! 🚀
