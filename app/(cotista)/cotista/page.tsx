import { redirect } from "next/navigation";

/**
 * Página inicial do portal cotista em /cotista.
 * Redireciona para o dashboard do cotista (/dashboard).
 */
export default function CotistaHomePage() {
  redirect("/dashboard");
}
