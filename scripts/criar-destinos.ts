/**
 * Script para criar os 3 destinos principais da Vivant
 * 
 * Destinos:
 * 1. Porto Rico - PR
 * 2. Represa Capivara - PR
 * 3. Litoral Catarinense - SC
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function criarDestinos() {
  console.log('🏝️  Criando destinos da Vivant...\n');

  try {
    // Buscar um usuário admin para ser o criador
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });

    if (!adminUser) {
      console.error('❌ Nenhum usuário admin encontrado. Por favor, crie um usuário admin primeiro.');
      return;
    }

    console.log(`✓ Usando usuário: ${adminUser.name}\n`);

    // 1. PORTO RICO - PR
    console.log('🚤 Criando destino: Porto Rico - PR...');
    const portoRico = await prisma.destination.create({
      data: {
        name: 'Porto Rico',
        slug: 'porto-rico-pr',
        state: 'Paraná',
        emoji: '🚤',
        color: 'from-blue-500 to-cyan-400',
        subtitle: 'O Caribe Paranaense às margens do Rio Paraná',
        location: '120 km de Maringá | 580 km de Curitiba | 650 km de São Paulo',
        description: `Conhecido como o "Caribe Paranaense", Porto Rico é um verdadeiro paraíso náutico às margens do Rio Paraná. Com águas cristalinas da Represa de Itaipu, praias de areia branca e uma infraestrutura turística de primeiro mundo, Porto Rico combina natureza exuberante com conforto e sofisticação. A cidade oferece uma das melhores experiências de lazer aquático do Brasil, com marinas modernas, restaurantes à beira-rio e uma vida noturna vibrante que atrai turistas de todo o país.`,
        climate: `Clima tropical de altitude com temperaturas médias de 28°C no verão e 18°C no inverno. O sol brilha praticamente o ano todo, com verões quentes e úmidos perfeitos para esportes aquáticos. A temporada de alta movimentação vai de dezembro a março, mas o destino é agradável em qualquer época do ano, especialmente na primavera e outono quando as temperaturas são mais amenas.`,
        lifestyle: `Porto Rico é sinônimo de estilo de vida náutico e descontraído. Os dias começam com café da manhã com vista para o rio, seguidos de jet-ski, wakeboard, passeios de lancha e stand-up paddle. As tardes são perfeitas para relaxar nas praias de água doce ou explorar as ilhas fluviais. À noite, a orla se transforma com restaurantes sofisticados, bares com música ao vivo e o famoso pôr do sol sobre o Rio Paraná. É o destino ideal para famílias que buscam diversão aquática e casais que querem tranquilidade e romance.`,
        features: [
          {
            icon: '🌊',
            title: 'Águas Cristalinas',
            desc: 'Praias de água doce com transparência incrível e areia branca'
          },
          {
            icon: '⛵',
            title: 'Esportes Náuticos',
            desc: 'Jet-ski, wakeboard, lancha, stand-up paddle e pesca esportiva'
          },
          {
            icon: '🏖️',
            title: 'Infraestrutura Completa',
            desc: 'Marinas modernas, restaurantes gourmet e comércio diversificado'
          },
          {
            icon: '🌅',
            title: 'Pôr do Sol Espetacular',
            desc: 'Vista privilegiada para o pôr do sol mais bonito do Paraná'
          }
        ],
        appreciation: 'Valorização de 42% nos últimos 3 anos. A demanda por imóveis em Porto Rico cresceu exponencialmente com a consolidação do turismo náutico na região. Investimento seguro em destino consolidado com alta procura nacional.',
        published: true,
        publishedAt: new Date(),
        order: 1,
        createdById: adminUser.id,
      }
    });
    console.log(`   ✓ Porto Rico criado com sucesso!\n`);

    // 2. REPRESA CAPIVARA - PR
    console.log('🏞️  Criando destino: Represa Capivara - PR...');
    const represaCapivara = await prisma.destination.create({
      data: {
        name: 'Represa Capivara',
        slug: 'represa-capivara-pr',
        state: 'Paraná',
        emoji: '🏞️',
        color: 'from-emerald-500 to-teal-400',
        subtitle: 'Natureza preservada e tranquilidade no interior do Paraná',
        location: '80 km de Londrina | 90 km de Maringá | 480 km de Curitiba',
        description: `A Represa Capivara é um verdadeiro refúgio de paz e conexão com a natureza. Localizada na região de Chavantes, entre Paraná e São Paulo, este reservatório oferece 600 km² de águas calmas perfeitas para quem busca tranquilidade e contato com a natureza preservada. Com mata atlântica nativa, fauna abundante e águas limpas, a Capivara é ideal para pesca esportiva, passeios de barco contemplativos e momentos de descanso longe do agito urbano. É o destino perfeito para quem valoriza privacidade, silêncio e a experiência autêntica do campo.`,
        climate: `Clima subtropical com verões quentes e úmidos (temperatura média de 26°C) e invernos amenos e secos (média de 16°C). A região tem estações bem definidas, com primavera e outono muito agradáveis. As chuvas são bem distribuídas ao longo do ano, mas o verão é a época mais úmida. O clima é perfeito para quem gosta de acordar com o canto dos pássaros e desfrutar de um clima mais temperado que o litoral.`,
        lifestyle: `O estilo de vida na Represa Capivara é voltado para o descanso e a contemplação. Os dias começam com o som da natureza, café da manhã na varanda com vista para a represa e passeios de barco para pescar ou simplesmente observar a fauna local. É comum ver tucanos, araras e capivaras nas margens. As tardes são perfeitas para leitura, caminhadas ecológicas ou simplesmente relaxar na rede. À noite, churrascos em família, fogueiras e noites estreladas sem poluição luminosa. É o refúgio ideal para quem quer desacelerar e reconectar com o essencial.`,
        features: [
          {
            icon: '🎣',
            title: 'Pesca Esportiva',
            desc: 'Represa rica em peixes nobres: dourado, pintado, pacu e tilápia'
          },
          {
            icon: '🦜',
            title: 'Fauna e Flora',
            desc: 'Mata atlântica preservada com tucanos, araras e capivaras'
          },
          {
            icon: '🛶',
            title: 'Águas Calmas',
            desc: 'Perfeito para caiaque, stand-up paddle e passeios de barco'
          },
          {
            icon: '🌳',
            title: 'Privacidade Total',
            desc: 'Ambiente tranquilo e reservado, longe da agitação urbana'
          }
        ],
        appreciation: 'Valorização de 35% nos últimos 3 anos. A busca por refúgios naturais e propriedades rurais cresceu significativamente pós-pandemia. Investimento estratégico em área de alta demanda por turismo de natureza e pesca esportiva.',
        published: true,
        publishedAt: new Date(),
        order: 2,
        createdById: adminUser.id,
      }
    });
    console.log(`   ✓ Represa Capivara criada com sucesso!\n`);

    // 3. LITORAL CATARINENSE - SC
    console.log('🏖️  Criando destino: Litoral Catarinense - SC...');
    const litoralCatarinense = await prisma.destination.create({
      data: {
        name: 'Litoral Catarinense',
        slug: 'litoral-catarinense-sc',
        state: 'Santa Catarina',
        emoji: '🏖️',
        color: 'from-orange-500 to-pink-500',
        subtitle: 'Praias paradisíacas e cultura açoriana no litoral mais belo do Brasil',
        location: '50 km de Florianópolis | 180 km de Curitiba | 700 km de São Paulo',
        description: `O litoral de Santa Catarina é considerado um dos mais belos do Brasil, combinando praias de águas cristalinas, montanhas cobertas de Mata Atlântica e a rica herança cultural açoriana. Com mais de 500 km de costa, a região oferece desde praias badaladas com infraestrutura completa até enseadas desertas e intocadas. A gastronomia local é referência nacional, especialmente em frutos do mar, e a hospitalidade catarinense é conhecida em todo o país. É o destino perfeito para quem busca o melhor do litoral brasileiro: beleza natural, cultura rica e infraestrutura de primeiro mundo.`,
        climate: `Clima subtropical oceânico com verões quentes e úmidos (média de 28°C) e invernos amenos (média de 15°C). O mar tem temperatura agradável para banho praticamente o ano todo, especialmente entre dezembro e abril. A primavera e o outono são épocas ideais para quem prefere menos movimento e temperaturas mais amenas. Santa Catarina tem cerca de 280 dias de sol por ano, tornando o litoral atrativo em qualquer estação.`,
        lifestyle: `O estilo de vida no litoral catarinense combina o melhor de dois mundos: a energia vibrante das praias badaladas e a tranquilidade das enseadas preservadas. Os dias podem ser de surfe nas ondas de Joaquina, passeios de trilha até praias desertas, mergulho em águas cristalinas ou simplesmente relaxar em beach clubs sofisticados. A cultura local é um atrativo à parte, com festas açorianas, artesanato tradicional e a famosa gastronomia de frutos do mar. É o destino ideal para famílias que querem praia + cultura, casais que buscam romance à beira-mar e grupos de amigos que querem agito e natureza no mesmo lugar.`,
        features: [
          {
            icon: '🌊',
            title: 'Praias Paradisíacas',
            desc: 'Mais de 100 praias de águas cristalinas e areia branca fininha'
          },
          {
            icon: '🏄',
            title: 'Surfe e Esportes',
            desc: 'Ondas perfeitas, kitesurf, mergulho e trilhas ecológicas'
          },
          {
            icon: '🦐',
            title: 'Gastronomia Premiada',
            desc: 'Melhor culinária litorânea do Brasil, frutos do mar frescos'
          },
          {
            icon: '🎭',
            title: 'Cultura Açoriana',
            desc: 'Festivais tradicionais, arquitetura colonial e artesanato local'
          }
        ],
        appreciation: 'Valorização de 38% nos últimos 3 anos. Santa Catarina lidera o ranking de valorização imobiliária no litoral brasileiro. A infraestrutura em constante melhoria e a qualidade de vida atraem investidores nacionais e internacionais. Mercado aquecido com demanda crescente.',
        published: true,
        publishedAt: new Date(),
        order: 3,
        createdById: adminUser.id,
      }
    });
    console.log(`   ✓ Litoral Catarinense criado com sucesso!\n`);

    console.log('✅ Todos os destinos foram criados com sucesso!\n');
    console.log('📊 Resumo:');
    console.log(`   1. ${portoRico.emoji} ${portoRico.name} - ${portoRico.state}`);
    console.log(`   2. ${represaCapivara.emoji} ${represaCapivara.name} - ${represaCapivara.state}`);
    console.log(`   3. ${litoralCatarinense.emoji} ${litoralCatarinense.name} - ${litoralCatarinense.state}`);
    console.log('\n🎉 Os destinos estão prontos para serem visualizados no site!\n');

  } catch (error) {
    console.error('❌ Erro ao criar destinos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

criarDestinos()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
