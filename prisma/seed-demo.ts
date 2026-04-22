/**
 * SEED DE DEMONSTRAÇÃO — apenas para desenvolvimento/testes locais.
 *
 * Cria destinos fictícios, propriedades de exemplo, cotistas de teste,
 * cotas, cobranças e avisos para facilitar o desenvolvimento.
 *
 * NUNCA execute este seed em produção.
 *
 * Pré-requisito: o seed principal já deve ter sido rodado (npm run db:seed).
 *
 * Uso: npm run db:seed:demo
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Iniciando seed de demonstração...\n');
  console.log('⚠️  Este seed cria dados fictícios para desenvolvimento.');
  console.log('    NÃO execute em produção.\n');

  const admin = await prisma.user.findUnique({ where: { email: 'admin@vivant.com.br' } });
  if (!admin) {
    console.error('❌ Usuário admin não encontrado. Execute primeiro: npm run db:seed');
    process.exit(1);
  }

  // 1. Destinos de demonstração
  console.log('🌍 Criando destinos de demonstração...');
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

  // 2. Propriedades de demonstração
  console.log('\n🏠 Criando propriedades de demonstração...');
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

  // 3. Cotistas de teste
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

  // 4. Cotas de propriedade
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

  // 5. Cobranças de exemplo
  console.log('\n💰 Criando cobranças de exemplo...');
  const vencimento = new Date(currentYear, 2, 5); // 5 de março

  const cobrancaExistente1 = await prisma.cobranca.findFirst({
    where: { cotaId: cota1.id, mesReferencia: 3, anoReferencia: currentYear, tipo: 'CONDOMINIO' },
  });
  if (!cobrancaExistente1) {
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
  } else {
    console.log('⏭️  Cobrança 1 já existe, pulando...');
  }

  const cobrancaExistente2 = await prisma.cobranca.findFirst({
    where: { cotaId: cota2.id, mesReferencia: 3, anoReferencia: currentYear, tipo: 'CONDOMINIO' },
  });
  if (!cobrancaExistente2) {
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
  } else {
    console.log('⏭️  Cobrança 2 já existe, pulando...');
  }

  // 6. Avisos de exemplo
  console.log('\n📢 Criando avisos de exemplo...');
  const avisoExistente = await prisma.mensagem.findFirst({
    where: { propertyId: property1.id, titulo: 'Bem-vindo ao Portal do Cotista!' },
  });
  if (!avisoExistente) {
    const aviso1 = await prisma.mensagem.create({
      data: {
        propertyId: property1.id,
        autorNome: 'Administração Vivant',
        autorTipo: 'ADMINISTRACAO',
        titulo: 'Bem-vindo ao Portal do Cotista!',
        conteudo:
          'Estamos muito felizes em ter você conosco. Explore todas as funcionalidades do portal e aproveite ao máximo sua multipropriedade.',
        tipo: 'COMUNICADO',
        prioridade: 'NORMAL',
        fixada: true,
        ativa: true,
      },
    });
    console.log('✅ Aviso criado:', aviso1.titulo);
  } else {
    console.log('⏭️  Aviso já existe, pulando...');
  }

  console.log('\n✨ Seed de demonstração concluído!\n');
  console.log('📝 Credenciais de teste:\n');
  console.log('👨‍💼 ADMIN:');
  console.log('   Email: admin@vivant.com.br | Senha: 123456');
  console.log('👤 COTISTA 1:');
  console.log('   Email: joao@vivant.com.br | Senha: cotista123');
  console.log('👤 COTISTA 2:');
  console.log('   Email: maria@email.com | Senha: cotista123\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed de demonstração:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
