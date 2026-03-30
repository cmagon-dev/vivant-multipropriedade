import { redirect } from "next/navigation";

/** Mantém links antigos /financeiro; a lista de cobranças fica em /financeiro/cobrancas. */
export default function VivantCareFinanceiroIndexPage() {
  redirect("/admin/vivant-care/financeiro/cobrancas");
}
