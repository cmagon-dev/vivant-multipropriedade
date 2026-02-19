# 📜 Scripts de Backup - Vivant

Esta pasta contém scripts automatizados para backup do sistema.

## 🗂️ Scripts Disponíveis

### 1. `backup-database.ps1`
Faz backup completo do banco de dados PostgreSQL (Neon).

**Execução:**
```powershell
.\scripts\backup-database.ps1
```

**O que faz:**
- Cria dump SQL do banco de dados
- Salva em `backups/vivant-db-backup-YYYYMMDD-HHMMSS.sql`
- Lista todos os backups existentes

**Requisitos:**
- `pg_dump` instalado (PostgreSQL Client Tools)
- Conexão com internet (para acessar Neon)

---

### 2. `backup-projeto.ps1`
Cria arquivo ZIP com todo o código do projeto.

**Execução:**
```powershell
.\scripts\backup-projeto.ps1
```

**O que faz:**
- Cria ZIP com todo o código-fonte
- Exclui `node_modules`, `.next`, `.git`
- **NÃO inclui `.env`** (por segurança)
- Salva em `backups/vivant-projeto-backup-YYYYMMDD-HHMMSS.zip`

**O que está incluído:**
- ✅ Todo o código TypeScript/React
- ✅ Configurações do projeto
- ✅ Documentação
- ✅ Schema do Prisma
- ❌ Dependências (`node_modules`)
- ❌ Build (`.next`)
- ❌ Credenciais (`.env`)

---

## 📋 Rotina de Backup Recomendada

### Diária (Automática)
- Backup do banco de dados Neon (configurar backup automático no Neon)

### Semanal (Manual)
```powershell
# Executar todo domingo
.\scripts\backup-database.ps1
```

### Antes de Grandes Mudanças (Manual)
```powershell
# Executar antes de refatorações importantes
.\scripts\backup-database.ps1
.\scripts\backup-projeto.ps1
```

### Mensal (Manual)
```powershell
# Backup completo + upload para cloud
.\scripts\backup-database.ps1
.\scripts\backup-projeto.ps1

# Depois: fazer upload dos arquivos em backups/ para:
# - Google Drive
# - Dropbox
# - OneDrive
# - Ou outro serviço de cloud
```

---

## 🔒 Backup de Credenciais

**IMPORTANTE:** O arquivo `.env` contém credenciais sensíveis e **NÃO** é incluído nos backups automáticos.

**Como fazer backup manual do .env:**

1. Copie o arquivo `.env` para um local seguro
2. Use um gerenciador de senhas (LastPass, 1Password, Bitwarden)
3. Ou criptografe o arquivo antes de guardar

**Nunca:**
- ❌ Envie .env por email
- ❌ Coloque .env em cloud pública
- ❌ Comite .env no git
- ❌ Compartilhe .env em chats

---

## 📁 Estrutura de Backups

```
backups/
├── vivant-db-backup-20260219-143022.sql      # Banco de dados
├── vivant-db-backup-20260212-100000.sql
├── vivant-projeto-backup-20260219-143022.zip # Código
└── vivant-projeto-backup-20260212-100000.zip
```

**Retenção recomendada:**
- Manter últimos 7 backups diários
- Manter últimos 4 backups semanais
- Manter últimos 12 backups mensais

---

## 🔄 Como Restaurar

### Restaurar Banco de Dados

```powershell
# Usando psql
psql "postgresql://sua-connection-string" < backups\vivant-db-backup-20260219-143022.sql
```

### Restaurar Projeto

```powershell
# 1. Extrair ZIP
Expand-Archive -Path backups\vivant-projeto-backup-20260219-143022.zip -DestinationPath restaurado\

# 2. Entrar na pasta
cd restaurado

# 3. Instalar dependências
npm install

# 4. Restaurar .env (de backup seguro)
# Copie manualmente o .env

# 5. Gerar Prisma Client
npx prisma generate

# 6. Testar
npm run dev
```

---

## ⚠️ Troubleshooting

### Erro: pg_dump não encontrado

**Solução:**
1. Baixe PostgreSQL: https://www.postgresql.org/download/windows/
2. Durante instalação, marque "Command Line Tools"
3. Adicione ao PATH: `C:\Program Files\PostgreSQL\XX\bin`

### Backup muito grande

**Solução:**
- Verifique se `node_modules` foi excluído
- Verifique se `.next` foi excluído
- Limpe backups antigos

### Erro de permissão

**Solução:**
- Execute PowerShell como Administrador
- Verifique permissões da pasta `backups/`

---

## 📞 Suporte

Se encontrar problemas com os scripts de backup, consulte:
- `LIMPEZA-E-BACKUP.md` - Guia completo de backup
- `TESTES-PRODUCAO.md` - Guia de testes e troubleshooting

---

**Última atualização:** 19 de Fevereiro de 2026
