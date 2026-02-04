# ⚡ TESTE RÁPIDO - 2 MINUTOS

## 🚀 PASSO 1: REINICIE O SERVIDOR

```bash
# Se o servidor está rodando, pare com Ctrl+C
npm run dev
```

Aguarde: `✓ Ready in Xms`

---

## 🎨 PASSO 2: TESTE VISUAL

Acesse:
```
http://localhost:3001/portal-cotista
```

### ✅ O que você DEVE ver:

1. **Box de debug no canto inferior direito:**
   ```
   🎨 Style Debug
   Font Sans (Inter): ABCabc123
   Font Serif (Playfair): ABCabc123
   Vivant Navy: #1A2F4B
   Vivant Gold: #D4AF37
   ```

2. **3 Cards elegantes:**
   - 📅 Calendário de Uso
   - 📄 Meus Boletos/Extrato
   - ✨ Solicitar Concierge

3. **Cores corretas:**
   - Título "Portal do Cotista" em azul navy escuro
   - Botões em azul navy
   - Ícone do Concierge em dourado

4. **Fontes diferentes:**
   - Título em fonte Serif (Playfair)
   - Textos em fonte Sans (Inter)

---

## 🔍 PASSO 3: VERIFIQUE O CONSOLE

Pressione **F12** para abrir DevTools

Vá na aba **Console**

### ✅ Você DEVE ver:

```
🎨 [Client] Hostname detectado: localhost
🎨 [Client] Porta: 3001
🎨 [Client] URL completa: http://localhost:3001/portal-cotista
🎨 [Client] Marca detectada: Vivant Residences
🎨 [Client] Classes HTML: __variable_... __variable_...
🎨 [Client] Font variables: { inter: "__font-inter_...", playfair: "__font-playfair_..." }
🎨 [Client] Body font-family: "__Inter_..."
🎨 [Client] Body background: rgb(248, 249, 250)
🎨 [Client] Stylesheets carregadas: 3
```

---

## 📟 PASSO 4: VERIFIQUE O TERMINAL

No terminal onde o servidor está rodando:

### ✅ Você DEVE ver:

```
🔍 [Middleware] Hostname detectado: localhost:3001
🔍 [Middleware] Domain: localhost
🔍 [Middleware] Pathname: /portal-cotista
✅ [Middleware] Seguindo fluxo normal (Residences)

🎨 [Layout Server] Hostname: localhost:3001
🎨 [Layout Server] Vivant Domain: residences
🎨 [Layout Server] Marca: Vivant Residences
```

---

## ✅ ESTÁ FUNCIONANDO?

Se você viu:
- ✅ Box de debug
- ✅ Cores Navy e Gold
- ✅ Fontes diferentes
- ✅ Logs no console
- ✅ Logs no terminal

**PARABÉNS! 🎉 O sistema está funcionando perfeitamente!**

---

## 🌐 TESTE COM DOMÍNIOS (OPCIONAL)

Se quiser testar com domínios simulados:

### 1. Configure hosts

Edite `C:\Windows\System32\drivers\etc\hosts` como Administrador:

```
127.0.0.1 vivantcare.com.br
```

### 2. Acesse

```
http://vivantcare.com.br:3001
```

### 3. Verifique Console

Deve mostrar:
```
🔍 [Middleware] Hostname detectado: vivantcare.com.br:3001
✅ [Middleware] Redirecionando para: /portal-cotista
🎨 [Client] Hostname detectado: vivantcare.com.br
🎨 [Client] Marca detectada: Vivant Care
```

---

## ❌ NÃO FUNCIONOU?

### Problema: Não vejo o box de debug

**Causa:** Página não carregou completamente

**Solução:** Recarregue com `Ctrl + F5`

---

### Problema: Cores não aparecem

**Solução 1:** Limpe cache do Next.js
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

**Solução 2:** Limpe cache do navegador
- `Ctrl + Shift + Delete`
- Limpe tudo
- Tente novamente

---

### Problema: Console não mostra logs

**Causa:** Você está olhando a aba errada

**Solução:**
1. Pressione F12
2. Clique na aba **"Console"**
3. NÃO na aba "Network" ou "Elements"

---

### Problema: Terminal não mostra logs

**Causa:** Servidor não reiniciou

**Solução:**
1. Pare o servidor (Ctrl+C)
2. Execute `npm run dev` novamente
3. Acesse a URL novamente

---

## 📚 MAIS INFORMAÇÕES

Para detalhes técnicos completos:
- **`RESUMO_CORRECOES_ESTILOS.md`** - O que foi feito
- **`TESTE_CORES_FONTES.md`** - Guia completo de teste

---

## ✅ RESUMO

**Testou?** ✅  
**Funcionou?** ✅  
**Viu os logs?** ✅  

**Está pronto! O sistema de multi-domínio está operacional com cores e fontes carregando corretamente em qualquer hostname!** 🎉

---

**Tempo estimado:** 2 minutos  
**Dificuldade:** ⭐☆☆☆☆
