import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
  const email = process.env.RESET_ADMIN_EMAIL;
  const newPassword = process.env.RESET_ADMIN_PASSWORD;

  if (!email || !newPassword) {
    console.error(
      "Erro: defina RESET_ADMIN_EMAIL e RESET_ADMIN_PASSWORD no .env antes de rodar o script."
    );
    process.exit(1);
  }

  console.log(`🔐 Resetando senha para o usuário: ${email}`);

  try {
    const hashed = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.update({
      where: { email },
      data: {
        password: hashed,
        // se o modelo tiver campo "active", mantemos true; se não tiver, o Prisma vai ignorar
        active: true as any,
      },
    });

    console.log("✅ Senha atualizada com sucesso para:", user.email);
  } catch (err: any) {
    if (err?.code === "P2025") {
      console.error("❌ Usuário não encontrado para o email informado.");
    } else {
      console.error("❌ Erro ao atualizar a senha do usuário:", err);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

