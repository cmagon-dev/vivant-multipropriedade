import { prisma } from "@/lib/prisma";

export type NotifyPropertyCotistasInput = {
  propertyId: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  url?: string | null;
  /** Não notificar este cotista (ex.: quem criou a solicitação). */
  excludeCotistaId?: string;
  expiresAt?: Date | null;
};

/**
 * Notificações restritas aos cotistas com cota ativa na mesma propriedade.
 * Nunca envia para o sistema inteiro — apenas cotistas da casa.
 */
export async function notifyCotistasDaPropriedade(
  input: NotifyPropertyCotistasInput
): Promise<{ count: number }> {
  const cotas = await prisma.cotaPropriedade.findMany({
    where: { propertyId: input.propertyId, ativo: true },
    select: { cotistaId: true },
  });
  const ids = Array.from(
    new Set(
      cotas
        .map((c) => c.cotistaId)
        .filter((id) => id && id !== input.excludeCotistaId)
    )
  );
  if (ids.length === 0) return { count: 0 };

  await prisma.notificacao.createMany({
    data: ids.map((cotistaId) => ({
      cotistaId,
      propertyId: input.propertyId,
      tipo: input.tipo,
      titulo: input.titulo,
      mensagem: input.mensagem,
      url: input.url ?? null,
      expiresAt: input.expiresAt ?? null,
    })),
  });
  return { count: ids.length };
}
