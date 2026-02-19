# Script de Backup Completo do Projeto Vivant
# Execução: .\scripts\backup-projeto.ps1

$ErrorActionPreference = "Stop"

# Configurações
$BackupDir = "backups"
$Date = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFile = "$BackupDir\vivant-projeto-backup-$Date.zip"
$ProjectRoot = $PSScriptRoot + "\.."

Write-Host "`n🔄 Iniciando backup completo do projeto..." -ForegroundColor Cyan
Write-Host "Arquivo: $BackupFile`n" -ForegroundColor Yellow

# Criar diretório de backups se não existir
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
    Write-Host "✅ Diretório de backups criado: $BackupDir" -ForegroundColor Green
}

# Arquivos e pastas para incluir
$IncludeItems = @(
    "app",
    "components",
    "lib",
    "prisma",
    "public",
    "types",
    "docs",
    "scripts",
    "*.md",
    "*.json",
    "*.ts",
    "*.js",
    ".env.example",
    ".gitignore"
)

# Arquivos e pastas para excluir
$ExcludeItems = @(
    "node_modules",
    ".next",
    ".git",
    "backups",
    ".env"  # NÃO incluir .env no zip (tem credenciais)
)

Write-Host "📦 Criando arquivo ZIP..." -ForegroundColor Cyan
Write-Host "Incluindo: $($IncludeItems -join ', ')" -ForegroundColor Gray
Write-Host "Excluindo: $($ExcludeItems -join ', ')`n" -ForegroundColor Gray

# Criar arquivo temporário com lista de arquivos
$TempList = New-TemporaryFile
$FilesToBackup = @()

# Coletar arquivos
foreach ($item in $IncludeItems) {
    $files = Get-ChildItem -Path $ProjectRoot -Filter $item -Recurse -File -ErrorAction SilentlyContinue
    $FilesToBackup += $files
}

# Remover arquivos excluídos
$FilesToBackup = $FilesToBackup | Where-Object {
    $path = $_.FullName
    $shouldInclude = $true
    foreach ($exclude in $ExcludeItems) {
        if ($path -like "*\$exclude\*" -or $path -like "*\$exclude") {
            $shouldInclude = $false
            break
        }
    }
    $shouldInclude
}

# Criar ZIP
try {
    $compress = @{
        Path = $FilesToBackup.FullName
        DestinationPath = $BackupFile
        CompressionLevel = "Optimal"
    }
    
    Compress-Archive @compress -Force
    
    $FileSize = (Get-Item $BackupFile).Length / 1MB
    $FileCount = $FilesToBackup.Count
    
    Write-Host "✅ Backup concluído com sucesso!" -ForegroundColor Green
    Write-Host "📁 Arquivo: $BackupFile" -ForegroundColor Green
    Write-Host "📊 Tamanho: $([math]::Round($FileSize, 2)) MB" -ForegroundColor Green
    Write-Host "📄 Arquivos: $FileCount arquivos`n" -ForegroundColor Green
    
    # Listar backups existentes
    Write-Host "📋 Backups disponíveis:" -ForegroundColor Cyan
    Get-ChildItem -Path $BackupDir -Filter "*.zip" | 
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 10 |
        Format-Table Name, @{Label="Tamanho";Expression={"{0:N2} MB" -f ($_.Length/1MB)}}, LastWriteTime -AutoSize
        
} catch {
    Write-Host "`n❌ ERRO ao fazer backup: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n⚠️  IMPORTANTE:" -ForegroundColor Red
Write-Host "O arquivo .env NÃO foi incluído no backup (contém credenciais)" -ForegroundColor Yellow
Write-Host "Guarde o .env separadamente em local SEGURO!" -ForegroundColor Yellow

Write-Host "`n💡 Dicas:" -ForegroundColor Yellow
Write-Host "- Guarde este backup em cloud storage (Google Drive, Dropbox, etc.)" -ForegroundColor Yellow
Write-Host "- Faça backups antes de grandes mudanças" -ForegroundColor Yellow
Write-Host "- Mantenha pelo menos 3 backups (atual, anterior, mais antigo)" -ForegroundColor Yellow
Write-Host "- Para restaurar: extraia o ZIP e rode 'npm install'" -ForegroundColor Yellow
Write-Host ""
