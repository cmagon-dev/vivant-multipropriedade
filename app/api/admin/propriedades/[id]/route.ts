import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { propertyUpdateSchema } from "@/lib/validations/property-admin";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { deleteCapitalAssetConfigCascade } from "@/lib/capital/delete-asset-config-cascade";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

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
    const session = await getServerSession(authOptions);

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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        cotas: true,
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: "Propriedade não encontrada" },
        { status: 404 }
      );
    }

    if (property.cotas.length > 0) {
      return NextResponse.json(
        { error: "Não é possível deletar propriedade com cotas alocadas. Delete as cotas primeiro." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const capitalCfg = await tx.capitalAssetConfig.findUnique({
        where: { propertyId: params.id },
        select: { id: true },
      });
      if (capitalCfg) {
        await deleteCapitalAssetConfigCascade(tx, capitalCfg.id);
      }
      await tx.property.delete({ where: { id: params.id } });
    });

    await createAuditLog({
      userId: session.user.id,
      action: "DELETE",
      entity: "Property",
      entityId: params.id,
      changes: { name: property.name },
    });

    revalidatePath("/admin-portal/propriedades");
    revalidatePath("/");
    revalidatePath("/casas");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar propriedade:", error);
    return NextResponse.json(
      { error: "Erro ao deletar propriedade" },
      { status: 500 }
    );
  }
}

