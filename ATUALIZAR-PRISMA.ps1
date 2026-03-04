# Script para atualizar o Prisma Client
# Execute este script de um NOVO terminal PowerShell

Write-Host "🔧 Atualizando Prisma Client..." -ForegroundColor Cyan
Write-Host ""

# Parar processos Node.js
Write-Host "🛑 Parando processos Node.js..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Limpar pasta do Prisma Client
Write-Host "🧹 Limpando cache do Prisma..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Path "node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Regenerar Prisma Client
Write-Host "⚡ Regenerando Prisma Client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Prisma Client atualizado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Agora você pode:" -ForegroundColor Cyan
    Write-Host "  1. Executar: npm run dev" -ForegroundColor White
    Write-Host "  2. Testar o formulário de destinos com imagens" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro ao regenerar Prisma Client" -ForegroundColor Red
    Write-Host "Tente fechar TODOS os programas e executar novamente" -ForegroundColor Yellow
    Write-Host ""
}

pause
