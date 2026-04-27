/**
 * Helpers de autorização para o módulo Vivant Capital.
 * Admin: capital.view | capital.manage
 * Investidor: role INVESTOR ou capital.portal; acesso apenas aos próprios dados via CapitalInvestorProfile.
 */

import type { Session } from "next-auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export function canAccessCapitalAdmin(session: Session | null): boolean {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return hasPermission(session, "capital.view") || hasPermission(session, "capital.manage");
}

export function canManageCapital(session: Session | null): boolean {
  return canAccessCapitalAdmin(session) && hasPermission(session, "capital.manage");
}

/** Retorna o ID do perfil de investidor do usuário logado, ou null se não for investidor. */
export async function getCapitalInvestorProfileId(session: Session | null): Promise<string | null> {
  if (!session?.user?.id) return null;
  const profile = await prisma.capitalInvestorProfile.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  return profile?.id ?? null;
}

export async function getCapitalInvestorContext(
  session: Session | null
): Promise<{ investorProfileId: string; companyId: string } | null> {
  if (!session?.user?.id) return null;
  const profile = await prisma.capitalInvestorProfile.findFirst({
    where: { userId: session.user.id },
    select: { id: true, companyId: true },
    orderBy: { createdAt: "asc" },
  });
  if (!profile) return null;
  return { investorProfileId: profile.id, companyId: profile.companyId };
}

/** Verifica se o usuário é investidor (tem perfil ou role INVESTOR). */
export function isCapitalInvestor(session: Session | null): boolean {
  if (!session) return false;
  const roleKey = (session.user as { roleKey?: string }).roleKey;
  const permissions = (session.user as { permissions?: string[] }).permissions ?? [];
  return roleKey === "INVESTOR" || hasPermission(session, "capital.portal");
}
