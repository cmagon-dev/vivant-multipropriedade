# Script de Backup do Banco de Dados Vivant
# Execução: .\scripts\backup-database.ps1

$ErrorActionPreference = "Stop"

# Configurações
$BackupDir = "backups"
$Date = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFile = "$BackupDir\vivant-db-backup-$Date.sql"

# Criar diretório de backups se não existir
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
    Write-Host "Diretório de backups criado: $BackupDir" -ForegroundColor Green
}

# Connection string do banco (obtida do .env)
$ConnectionString = "postgresql://neondb_owner:npg_vVwpk7DxjNt4@ep-broad-surf-acw33r2t.sa-east-1.aws.neon.tech/neondb?sslmode=require"

Write-Host "`n🔄 Iniciando backup do banco de dados..." -ForegroundColor Cyan
Write-Host "Arquivo: $BackupFile`n" -ForegroundColor Yellow

# Verificar se pg_dump está instalado
try {
    $pgDumpVersion = pg_dump --version 2>$null
    Write-Host "✅ pg_dump encontrado: $pgDumpVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: pg_dump não encontrado!" -ForegroundColor Red
    Write-Host "`nPara instalar o pg_dump:" -ForegroundColor Yellow
    Write-Host "1. Baixe PostgreSQL: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "2. Durante a instalação, selecione 'Command Line Tools'" -ForegroundColor Yellow
    Write-Host "3. Adicione C:\Program Files\PostgreSQL\XX\bin ao PATH" -ForegroundColor Yellow
    Write-Host "`nAlternativamente, use o backup manual via Prisma Studio." -ForegroundColor Yellow
    exit 1
}

# Fazer backup
try {
    pg_dump $ConnectionString > $BackupFile
    
    $FileSize = (Get-Item $BackupFile).Length / 1KB
    Write-Host "`n✅ Backup concluído com sucesso!" -ForegroundColor Green
    Write-Host "📁 Arquivo: $BackupFile" -ForegroundColor Green
    Write-Host "📊 Tamanho: $([math]::Round($FileSize, 2)) KB`n" -ForegroundColor Green
    
    # Listar backups existentes
    Write-Host "📋 Backups disponíveis:" -ForegroundColor Cyan
    Get-ChildItem -Path $BackupDir -Filter "*.sql" | 
        Sort-Object LastWriteTime -Descending |
        Format-Table Name, @{Label="Tamanho";Expression={"{0:N2} KB" -f ($_.Length/1KB)}}, LastWriteTime -AutoSize
        
} catch {
    Write-Host "`n❌ ERRO ao fazer backup: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n💡 Dicas:" -ForegroundColor Yellow
Write-Host "- Guarde este backup em local seguro" -ForegroundColor Yellow
Write-Host "- Faça backups regularmente (semanal ou após mudanças importantes)" -ForegroundColor Yellow
Write-Host "- Para restaurar: psql 'connection-string' < $BackupFile" -ForegroundColor Yellow
Write-Host ""
