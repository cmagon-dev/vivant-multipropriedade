# Mapa da Estrutura da Aplicação — Base para Manual de Ajuda

Documento gerado para suportar a criação do **Manual do Usuário / Seção de Ajuda** do sistema. Lista todos os módulos, itens de menu e páginas/rotas com descrição e tipo de usuário.

---

## 1) Módulos principais do sistema

| # | Módulo | Descrição |
|---|--------|-----------|
| 1 | **Dashboard / Visão do Dono** | Visão geral e início comercial para administradores |
| 2 | **Comercial / CRM** | Funis, leads, tarefas e eventos de vendas |
| 3 | **Propriedades** | Casas e destinos (cadastro geral do sistema) |
| 4 | **Vivant Care** | Gestão do portal do cotista (cotistas, convites, propriedades, financeiro, avisos, documentos, assembleias, trocas) |
| 5 | **Vivant Capital** | Investimentos sobre imóveis (ativos, investidores, participações, distribuições, solicitações) |
| 6 | **Administração** | Usuários e permissões (roles) |
| 7 | **Suporte** | Ajuda contextual |
| 8 | **Portal do Cotista** | Área do cotista (dashboard, calendário, financeiro, assembleias, trocas, documentos, avisos, perfil) |
| 9 | **Portal do Investidor (Capital)** | Área do investidor Capital (dashboard, portfólio, rendimentos, documentos, solicitações) |
| 10 | **Marketing / Público** | Site institucional, casas, destinos, contato, simulador, etc. |
| 11 | **Autenticação** | Login e aceite de convite |
| 12 | **Admin-portal (legado)** | Portal administrativo alternativo (propriedades, cotistas, convites, financeiro, configurações) |

---

## 2) Itens do menu (sidebar) — Admin

O menu único do admin é filtrado por permissão. Abaixo, todos os itens possíveis.

| Seção | Label do menu | Rota | Permissões necessárias |
|-------|----------------|------|-------------------------|
| DASHBOARD | Visão do Dono | /admin/overview | admin.view, dashboard.admin.view |
| DASHBOARD | Início Comercial | /dashboard/comercial | comercial.view, crm.view |
| COMERCIAL | Funis / CRM | /admin/crm | crm.manage |
| COMERCIAL | Leads | /dashboard/comercial/leads | comercial.view, crm.view |
| COMERCIAL | Tarefas | /admin/tasks | tasks.view, tasks.manage |
| COMERCIAL | Eventos | /admin/events | events.view, events.manage |
| PROPRIEDADES | Casas | /admin/casas | properties.view, properties.manage |
| PROPRIEDADES | Destinos | /admin/destinos | destinations.view, destinations.manage |
| VIVANT CARE | Dashboard | /admin/vivant-care | vivantCare.view |
| VIVANT CARE | Cotistas | /admin/vivant-care/cotistas | vivantCare.cotistas.view, vivantCare.cotistas.manage |
| VIVANT CARE | Convites | /admin/vivant-care/convites | vivantCare.convites.view, vivantCare.convites.manage |
| VIVANT CARE | Propriedades | /admin/vivant-care/propriedades | vivantCare.propriedades.view, vivantCare.propriedades.manage |
| VIVANT CARE | Financeiro | /admin/vivant-care/financeiro | vivantCare.financeiro.view, vivantCare.financeiro.manage |
| VIVANT CARE | Avisos | /admin/vivant-care/avisos | vivantCare.avisos.view, vivantCare.avisos.manage |
| VIVANT CARE | Documentos | /admin/vivant-care/documentos | vivantCare.documentos.view, vivantCare.documentos.manage |
| VIVANT CARE | Assembleias | /admin/vivant-care/assembleias | vivantCare.assembleias.view, vivantCare.assembleias.manage |
| VIVANT CARE | Trocas | /admin/vivant-care/trocas | vivantCare.trocas.view, vivantCare.trocas.manage |
| VIVANT CAPITAL | Capital | /admin/capital | capital.view, capital.manage |
| VIVANT CAPITAL | Ativos | /admin/capital/ativos | capital.view, capital.manage |
| VIVANT CAPITAL | Investidores | /admin/capital/investidores | capital.view, capital.manage |
| VIVANT CAPITAL | Participações | /admin/capital/participacoes | capital.view, capital.manage |
| VIVANT CAPITAL | Distribuições | /admin/capital/distribuicoes | capital.view, capital.manage |
| VIVANT CAPITAL | Solicitações | /admin/capital/solicitacoes | capital.view, capital.manage |
| VIVANT CAPITAL | Relatórios | /admin/capital/relatorios | capital.view, capital.manage |
| ADMINISTRAÇÃO | Usuários | /admin/usuarios | users.manage |
| ADMINISTRAÇÃO | Permissões | /admin/roles | roles.manage |
| SUPORTE | Ajuda | /admin/help | help.view, help.manage |

---

## 3) Todas as páginas/rotas (app folder)

Para cada entrada: **Módulo | Nome da página | Rota | Descrição breve | Tipo de usuário**.

### 3.1 Raiz e autenticação

| Módulo | Página | Rota | Descrição | Usuário |
|--------|--------|------|-----------|---------|
| Marketing | Home | / | Página inicial institucional do site | Público (ou redirect se logado) |
| Autenticação | Login | /login | Tela de login (admin/cotista/investidor) | Público |
| Autenticação | Aceitar convite | /convite/[token] | Aceitar convite de cotista por token | Público (com token) |
| Sistema | Acesso negado | /403 | Página de acesso negado | Qualquer (sem permissão) |

---

## 4) Páginas Admin (/admin/*)

| Módulo | Página | Rota | Descrição | Usuário |
|--------|--------|------|-----------|---------|
| Admin | Redirecionamento admin | /admin | Redireciona para overview ou outra rota conforme permissão | Admin |
| Dashboard | Visão do Dono | /admin/overview | Visão geral para o dono (métricas e atalhos) | Admin (admin.view) |
| Dashboard | Dashboard (alternativo) | /admin/dashboard | Dashboard alternativo do admin | Admin |
| Comercial | Funis / CRM | /admin/crm | Gestão de funis de vendas e CRM | Admin (crm.manage) |
| Comercial | Tarefas | /admin/tasks | Lista de tarefas e pendências do sistema | Admin (tasks) |
| Comercial | Eventos | /admin/events | Eventos do sistema para o dono | Admin (events) |
| Propriedades | Casas | /admin/casas | Listagem de casas/propriedades | Admin (properties) |
| Propriedades | Nova casa | /admin/casas/nova | Cadastro de nova propriedade | Admin (properties) |
| Propriedades | Editar casa | /admin/casas/[id]/editar | Edição de propriedade | Admin (properties) |
| Propriedades | Destinos | /admin/destinos | Listagem de destinos | Admin (destinations) |
| Propriedades | Novo destino | /admin/destinos/novo | Cadastro de novo destino | Admin (destinations) |
| Propriedades | Editar destino | /admin/destinos/[id]/editar | Edição de destino | Admin (destinations) |
| Vivant Care | Dashboard Vivant Care | /admin/vivant-care | Visão geral do módulo (cotistas, propriedades, cobranças, etc.) | Admin (vivantCare.view) |
| Vivant Care | Cotistas | /admin/vivant-care/cotistas | Lista de cotistas do portal | Admin (vivantCare.cotistas) |
| Vivant Care | Convites | /admin/vivant-care/convites | Lista e gestão de convites de cotistas | Admin (vivantCare.convites) |
| Vivant Care | Novo convite | /admin/vivant-care/convites/novo | Criar novo convite | Admin (vivantCare.convites) |
| Vivant Care | Propriedades (Care) | /admin/vivant-care/propriedades | Propriedades do portal e vínculo com cotas | Admin (vivantCare.propriedades) |
| Vivant Care | Nova propriedade (Care) | /admin/vivant-care/propriedades/nova | Cadastro de propriedade no portal | Admin (vivantCare.propriedades) |
| Vivant Care | Detalhe propriedade (Care) | /admin/vivant-care/propriedades/[id] | Detalhe da propriedade no portal | Admin (vivantCare.propriedades) |
| Vivant Care | Editar propriedade (Care) | /admin/vivant-care/propriedades/[id]/editar | Edição da propriedade no portal | Admin (vivantCare.propriedades) |
| Vivant Care | Calendário propriedade | /admin/vivant-care/propriedades/[id]/calendario | Calendário de reservas da propriedade | Admin (vivantCare.propriedades) |
| Vivant Care | Financeiro | /admin/vivant-care/financeiro | Cobranças e financeiro do portal cotista | Admin (vivantCare.financeiro) |
| Vivant Care | Avisos | /admin/vivant-care/avisos | Lista de avisos/comunicados por propriedade | Admin (vivantCare.avisos) |
| Vivant Care | Novo aviso | /admin/vivant-care/avisos/novo | Criar novo aviso | Admin (vivantCare.avisos) |
| Vivant Care | Detalhe aviso | /admin/vivant-care/avisos/[id] | Ver detalhe do aviso | Admin (vivantCare.avisos) |
| Vivant Care | Editar aviso | /admin/vivant-care/avisos/[id]/editar | Editar aviso | Admin (vivantCare.avisos) |
| Vivant Care | Documentos | /admin/vivant-care/documentos | Lista de documentos do portal | Admin (vivantCare.documentos) |
| Vivant Care | Novo documento | /admin/vivant-care/documentos/novo | Upload de novo documento | Admin (vivantCare.documentos) |
| Vivant Care | Detalhe documento | /admin/vivant-care/documentos/[id] | Ver documento | Admin (vivantCare.documentos) |
| Vivant Care | Editar documento | /admin/vivant-care/documentos/[id]/editar | Editar documento | Admin (vivantCare.documentos) |
| Vivant Care | Assembleias | /admin/vivant-care/assembleias | Lista de assembleias | Admin (vivantCare.assembleias) |
| Vivant Care | Nova assembleia | /admin/vivant-care/assembleias/nova | Criar assembleia | Admin (vivantCare.assembleias) |
| Vivant Care | Detalhe assembleia | /admin/vivant-care/assembleias/[id] | Ver assembleia e pautas | Admin (vivantCare.assembleias) |
| Vivant Care | Editar assembleia | /admin/vivant-care/assembleias/[id]/editar | Editar assembleia | Admin (vivantCare.assembleias) |
| Vivant Care | Trocas de semanas | /admin/vivant-care/trocas | Lista de solicitações de troca de semanas | Admin (vivantCare.trocas) |
| Vivant Care | Detalhe troca | /admin/vivant-care/trocas/[id] | Ver e gerenciar solicitação de troca | Admin (vivantCare.trocas) |
| Vivant Capital | Dashboard Capital | /admin/capital | Visão geral (captado, distribuído, investidores, ativos, solicitações) | Admin (capital.view/manage) |
| Vivant Capital | Ativos Capital | /admin/capital/ativos | Imóveis vinculados ao Capital | Admin (capital) |
| Vivant Capital | Vincular ativo | /admin/capital/ativos/novo | Vincular imóvel ao Capital (config cotas, taxa, reserva) | Admin (capital.manage) |
| Vivant Capital | Configurar ativo | /admin/capital/ativos/[id] | Editar configuração do ativo no Capital | Admin (capital) |
| Vivant Capital | Investidores | /admin/capital/investidores | Perfis de investidores | Admin (capital) |
| Vivant Capital | Participações | /admin/capital/participacoes | Participações investidor × ativo | Admin (capital) |
| Vivant Capital | Distribuições | /admin/capital/distribuicoes | Distribuições de resultados por competência | Admin (capital) |
| Vivant Capital | Detalhe distribuição | /admin/capital/distribuicoes/[id] | Detalhe e aprovar/marcar paga | Admin (capital) |
| Vivant Capital | Solicitações liquidez | /admin/capital/solicitacoes | Solicitações de antecipação/resgate | Admin (capital) |
| Vivant Capital | Detalhe solicitação | /admin/capital/solicitacoes/[id] | Aprovar, recusar ou marcar como paga | Admin (capital) |
| Vivant Capital | Relatórios Capital | /admin/capital/relatorios | Relatórios financeiros (placeholder) | Admin (capital) |
| Administração | Usuários | /admin/usuarios | Lista de usuários do sistema | Admin (users.manage) |
| Administração | Novo usuário | /admin/usuarios/novo | Cadastro de usuário | Admin (users.manage) |
| Administração | Editar usuário | /admin/usuarios/[id]/editar | Edição de usuário e roles | Admin (users.manage) |
| Administração | Permissões (Roles) | /admin/roles | Gestão de roles e permissões | Admin (roles.manage) |
| Administração | Permissões (lista) | /admin/permissions | Lista de permissões do sistema | Admin (permissions) |
| Suporte | Ajuda | /admin/help | Conteúdos de ajuda contextual | Admin (help) |

---

## 5) Páginas do investidor/cotista (portal do cotista)

Menu do cotista: Dashboard, Calendário, Financeiro, Assembleias, Troca de Semanas, Documentos, Avisos, Meu Perfil.

| Módulo | Página | Rota | Descrição | Usuário |
|--------|--------|------|-----------|---------|
| Cotista | Redirecionamento cotista | /cotista | Redireciona para o dashboard do cotista | Cotista |
| Cotista | Dashboard | /dashboard | Resumo: status financeiro, próximas reservas, pagamentos pendentes, avisos | Cotista |
| Cotista | Calendário | /dashboard/calendario | Calendário de semanas e reservas | Cotista |
| Cotista | Financeiro | /dashboard/financeiro | Cobranças e pagamentos do cotista | Cotista |
| Cotista | Detalhe cobrança | /dashboard/financeiro/[id] | Detalhe de uma cobrança | Cotista |
| Cotista | Assembleias | /dashboard/assembleias | Lista de assembleias das propriedades do cotista | Cotista |
| Cotista | Detalhe assembleia | /dashboard/assembleias/[id] | Ver detalhe e pautas da assembleia | Cotista |
| Cotista | Trocas de semanas | /dashboard/trocas | Lista de solicitações de troca e nova solicitação | Cotista |
| Cotista | Detalhe troca | /dashboard/trocas/[id] | Ver detalhe e cancelar solicitação (se aberta) | Cotista |
| Cotista | Documentos | /dashboard/documentos | Documentos das propriedades do cotista | Cotista |
| Cotista | Avisos | /dashboard/avisos | Avisos e comunicados | Cotista |
| Cotista | Meu perfil | /dashboard/perfil | Dados e perfil do cotista | Cotista |

---

## 6) Páginas relacionadas a CRM / Comercial

| Módulo | Página | Rota | Descrição | Usuário |
|--------|--------|------|-----------|---------|
| Comercial | Início Comercial | /dashboard/comercial | Visão geral comercial (métricas, atalhos) | Admin / Comercial |
| Comercial | Leads | /dashboard/comercial/leads | Lista/kanban de leads | Admin / Comercial |
| Comercial | Propriedades (comercial) | /dashboard/comercial/propriedades | Propriedades no contexto comercial | Admin / Comercial |
| Comercial | Funis / CRM | /admin/crm | Configuração de funis e CRM | Admin (crm.manage) |
| Comercial | Tarefas | /admin/tasks | Tarefas do sistema | Admin (tasks) |
| Comercial | Eventos | /admin/events | Eventos do sistema | Admin (events) |

---

## 7) Páginas Capital / investimento

### 7.1 Admin — Vivant Capital

(Já listadas na seção 4; resumo abaixo.)

| Página | Rota | Descrição | Usuário |
|--------|------|-----------|---------|
| Dashboard Capital | /admin/capital | Totais e resumo financeiro | Admin (capital) |
| Ativos | /admin/capital/ativos | Imóveis no Capital | Admin (capital) |
| Vincular ativo | /admin/capital/ativos/novo | Novo ativo | Admin (capital.manage) |
| Configurar ativo | /admin/capital/ativos/[id] | Editar ativo | Admin (capital) |
| Investidores | /admin/capital/investidores | Perfis de investidor | Admin (capital) |
| Participações | /admin/capital/participacoes | Participações por ativo | Admin (capital) |
| Distribuições | /admin/capital/distribuicoes | Distribuições por competência | Admin (capital) |
| Detalhe distribuição | /admin/capital/distribuicoes/[id] | Aprovar/pagar | Admin (capital) |
| Solicitações | /admin/capital/solicitacoes | Antecipação/resgate | Admin (capital) |
| Detalhe solicitação | /admin/capital/solicitacoes/[id] | Decidir solicitação | Admin (capital) |
| Relatórios | /admin/capital/relatorios | Relatórios (em breve) | Admin (capital) |

### 7.2 Portal do investidor (Capital)

Menu: Dashboard, Portfólio, Rendimentos, Documentos, Solicitações.

| Módulo | Página | Rota | Descrição | Usuário |
|--------|--------|------|-----------|---------|
| Capital Investidor | Dashboard | /capital | Patrimônio, valor estimado, rendimento, ativos, solicitações em aberto | Investidor (Capital) |
| Capital Investidor | Portfólio | /capital/portfolio | Ativos em que participa | Investidor |
| Capital Investidor | Detalhe ativo | /capital/ativos/[id] | Dados do imóvel + sua participação + avaliação | Investidor |
| Capital Investidor | Rendimentos | /capital/rendimentos | Histórico de distribuições recebidas | Investidor |
| Capital Investidor | Documentos | /capital/documentos | Documentos dos imóveis em que participa | Investidor |
| Capital Investidor | Solicitações | /capital/solicitacoes | Lista e nova solicitação (antecipação/resgate) | Investidor |
| Capital Investidor | Detalhe solicitação | /capital/solicitacoes/[id] | Status da solicitação | Investidor |

---

## 8) Páginas relacionadas a reservas

| Módulo | Página | Rota | Descrição | Usuário |
|--------|--------|------|-----------|---------|
| Cotista | Calendário | /dashboard/calendario | Calendário de semanas e reservas do cotista | Cotista |
| Vivant Care | Calendário propriedade | /admin/vivant-care/propriedades/[id]/calendario | Calendário de reservas de uma propriedade (admin) | Admin (vivantCare) |
| Admin-portal | Calendário propriedade | /admin-portal/propriedades/[id]/calendario | Calendário no admin-portal (legado) | Admin |

*(Reservas são criadas/gerenciadas no calendário do cotista e no calendário da propriedade no admin.)*

---

## 9) Páginas de configuração / administração

| Módulo | Página | Rota | Descrição | Usuário |
|--------|--------|------|-----------|---------|
| Administração | Usuários | /admin/usuarios | Lista e gestão de usuários | Admin (users.manage) |
| Administração | Novo usuário | /admin/usuarios/novo | Criar usuário | Admin (users.manage) |
| Administração | Editar usuário | /admin/usuarios/[id]/editar | Editar usuário e role | Admin (users.manage) |
| Administração | Roles / Permissões | /admin/roles | Roles e permissões (RBAC) | Admin (roles.manage) |
| Administração | Permissões | /admin/permissions | Lista de permissões | Admin (permissions.manage) |
| Suporte | Ajuda | /admin/help | Conteúdos de ajuda | Admin (help) |
| Admin-portal | Início admin-portal | /admin-portal | Página inicial do admin-portal (legado) | Admin |
| Admin-portal | Propriedades | /admin-portal/propriedades | Propriedades (legado) | Admin |
| Admin-portal | Nova propriedade | /admin-portal/propriedades/nova | Nova propriedade (legado) | Admin |
| Admin-portal | Detalhe propriedade | /admin-portal/propriedades/[id] | Detalhe (legado) | Admin |
| Admin-portal | Editar propriedade | /admin-portal/propriedades/[id]/editar | Editar (legado) | Admin |
| Admin-portal | Calendário | /admin-portal/propriedades/[id]/calendario | Calendário (legado) | Admin |
| Admin-portal | Cotistas | /admin-portal/cotistas | Cotistas (legado) | Admin |
| Admin-portal | Novo cotista | /admin-portal/cotistas/novo | Novo cotista (legado) | Admin |
| Admin-portal | Convites pendentes | /admin-portal/convites-pendentes | Convites (legado) | Admin |
| Admin-portal | Financeiro | /admin-portal/financeiro | Financeiro (legado) | Admin |
| Admin-portal | Configurações | /admin-portal/configuracoes | Configurações do admin-portal (legado) | Admin |

---

## 10) Outras rotas (dashboard, marketing, público, admin-portal)

| Módulo | Página | Rota | Descrição | Usuário |
|--------|--------|------|-----------|---------|
| Dashboard | Portal cotista (redirect) | /portal-cotista | Redirecionamento para portal do cotista | Admin/Cotista |
| Dashboard | Simulador | /dashboard/simulador | Simulador (dashboard) | Admin (conforme permissão) |
| Público | Captar | /captar | Página de captação de leads | Público |
| Público | Captar por tipo | /captar/[tipo] | Captação por tipo | Público |
| Marketing | Modelo | /modelo | Página “O modelo Vivant” | Público |
| Marketing | Destinos | /destinos | Nossos destinos | Público |
| Marketing | Casas | /casas | Nossas casas | Público |
| Marketing | Casa (slug) | /casas/[slug] | Detalhe de uma casa | Público |
| Marketing | Contato | /contato | Fale conosco | Público |
| Marketing | Parceiros | /parceiros | Vivant Parceiros | Público |
| Marketing | Vivant Care (institucional) | /care | Página institucional Vivant Care | Público |
| Marketing | Sobre Capital | /sobre-capital | Página institucional Vivant Capital | Público |
| Marketing | Simulador investimentos | /simulador-investimentos | Simulador de investimentos (público) | Público |
| Marketing | Apresentação | /apresentacao | Apresentação (conteúdo institucional) | Público |

*(Rotas do admin-portal legado estão listadas na seção 9 — Configuração / administração.)*

---

## Tipos de usuário referenciados

| Tipo | Descrição |
|------|-----------|
| **Público** | Visitante não autenticado |
| **Admin** | Usuário do painel administrativo (roles: OWNER, SUPER_ADMIN, ADMIN, STAFF, COMMERCIAL, etc.); acesso conforme permissões |
| **Comercial** | Admin com foco em vendas/CRM (comercial.view, crm.*) |
| **Cotista** | Usuário do portal do cotista (acesso a /dashboard/*) |
| **Investidor (Capital)** | Usuário do portal Vivant Capital (role INVESTOR; acesso a /capital/*) |

---

*Documento gerado para servir de base ao Manual de Ajuda / Manual do Usuário. Atualize este mapa quando novas rotas ou módulos forem adicionados.*
