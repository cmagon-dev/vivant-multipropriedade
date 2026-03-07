import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as { userType?: string }).userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const canAccess =
      hasPermission(session as any, "vivantCare.cotistas.view") ||
      hasPermission(session as any, "vivantCare.cotistas.manage") ||
      (session.user as { role?: string }).role === "ADMIN";

    if (!canAccess) {
      return NextResponse.json(
        { error: "Sem permissão para listar cotistas" },
        { status: 403 }
      );
    }

    const cotistas = await prisma.cotista.findMany({
      include: {
        cotas: {
          include: {
            property: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ cotistas });

  } catch (error) {
    console.error("Erro ao carregar cotistas:", error);
    return NextResponse.json(
      { error: "Erro ao carregar cotistas" },
      { status: 500 }
    );
  }
}
