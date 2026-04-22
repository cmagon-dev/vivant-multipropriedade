import { signOut } from "next-auth/react";

/**
 * Logout confiável: usa o endpoint do portal correto (admin ou cotista) para
 * invalidar apenas o cookie daquele portal, permitindo que o outro permaneça ativo.
 */
export async function signOutAndGoToLogin(): Promise<void> {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname;
  const isCotistaArea =
    currentPath.startsWith("/dashboard") ||
    currentPath.startsWith("/cotista") ||
    currentPath.startsWith("/portal-cotista");
  const loginPath = isCotistaArea ? "/login-cotista" : "/login";
  const loginUrl = `${window.location.origin}${loginPath}`;

  // Endpoint do portal ativo: admin → /api/auth-admin, cotista → /api/auth-cotista
  const authBase = isCotistaArea ? "/api/auth-cotista" : "/api/auth-admin";

  try {
    // signOut usa __NEXTAUTH.basePath do SessionProvider em contexto — correto por portal.
    await signOut({ redirect: false, callbackUrl: loginUrl });
  } catch (e) {
    console.error("signOut:", e);
  }

  try {
    // POST direto ao endpoint do portal para garantir a remoção do cookie correto.
    const csrfRes = await fetch(`${window.location.origin}${authBase}/csrf`);
    const csrfData = (await csrfRes.json()) as { csrfToken?: string };
    await fetch(`${window.location.origin}${authBase}/signout`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken: csrfData.csrfToken ?? "",
        callbackUrl: loginUrl,
        json: "true",
      }),
      credentials: "same-origin",
    });
  } catch (e) {
    console.error("signout fetch:", e);
  }

  window.location.replace(loginUrl);
}
