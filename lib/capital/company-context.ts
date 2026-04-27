import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function getCapitalCompanyId(session: Session | null): Promise<string> {
  if (!session?.user?.id) {
    const fallback = await prisma.company.findFirst({
      where: { slug: "default" },
      orderBy: { id: "asc" },
      select: { id: true },
    });
    if (!fallback) throw new Error("Company default não encontrada");
    return fallback.id;
  }

  const assignments = await prisma.userRoleAssignment.findMany({
    where: {
      userId: session.user.id,
      companyId: { not: null },
    },
    select: { companyId: true, company: { select: { slug: true } } },
    orderBy: { companyId: "asc" },
  });

  const assignedDefault = assignments.find((assignment) => assignment.company?.slug === "default");
  if (assignedDefault?.companyId) return assignedDefault.companyId;
  if (assignments[0]?.companyId) return assignments[0].companyId;

  const fallback = await prisma.company.findFirst({
    where: { slug: "default" },
    orderBy: { id: "asc" },
    select: { id: true },
  });
  if (!fallback) throw new Error("Company default não encontrada");
  return fallback.id;
}

