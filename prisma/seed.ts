import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // 1. Usuário ADMIN inicial: admin@vivant.com.br / 123456
  console.log('👤 Criando/atualizando usuário ADMIN inicial...');
  const adminPassword = await bcrypt.hash('123456', 10);
  const adminEmail = 'admin@vivant.com.br';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword, active: true, defaultRoute: '/admin' },
    create: {
      name: 'Administrador Vivant',
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
      active: true,
      defaultRoute: '/admin',
    },
  });
  console.log('✅ ADMIN criado/atualizado:', admin.email);

  // 1a. Company padrão (evita companyId null no upsert de UserRoleAssignment)
  const defaultCompany = await prisma.company.upsert({
    where: { slug: 'default' },
    update: {},
    create: { name: 'Vivant', slug: 'default', active: true },
  });
  console.log('✅ Company padrão:', defaultCompany.slug);

  // 1b. RBAC: Roles e Permissions
  console.log('\n🔐 Criando roles e permissões...');
  const roles = [
    { key: 'OWNER', name: 'Dono', description: 'Acesso total ao sistema (visibilidade de tudo)', isSystem: true },
    { key: 'SUPER_ADMIN', name: 'Super Admin', description: 'Acesso total ao sistema', isSystem: true },
    { key: 'COMMERCIAL', name: 'Comercial', description: 'Vendedor / Comercial', isSystem: true },
    { key: 'ADMIN', name: 'Administrador', description: 'Admin da empresa/portal', isSystem: true },
    { key: 'STAFF', name: 'Equipe', description: 'Colaborador com permissões limitadas', isSystem: true },
    { key: 'COTISTA', name: 'Cotista', description: 'Investidor / Portal cotista', isSystem: true },
    { key: 'INVESTOR', name: 'Investidor Capital', description: 'Portal Vivant Capital (investimentos)', isSystem: true },
  ];
  for (const r of roles) {
    await prisma.role.upsert({
      where: { key: r.key },
      update: { name: r.name, description: r.description, isSystem: r.isSystem },
      create: r,
    });
  }
  const ownerRole = await prisma.role.findUniqueOrThrow({ where: { key: 'OWNER' } });
  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { key: 'SUPER_ADMIN' } });
  const commercialRole = await prisma.role.findUniqueOrThrow({ where: { key: 'COMMERCIAL' } });
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { key: 'ADMIN' } });
  const staffRole = await prisma.role.findUniqueOrThrow({ where: { key: 'STAFF' } });

  const permissions = [
    { key: 'admin.view', name: 'Ver painel admin', description: 'Acesso ao /admin', group: 'dashboard' },
    { key: 'dashboard.admin.view', name: 'Ver painel admin', description: 'Acesso ao /admin', group: 'dashboard' },
    { key: 'dashboard.view', name: 'Ver dashboard', description: 'Acesso ao painel dashboard', group: 'dashboard' },
    { key: 'comercial.view', name: 'Ver painel comercial', description: 'Acesso ao /dashboard/comercial', group: 'crm' },
    { key: 'cotista.view', name: 'Ver portal cotista', description: 'Acesso ao portal do cotista', group: 'cotista' },
    { key: 'users.view', name: 'Ver usuários', description: 'Listar usuários', group: 'users' },
    { key: 'users.create', name: 'Criar usuários', description: 'Criar novos usuários', group: 'users' },
    { key: 'users.edit', name: 'Editar usuários', description: 'Editar usuários', group: 'users' },
    { key: 'users.delete', name: 'Excluir usuários', description: 'Excluir usuários', group: 'users' },
    { key: 'users.manage', name: 'Gerenciar usuários', description: 'CRUD e atribuição de usuários', group: 'users' },
    { key: 'roles.view', name: 'Ver roles', description: 'Listar roles', group: 'roles' },
    { key: 'roles.manage', name: 'Gerenciar roles', description: 'Criar e editar roles', group: 'roles' },
    { key: 'permissions.view', name: 'Ver permissões', description: 'Listar permissões', group: 'permissions' },
    { key: 'permissions.manage', name: 'Gerenciar permissões', description: 'Atribuir permissões a roles', group: 'permissions' },
    { key: 'help.view', name: 'Ver ajuda', description: 'Conteúdos de ajuda', group: 'help' },
    { key: 'help.manage', name: 'Gerenciar ajuda', description: 'Editar conteúdos de ajuda contextual', group: 'help' },
    { key: 'companies.manage', name: 'Gerenciar empresas', description: 'Multi-tenant', group: 'companies' },
    { key: 'events.view', name: 'Ver eventos', description: 'Eventos do sistema', group: 'events' },
    { key: 'events.manage', name: 'Gerenciar eventos', description: 'Admin de eventos', group: 'events' },
    { key: 'tasks.view', name: 'Ver tarefas', description: 'Tarefas e pendências', group: 'tasks' },
    { key: 'tasks.manage', name: 'Gerenciar tarefas', description: 'Admin de tarefas', group: 'tasks' },
    { key: 'crm.view', name: 'Ver CRM/Leads', description: 'Visualizar funis e leads', group: 'crm' },
    { key: 'crm.create', name: 'Criar leads', description: 'Criar novos leads', group: 'crm' },
    { key: 'crm.edit', name: 'Editar leads', description: 'Editar dados de leads', group: 'crm' },
    { key: 'crm.delete', name: 'Excluir leads', description: 'Excluir leads', group: 'crm' },
    { key: 'crm.manage', name: 'Gerenciar CRM', description: 'Tipos, etapas, motivos de perda', group: 'crm' },
    { key: 'crm.activity', name: 'Registrar atividades', description: 'Notas, ligações, WhatsApp', group: 'crm' },
    { key: 'crm.move', name: 'Mover etapa', description: 'Mover lead entre etapas', group: 'crm' },
    { key: 'crm.close', name: 'Fechar lead', description: 'Ganho/Perda', group: 'crm' },
    { key: 'sla.manage', name: 'Configurar SLA / Kanban', description: 'Pode configurar SLA e thresholds por etapa', group: 'crm' },
    { key: 'leads.read', name: 'Ler leads (legado)', description: 'Visualizar leads', group: 'crm' },
    { key: 'leads.write', name: 'Editar leads (legado)', description: 'Criar/editar leads', group: 'crm' },
    { key: 'properties.view', name: 'Ver propriedades', description: 'Visualizar casas/propriedades', group: 'properties' },
    { key: 'properties.read', name: 'Ler propriedades (legado)', description: 'Visualizar propriedades', group: 'properties' },
    { key: 'properties.write', name: 'Editar propriedades (legado)', description: 'Criar/editar propriedades', group: 'properties' },
    { key: 'properties.create', name: 'Criar propriedades', description: 'Criar propriedades', group: 'properties' },
    { key: 'properties.edit', name: 'Editar propriedades', description: 'Editar propriedades', group: 'properties' },
    { key: 'properties.delete', name: 'Excluir propriedades', description: 'Excluir propriedades', group: 'properties' },
    { key: 'properties.manage', name: 'Gerenciar propriedades', description: 'Admin total de propriedades', group: 'properties' },
    { key: 'destinations.view', name: 'Ver destinos', description: 'Visualizar destinos', group: 'destinations' },
    { key: 'destinations.create', name: 'Criar destinos', description: 'Criar novos destinos', group: 'destinations' },
    { key: 'destinations.edit', name: 'Editar destinos', description: 'Editar destinos', group: 'destinations' },
    { key: 'destinations.delete', name: 'Excluir destinos', description: 'Excluir destinos', group: 'destinations' },
    { key: 'destinations.manage', name: 'Gerenciar destinos', description: 'CRUD de destinos', group: 'destinations' },
    // Vivant Care
    { key: 'vivantCare.view', name: 'Ver Vivant Care', description: 'Acesso ao módulo Vivant Care no admin', group: 'vivantCare' },
    { key: 'vivantCare.cotistas.view', name: 'Ver cotistas', description: 'Listar cotistas do Vivant Care', group: 'vivantCare' },
    { key: 'vivantCare.cotistas.manage', name: 'Gerenciar cotistas', description: 'CRUD e convites de cotistas', group: 'vivantCare' },
    { key: 'vivantCare.propriedades.view', name: 'Ver propriedades (Vivant Care)', description: 'Listar propriedades do portal', group: 'vivantCare' },
    { key: 'vivantCare.propriedades.manage', name: 'Gerenciar propriedades (Vivant Care)', description: 'Editar propriedades e cotas do portal', group: 'vivantCare' },
    { key: 'vivantCare.financeiro.view', name: 'Ver financeiro', description: 'Listar cobranças e financeiro', group: 'vivantCare' },
    { key: 'vivantCare.financeiro.manage', name: 'Gerenciar financeiro', description: 'Gerar cobranças e registrar pagamentos', group: 'vivantCare' },
    { key: 'vivantCare.avisos.view', name: 'Ver avisos', description: 'Listar avisos/comunicados', group: 'vivantCare' },
    { key: 'vivantCare.avisos.manage', name: 'Gerenciar avisos', description: 'Criar e editar avisos por propriedade', group: 'vivantCare' },
    { key: 'vivantCare.documentos.view', name: 'Ver documentos', description: 'Listar documentos do portal', group: 'vivantCare' },
    { key: 'vivantCare.documentos.manage', name: 'Gerenciar documentos', description: 'Upload e gestão de documentos', group: 'vivantCare' },
    { key: 'vivantCare.convites.view', name: 'Ver convites', description: 'Listar convites de cotistas', group: 'vivantCare' },
    { key: 'vivantCare.convites.manage', name: 'Gerenciar convites', description: 'Criar, reenviar e cancelar convites', group: 'vivantCare' },
    { key: 'vivantCare.assembleias.view', name: 'Ver assembleias', description: 'Listar assembleias', group: 'vivantCare' },
    { key: 'vivantCare.assembleias.manage', name: 'Gerenciar assembleias', description: 'Criar e editar assembleias e pautas', group: 'vivantCare' },
    { key: 'vivantCare.trocas.view', name: 'Ver trocas de semanas', description: 'Listar solicitações de troca', group: 'vivantCare' },
    { key: 'vivantCare.trocas.manage', name: 'Gerenciar trocas', description: 'Aprovar, reprovar e gerenciar trocas', group: 'vivantCare' },
    // Vivant Capital
    { key: 'capital.view', name: 'Ver Vivant Capital', description: 'Acesso ao módulo Capital no admin', group: 'capital' },
    { key: 'capital.manage', name: 'Gerenciar Capital', description: 'Ativos, investidores, distribuições', group: 'capital' },
    { key: 'capital.portal', name: 'Portal do investidor', description: 'Acesso ao portal /capital', group: 'capital' },
  ];
  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: { name: p.name, description: p.description, group: p.group },
      create: p,
    });
  }

  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: ownerRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: ownerRole.id, permissionId: perm.id },
    });
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: perm.id },
    });
  }

  const byKey = (k: string) => allPermissions.find((p) => p.key === k)!;
  const dashboardView = byKey('dashboard.view');
  const dashboardAdminView = byKey('dashboard.admin.view');
  const adminView = byKey('admin.view');
  const comercialView = byKey('comercial.view');
  const cotistaView = byKey('cotista.view');
  const crmView = byKey('crm.view');
  const crmCreate = byKey('crm.create');
  const crmEdit = byKey('crm.edit');
  const crmActivity = byKey('crm.activity');
  const crmMove = byKey('crm.move');
  const crmClose = byKey('crm.close');
  const slaManage = byKey('sla.manage');
  const propsRead = byKey('properties.read');
  const propsView = byKey('properties.view');
  const propsWrite = byKey('properties.write');
  const leadsRead = byKey('leads.read');
  const leadsWrite = byKey('leads.write');
  const eventsView = byKey('events.view');
  const tasksView = byKey('tasks.view');

  const adminPerms = [adminView, dashboardView, dashboardAdminView, propsRead, propsWrite, leadsRead, leadsWrite, cotistaView, slaManage];
  for (const perm of adminPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  const commercialPerms = [comercialView, crmView, crmCreate, crmEdit, crmActivity, crmMove, crmClose, dashboardView, leadsRead, leadsWrite, propsRead, propsView];
  for (const perm of commercialPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: commercialRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: commercialRole.id, permissionId: perm.id },
    });
  }

  const staffPerms = [dashboardView, propsView, propsRead, eventsView, tasksView];
  for (const perm of staffPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: staffRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: staffRole.id, permissionId: perm.id },
    });
  }

  const cotistaRole = await prisma.role.findUniqueOrThrow({ where: { key: 'COTISTA' } });
  for (const perm of [cotistaView]) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: cotistaRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: cotistaRole.id, permissionId: perm.id },
    });
  }

  const investorRole = await prisma.role.findUniqueOrThrow({ where: { key: 'INVESTOR' } });
  const capitalPortal = allPermissions.find((p) => p.key === 'capital.portal');
  if (capitalPortal) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: investorRole.id, permissionId: capitalPortal.id } },
      update: {},
      create: { roleId: investorRole.id, permissionId: capitalPortal.id },
    });
  }

  await prisma.userRoleAssignment.upsert({
    where: { userId_roleId_companyId: { userId: admin.id, roleId: ownerRole.id, companyId: defaultCompany.id } },
    update: {},
    create: { userId: admin.id, roleId: ownerRole.id, companyId: defaultCompany.id },
  });
  console.log('✅ RBAC configurado (admin como OWNER)');

  // 1b. Ajuda contextual — conteúdos padrão
  console.log('\n💡 Criando conteúdos de ajuda padrão...');
  await prisma.helpContent.upsert({
    where: { key: 'crm.funnel.howto' },
    update: {
      title: 'Como usar o Funil de Vendas (CRM)',
      description:
        'Como usar o Funil de Vendas (CRM)\n\n' +
        'O Funil é onde você acompanha todos os seus clientes em andamento, desde o primeiro contato até o fechamento.\n' +
        'Ele funciona como um quadro organizado por etapas.\n\n' +
        'O que é o Funil?\n' +
        'Imagine uma mesa dividida em colunas.\n' +
        'Cada coluna representa uma etapa do seu processo comercial, por exemplo:\n' +
        '- Novo Lead\n' +
        '- Contato Inicial\n' +
        '- Visita Agendada\n' +
        '- Negociação\n' +
        '- Fechado\n' +
        'Cada cliente (Lead) aparece como um cartão dentro dessas colunas.\n\n' +
        'Como funciona na prática\n' +
        '1. Quando um novo cliente entra no sistema, ele aparece na primeira etapa.\n' +
        '2. Conforme o atendimento evolui, você arrasta o cartão para a próxima etapa.\n' +
        '3. Assim você visualiza rapidamente:\n' +
        '- Quantos clientes estão em cada fase\n' +
        '- Quem está demorando para avançar\n' +
        '- Onde estão as oportunidades de fechamento\n\n' +
        'Cores e prazos (SLA)\n' +
        'Cada etapa pode ter um prazo definido.\n' +
        'As cores da borda do cartão indicam a situação do atendimento:\n' +
        'Verde → Dentro do prazo\n' +
        'Amarelo → Atenção, prazo se aproximando\n' +
        'Laranja → Urgente\n' +
        'Vermelho → Prazo vencido\n' +
        'Se estiver vermelho, aparecerá quanto tempo está atrasado.\n' +
        'Isso ajuda a equipe a não perder oportunidades por demora no atendimento.\n\n' +
        'Movendo um Lead\n' +
        'Para mudar um cliente de etapa:\n' +
        '- Basta arrastar o cartão para a próxima coluna.\n' +
        '- Ao mudar de etapa, inicia um novo prazo referente àquela fase.\n' +
        'O histórico de movimentações fica registrado para acompanhamento.\n\n' +
        'Por que usar o Funil?\n' +
        '- Organização visual da equipe\n' +
        '- Controle de prazos\n' +
        '- Redução de perdas por atraso\n' +
        '- Mais previsibilidade de fechamento\n\n' +
        'Para gestores\n' +
        'O gestor pode acompanhar:\n' +
        '- Leads atrasados\n' +
        '- Etapas com maior volume\n' +
        '- Histórico de atrasos\n' +
        '- Desempenho da equipe',
      shortText: 'Guia passo a passo para entender o funil de vendas, etapas, cores e prazos (SLA).',
      audienceRole: null,
    },
    create: {
      key: 'crm.funnel.howto',
      title: 'Como usar o Funil de Vendas (CRM)',
      description:
        'Como usar o Funil de Vendas (CRM)\n\n' +
        'O Funil é onde você acompanha todos os seus clientes em andamento, desde o primeiro contato até o fechamento.\n' +
        'Ele funciona como um quadro organizado por etapas.\n\n' +
        'O que é o Funil?\n' +
        'Imagine uma mesa dividida em colunas.\n' +
        'Cada coluna representa uma etapa do seu processo comercial, por exemplo:\n' +
        '- Novo Lead\n' +
        '- Contato Inicial\n' +
        '- Visita Agendada\n' +
        '- Negociação\n' +
        '- Fechado\n' +
        'Cada cliente (Lead) aparece como um cartão dentro dessas colunas.\n\n' +
        'Como funciona na prática\n' +
        '1. Quando um novo cliente entra no sistema, ele aparece na primeira etapa.\n' +
        '2. Conforme o atendimento evolui, você arrasta o cartão para a próxima etapa.\n' +
        '3. Assim você visualiza rapidamente:\n' +
        '- Quantos clientes estão em cada fase\n' +
        '- Quem está demorando para avançar\n' +
        '- Onde estão as oportunidades de fechamento\n\n' +
        'Cores e prazos (SLA)\n' +
        'Cada etapa pode ter um prazo definido.\n' +
        'As cores da borda do cartão indicam a situação do atendimento:\n' +
        'Verde → Dentro do prazo\n' +
        'Amarelo → Atenção, prazo se aproximando\n' +
        'Laranja → Urgente\n' +
        'Vermelho → Prazo vencido\n' +
        'Se estiver vermelho, aparecerá quanto tempo está atrasado.\n' +
        'Isso ajuda a equipe a não perder oportunidades por demora no atendimento.\n\n' +
        'Movendo um Lead\n' +
        'Para mudar um cliente de etapa:\n' +
        '- Basta arrastar o cartão para a próxima coluna.\n' +
        '- Ao mudar de etapa, inicia um novo prazo referente àquela fase.\n' +
        'O histórico de movimentações fica registrado para acompanhamento.\n\n' +
        'Por que usar o Funil?\n' +
        '- Organização visual da equipe\n' +
        '- Controle de prazos\n' +
        '- Redução de perdas por atraso\n' +
        '- Mais previsibilidade de fechamento\n\n' +
        'Para gestores\n' +
        'O gestor pode acompanhar:\n' +
        '- Leads atrasados\n' +
        '- Etapas com maior volume\n' +
        '- Histórico de atrasos\n' +
        '- Desempenho da equipe',
      shortText: 'Guia passo a passo para entender o funil de vendas, etapas, cores e prazos (SLA).',
      videoUrl: null,
      audienceRole: null,
    },
  });

  // 1c. CRM — Tipos e etapas (3 funis prontos)
  console.log('\n📊 Criando tipos e funis CRM...');
  const leadTypesData = [
    { key: 'IMOVEL', name: 'Captação de Imóvel', description: 'Funil para captação de imóveis', order: 1 },
    { key: 'INVESTIDOR', name: 'Captação de Investidor (Aporte/Empréstimo)', description: 'Funil para investidores', order: 2 },
    { key: 'COTISTA', name: 'Venda de Cotas', description: 'Funil para venda de cotas', order: 3 },
    { key: 'MODELO', name: 'Conhecer o modelo', description: 'Funil para quem quer conhecer melhor o modelo Vivant', order: 4 },
  ];
  for (const lt of leadTypesData) {
    await prisma.leadType.upsert({
      where: { key: lt.key },
      update: { name: lt.name, description: lt.description ?? null, order: lt.order, isActive: true },
      create: { key: lt.key, name: lt.name, description: lt.description ?? null, order: lt.order, isActive: true },
    });
  }
  const imovelType = await prisma.leadType.findUniqueOrThrow({ where: { key: 'IMOVEL' } });
  const investidorType = await prisma.leadType.findUniqueOrThrow({ where: { key: 'INVESTIDOR' } });
  const cotistaType = await prisma.leadType.findUniqueOrThrow({ where: { key: 'COTISTA' } });
  const modeloType = await prisma.leadType.findUniqueOrThrow({ where: { key: 'MODELO' } });

  const imovelStages = [
    { order: 1, name: 'Novo Lead', slaHours: 2, isFinal: false, finalStatus: null },
    { order: 2, name: 'Coleta de informações', slaHours: 24, isFinal: false, finalStatus: null },
    { order: 3, name: 'Pré-análise', slaHours: 24, isFinal: false, finalStatus: null },
    { order: 4, name: 'Visita/Avaliação', slaHours: 72, isFinal: false, finalStatus: null },
    { order: 5, name: 'Proposta enviada', slaHours: 24, isFinal: false, finalStatus: null },
    { order: 6, name: 'Negociação', slaHours: 72, isFinal: false, finalStatus: null },
    { order: 7, name: 'Fechado - Imóvel captado', slaHours: null, isFinal: true, finalStatus: 'WON' as const },
    { order: 8, name: 'Perdido', slaHours: null, isFinal: true, finalStatus: 'LOST' as const },
  ];
  for (const s of imovelStages) {
    await prisma.leadStage.upsert({
      where: { leadTypeId_order: { leadTypeId: imovelType.id, order: s.order } },
      update: { name: s.name, slaHours: s.slaHours, isFinal: s.isFinal, finalStatus: s.finalStatus, isActive: true },
      create: { leadTypeId: imovelType.id, name: s.name, order: s.order, slaHours: s.slaHours, isFinal: s.isFinal, finalStatus: s.finalStatus, isActive: true },
    });
  }
  const investidorStages = [
    { order: 1, name: 'Novo contato', slaHours: 2, isFinal: false, finalStatus: null },
    { order: 2, name: 'Perfil e objetivo', slaHours: 24, isFinal: false, finalStatus: null },
    { order: 3, name: 'Simulação/Explicação', slaHours: 24, isFinal: false, finalStatus: null },
    { order: 4, name: 'Proposta/Termos enviados', slaHours: 24, isFinal: false, finalStatus: null },
    { order: 5, name: 'Validação', slaHours: 72, isFinal: false, finalStatus: null },
    { order: 6, name: 'Fechado - Aporte confirmado', slaHours: null, isFinal: true, finalStatus: 'WON' as const },
    { order: 7, name: 'Perdido', slaHours: null, isFinal: true, finalStatus: 'LOST' as const },
  ];
  for (const s of investidorStages) {
    await prisma.leadStage.upsert({
      where: { leadTypeId_order: { leadTypeId: investidorType.id, order: s.order } },
      update: { name: s.name, slaHours: s.slaHours, isFinal: s.isFinal, finalStatus: s.finalStatus, isActive: true },
      create: { leadTypeId: investidorType.id, name: s.name, order: s.order, slaHours: s.slaHours, isFinal: s.isFinal, finalStatus: s.finalStatus, isActive: true },
    });
  }
  const cotistaStages = [
    { order: 1, name: 'Novo Lead', slaHours: 2, isFinal: false, finalStatus: null },
    { order: 2, name: 'Primeiro contato', slaHours: 24, isFinal: false, finalStatus: null },
    { order: 3, name: 'Qualificação', slaHours: 48, isFinal: false, finalStatus: null },
    { order: 4, name: 'Apresentação', slaHours: 48, isFinal: false, finalStatus: null },
    { order: 5, name: 'Proposta', slaHours: 24, isFinal: false, finalStatus: null },
    { order: 6, name: 'Negociação', slaHours: 72, isFinal: false, finalStatus: null },
    { order: 7, name: 'Fechado - Cota vendida', slaHours: null, isFinal: true, finalStatus: 'WON' as const },
    { order: 8, name: 'Perdido', slaHours: null, isFinal: true, finalStatus: 'LOST' as const },
  ];
  for (const s of cotistaStages) {
    await prisma.leadStage.upsert({
      where: { leadTypeId_order: { leadTypeId: cotistaType.id, order: s.order } },
      update: { name: s.name, slaHours: s.slaHours, isFinal: s.isFinal, finalStatus: s.finalStatus, isActive: true },
      create: { leadTypeId: cotistaType.id, name: s.name, order: s.order, slaHours: s.slaHours, isFinal: s.isFinal, finalStatus: s.finalStatus, isActive: true },
    });
  }
  const modeloStages = [
    { order: 1, name: 'Novo contato', slaHours: 2, isFinal: false, finalStatus: null },
    { order: 2, name: 'Qualificação', slaHours: 24, isFinal: false, finalStatus: null },
    { order: 3, name: 'Enviou material', slaHours: 48, isFinal: false, finalStatus: null },
    { order: 4, name: 'Fechado - conhecendo', slaHours: null, isFinal: true, finalStatus: 'WON' as const },
    { order: 5, name: 'Perdido', slaHours: null, isFinal: true, finalStatus: 'LOST' as const },
  ];
  for (const s of modeloStages) {
    await prisma.leadStage.upsert({
      where: { leadTypeId_order: { leadTypeId: modeloType.id, order: s.order } },
      update: { name: s.name, slaHours: s.slaHours, isFinal: s.isFinal, finalStatus: s.finalStatus, isActive: true },
      create: { leadTypeId: modeloType.id, name: s.name, order: s.order, slaHours: s.slaHours, isFinal: s.isFinal, finalStatus: s.finalStatus, isActive: true },
    });
  }
  const imovelFirst = await prisma.leadStage.findFirst({ where: { leadTypeId: imovelType.id, isActive: true }, orderBy: { order: 'asc' } });
  const investidorFirst = await prisma.leadStage.findFirst({ where: { leadTypeId: investidorType.id, isActive: true }, orderBy: { order: 'asc' } });
  const cotistaFirst = await prisma.leadStage.findFirst({ where: { leadTypeId: cotistaType.id, isActive: true }, orderBy: { order: 'asc' } });
  const modeloFirst = await prisma.leadStage.findFirst({ where: { leadTypeId: modeloType.id, isActive: true }, orderBy: { order: 'asc' } });
  if (imovelFirst) await prisma.leadType.update({ where: { id: imovelType.id }, data: { initialStageId: imovelFirst.id } });
  if (investidorFirst) await prisma.leadType.update({ where: { id: investidorType.id }, data: { initialStageId: investidorFirst.id } });
  if (cotistaFirst) await prisma.leadType.update({ where: { id: cotistaType.id }, data: { initialStageId: cotistaFirst.id } });
  if (modeloFirst) await prisma.leadType.update({ where: { id: modeloType.id }, data: { initialStageId: modeloFirst.id } });

  const defaultLossReasons = [
    { order: 1, name: 'Preço' },
    { order: 2, name: 'Sem retorno' },
    { order: 3, name: 'Não qualificado' },
    { order: 4, name: 'Concorrente' },
    { order: 5, name: 'Desistiu' },
  ];
  for (const lr of defaultLossReasons) {
    await prisma.leadLossReason.upsert({
      where: { leadTypeId_order: { leadTypeId: imovelType.id, order: lr.order } },
      update: { name: lr.name },
      create: { leadTypeId: imovelType.id, name: lr.name, order: lr.order, isActive: true },
    });
    await prisma.leadLossReason.upsert({
      where: { leadTypeId_order: { leadTypeId: investidorType.id, order: lr.order } },
      update: { name: lr.name },
      create: { leadTypeId: investidorType.id, name: lr.name, order: lr.order, isActive: true },
    });
    await prisma.leadLossReason.upsert({
      where: { leadTypeId_order: { leadTypeId: cotistaType.id, order: lr.order } },
      update: { name: lr.name },
      create: { leadTypeId: cotistaType.id, name: lr.name, order: lr.order, isActive: true },
    });
    await prisma.leadLossReason.upsert({
      where: { leadTypeId_order: { leadTypeId: modeloType.id, order: lr.order } },
      update: { name: lr.name },
      create: { leadTypeId: modeloType.id, name: lr.name, order: lr.order, isActive: true },
    });
  }
  const playbookDefaults: { nameContains: string; whatsTemplate: string; playbookChecklist: string[]; helpText: string }[] = [
    {
      nameContains: 'Novo Lead',
      whatsTemplate: 'Olá {nome}, tudo bem? Aqui é {vendedor} da Vivant. Vi seu interesse em {tipo}. Posso te fazer 2 perguntas rápidas?',
      playbookChecklist: ['Confirmar dados de contato', 'Entender necessidade', 'Agendar próximo contato'],
      helpText: 'Primeiro contato: seja cordial e objetivo.',
    },
    {
      nameContains: 'Primeiro contato',
      whatsTemplate: 'Olá {nome}! Aqui é {vendedor} da Vivant. Vi que você tem interesse em {tipo}. Tudo bem se eu te enviar mais informações?',
      playbookChecklist: ['Apresentar a Vivant', 'Qualificar interesse', 'Combinar próximo passo'],
      helpText: 'Apresente-se e qualifique o lead.',
    },
    {
      nameContains: 'Novo contato',
      whatsTemplate: 'Olá {nome}, tudo bem? Sou {vendedor} da Vivant. Vi seu interesse em {tipo}. Podemos conversar um pouco?',
      playbookChecklist: ['Confirmar perfil', 'Explicar opções', 'Agendar simulação'],
      helpText: 'Contato inicial para investidores.',
    },
    {
      nameContains: 'Proposta enviada',
      whatsTemplate: 'Oi {nome}, aqui é {vendedor}. Enviei a proposta para {etapa}. Quando puder, dá uma olhada e me diz se tiver dúvidas!',
      playbookChecklist: ['Confirmar recebimento', 'Esclarecer dúvidas', 'Definir prazo de retorno'],
      helpText: 'Acompanhe o retorno da proposta.',
    },
    {
      nameContains: 'Proposta/Termos',
      whatsTemplate: 'Olá {nome}, {vendedor} da Vivant. Os termos da proposta foram enviados. Qualquer dúvida, estou à disposição.',
      playbookChecklist: ['Confirmar leitura', 'Responder dúvidas', 'Agendar validação'],
      helpText: 'Follow-up da proposta enviada.',
    },
    {
      nameContains: 'Proposta',
      whatsTemplate: 'Oi {nome}! Segue a proposta que comentei. Qualquer coisa me chama no {telefone}. Abraço, {vendedor}.',
      playbookChecklist: ['Enviar proposta', 'Confirmar recebimento', 'Agendar feedback'],
      helpText: 'Envie a proposta e combine retorno.',
    },
    {
      nameContains: 'Negociação',
      whatsTemplate: 'Oi {nome}, tudo certo? Aqui é {vendedor}. Estamos na reta final da {etapa}. Posso te ajudar em mais alguma coisa para fecharmos?',
      playbookChecklist: ['Alinhar condições', 'Resolver objeções', 'Fechar acordo'],
      helpText: 'Reforce benefícios e feche o negócio.',
    },
  ];
  const allStages = await prisma.leadStage.findMany({ where: { whatsTemplate: null }, select: { id: true, name: true } });
  for (const stage of allStages) {
    const match = playbookDefaults.find((p) => stage.name.includes(p.nameContains) || p.nameContains.includes(stage.name));
    if (match) {
      await prisma.leadStage.update({
        where: { id: stage.id },
        data: {
          whatsTemplate: match.whatsTemplate,
          playbookChecklist: match.playbookChecklist,
          helpText: match.helpText,
        },
      });
    }
  }

  // Distribuição: vendedor padrão por tipo de funil (para captação pública)
  const firstCommercial = await prisma.user.findFirst({
    where: {
      active: true,
      userRoleAssignments: { some: { roleId: commercialRole.id } },
    },
    select: { id: true },
  });
  const defaultOwnerId = firstCommercial?.id ?? admin.id;
  for (const leadType of [imovelType, investidorType, cotistaType, modeloType]) {
    await prisma.leadTypeAssignment.upsert({
      where: { leadTypeId: leadType.id },
      update: { defaultOwnerUserId: defaultOwnerId, isActive: true },
      create: { leadTypeId: leadType.id, defaultOwnerUserId: defaultOwnerId, isActive: true },
    });
  }
  console.log('✅ CRM: 4 tipos, funis, motivos de perda, playbook e distribuição criados');

  // 2. Criar destinos
  console.log('\n🌍 Criando destinos...');
  const gramado = await prisma.destination.upsert({
    where: { slug: 'gramado' },
    update: {},
    create: {
      name: 'Gramado',
      slug: 'gramado',
      state: 'RS',
      emoji: '🏔️',
      color: '#10B981',
      subtitle: 'Serra Gaúcha',
      location: 'Gramado, Rio Grande do Sul',
      description: 'Conhecido por seu charme europeu e belezas naturais.',
      climate: 'Clima subtropical, frio no inverno com possibilidade de neve.',
      lifestyle: 'Tranquilo e acolhedor, perfeito para famílias.',
      features: ['Natureza', 'Gastronomia', 'Cultura'],
      appreciation: '15% ao ano',
      published: true,
      order: 1,
      createdById: admin.id,
    },
  });
  console.log('✅ Destino criado:', gramado.name);

  const florianopolis = await prisma.destination.upsert({
    where: { slug: 'florianopolis' },
    update: {},
    create: {
      name: 'Florianópolis',
      slug: 'florianopolis',
      state: 'SC',
      emoji: '🏖️',
      color: '#3B82F6',
      subtitle: 'Ilha da Magia',
      location: 'Florianópolis, Santa Catarina',
      description: 'Praias paradisíacas e qualidade de vida excepcional.',
      climate: 'Clima subtropical oceânico, verões quentes e invernos amenos.',
      lifestyle: 'Moderno e vibrante, com ótima infraestrutura.',
      features: ['Praias', 'Surf', 'Tecnologia'],
      appreciation: '18% ao ano',
      published: true,
      order: 2,
      createdById: admin.id,
    },
  });
  console.log('✅ Destino criado:', florianopolis.name);

  // 3. Criar propriedades
  console.log('\n🏠 Criando propriedades...');
  const property1 = await prisma.property.upsert({
    where: { slug: 'casa-gramado-centro' },
    update: {},
    create: {
      name: 'Casa Gramado Centro',
      slug: 'casa-gramado-centro',
      description: 'Linda casa no centro de Gramado com vista para as montanhas.',
      location: 'Centro, Gramado',
      cidade: 'Gramado',
      destinoId: gramado.id,
      condominio: 'Condomínio Vale Encantado',
      type: 'Casa',
      priceValue: 850000,
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      fraction: '1/6',
      price: 'R$ 850.000',
      monthlyFee: 'R$ 800',
      weeks: '8 semanas/ano',
      images: [],
      features: ['Lareira', 'Churrasqueira', 'Jardim', 'Garagem'],
      appreciation: '15% ao ano',
      status: 'DISPONIVEL',
      highlight: true,
      published: true,
      createdById: admin.id,
    },
  });
  console.log('✅ Propriedade criada:', property1.name);

  const property2 = await prisma.property.upsert({
    where: { slug: 'apto-floripa-beira-mar' },
    update: {},
    create: {
      name: 'Apto Floripa Beira-mar',
      slug: 'apto-floripa-beira-mar',
      description: 'Apartamento de frente para o mar em Canasvieiras.',
      location: 'Canasvieiras, Florianópolis',
      cidade: 'Florianópolis',
      destinoId: florianopolis.id,
      condominio: 'Edifício Mar Azul',
      type: 'Apartamento',
      priceValue: 650000,
      bedrooms: 2,
      bathrooms: 2,
      area: 95,
      fraction: '1/8',
      price: 'R$ 650.000',
      monthlyFee: 'R$ 600',
      weeks: '6 semanas/ano',
      images: [],
      features: ['Piscina', 'Academia', 'Vista Mar', 'Segurança 24h'],
      appreciation: '18% ao ano',
      status: 'DISPONIVEL',
      highlight: true,
      published: true,
      createdById: admin.id,
    },
  });
  console.log('✅ Propriedade criada:', property2.name);

  // 4. Criar cotista de teste
  console.log('\n👥 Criando cotistas de teste...');
  const cotistaPassword = await bcrypt.hash('cotista123', 10);
  
  const cotista1 = await prisma.cotista.upsert({
    where: { email: 'joao@vivant.com.br' },
    update: { password: cotistaPassword, active: true },
    create: {
      name: 'João da Silva',
      email: 'joao@vivant.com.br',
      cpf: '11122233344',
      phone: '(11) 99999-1234',
      password: cotistaPassword,
      active: true,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Cotista criado:', cotista1.name);

  const cotista2 = await prisma.cotista.upsert({
    where: { email: 'maria@email.com' },
    update: {},
    create: {
      name: 'Maria Oliveira',
      email: 'maria@email.com',
      cpf: '98765432100',
      phone: '(11) 99999-5678',
      password: cotistaPassword,
      active: true,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Cotista criado:', cotista2.name);

  // 5. Criar cotas de propriedade (idempotente)
  console.log('\n📊 Criando cotas de propriedade...');
  const currentYear = new Date().getFullYear();

  const cota1Data = {
    cotistaId: cotista1.id,
    propertyId: property1.id,
    numeroCota: 'Cota 1 de 6',
    percentualCota: 16.67,
    semanasAno: 8,
    ativo: true,
  };
  const cota1 = await prisma.cotaPropriedade.upsert({
    where: {
      cotistaId_propertyId_numeroCota: {
        cotistaId: cota1Data.cotistaId,
        propertyId: cota1Data.propertyId,
        numeroCota: cota1Data.numeroCota,
      },
    },
    update: { percentualCota: cota1Data.percentualCota, semanasAno: cota1Data.semanasAno, ativo: true },
    create: cota1Data,
  });
  console.log('✅ Cota 1 garantida:', cota1.numeroCota);

  const cota2Data = {
    cotistaId: cotista2.id,
    propertyId: property2.id,
    numeroCota: 'Cota 1 de 8',
    percentualCota: 12.5,
    semanasAno: 6,
    ativo: true,
  };
  const cota2 = await prisma.cotaPropriedade.upsert({
    where: {
      cotistaId_propertyId_numeroCota: {
        cotistaId: cota2Data.cotistaId,
        propertyId: cota2Data.propertyId,
        numeroCota: cota2Data.numeroCota,
      },
    },
    update: { percentualCota: cota2Data.percentualCota, semanasAno: cota2Data.semanasAno, ativo: true },
    create: cota2Data,
  });
  console.log('✅ Cota 2 garantida:', cota2.numeroCota);

  // 6. Reservas de exemplo: use o calendário oficial no admin (publicar ano + distribuir + reservar).

  // 7. Criar cobranças
  console.log('\n💰 Criando cobranças...');
  const vencimento = new Date(currentYear, 2, 5); // 5 de março

  const cobranca1 = await prisma.cobranca.create({
    data: {
      cotaId: cota1.id,
      tipo: 'CONDOMINIO',
      descricao: 'Condomínio - Março/2024',
      valor: 800,
      mesReferencia: 3,
      anoReferencia: currentYear,
      dataVencimento: vencimento,
      status: 'PENDENTE',
    },
  });
  console.log('✅ Cobrança criada:', cobranca1.descricao);

  const cobranca2 = await prisma.cobranca.create({
    data: {
      cotaId: cota2.id,
      tipo: 'CONDOMINIO',
      descricao: 'Condomínio - Março/2024',
      valor: 600,
      mesReferencia: 3,
      anoReferencia: currentYear,
      dataVencimento: vencimento,
      status: 'PENDENTE',
    },
  });
  console.log('✅ Cobrança criada:', cobranca2.descricao);

  // 8. Criar avisos
  console.log('\n📢 Criando avisos...');
  const aviso1 = await prisma.mensagem.create({
    data: {
      propertyId: property1.id,
      autorNome: 'Administração Vivant',
      autorTipo: 'ADMINISTRACAO',
      titulo: 'Bem-vindo ao Portal do Cotista!',
      conteudo: 'Estamos muito felizes em ter você conosco. Explore todas as funcionalidades do portal e aproveite ao máximo sua multipropriedade.',
      tipo: 'COMUNICADO',
      prioridade: 'NORMAL',
      fixada: true,
      ativa: true,
    },
  });
  console.log('✅ Aviso criado:', aviso1.titulo);

  console.log('\n✨ Seed concluído com sucesso!\n');
  console.log('📝 Credenciais de acesso iniciais:\n');
  console.log('👨‍💼 ADMIN:');
  console.log('   Email: admin@vivant.com.br');
  console.log('   Senha: 123456');
  console.log('   URL: http://localhost:3000/login\n');
  console.log('👤 COTISTA 1:');
  console.log('   Email: joao@vivant.com.br');
  console.log('   Senha: cotista123');
  console.log('   URL: http://localhost:3000/login (escolher Cotista)\n');
  console.log('👤 COTISTA 2:');
  console.log('   Email: maria@email.com');
  console.log('   Senha: cotista123');
  console.log('   URL: http://localhost:3000/login (escolher Cotista)\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
