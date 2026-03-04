# Script de Setup Completo do Admin Portal

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🔧 SETUP COMPLETO - ADMIN PORTAL" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# 1. Aplicar Schema no Banco
Write-Host "PASSO 1: Aplicando schema no banco..." -ForegroundColor Yellow
Write-Host "-----------------------------------------------" -ForegroundColor Gray
npx prisma db push --accept-data-loss --skip-generate
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erro ao aplicar schema no banco" -ForegroundColor Red
    Write-Host "   Verifique se o servidor dev está parado (Ctrl+C)" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Schema aplicado com sucesso!" -ForegroundColor Green
Write-Host ""

# 2. Gerar Prisma Client
Write-Host "PASSO 2: Gerando Prisma Client..." -ForegroundColor Yellow
Write-Host "-----------------------------------------------" -ForegroundColor Gray
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  Aviso ao gerar client" -ForegroundColor Yellow
    Write-Host "   Isso pode acontecer se o servidor estiver rodando" -ForegroundColor Yellow
    Write-Host "   O client será regerado automaticamente no próximo restart" -ForegroundColor Yellow
    Write-Host ""
}
else {
    Write-Host "✅ Client gerado com sucesso!" -ForegroundColor Green
    Write-Host ""
}

# 3. Popular Banco com Dados
Write-Host "PASSO 3: Populando banco com dados de teste..." -ForegroundColor Yellow
Write-Host "-----------------------------------------------" -ForegroundColor Gray
npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erro ao popular banco" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Banco populado com sucesso!" -ForegroundColor Green
Write-Host ""

# 4. Sucesso
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Green
Write-Host "   ✅ SETUP CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "   1. Inicie o servidor:" -ForegroundColor White
Write-Host "      npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "   2. Acesse o Admin Portal:" -ForegroundColor White
Write-Host "      http://localhost:3000/login" -ForegroundColor Yellow
Write-Host ""
Write-Host "   3. Faça login:" -ForegroundColor White
Write-Host "      • Selecione 'Admin Portal' (verde)" -ForegroundColor Yellow
Write-Host "      • Email: admin@vivant.com" -ForegroundColor Yellow
Write-Host "      • Senha: admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Tudo pronto para usar!" -ForegroundColor Green
Write-Host ""
