import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SimuladorClient } from "./simulador-client";

export default async function SimuladoresVendasPage() {
  const session = await getSession();
  if (!session) redirect("/login");

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
    />
  );
}
