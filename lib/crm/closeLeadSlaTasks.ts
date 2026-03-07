import { prisma } from "@/lib/prisma";

/**
 * Fecha todas as SystemTask OPEN de SLA relacionadas ao lead (máx. 1 por lead em uso).
 * Ao criar nova task de SLA, chamar antes para não duplicar.
 * @param leadId - id do Lead
 * @param newStatus - CANCELED ao mudar etapa; DONE se quiser marcar como concluída
 */
export async function closeLeadSlaTasks(
  leadId: string,
  newStatus: "DONE" | "CANCELED" = "CANCELED"
): Promise<number> {
  const result = await prisma.systemTask.updateMany({
    where: {
      relatedEntityType: "Lead",
      relatedEntityId: leadId,
      status: "OPEN",
    },
    data: { status: newStatus },
  });
  return result.count;
}
