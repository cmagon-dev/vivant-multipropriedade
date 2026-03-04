# Script para corrigir e reiniciar o Admin Portal

Write-Host "🔧 Corrigindo Admin Portal..." -ForegroundColor Cyan
Write-Host ""

# 1. Aplicar mudanças no banco
Write-Host "1️⃣ Aplicando mudanças no banco de dados..." -ForegroundColor Yellow
npx prisma db push --accept-data-loss
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao aplicar mudanças no banco" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Banco atualizado" -ForegroundColor Green
Write-Host ""

# 2. Gerar Prisma Client
Write-Host "2️⃣ Gerando Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Aviso: Erro ao gerar client (servidor pode estar rodando)" -ForegroundColor Yellow
    Write-Host "   O client será regerado automaticamente quando o servidor reiniciar" -ForegroundColor Yellow
}
else {
    Write-Host "✅ Client gerado" -ForegroundColor Green
}
Write-Host ""

# 3. Popular banco
Write-Host "3️⃣ Populando banco com dados de teste..." -ForegroundColor Yellow
npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao popular banco" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Banco populado" -ForegroundColor Green
Write-Host ""

# 4. Instruções finais
Write-Host "✅ Correções aplicadas com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Reinicie o servidor: npm run dev" -ForegroundColor White
Write-Host "   2. Acesse: http://localhost:3000/admin-portal" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Pronto para usar!" -ForegroundColor Green
