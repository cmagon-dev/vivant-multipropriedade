import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    
    if (!session || !session.user.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
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
