import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");
  
  // 1. Criar usuário admin
  const hashedPassword = await bcrypt.hash("vivant@2024", 12);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@vivant.com.br" },
    update: {},
    create: {
      name: "Admin Vivant",
      email: "admin@vivant.com.br",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  
  console.log("✅ Usuário admin criado:", admin.email);
  
  // 2. Criar destinos
  const portoRico = await prisma.destination.upsert({
    where: { slug: "porto-rico" },
    update: {},
    create: {
      name: "Porto Rico",
      slug: "porto-rico",
      state: "Paraná",
      emoji: "🚤",
      color: "from-blue-500 to-cyan-400",
      subtitle: "Paraíso náutico às margens do Rio Paraná",
      location: "120 km de Maringá | 580 km de Curitiba",
      description: "Conhecido como o 'Caribe Paranaense', Porto Rico oferece praias de água doce com areia branca e fina às margens do majestoso Rio Paraná. Destino ideal para quem busca lazer náutico e contato direto com a natureza.",
      climate: "Temperatura média de 28°C no verão. Clima perfeito para atividades aquáticas o ano todo.",
      lifestyle: "Esportes náuticos durante o dia (jet-ski, lancha, wakeboard), pesca esportiva de dourado e pintado, e restaurantes à beira-rio ao entardecer.",
      features: [
        { icon: "🚤", title: "Esportes Náuticos", desc: "Jet-ski, lancha e wakeboard" },
        { icon: "🏖️", title: "Praias de Água Doce", desc: "Areia branca e fina" },
        { icon: "🎣", title: "Pesca Esportiva", desc: "Dourado, pintado e outros" },
        { icon: "🌅", title: "Pôr do Sol Único", desc: "Vista panorâmica sobre o Paraná" },
      ],
      appreciation: "Valorização de 42% nos últimos 3 anos. Demanda por imóveis de lazer cresce 18% ao ano.",
      published: true,
      order: 1,
      createdById: admin.id,
    },
  });
  
  const chavantes = await prisma.destination.upsert({
    where: { slug: "chavantes" },
    update: {},
    create: {
      name: "Região Chavantes",
      slug: "chavantes",
      state: "Paraná",
      emoji: "🏞️",
      color: "from-green-500 to-emerald-400",
      subtitle: "Lago tranquilo e natureza preservada",
      location: "120 km de Londrina | 140 km de Maringá | 380 km de Curitiba",
      description: "Condomínios de alto padrão às margens da Represa de Chavantes, um dos maiores lagos artificiais do Brasil com 400 km² de espelho d'água. Destino consolidado para famílias que buscam tranquilidade e segurança.",
      climate: "Clima tropical úmido com temperaturas amenas. Ideal para lazer o ano todo, especialmente primavera e verão.",
      lifestyle: "Lazer náutico em águas calmas, pescaria, convívio familiar em condomínios seguros e proximidade com Londrina e Maringá para serviços.",
      features: [
        { icon: "🏞️", title: "Lago Chavantes", desc: "400 km² de águas calmas" },
        { icon: "🛥️", title: "Turismo Náutico", desc: "Passeios de barco e pesca" },
        { icon: "🌳", title: "Natureza Preservada", desc: "Muito verde e tranquilidade" },
        { icon: "👨‍👩‍👧‍👦", title: "Lazer Familiar", desc: "Condomínios com infraestrutura" },
      ],
      appreciation: "Valorização média de 28% nos últimos 2 anos. Turismo náutico cresce 15% ao ano na região.",
      published: true,
      order: 2,
      createdById: admin.id,
    },
  });
  
  const serraGaucha = await prisma.destination.upsert({
    where: { slug: "serra-gaucha" },
    update: {},
    create: {
      name: "Serra Gaúcha",
      slug: "serra-gaucha",
      state: "Rio Grande do Sul",
      emoji: "🏔️",
      color: "from-purple-500 to-pink-400",
      subtitle: "Charme europeu e clima de montanha",
      location: "Gramado, Canela e região | 120 km de Porto Alegre",
      description: "A Serra Gaúcha encanta com sua arquitetura europeia, clima frio de montanha e gastronomia sofisticada. Destino perfeito para quem busca experiências culturais, vinícolas e o charme do frio brasileiro.",
      climate: "Clima subtropical de altitude. Invernos frios (0-15°C) e verões amenos (15-25°C). Possibilidade de geadas no inverno.",
      lifestyle: "Turismo cultural em Gramado e Canela, visitação a vinícolas no Vale dos Vinhedos, gastronomia de montanha, compras e eventos temáticos.",
      features: [
        { icon: "🏔️", title: "Clima de Montanha", desc: "Frio no inverno, ameno no verão" },
        { icon: "🍷", title: "Rota dos Vinhos", desc: "Vale dos Vinhedos e vinícolas" },
        { icon: "🏰", title: "Arquitetura Europeia", desc: "Estilo alpino e bávaro" },
        { icon: "🎄", title: "Eventos Temáticos", desc: "Natal Luz e festivais" },
      ],
      appreciation: "Valorização de 35% nos últimos 3 anos. Alta demanda por imóveis de lazer e segunda residência.",
      published: true,
      order: 3,
      createdById: admin.id,
    },
  });
  
  const litoral = await prisma.destination.upsert({
    where: { slug: "litoral-catarinense" },
    update: {},
    create: {
      name: "Litoral Catarinense",
      slug: "litoral-catarinense",
      state: "Santa Catarina",
      emoji: "🏖️",
      color: "from-orange-400 to-amber-500",
      subtitle: "Praias paradisíacas e infraestrutura completa",
      location: "Balneário Camboriú, Florianópolis e região",
      description: "O Litoral de Santa Catarina oferece o melhor dos dois mundos: praias paradisíacas de mar com infraestrutura urbana completa. Destino preferido de brasileiros e argentinos para férias de verão.",
      climate: "Clima subtropical oceânico. Verões quentes (25-32°C) perfeitos para praia. Invernos amenos (12-20°C) ideais para passeios.",
      lifestyle: "Praias de mar, esportes aquáticos, vida noturna agitada em Balneário Camboriú, trilhas e natureza em Florianópolis, gastronomia à beira-mar.",
      features: [
        { icon: "🏖️", title: "Praias de Mar", desc: "Areia branca e mar azul" },
        { icon: "🏄", title: "Esportes Aquáticos", desc: "Surf, stand up e vela" },
        { icon: "🌴", title: "Infraestrutura Urbana", desc: "Restaurantes e serviços" },
        { icon: "🎭", title: "Vida Cultural", desc: "Eventos e baladas" },
      ],
      appreciation: "Valorização de 40% nos últimos 3 anos. Mercado imobiliário aquecido com alta procura.",
      published: true,
      order: 4,
      createdById: admin.id,
    },
  });
  
  console.log("✅ Destinos criados:", [portoRico.name, chavantes.name, serraGaucha.name, litoral.name].join(", "));
  
  // 3. Criar propriedades
  await prisma.property.upsert({
    where: { slug: "casa-porto-rico-marina-premium" },
    update: {},
    create: {
      name: "Casa Porto Rico - Marina Premium",
      slug: "casa-porto-rico-marina-premium",
      description: "<p>Casa de alto padrão localizada no <strong>Condomínio Marina Premium</strong>, às margens do Rio Paraná. Com arquitetura moderna e acabamentos de primeira linha, esta propriedade oferece o melhor do lazer náutico.</p><p>O imóvel conta com <strong>4 suítes espaçosas</strong>, todas com vista para o rio, área gourmet completa de 60m² ideal para receber amigos e família, e piscina infinita aquecida com deck em madeira nobre.</p><p>A marina privativa comporta embarcações de até 40 pés, com 12 vagas exclusivas para proprietários. A propriedade vem <strong>totalmente mobiliada e decorada</strong> por arquitetos renomados, pronta para uso imediato.</p>",
      location: "Porto Rico, Paraná",
      cidade: "Porto Rico",
      destinoId: portoRico.id,
      condominio: "Marina Premium",
      type: "Casa de Lazer Náutica",
      priceValue: 375000,
      bedrooms: 4,
      bathrooms: 5,
      area: 280,
      fraction: "1/8",
      price: "R$ 375.000",
      monthlyFee: "R$ 2.800",
      weeks: "8-10",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
      ],
      features: [
        "Marina privativa 12 vagas",
        "Vista panorâmica Rio Paraná",
        "Piscina infinita aquecida",
        "Área gourmet 60m²",
        "Mobiliada e decorada",
        "Sistema energia solar",
        "Segurança 24h",
        "Jet-ski incluso",
      ],
      appreciation: "+42% em 3 anos",
      status: "ULTIMAS_COTAS",
      highlight: true,
      published: true,
      createdById: admin.id,
    },
  });
  
  await prisma.property.upsert({
    where: { slug: "casa-chavantes-condominio-sunset" },
    update: {},
    create: {
      name: "Casa Chavantes - Condomínio Sunset",
      slug: "casa-chavantes-condominio-sunset",
      description: "<p>Casa familiar perfeita para momentos inesquecíveis às margens do <strong>Lago Chavantes</strong>. Localizada no Condomínio Sunset, esta propriedade oferece segurança, conforto e infraestrutura completa para toda a família.</p><p>O imóvel conta com <strong>3 suítes amplas</strong> com ar-condicionado, sala de estar integrada com a varanda, e churrasqueira gourmet com vista para o lago. A piscina privativa tem aquecimento solar e deck para banho de sol.</p><p>O condomínio oferece <strong>acesso direto ao clube náutico</strong>, quadras de tênis e beach tennis, playground, e segurança 24h. Localizado a apenas 1h30 de Londrina, é o destino perfeito para finais de semana relaxantes.</p>",
      location: "1º de Maio, Paraná",
      cidade: "1º de Maio",
      destinoId: chavantes.id,
      condominio: "Condomínio Sunset",
      type: "Casa de Lazer Familiar",
      priceValue: 285000,
      bedrooms: 3,
      bathrooms: 4,
      area: 220,
      fraction: "1/8",
      price: "R$ 285.000",
      monthlyFee: "R$ 2.200",
      weeks: "8-10",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
      ],
      features: [
        "Condomínio fechado seguro",
        "Piscina privativa",
        "Churrasqueira gourmet",
        "Acesso clube náutico",
        "Quadras esportivas",
        "1h30 de Londrina",
        "Playground kids",
        "Mobiliada completa",
      ],
      appreciation: "+28% em 2 anos",
      status: "DISPONIVEL",
      highlight: false,
      published: true,
      createdById: admin.id,
    },
  });
  
  console.log("✅ Propriedades de exemplo criadas");
  
  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📝 Credenciais de acesso:");
  console.log("   Email: admin@vivant.com.br");
  console.log("   Senha: vivant@2024");
  console.log("\n🔗 Acesse: http://localhost:3000/admin\n");
}

main()
  .catch((error) => {
    console.error("❌ Erro no seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
