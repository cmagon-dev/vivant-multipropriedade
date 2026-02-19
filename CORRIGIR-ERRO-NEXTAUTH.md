# 🔧 Corrigir Erro NEXTAUTH_URL na Vercel

## ❌ Problema Identificado

O erro `TypeError: Invalid URL` está acontecendo porque a variável `NEXTAUTH_URL` foi configurada com o valor placeholder:

```
https://[SEU-DOMINIO].vercel.app
```

Isso é um placeholder, não uma URL real!

## ✅ Solução - Passo a Passo

### Passo 1: Descobrir a URL Real de Produção

1. Acesse o Dashboard da Vercel: https://vercel.com/dashboard
2. Clique no seu projeto **vivant-multipropriedade**
3. Na página principal do projeto, você verá a URL de produção
4. **Copie essa URL completa** (exemplo: `https://vivant-multipropriedade-abc123.vercel.app`)

**A URL pode ser uma das seguintes:**
- `https://vivant-multipropriedade.vercel.app`
- `https://vivant-multipropriedade-xxx.vercel.app` (onde xxx são letras/números aleatórios)
- Ou o domínio customizado se você já configurou

### Passo 2: Atualizar a Variável NEXTAUTH_URL

1. No Dashboard da Vercel, ainda no seu projeto
2. Clique em **Settings** (no topo)
3. Clique em **Environment Variables** (menu lateral)
4. Procure pela variável `NEXTAUTH_URL`
5. Clique no ícone de **editar** (lápis) ao lado dela
6. **Delete o valor antigo** (`https://[SEU-DOMINIO].vercel.app`)
7. **Cole a URL real** que você copiou no Passo 1
8. Clique em **Save**

### Passo 3: Fazer Redeploy

1. Clique na aba **Deployments** (no topo)
2. Encontre o deployment que deu erro (o mais recente)
3. Clique nos **3 pontinhos (...)** ao lado
4. Clique em **Redeploy**
5. Confirme o redeploy

### Passo 4: Aguardar o Build

- O build vai começar novamente
- Aguarde até completar (2-5 minutos)
- Desta vez deve funcionar! ✅

## 📸 Exemplo Visual

**URL que você deve copiar:**
```
✅ https://vivant-multipropriedade.vercel.app
ou
✅ https://vivant-multipropriedade-7x8y9z.vercel.app
```

**NÃO use:**
```
❌ https://[SEU-DOMINIO].vercel.app  (placeholder)
❌ http://localhost:3000  (ambiente local)
```

## 🎯 Checklist

- [ ] Copiei a URL real de produção da Vercel
- [ ] Editei a variável NEXTAUTH_URL
- [ ] Colei a URL correta (sem colchetes [])
- [ ] Salvei a variável
- [ ] Fiz o redeploy
- [ ] Aguardei o build completar

## 💡 Dica

A URL real está sempre visível na página principal do projeto na Vercel, geralmente em um card grande com um botão "Visit" ao lado.

---

**Se ainda tiver dúvidas, me avise que te ajudo!**
