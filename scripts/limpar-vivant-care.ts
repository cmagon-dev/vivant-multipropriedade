/**
 * Script para limpar todos os dados do portal Vivant Care
 * 
 * Este script remove:
 * - Cotistas e suas cotas
 * - Reservas e trocas de semanas
 * - Cobranças financeiras
 * - Assembleias, pautas e votos
 * - Mensagens e documentos
 * - Notificações
 * 
 * IMPORTANTE: Não remove casas (properties) nem destinos do portal admin
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function limparVivantCare() {
  console.log('🧹 Iniciando limpeza do portal Vivant Care...\n');

  try {
    // 1. Limpar notificações
    console.log('📧 Removendo notificações...');
    const notificacoes = await prisma.notificacao.deleteMany({});
    console.log(`   ✓ ${notificacoes.count} notificações removidas\n`);

    // 2. Limpar visualizações de mensagens
    console.log('👁️  Removendo visualizações de mensagens...');
    const visualizacoes = await prisma.visualizacaoMensagem.deleteMany({});
    console.log(`   ✓ ${visualizacoes.count} visualizações removidas\n`);

    // 3. Limpar mensagens/avisos
    console.log('💬 Removendo mensagens e avisos...');
    const mensagens = await prisma.mensagem.deleteMany({});
    console.log(`   ✓ ${mensagens.count} mensagens removidas\n`);

    // 4. Limpar documentos
    console.log('📄 Removendo documentos...');
    const documentos = await prisma.documento.deleteMany({});
    console.log(`   ✓ ${documentos.count} documentos removidos\n`);

    // 5. Limpar votos de assembleia
    console.log('🗳️  Removendo votos de assembleia...');
    const votos = await prisma.votoAssembleia.deleteMany({});
    console.log(`   ✓ ${votos.count} votos removidos\n`);

    // 6. Limpar pautas de assembleia
    console.log('📋 Removendo pautas de assembleia...');
    const pautas = await prisma.pautaAssembleia.deleteMany({});
    console.log(`   ✓ ${pautas.count} pautas removidas\n`);

    // 7. Limpar assembleias
    console.log('🏛️  Removendo assembleias...');
    const assembleias = await prisma.assembleia.deleteMany({});
    console.log(`   ✓ ${assembleias.count} assembleias removidas\n`);

    // 8. Limpar trocas de semanas
    console.log('🔄 Removendo trocas de semanas...');
    const trocas = await prisma.trocaSemana.deleteMany({});
    console.log(`   ✓ ${trocas.count} trocas removidas\n`);

    // 9. Limpar reservas (serão deletadas com as cotas por cascade, mas vamos garantir)
    console.log('📅 Removendo reservas...');
    const reservas = await prisma.reserva.deleteMany({});
    console.log(`   ✓ ${reservas.count} reservas removidas\n`);

    // 10. Limpar cobranças (serão deletadas com as cotas por cascade, mas vamos garantir)
    console.log('💰 Removendo cobranças...');
    const cobrancas = await prisma.cobranca.deleteMany({});
    console.log(`   ✓ ${cobrancas.count} cobranças removidas\n`);

    // 11. Limpar cotas de propriedade
    console.log('📊 Removendo cotas de propriedade...');
    const cotas = await prisma.cotaPropriedade.deleteMany({});
    console.log(`   ✓ ${cotas.count} cotas removidas\n`);

    // 12. Limpar cotistas
    console.log('👥 Removendo cotistas...');
    const cotistas = await prisma.cotista.deleteMany({});
    console.log(`   ✓ ${cotistas.count} cotistas removidos\n`);

    // Verificar se as properties e destinations estão intactas
    const propertiesCount = await prisma.property.count();
    const destinationsCount = await prisma.destination.count();
    
    console.log('✅ Limpeza concluída com sucesso!\n');
    console.log('📊 Resumo:');
    console.log(`   - Properties (casas) mantidas: ${propertiesCount}`);
    console.log(`   - Destinations (destinos) mantidos: ${destinationsCount}`);
    console.log('\n🎉 Portal Vivant Care limpo. Você pode agora vincular as casas corretas!\n');

  } catch (error) {
    console.error('❌ Erro ao limpar Vivant Care:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

limparVivantCare()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
