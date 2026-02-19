# ✅ Sistema Deployado - Checklist de Testes

## 🎉 Parabéns! O deploy foi concluído com sucesso!

Agora vamos testar tudo em produção e configurar a segurança.

---

## 📝 Testes Obrigatórios em Produção

### 1. Acesso Básico ao Site

**URL:** Sua URL de produção (ex: `https://vivant-multipropriedade.vercel.app`)

- [ ] Página inicial carrega corretamente
- [ ] Layout está responsivo
- [ ] Imagens aparecem
- [ ] Navegação funciona

### 2. Teste de Login no Admin

**URL:** `[SUA-URL]/admin`

Credenciais iniciais:
```
Email: admin@vivant.com.br
Senha: vivant@2024
```

**O que testar:**
- [ ] Página de login carrega
- [ ] Consegue fazer login com as credenciais acima
- [ ] Redireciona para `/admin/dashboard` após login
- [ ] Dashboard aparece com sidebar e header
- [ ] Não há erros no console do navegador (F12)

### 3. Teste de CRUD - Casas

- [ ] Acesse: `[SUA-URL]/admin/casas`
- [ ] Lista de casas aparece (pode estar vazia)
- [ ] Clique em "Nova Casa"
- [ ] Preencha um formulário de teste
- [ ] Teste o upload de imagem
- [ ] Salve a casa
- [ ] Verifique se aparece na lista
- [ ] Edite a casa criada
- [ ] Publique a casa
- [ ] Tente deletar (só funciona se você for ADMIN)

### 4. Teste de CRUD - Destinos

- [ ] Acesse: `[SUA-URL]/admin/destinos`
- [ ] Lista de destinos aparece
- [ ] Clique em "Novo Destino"
- [ ] Preencha o formulário
- [ ] Adicione as 4 features obrigatórias
- [ ] Salve o destino
- [ ] Edite e publique

### 5. Teste de Gestão de Usuários

- [ ] Acesse: `[SUA-URL]/admin/usuarios`
- [ ] Lista de usuários aparece (deve ter pelo menos o admin)
- [ ] Clique em "Novo Usuário"
- [ ] Crie um usuário de teste (role: EDITOR)
- [ ] Verifique se aparece na lista

---

## 🔒 AÇÕES DE SEGURANÇA OBRIGATÓRIAS

### ⚠️ CRÍTICO 1: Trocar Senha do Admin

**FAÇA ISSO AGORA, antes de qualquer outra coisa:**

1. Acesse: `[SUA-URL]/admin/usuarios`
2. Encontre o usuário **admin@vivant.com.br**
3. Clique no botão de **Editar** (ícone de lápis)
4. No formulário, preencha:
   - **Nova senha:** [Use uma senha FORTE - mínimo 12 caracteres]
   - Exemplo: `Vivant@2026!Secure#Admin`
5. Clique em **Salvar**
6. **Anote essa nova senha em local seguro!**
7. Faça logout e login novamente com a nova senha para confirmar

**Por que isso é crítico?**
- A senha `vivant@2024` é padrão e está em arquivos públicos
- Qualquer pessoa pode tentar usar essa senha
- Você precisa proteger o acesso administrativo IMEDIATAMENTE

### CRÍTICO 2: Criar Usuários Individuais

**NÃO compartilhe a conta de admin!**

Para cada pessoa da equipe:

1. Acesse: `[SUA-URL]/admin/usuarios`
2. Clique em **Novo Usuário**
3. Preencha:
   - Nome completo da pessoa
   - Email corporativo
   - Senha inicial (pessoa deve trocar depois)
   - Role apropriada:
     - **ADMIN:** Só para 1-2 pessoas (acesso total)
     - **EDITOR:** Para equipe de conteúdo (criar/editar)
     - **VIEWER:** Para visualização apenas
4. Envie as credenciais para a pessoa de forma segura
5. Peça para ela trocar a senha no primeiro acesso

---

## 🧪 Testes Adicionais (Opcional mas Recomendado)

### Teste de Permissões

1. Faça logout
2. Login com usuário EDITOR
3. Tente acessar `/admin/usuarios` → Deve bloquear
4. Tente deletar uma casa → Deve bloquear
5. Tente criar/editar casa → Deve funcionar

### Teste de Páginas Públicas

- [ ] `[SUA-URL]/casas` - Lista de casas
- [ ] `[SUA-URL]/destinos` - Lista de destinos
- [ ] `[SUA-URL]/contato` - Formulário de contato
- [ ] `[SUA-URL]/simulador-investimentos` - Simulador

### Teste de Performance

- [ ] Site carrega rápido (< 3 segundos)
- [ ] Imagens otimizadas
- [ ] Navegação fluida
- [ ] Não há erros no console

---

## 📊 Status do Sistema

Após completar todos os testes acima:

### ✅ Sistema Funcional
- [x] Build completado
- [x] Deploy bem-sucedido
- [x] Variáveis de ambiente configuradas
- [ ] Testes em produção realizados
- [ ] Senha do admin trocada
- [ ] Usuários individuais criados

### 🎯 Próximas Melhorias (Futuro)

Estas são melhorias opcionais para implementar depois:

1. **Migrar páginas públicas para o banco**
   - Atualmente `/casas` e `/destinos` usam dados hardcoded
   - Migrar para buscar do Prisma

2. **Recuperação de senha**
   - Implementar "Esqueci minha senha"
   - Envio de email com token

3. **Domínios customizados**
   - Configurar `vivantresidences.com.br`
   - Configurar `vivantcapital.com.br`
   - Configurar `vivantcare.com.br`

4. **Analytics**
   - Configurar Google Analytics
   - Monitorar acessos e conversões

---

## 🆘 Se Encontrar Problemas

### Erro de Login
- Limpe o cache do navegador
- Tente em aba anônima
- Verifique se `NEXTAUTH_URL` está correto

### Erro de Banco de Dados
- Verifique se todas as variáveis `POSTGRES_*` foram configuradas
- Veja os logs na Vercel (Functions → Logs)

### Upload de Imagens Não Funciona
- Confirme que `BLOB_READ_WRITE_TOKEN` está correto
- Veja se o Vercel Blob está ativo na sua conta

---

## ✨ Sistema Pronto para Uso!

Após completar este checklist, seu sistema estará 100% funcional e seguro para uso em produção!

**Última atualização:** 19 de Fevereiro de 2026
