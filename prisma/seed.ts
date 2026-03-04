import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // 1. Criar usuário admin
  console.log('👤 Criando usuário admin...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vivant.com.br' },
    update: {},
    create: {
      name: 'Admin Vivant',
      email: 'admin@vivant.com.br',
      password: adminPassword,
      role: 'ADMIN',
      active: true,
    },
  });
  console.log('✅ Admin criado:', admin.email);

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
      images: ['/placeholder-house.jpg'],
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
      images: ['/placeholder-apt.jpg'],
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
    where: { email: 'joao@email.com' },
    update: {},
    create: {
      name: 'João da Silva',
      email: 'joao@email.com',
      cpf: '12345678900',
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

  const cotista3 = await prisma.cotista.upsert({
    where: { email: 'cmagon@glocon.com.br' },
    update: {},
    create: {
      name: 'Caio Magon',
      email: 'cmagon@glocon.com.br',
      cpf: '07946178913',
      phone: '(44) 98809-7007',
      password: cotistaPassword,
      active: true,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Cotista criado:', cotista3.name);

  // 5. Criar cotas de propriedade
  console.log('\n📊 Criando cotas de propriedade...');
  const currentYear = new Date().getFullYear();
  
  const cota1 = await prisma.cotaPropriedade.create({
    data: {
      cotistaId: cotista1.id,
      propertyId: property1.id,
      numeroCota: 'Cota 1 de 6',
      percentualCota: 16.67,
      semanasAno: 8,
      semanasConfig: {
        baseYear: currentYear,
        weeks: [2, 10, 18, 26, 34, 42, 50, 52]
      },
      ativo: true,
    },
  });
  console.log('✅ Cota criada:', cota1.numeroCota);

  const cota2 = await prisma.cotaPropriedade.create({
    data: {
      cotistaId: cotista2.id,
      propertyId: property2.id,
      numeroCota: 'Cota 1 de 8',
      percentualCota: 12.5,
      semanasAno: 6,
      semanasConfig: {
        baseYear: currentYear,
        weeks: [5, 13, 21, 29, 37, 45]
      },
      ativo: true,
    },
  });
  console.log('✅ Cota criada:', cota2.numeroCota);

  // 6. Criar algumas reservas
  console.log('\n📅 Criando reservas de exemplo...');
  const weekStart = new Date(currentYear, 0, 8); // Semana 2
  const weekEnd = new Date(currentYear, 0, 15);

  const reserva1 = await prisma.reserva.create({
    data: {
      cotaId: cota1.id,
      cotistaId: cotista1.id,
      ano: currentYear,
      numeroSemana: 2,
      dataInicio: weekStart,
      dataFim: weekEnd,
      status: 'CONFIRMADA',
      confirmadoEm: new Date(),
    },
  });
  console.log('✅ Reserva criada: Semana', reserva1.numeroSemana);

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
  console.log('📝 Credenciais de acesso:\n');
  console.log('👨‍💼 ADMIN:');
  console.log('   Email: admin@vivant.com.br');
  console.log('   Senha: admin123');
  console.log('   URL: http://localhost:3000/login\n');
  console.log('👤 COTISTA 1:');
  console.log('   Email: joao@email.com');
  console.log('   Senha: cotista123');
  console.log('   URL: http://localhost:3000/portal-cotista\n');
  console.log('👤 COTISTA 2:');
  console.log('   Email: maria@email.com');
  console.log('   Senha: cotista123');
  console.log('   URL: http://localhost:3000/portal-cotista\n');
  console.log('👤 COTISTA 3 (Caio Magon):');
  console.log('   Email: cmagon@glocon.com.br');
  console.log('   Senha: cotista123');
  console.log('   CPF: 079.461.789-13');
  console.log('   Telefone: (44) 98809-7007');
  console.log('   URL: http://localhost:3000/portal-cotista\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
