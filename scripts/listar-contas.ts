/**
 * Lista todas as contas do banco (usuários admin e cotistas).
 * Uso: npx tsx scripts/listar-contas.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("\n=== CONTAS DO BANCO DE DADOS VIVANT ===\n");

  const [users, cotistas] = await Promise.all([
    prisma.user.findMany({
      orderBy: { email: "asc" },
      include: {
        userRoleAssignments: { include: { role: true } },
      },
    }),
    prisma.cotista.findMany({
      orderBy: { email: "asc" },
    }),
  ]);

  console.log("--- USUÁRIOS ADMIN ---");
  if (users.length === 0) {
    console.log("(nenhum usuário cadastrado)\n");
  } else {
    users.forEach((u, i) => {
      const roles = u.userRoleAssignments?.map((ur) => ur.role?.key).filter(Boolean).join(", ") || u.role;
      console.log(`${i + 1}. ${u.name}`);
      console.log(`   Email: ${u.email}`);
      console.log(`   Role: ${roles}`);
      console.log(`   Ativo: ${u.active ? "Sim" : "Não"}`);
      console.log(`   ID: ${u.id}`);
      console.log("");
    });
  }

  console.log("--- COTISTAS ---");
  if (cotistas.length === 0) {
    console.log("(nenhum cotista cadastrado)\n");
  } else {
    cotistas.forEach((c, i) => {
      console.log(`${i + 1}. ${c.name}`);
      console.log(`   Email: ${c.email}`);
      console.log(`   CPF: ${c.cpf}`);
      console.log(`   Ativo: ${c.active ? "Sim" : "Não"}`);
      console.log(`   ID: ${c.id}`);
      console.log("");
    });
  }

  console.log(`Total: ${users.length} usuário(s) admin, ${cotistas.length} cotista(s).\n`);
}

main()
  .catch((e) => {
    console.error("Erro:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
