import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const body = await request.json();
    const { password, phone } = body;

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter no mínimo 6 caracteres" },
        { status: 400 }
      );
    }

    const cotista = await prisma.cotista.findUnique({
      where: { inviteToken: token }
    });

    if (!cotista) {
      return NextResponse.json(
        { error: "Convite não encontrado" },
        { status: 404 }
      );
    }

    if (cotista.active) {
      return NextResponse.json(
        { error: "Este convite já foi aceito" },
        { status: 400 }
      );
    }

    if (cotista.inviteTokenExpiry && cotista.inviteTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "Este convite expirou" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedCotista = await prisma.cotista.update({
      where: { id: cotista.id },
      data: {
        password: hashedPassword,
        phone: phone || cotista.phone,
        active: true,
        emailVerified: new Date(),
        inviteToken: null,
        inviteTokenExpiry: null,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Conta ativada com sucesso!",
      cotista: {
        id: updatedCotista.id,
        name: updatedCotista.name,
        email: updatedCotista.email,
      }
    });

  } catch (error) {
    console.error("Erro ao aceitar convite:", error);
    return NextResponse.json(
      { error: "Erro ao aceitar convite" },
      { status: 500 }
    );
  }
}
