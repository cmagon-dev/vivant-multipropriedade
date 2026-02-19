# Script Simples de Backup do Projeto Vivant

$BackupDir = "backups"
$Date = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFile = "$BackupDir\vivant-projeto-backup-$Date.zip"

# Criar diretório de backups
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

Write-Host "`nCriando backup do projeto..." -ForegroundColor Cyan

# Criar ZIP excluindo node_modules, .next, .git
Compress-Archive -Path `
    app,components,lib,prisma,public,types,docs,scripts,*.md,*.json,*.ts,*.js,.env.example,.gitignore `
    -DestinationPath $BackupFile `
    -Force

$FileSize = (Get-Item $BackupFile).Length / 1MB
Write-Host "Backup concluído: $BackupFile" -ForegroundColor Green
Write-Host "Tamanho: $([math]::Round($FileSize, 2)) MB`n" -ForegroundColor Green
