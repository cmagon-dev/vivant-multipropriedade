import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CadastrosClient } from "./cadastros-client";

export default async function CadastrosPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [cadastros, destinos, usuarios] = await Promise.all([
    prisma.imovelCaptacao.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        destino: { select: { id: true, name: true, emoji: true } },
        responsavel: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
      },
    }),
    prisma.destination.findMany({
      select: { id: true, name: true, emoji: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <CadastrosClient
      initialData={JSON.parse(JSON.stringify(cadastros))}
      destinos={destinos}
      usuarios={usuarios}
    />
  );
}
