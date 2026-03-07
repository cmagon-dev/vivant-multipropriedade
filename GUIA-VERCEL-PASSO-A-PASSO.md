# 🎯 Guia Passo a Passo - Configurar Vercel

## Passo 1: Acessar o Dashboard da Vercel

1. Abra o navegador
2. Acesse: **https://vercel.com/dashboard**
3. Faça login (se necessário)
4. Você verá a lista de seus projetos

## Passo 2: Acessar Seu Projeto

1. Na lista de projetos, procure por: **vivant-multipropriedade** (ou o nome que aparece)
2. Clique no projeto para abrir
3. Você verá o dashboard do projeto com:
   - Última deployment
   - Status do build
   - URL de produção

## Passo 3: Acessar Configurações

1. No topo da página, clique na aba **"Settings"**
2. No menu lateral esquerdo, procure por **"Environment Variables"**
3. Clique em **"Environment Variables"**

## Passo 4: Adicionar Variáveis de Ambiente

Agora você verá uma página com:
- Um campo para nome da variável
- Um campo para valor
- Checkboxes para escolher onde aplicar (Production, Preview, Development)

### 4.1 - Variáveis do Banco de Dados (7 variáveis)

**Copie e cole uma por vez:**

**Variável 1:**
```
Nome: POSTGRES_URL
Valor: postgresql://neondb_owner:npg_vVwpk7DxjNt4@ep-broad-surf-acw33r2t-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
Aplicar em: ✅ Production, ✅ Preview, ✅ Development
```

**Variável 2:**
```
Nome: POSTGRES_PRISMA_URL
Valor: postgresql://neondb_owner:npg_vVwpk7DxjNt4@ep-broad-surf-acw33r2t-pooler.sa-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
Aplicar em: ✅ Production, ✅ Preview, ✅ Development
```

**Variável 3:**
```
Nome: POSTGRES_URL_NON_POOLING
Valor: postgresql://neondb_owner:npg_vVwpk7DxjNt4@ep-broad-surf-acw33r2t.sa-east-1.aws.neon.tech/neondb?sslmode=require
Aplicar em: ✅ Production, ✅ Preview, ✅ Development
```

**Variável 4:**
```
Nome: POSTGRES_USER
Valor: neondb_owner
Aplicar em: ✅ Production, ✅ Preview, ✅ Development
```

**Variável 5:**
```
Nome: POSTGRES_HOST
Valor: ep-broad-surf-acw33r2t-pooler.sa-east-1.aws.neon.tech
Aplicar em: ✅ Production, ✅ Preview, ✅ Development
```

**Variável 6:**
```
Nome: POSTGRES_PASSWORD
Valor: npg_vVwpk7DxjNt4
Aplicar em: ✅ Production, ✅ Preview, ✅ Development
```

**Variável 7:**
```
Nome: POSTGRES_DATABASE
Valor: neondb
Aplicar em: ✅ Production, ✅ Preview, ✅ Development
```

### 4.2 - Variáveis de Autenticação (2 variáveis)

⚠️ **IMPORTANTE:** Estas são diferentes do ambiente local!

**Variável 8:**
```
Nome: NEXTAUTH_SECRET
Valor: 0qIrVOvqadzgz+1V3jZB03gH4ESth3noeiqHQL0U1LM=
Aplicar em: ✅ Production
```

**Variável 9:**
```
Nome: NEXTAUTH_URL
Valor: [IMPORTANTE - VER INSTRUÇÃO ABAIXO]
Aplicar em: ✅ Production
```

**Para NEXTAUTH_URL:**
1. Volte para a aba principal do projeto (clique no nome do projeto no topo)
2. Copie a URL de produção que aparece (algo como: `https://vivant-multipropriedade-xxx.vercel.app`)
3. Volte para Environment Variables
4. Cole essa URL no valor de `NEXTAUTH_URL`

### 4.3 - Variável de Upload (1 variável)

**Variável 10:**
```
Nome: BLOB_READ_WRITE_TOKEN
Valor: vercel_blob_rw_pwEuLXKeX9iN0BLb_4ilqSQPjXxLlQetMsTbneurovwfUWs
Aplicar em: ✅ Production, ✅ Preview, ✅ Development
```

### 4.4 - Variáveis de Domínios Públicos (3 variáveis)

**Variável 11:**
```
Nome: NEXT_PUBLIC_CAPITAL_DOMAIN
Valor: vivantcapital.com.br
Aplicar em: ✅ Production, ✅ Preview, ✅ Development
```

**Variável 12:**
```
Nome: NEXT_PUBLIC_RESIDENCES_DOMAIN
Valor: vivantresidences.com.br
Aplicar em: ✅ Production, ✅ Preview, ✅ Development
```

**Variável 13:**
```
Nome: NEXT_PUBLIC_CARE_DOMAIN
Valor: vivantcare.com.br
Aplicar em: ✅ Production, ✅ Preview, ✅ Development
```

## Passo 5: Salvar Cada Variável

Para cada variável acima:
1. Cole o **Nome** no campo "Key" ou "Name"
2. Cole o **Valor** no campo "Value"
3. Marque os checkboxes conforme indicado
4. Clique em **"Save"** ou **"Add"**
5. Repita para a próxima variável

## Passo 6: Verificar Todas as Variáveis

Após adicionar todas, você deve ver **13 variáveis** listadas:

✅ POSTGRES_URL
✅ POSTGRES_PRISMA_URL
✅ POSTGRES_URL_NON_POOLING
✅ POSTGRES_USER
✅ POSTGRES_HOST
✅ POSTGRES_PASSWORD
✅ POSTGRES_DATABASE
✅ NEXTAUTH_SECRET
✅ NEXTAUTH_URL
✅ BLOB_READ_WRITE_TOKEN
✅ NEXT_PUBLIC_CAPITAL_DOMAIN
✅ NEXT_PUBLIC_RESIDENCES_DOMAIN
✅ NEXT_PUBLIC_CARE_DOMAIN

## Passo 7: Forçar Novo Deploy (Redeploy)

Depois de salvar todas as variáveis:

1. Clique na aba **"Deployments"** no topo
2. Encontre o deployment mais recente (deve ser o commit: "feat: sistema administrativo completo")
3. Clique nos 3 pontinhos (...) ao lado do deployment
4. Clique em **"Redeploy"**
5. Confirme o redeploy

Ou simplesmente:
1. Vá na aba principal do projeto
2. Clique no botão **"Redeploy"** (se aparecer)

## Passo 8: Aguardar o Build

1. Você verá a tela de build em tempo real
2. Aguarde até aparecer **"Building..."** → **"Completed"**
3. Isso pode levar de 2 a 5 minutos

## Passo 9: Testar a Aplicação

Quando o build completar:

1. Clique no botão **"Visit"** ou copie a URL de produção
2. Acesse a URL no navegador
3. Teste a página inicial (deve carregar normalmente)
4. Acesse: `[SUA-URL]/admin`
5. Tente fazer login:
   - Email: `admin@vivant.com.br`
   - Senha: `vivant@2024`

## ✅ Checklist Final

- [ ] 13 variáveis de ambiente adicionadas
- [ ] NEXTAUTH_URL com a URL de produção correta
- [ ] Redeploy realizado
- [ ] Build completado sem erros
- [ ] Site acessível na URL de produção
- [ ] Login no admin funciona

## 🆘 Se Algo Der Errado

### Erro no Build
- Verifique os logs do build na Vercel
- Procure por mensagens de erro em vermelho
- Me envie a mensagem de erro

### Login Não Funciona
- Confirme que `NEXTAUTH_URL` está correto (sem / no final)
- Confirme que `NEXTAUTH_SECRET` foi salvo corretamente
- Limpe cache do navegador e tente novamente

### Banco de Dados Não Conecta
- Verifique se todas as 7 variáveis `POSTGRES_*` estão corretas
- Confirme que não há espaços extras nos valores

## 📞 Precisa de Ajuda?

Se encontrar algum problema em qualquer passo, me avise e eu te ajudo!

---

**Última atualização:** 19 de Fevereiro de 2026
