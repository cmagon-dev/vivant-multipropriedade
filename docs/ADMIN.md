# Sistema Administrativo Vivant

## 🚀 Acesso

**URL:** `https://vivantresidences.com.br/admin`

## 🔐 Credenciais Iniciais (após seed)

- **Email:** caio@vivant.com.br
- **Senha:** admin123

> ⚠️ **IMPORTANTE:** Altere a senha após o primeiro login em produção!

---

## 👥 Níveis de Acesso

### ADMIN
- ✅ Acesso total ao sistema
- ✅ Pode criar/editar/deletar tudo
- ✅ Pode gerenciar usuários
- ✅ Acesso exclusivo à área de Usuários

### EDITOR
- ✅ Pode criar/editar casas e destinos
- ✅ Pode fazer upload de imagens
- ✅ Pode publicar/despublicar conteúdo
- ❌ Não pode gerenciar usuários

### VIEWER
- ✅ Apenas visualização
- ❌ Não pode editar nada
- ❌ Acesso somente leitura

---

## 📋 Fluxo de Trabalho

### 1. Login
1. Acesse `/admin` (redireciona para `/login` se não autenticado)
2. Insira suas credenciais
3. Após login, é redirecionado para o Dashboard

### 2. Gerenciar Casas

#### Criar Nova Casa
1. Acesse **Casas** no menu lateral
2. Clique em **"Nova Casa"**
3. Preencha todas as informações obrigatórias:
   - Nome da casa
   - Slug (gerado automaticamente)
   - Localização e cidade
   - Destino (selecione da lista)
   - Condomínio
   - Tipo de propriedade
   - Características (suítes, banheiros, área)
   - Valores (preço, fração, taxa mensal)
   - **Imagens** (arraste e solte ou clique para selecionar)
   - Features (características da casa)
   - Status e publicação
4. Clique em **"Criar Casa"**

#### Editar Casa Existente
1. Na listagem de casas, clique no ícone de **Editar** (lápis)
2. Modifique os campos desejados
3. Clique em **"Atualizar Casa"**

#### Publicar/Despublicar
- Clique no ícone de **olho** para publicar/despublicar rapidamente
- Verde = Publicado | Cinza = Despublicado

#### Deletar Casa
- Clique no ícone de **lixeira** (disponível apenas para ADMINs)
- Confirme a exclusão

### 3. Gerenciar Destinos

#### Criar Novo Destino
1. Acesse **Destinos** no menu lateral
2. Clique em **"Novo Destino"**
3. Preencha:
   - Nome do destino
   - Slug (gerado automaticamente)
   - Estado e emoji
   - Ordem de exibição
   - Gradiente Tailwind (ex: `from-blue-500 to-cyan-400`)
   - Subtítulo e localização
   - Descrições (geral, clima, estilo de vida, valorização)
   - **4 Features obrigatórias** (icon, título, descrição)
4. Clique em **"Criar Destino"**

#### Editar/Deletar
- Mesmo processo das casas
- ⚠️ **Não é possível deletar destinos com propriedades vinculadas**

### 4. Gerenciar Usuários (ADMIN Only)

#### Criar Novo Usuário
1. Acesse **Usuários** no menu lateral
2. Clique em **"Novo Usuário"**
3. Preencha:
   - Nome completo
   - Email
   - Senha (mínimo 8 caracteres)
   - Função (ADMIN, EDITOR ou VIEWER)
4. Clique em **"Criar Usuário"**

#### Editar Usuário
- Modifique nome, email, função
- Deixe senha em branco para manter a atual
- Use o switch "Ativo" para bloquear/desbloquear acesso

#### Deletar Usuário
- Não é possível deletar sua própria conta
- Confirme a exclusão

### 5. Upload de Imagens

- Arraste e solte múltiplas imagens (até 10)
- Formatos aceitos: JPG, PNG, WEBP
- Tamanho máximo: 5MB por imagem
- A primeira imagem é sempre a **principal**
- Clique no **X** para remover uma imagem

---

## 🎨 Interface

### Dashboard
- Visão geral: total de casas, destinos e usuários
- Estatísticas de publicação

### Menu Lateral
- **Dashboard**: Visão geral
- **Casas**: Gerenciar propriedades
- **Destinos**: Gerenciar destinos
- **Usuários**: Gerenciar usuários (ADMIN only)

### Cabeçalho
- Nome do usuário logado
- Botão **"Ver Site"** (abre o site em nova aba)
- Botão **"Sair"** (faz logout)

---

## 🔍 Recursos

### Slugs Automáticos
- Gerados automaticamente a partir do nome
- Podem ser editados manualmente
- Devem ser únicos

### Status de Propriedades
- **Disponível**: Casa disponível para compra
- **Últimas Cotas**: Poucas cotas restantes
- **Pré-lançamento**: Ainda não lançada oficialmente
- **Vendido**: Todas as cotas vendidas

### Publicação
- Conteúdo despublicado **não aparece** no site público
- Use para criar rascunhos ou remover temporariamente

### Auditoria
- Todas as ações são registradas
- Histórico de quem criou/editou cada item

---

## 🛠️ Setup Inicial (Dev)

### 1. Configurar Banco de Dados

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente (.env.local)
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."
NEXTAUTH_SECRET="gerar com: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# Gerar Prisma Client
npx prisma generate

# Criar tabelas no banco
npx prisma db push

# Popular dados iniciais
npx prisma db seed

# Abrir Prisma Studio (opcional)
npx prisma studio
```

### 2. Rodar o Projeto

```bash
npm run dev
```

### 3. Acessar o Admin

```
http://localhost:3000/admin
```

---

## 📦 Backup

- O banco é automaticamente backupeado pela Vercel
- Exportar backup manual: `npx prisma db pull`

---

## 🔒 Segurança

### Boas Práticas
1. ✅ Sempre use senhas fortes (mínimo 8 caracteres)
2. ✅ Não compartilhe credenciais de ADMIN
3. ✅ Revise permissões dos usuários regularmente
4. ✅ Use VIEWER para pessoas que só precisam visualizar
5. ✅ Desative usuários inativos em vez de deletar

### Proteções Implementadas
- ✅ Senhas com hash bcrypt (12 rounds)
- ✅ JWT sessions criptografados
- ✅ Middleware protegendo rotas /admin/*
- ✅ Verificação de roles em todas as APIs
- ✅ Validação de inputs com Zod
- ✅ HTTPS obrigatório em produção
- ✅ Logs de auditoria

---

## ❓ FAQ

### Como altero minha senha?
Atualmente não há interface. Peça a um ADMIN para editar seu usuário.

### Posso ter mais de 10 imagens por casa?
Não, o limite é 10 imagens para otimização.

### Como ordeno os destinos?
Use o campo "Ordem de Exibição" ao criar/editar destinos.

### Posso usar HTML nas descrições?
Não, use o editor de texto formatado (negrito, itálico, listas).

### O que acontece se deletar um destino com casas?
A exclusão é bloqueada. Delete ou reatribua as casas primeiro.

---

## 📞 Suporte

Para dúvidas ou problemas:
- Email: suporte@vivant.com.br
- WhatsApp: (XX) XXXX-XXXX

---

**Última atualização:** Fevereiro 2026
