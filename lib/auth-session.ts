import { getServerSession } from "next-auth";
import { authOptionsAdmin } from "@/lib/auth-admin";
import { authOptionsCotista } from "@/lib/auth-cotista";

export async function getAdminSession() {
  return await getServerSession(authOptionsAdmin);
}

export async function getCotistaSession() {
  return await getServerSession(authOptionsCotista);
}

export async function getAnySession() {
  const adminSession = await getAdminSession();
  if (adminSession) return { ...adminSession, sessionType: 'admin' };
  
  const cotistaSession = await getCotistaSession();
  if (cotistaSession) return { ...cotistaSession, sessionType: 'cotista' };
  
  return null;
}
