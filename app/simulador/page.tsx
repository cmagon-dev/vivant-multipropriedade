import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { SenhaGate } from "./senha-gate";
import { SimuladorClient } from "@/app/(dashboard)/dashboard/comercial/simuladores-cotas/simulador-client";

const COOKIE_NAME = "vivant.comercial.session";

async function isAutenticado(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;

    const payload = await decode({ token, secret: process.env.NEXTAUTH_SECRET! });
    return (payload as Record<string, unknown>)?.comercialAccess === true;
  } catch {
    return false;
  }
}

export default async function SimuladorPage() {
  if (!(await isAutenticado())) {
    return <SenhaGate />;
  }

  const cadastros = await prisma.imovelCaptacao.findMany({
    where: {
      status: { notIn: ["DECLINADO", "DESCARTADO"] },
    },
    select: {
      id: true,
      titulo: true,
      numCotas: true,
      valorCota: true,
      valorAcordado: true,
      vgvEstimado: true,
      destino: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <SimuladorClient
      cadastros={JSON.parse(JSON.stringify(cadastros))}
      forceClienteMode
    />
  );
}
