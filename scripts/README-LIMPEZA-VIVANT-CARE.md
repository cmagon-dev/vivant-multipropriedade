# Limpeza do Portal Vivant Care

## Sobre

Este script remove todos os dados do portal Vivant Care (cotistas, cotas, reservas, cobranças, assembleias, etc.) **sem afetar** as casas e destinos do portal admin.

## Quando usar

Use este script quando precisar:
- Limpar dados de teste do portal Vivant Care
- Resetar os vínculos de cotistas sem perder as casas cadastradas
- Reconfigurar as propriedades com novos cotistas

## Como executar

```bash
npm run vivant-care:limpar
```

## O que é removido

✅ **Removido:**
- Cotistas e suas cotas de propriedade
- Reservas de semanas
- Trocas de semanas entre cotistas
- Cobranças financeiras
- Assembleias, pautas e votos
- Mensagens e avisos
- Documentos das propriedades
- Notificações dos cotistas

❌ **Mantido:**
- Properties (casas) do portal admin
- Destinations (destinos) do portal admin
- Usuários administradores
- Logs de auditoria

## Fluxo recomendado

1. **Execute o script de limpeza:**
   ```bash
   npm run vivant-care:limpar
   ```

2. **Verifique as casas no portal admin:**
   - Acesse `/admin/casas`
   - Confirme que as casas estão corretas
   - Edite ou crie novas casas se necessário

3. **Configure os cotistas no Vivant Care:**
   - Acesse `/admin-portal/cotistas/novo`
   - Cadastre os cotistas corretos
   - Vincule-os às propriedades adequadas

4. **Configure as reservas e calendário:**
   - Acesse `/admin-portal/propriedades/[id]/calendario`
   - Configure o calendário de cada propriedade

## Segurança

- O script exibe um resumo do que foi removido
- Não há confirmação (executa imediatamente)
- Faça backup do banco de dados antes de executar em produção

## Backup antes de executar

```bash
npm run backup:db
```

Ou use o script PowerShell:
```powershell
.\scripts\backup-database.ps1
```
