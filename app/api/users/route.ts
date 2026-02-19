import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { userCreateSchema } from "@/lib/validations/user";
import { createAuditLog } from "@/lib/audit";

// GET /api/users - Listar usuários (ADMIN only)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  
  try {
    const users = await prisma.user.findMany({
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
      },
      orderBy: { createdAt: "desc" }
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}

// POST /api/users - Criar usuário (ADMIN only)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const validated = userCreateSchema.parse(body);
    
    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(validated.password, 12);
    
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: validated.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "CREATE",
      entity: "User",
      entityId: user.id,
      changes: { name: user.name, email: user.email, role: user.role },
    });
    
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
