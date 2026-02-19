import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { userUpdateSchema } from "@/lib/validations/user";
import { createAuditLog } from "@/lib/audit";

// GET /api/users/[id] - Buscar um específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        _count: {
          select: {
            properties: true,
            destinations: true,
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Atualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const validated = userUpdateSchema.parse(body);
    
    const updateData: any = {
      name: validated.name,
      email: validated.email,
      role: validated.role,
      active: validated.active,
    };
    
    // Se senha foi fornecida, atualizar hash
    if (validated.password) {
      updateData.password = await bcrypt.hash(validated.password, 12);
    }
    
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      }
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      entity: "User",
      entityId: user.id,
      changes: validated,
    });
    
    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Deletar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  
  // Não permitir deletar a si mesmo
  if (session.user.id === params.id) {
    return NextResponse.json(
      { error: "Você não pode deletar sua própria conta" },
      { status: 400 }
    );
  }
  
  try {
    await prisma.user.delete({
      where: { id: params.id }
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "DELETE",
      entity: "User",
      entityId: params.id,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Erro ao deletar usuário" },
      { status: 500 }
    );
  }
}
