import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type PortalCotistaAuth =
  | { ok: true; cotistaId: string }
  | { ok: false; response: NextResponse };

/**
 * Portal do cotista: sessão pode ser `userType === "cotista"` (tabela cotistas)
 * ou usuário admin com role COTISTA (tabela users), vinculado ao mesmo e-mail em `cotistas`.
 */
export async function requirePortalCotista(session: Session | null): Promise<PortalCotistaAuth> {
  if (!session?.user) {
    return { ok: false, response: NextResponse.json({ error: "Não autorizado" }, { status: 401 }) };
  }
  const u = session.user as {
    id?: string;
    email?: string | null;
    userType?: string;
    roleKey?: string | null;
  };

  if (u.userType === "cotista" && u.id) {
    return { ok: true, cotistaId: u.id };
  }

  if (u.userType === "admin" && u.email) {
    const cotista = await prisma.cotista.findFirst({
      where: { email: { equals: u.email.trim(), mode: "insensitive" } },
      select: { id: true },
    });
    if (cotista) {
      return { ok: true, cotistaId: cotista.id };
    }
    if (u.roleKey === "COTISTA") {
      return {
        ok: false,
        response: NextResponse.json(
          {
            error:
              "Perfil de cotista não encontrado para este usuário. Peça ao administrador para recriar ou vincular o cadastro.",
          },
          { status: 403 }
        ),
      };
    }
  }

  return { ok: false, response: NextResponse.json({ error: "Não autorizado" }, { status: 401 }) };
}
