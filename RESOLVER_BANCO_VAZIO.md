# 🔧 RESOLVER: Banco de Dados Vazio

## ❌ Problema

As tabelas do banco de dados não existem:
```
The table `public.destinations` does not exist
The table `public.properties` does not exist
```

## ✅ SOLUÇÃO RÁPIDA

Execute estes comandos EM SEQUÊNCIA:

### 1️⃣ Pare o servidor dev
```
Pressione Ctrl + C no terminal onde npm run dev está rodando
```

### 2️⃣ Crie as tabelas no banco
```powershell
npx prisma db push --accept-data-loss
```

### 3️⃣ Gere o Prisma Client
```powershell
npx prisma generate
```

### 4️⃣ Popular com dados de teste
```powershell
npm run db:seed
```

### 5️⃣ Reinicie o servidor
```powershell
npm run dev
```

---

## 🎯 O que cada comando faz

| Comando | O que faz |
|---------|-----------|
| `npx prisma db push` | Cria todas as tabelas no banco |
| `npx prisma generate` | Gera o cliente TypeScript |
| `npm run db:seed` | Adiciona dados de teste |
| `npm run dev` | Inicia o servidor |

---

## ✅ Você saberá que funcionou quando:

No terminal, você verá:
```
✅ Admin criado: admin@vivant.com.br
✅ Destino criado: Gramado
✅ Destino criado: Florianópolis
✅ Propriedade criada: Casa Gramado Centro
✅ Propriedade criada: Apto Floripa Beira-mar
✅ Cotista criado: João da Silva
✅ Cotista criado: Maria Oliveira
```

E depois:
```
✓ Ready in 2.9s
```

---

## 🧪 Testar Depois

1. Acesse `http://localhost:3000/login`
2. Faça login com `admin@vivant.com` / `admin123`
3. Selecione "Admin Portal"
4. Clique em "Propriedades"
5. Você verá 2 propriedades listadas!

---

**Execute os 5 passos acima agora!** 🚀
