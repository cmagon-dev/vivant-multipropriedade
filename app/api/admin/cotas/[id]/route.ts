import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const fs = require('fs');
  try {
    // #region agent log
    fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'cotas-route.ts:10',message:'DELETE cota handler started',data:{cotaId:params.id},timestamp:Date.now(),hypothesisId:'H10'})+'\n');
    // #endregion
    const session = await getAdminSession();
    // #region agent log
    fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'cotas-route.ts:14',message:'Session retrieved',data:{hasSession:!!session,userType:session?.user?.userType},timestamp:Date.now(),hypothesisId:'H10'})+'\n');
    // #endregion

    if (!session || session.user.userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Verificar se a cota existe
    const cota = await prisma.cotaPropriedade.findUnique({
      where: { id: params.id },
      include: {
        reservas: true,
        cobrancas: true,
      },
    });
    // #region agent log
    fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'cotas-route.ts:33',message:'Cota fetched',data:{found:!!cota,reservasCount:cota?.reservas?.length,cobrancasCount:cota?.cobrancas?.length},timestamp:Date.now(),hypothesisId:'H11'})+'\n');
    // #endregion

    if (!cota) {
      return NextResponse.json(
        { error: "Cota não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se há reservas ou cobranças vinculadas
    if (cota.reservas.length > 0 || cota.cobrancas.length > 0) {
      // #region agent log
      fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'cotas-route.ts:46',message:'Cannot delete - has reservas or cobrancas',data:{reservasCount:cota.reservas.length,cobrancasCount:cota.cobrancas.length},timestamp:Date.now(),hypothesisId:'H11'})+'\n');
      // #endregion
      return NextResponse.json(
        { error: "Não é possível remover uma cota com reservas ou cobranças vinculadas" },
        { status: 400 }
      );
    }

    // Deletar a cota
    // #region agent log
    fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'cotas-route.ts:54',message:'About to delete cota',data:{cotaId:params.id},timestamp:Date.now(),hypothesisId:'H12'})+'\n');
    // #endregion
    await prisma.cotaPropriedade.delete({
      where: { id: params.id },
    });
    // #region agent log
    fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'cotas-route.ts:59',message:'Cota deleted successfully',data:{cotaId:params.id},timestamp:Date.now(),hypothesisId:'H12'})+'\n');
    // #endregion

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // #region agent log
    fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'cotas-route.ts:66',message:'DELETE cota exception',data:{errorName:error?.constructor?.name,errorMessage:error?.message,errorCode:error?.code,stack:error?.stack?.substring?.(0,500)},timestamp:Date.now(),hypothesisId:'H12'})+'\n');
    // #endregion
    console.error("Erro ao deletar cota:", error);
    return NextResponse.json(
      { error: "Erro ao deletar cota" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();

    if (!session || session.user.userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { numeroCota, percentualCota, semanasAno, active } = body;

    const cota = await prisma.cotaPropriedade.update({
      where: { id: params.id },
      data: {
        ...(numeroCota !== undefined && { numeroCota }),
        ...(percentualCota !== undefined && { percentualCota }),
        ...(semanasAno !== undefined && { semanasAno }),
        ...(active !== undefined && { ativo: active }),
      },
      include: {
        cotista: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(cota);
  } catch (error) {
    console.error("Erro ao atualizar cota:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cota" },
      { status: 500 }
    );
  }
}
