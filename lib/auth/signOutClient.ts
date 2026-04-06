import { signOut, getCsrfToken } from "next-auth/react";

/**
 * Logout confiável: sessão única em /api/auth + redirect na origem atual (evita porta errada).
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

  try {
    await signOut({ redirect: false, callbackUrl: loginUrl });
  } catch (e) {
    console.error("signOut:", e);
  }

  try {
    const csrfToken = await getCsrfToken();
    await fetch(`${window.location.origin}/api/auth/signout`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken: csrfToken ?? "",
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
