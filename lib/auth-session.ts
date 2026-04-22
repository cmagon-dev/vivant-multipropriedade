import { getServerSession } from "next-auth";
import { authOptionsAdmin } from "@/lib/auth-admin";
import { authOptionsCotista } from "@/lib/auth-cotista";

export async function getAdminSession() {
  return await getServerSession(authOptionsAdmin);
}

export async function getCotistaSession() {
  return await getServerSession(authOptionsCotista);
}

/**
 * Tenta obter sessão admin primeiro, depois cotista.
 * Retorna null se nenhuma sessão for encontrada.
 */
export async function getAnySession() {
  const adminSession = await getAdminSession();
  if (adminSession?.user) return adminSession;
  return getCotistaSession();
}
