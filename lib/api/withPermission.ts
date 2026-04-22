import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import type { Session } from "next-auth";

type SessionWithPermissions = Session & {
  user: Session["user"] & { permissions?: string[]; roleKey?: string | null };
};

type RouteHandler = (
  request: NextRequest,
  context: { params?: Record<string, string> }
) => Promise<NextResponse> | NextResponse;

/**
 * Wrapper para API routes que exige uma permissão.
 * Retorna 403 se o usuário não tiver a permissão (ou não estiver autenticado).
 */
export function withPermission(permissionKey: string) {
  return function (handler: RouteHandler): RouteHandler {
    return async (request: NextRequest, context: { params?: Record<string, string> }) => {
      const session = (await getSession()) as SessionWithPermissions | null;
      if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }
      if (!hasPermission(session, permissionKey)) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
      return handler(request, context);
    };
  };
}
