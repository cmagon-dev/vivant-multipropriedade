import { prisma } from "./prisma";

interface AuditLogInput {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(input: AuditLogInput) {
  return prisma.auditLog.create({
    data: input,
  });
}

export async function getEntityHistory(entity: string, entityId: string) {
  return prisma.auditLog.findMany({
    where: { entity, entityId },
    include: {
      user: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
