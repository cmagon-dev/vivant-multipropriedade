import type { Prisma } from "@prisma/client";

/** Remove CapitalAssetConfig e registros dependentes (mesma ordem que em ativos/[id]). */
export async function deleteCapitalAssetConfigCascade(
  tx: Prisma.TransactionClient,
  assetConfigId: string
): Promise<void> {
  await tx.capitalDistributionItem.deleteMany({
    where: { distribution: { assetConfigId } },
  });
  await tx.capitalDistribution.deleteMany({ where: { assetConfigId } });
  await tx.capitalParticipation.deleteMany({ where: { assetConfigId } });
  await tx.capitalLiquidityRequest.deleteMany({ where: { assetConfigId } });
  await tx.capitalValuation.deleteMany({ where: { assetConfigId } });
  await tx.capitalAssetConfig.delete({ where: { id: assetConfigId } });
}
