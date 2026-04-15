import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RegistrationForm = {
  rg?: string;
  rgIssuer?: string;
  birthDate?: string;
  maritalStatus?: string;
  nationality?: string;
  profession?: string;
  monthlyIncome?: string;
  motherName?: string;
  fatherName?: string;
  spouseName?: string;
  spouseCpf?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  bankName?: string;
  bankBranch?: string;
  bankAccount?: string;
  bankAccountType?: string;
  pixKey?: string;
  notes?: string;
};

function isMissingProfileFormTableError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? "");
  return msg.includes(`relation "cotista_profile_forms" does not exist`);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const cotista = await prisma.cotista.findUnique({
      where: { id: auth.cotistaId },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        avatar: true,
        active: true,
        emailVerified: true,
        createdAt: true,
        cotas: {
          where: { ativo: true },
          select: {
            id: true,
            numeroCota: true,
            percentualCota: true,
            semanasAno: true,
            dataAquisicao: true,
            property: {
              select: {
                id: true,
                name: true,
                cidade: true,
                location: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!cotista) {
      return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
    }

    let registration: Record<string, unknown> = {};
    try {
      const rows = await prisma.$queryRaw<Array<{ payload: unknown }>>`
        SELECT "payload"
        FROM "cotista_profile_forms"
        WHERE "cotistaId" = ${auth.cotistaId}
        LIMIT 1
      `;
      registration = (rows[0]?.payload ?? {}) as Record<string, unknown>;
    } catch (error) {
      if (!isMissingProfileFormTableError(error)) {
        throw error;
      }
    }

    return NextResponse.json({
      profile: {
        ...cotista,
        registration,
      },
    });
  } catch (error) {
    console.error("Erro ao carregar perfil do cotista:", error);
    return NextResponse.json({ error: "Erro ao carregar perfil." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const body = (await request.json().catch(() => null)) as
      | {
          name?: string;
          cpf?: string;
          phone?: string | null;
          avatar?: string | null;
          registration?: RegistrationForm;
        }
      | null;

    if (!body) {
      return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
    }

    const name = (body.name ?? "").trim();
    const cpf = (body.cpf ?? "").replace(/\D/g, "");
    const phoneRaw = body.phone?.trim() ?? "";
    const avatar = body.avatar?.trim() ?? "";
    const registration = (body.registration ?? {}) as RegistrationForm;

    if (!name) {
      return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    }
    if (!cpf || cpf.length < 11) {
      return NextResponse.json({ error: "CPF inválido." }, { status: 400 });
    }

    const duplicateCpf = await prisma.cotista.findFirst({
      where: {
        cpf,
        id: { not: auth.cotistaId },
      },
      select: { id: true },
    });
    if (duplicateCpf) {
      return NextResponse.json({ error: "CPF já está em uso por outro cadastro." }, { status: 409 });
    }

    const updated = await prisma.cotista.update({
      where: { id: auth.cotistaId },
      data: {
        name,
        cpf,
        phone: phoneRaw || null,
        avatar: avatar || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        avatar: true,
        active: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    try {
      await prisma.$executeRaw`
        INSERT INTO "cotista_profile_forms" ("id", "cotistaId", "payload", "createdAt", "updatedAt")
        VALUES (${crypto.randomUUID()}, ${auth.cotistaId}, ${JSON.stringify(registration)}::jsonb, NOW(), NOW())
        ON CONFLICT ("cotistaId")
        DO UPDATE SET
          "payload" = EXCLUDED."payload",
          "updatedAt" = NOW()
      `;
    } catch (error) {
      if (isMissingProfileFormTableError(error)) {
        return NextResponse.json(
          {
            error:
              "Ficha cadastral ainda não está disponível no banco. Rode a migração e tente novamente.",
          },
          { status: 503 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      profile: {
        ...updated,
        registration,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil do cotista:", error);
    return NextResponse.json({ error: "Erro ao atualizar perfil." }, { status: 500 });
  }
}

