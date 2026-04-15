import { redirect } from "next/navigation";

/** Compatibilidade: links antigos com segmento extra `/view/` redirecionam para a rota canônica. */
export default function VivantCarePropriedadeViewLegacyRedirect({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/admin/vivant-care/propriedades/${params.id}`);
}
