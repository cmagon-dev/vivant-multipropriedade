import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-session";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { sendInviteEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    
    if (!session || !session.user.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, cpf, phone, propertyId, numeroCota, percentualCota, semanasAno, semanasConfig } = body;

    if (!name || !email || !cpf) {
      return NextResponse.json(
        { error: "Nome, email e CPF são obrigatórios" },
        { status: 400 }
      );
    }

    const existingCotista = await prisma.cotista.findFirst({
      where: {
        OR: [
          { email },
          { cpf }
        ]
      }
    });

    if (existingCotista) {
      return NextResponse.json(
        { error: "Já existe um cotista com este email ou CPF" },
        { status: 400 }
      );
    }

    const inviteToken = randomBytes(32).toString("hex");
    const inviteTokenExpiry = new Date();
    inviteTokenExpiry.setDate(inviteTokenExpiry.getDate() + 7);

    const tempPassword = randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const cotista = await prisma.cotista.create({
      data: {
        name,
        email,
        cpf,
        phone,
        password: hashedPassword,
        active: false,
        inviteToken,
        inviteTokenExpiry,
        invitedBy: session.user.id,
        invitedAt: new Date(),
      }
    });

    if (propertyId && numeroCota) {
      await prisma.cotaPropriedade.create({
        data: {
          cotistaId: cotista.id,
          propertyId,
          numeroCota,
          percentualCota: percentualCota || 16.67,
          semanasAno: semanasAno || 8,
          semanasConfig: semanasConfig || { baseYear: new Date().getFullYear(), weeks: [] },
        }
      });
    }

    await sendInviteEmail({
      to: email,
      name,
      inviteToken,
    });

    return NextResponse.json({
      success: true,
      cotista: {
        id: cotista.id,
        name: cotista.name,
        email: cotista.email,
      }
    });

  } catch (error) {
    console.error("Erro ao criar convite:", error);
    return NextResponse.json(
      { error: "Erro ao criar convite" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    
    if (!session || !session.user.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const convitesPendentes = await prisma.cotista.findMany({
      where: {
        active: false,
        inviteToken: { not: null },
        inviteTokenExpiry: { gte: new Date() }
      },
      include: {
        cotas: {
          include: {
            property: true
          }
        }
      },
      orderBy: { invitedAt: 'desc' }
    });

    return NextResponse.json({ convites: convitesPendentes });

  } catch (error) {
    console.error("Erro ao listar convites:", error);
    return NextResponse.json(
      { error: "Erro ao listar convites" },
      { status: 500 }
    );
  }
}
