@echo off
echo.
echo ========================================
echo   ATUALIZANDO PRISMA CLIENT
echo ========================================
echo.

echo Parando processos Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo Limpando cache do Prisma...
if exist "node_modules\.prisma" (
    rmdir /S /Q "node_modules\.prisma" >nul 2>&1
    timeout /t 1 >nul
)

echo Regenerando Prisma Client...
call npx prisma generate

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCESSO! Prisma Client atualizado!
    echo ========================================
    echo.
    echo Agora voce pode:
    echo   1. Executar: npm run dev
    echo   2. Testar o formulario de destinos
    echo.
) else (
    echo.
    echo ========================================
    echo   ERRO ao regenerar Prisma Client
    echo ========================================
    echo.
    echo Tente fechar TODOS os programas
    echo e executar novamente
    echo.
)

pause
