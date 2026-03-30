import { signOut, getCsrfToken } from "next-auth/react";

/**
 * Logout confiável: sessão única em /api/auth + redirect na origem atual (evita porta errada).
 */
export async function signOutAndGoToLogin(): Promise<void> {
  if (typeof window === "undefined") return;

  const loginUrl = `${window.location.origin}/login`;

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
