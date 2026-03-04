import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { propertyUpdateSchema } from "@/lib/validations/property-admin";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function GET(
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

    const propriedade = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        destino: true,
        cotas: {
          include: {
            cotista: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                reservas: true,
                cobrancas: true,
              },
            },
          },
          orderBy: {
            numeroCota: 'asc',
          },
        },
        _count: {
          select: {
            cotas: true,
            assembleias: true,
            mensagens: true,
            documentos: true,
          },
        },
      },
    });

    if (!propriedade) {
      return NextResponse.json(
        { error: "Propriedade não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(propriedade);
  } catch (error) {
    console.error("Erro ao buscar propriedade:", error);
    return NextResponse.json(
      { error: "Erro ao buscar propriedade" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const validated = propertyUpdateSchema.parse(body);

    const propertyExists = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!propertyExists) {
      return NextResponse.json(
        { error: "Propriedade não encontrada" },
        { status: 404 }
      );
    }

    const property = await prisma.property.update({
      where: { id: params.id },
      data: validated,
      include: {
        destino: true,
        cotas: {
          include: {
            cotista: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    await createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      entity: "Property",
      entityId: property.id,
      changes: validated,
    });

    revalidatePath("/admin-portal/propriedades");
    revalidatePath(`/admin-portal/propriedades/${params.id}`);
    revalidatePath("/");
    revalidatePath("/casas");

    return NextResponse.json(property);
  } catch (error: any) {
    console.error("Erro ao atualizar propriedade:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar propriedade" },
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
    const { published } = body;

    if (typeof published !== 'boolean') {
      return NextResponse.json(
        { error: "Campo 'published' é obrigatório e deve ser boolean" },
        { status: 400 }
      );
    }

    const property = await prisma.property.update({
      where: { id: params.id },
      data: { published },
      include: { destino: true }
    });

    await createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      entity: "Property",
      entityId: params.id,
      changes: { published },
    });

    revalidatePath("/admin/casas");
    revalidatePath("/");
    revalidatePath("/casas");

    return NextResponse.json(property);
  } catch (error) {
    console.error("Erro ao atualizar status de publicação:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const fs = require('fs');
  try {
    // #region agent log
    fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'route.ts:200',message:'DELETE handler started',data:{propertyId:params.id},timestamp:Date.now(),hypothesisId:'H5'})+'\n');
    // #endregion
    const session = await getAdminSession();
    // #region agent log
    fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'route.ts:204',message:'Session retrieved',data:{hasSession:!!session,userType:session?.user?.userType},timestamp:Date.now(),hypothesisId:'H3'})+'\n');
    // #endregion

    if (!session || session.user.userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        cotas: {
          include: {
            reservas: true,
          }
        },
      }
    });
    // #region agent log
    fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'route.ts:224',message:'Property fetched with cotas and reservas',data:{found:!!property,cotasCount:property?.cotas?.length,totalReservas:property?.cotas?.reduce((sum,c)=>sum+(c.reservas?.length||0),0)},timestamp:Date.now(),hypothesisId:'H7'})+'\n');
    // #endregion

    if (!property) {
      return NextResponse.json(
        { error: "Propriedade não encontrada" },
        { status: 404 }
      );
    }

    const totalReservas = property.cotas.reduce((sum, cota) => sum + (cota.reservas?.length || 0), 0);
    if (totalReservas > 0) {
      // #region agent log
      fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'route.ts:244',message:'Cannot delete - has reservas via cotas',data:{totalReservas,cotasCount:property.cotas.length},timestamp:Date.now(),hypothesisId:'H7'})+'\n');
      // #endregion
      return NextResponse.json(
        { error: "Não é possível deletar propriedade com reservas existentes. Cancele as reservas primeiro." },
        { status: 400 }
      );
    }

    if (property.cotas.length > 0) {
      // #region agent log
      fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'route.ts:251',message:'Checking cotas for cobrancas',data:{cotasCount:property.cotas.length},timestamp:Date.now(),hypothesisId:'H8'})+'\n');
      // #endregion
      
      const cotasComCobrancas = await prisma.cobranca.count({
        where: {
          cotaId: {
            in: property.cotas.map(c => c.id)
          }
        }
      });
      
      // #region agent log
      fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'route.ts:264',message:'Cobrancas count result',data:{cotasComCobrancas},timestamp:Date.now(),hypothesisId:'H8'})+'\n');
      // #endregion
      
      if (cotasComCobrancas > 0) {
        return NextResponse.json(
          { error: "Não é possível deletar propriedade com cobranças existentes nas cotas." },
          { status: 400 }
        );
      }
      
      // #region agent log
      fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'route.ts:274',message:'About to delete cotas in cascade',data:{cotasToDelete:property.cotas.length},timestamp:Date.now(),hypothesisId:'H9'})+'\n');
      // #endregion
      
      await prisma.cotaPropriedade.deleteMany({
        where: {
          propertyId: params.id
        }
      });
      
      // #region agent log
      fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'route.ts:284',message:'Cotas deleted successfully',data:{},timestamp:Date.now(),hypothesisId:'H9'})+'\n');
      // #endregion
    }

    // #region agent log
    fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'route.ts:244',message:'About to delete property',data:{propertyId:params.id},timestamp:Date.now(),hypothesisId:'H6'})+'\n');
    // #endregion
    await prisma.property.delete({
      where: { id: params.id }
    });
    // #region agent log
    fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'route.ts:248',message:'Property deleted successfully',data:{propertyId:params.id},timestamp:Date.now(),hypothesisId:'H6'})+'\n');
    // #endregion

    await createAuditLog({
      userId: session.user.id,
      action: "DELETE",
      entity: "Property",
      entityId: params.id,
      changes: { name: property.name },
    });

    revalidatePath("/admin/casas");
    revalidatePath("/");
    revalidatePath("/casas");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // #region agent log
    fs.appendFileSync('debug-b9f748.log', JSON.stringify({sessionId:'b9f748',location:'route.ts:260',message:'DELETE exception',data:{errorName:error?.constructor?.name,errorMessage:error?.message,errorCode:error?.code,stack:error?.stack?.substring?.(0,500)},timestamp:Date.now(),hypothesisId:'H6'})+'\n');
    // #endregion
    console.error("Erro ao deletar propriedade:", error);
    return NextResponse.json(
      { error: "Erro ao deletar propriedade" },
      { status: 500 }
    );
  }
}

