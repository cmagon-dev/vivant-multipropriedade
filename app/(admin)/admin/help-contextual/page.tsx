import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HelpContentManager } from "@/components/admin/help-content-manager";
import { PermissionsDocSection } from "@/components/admin/permissions-doc-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminHelpContextualPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const canManage = hasPermission(session as any, "help.manage");
  if (!canManage) redirect("/admin/overview");

  return (
    <div className="space-y-10">
      <div>
        <Link href="/admin/help" className="text-sm text-gray-600 hover:underline inline-block mb-2">
          ← Voltar para Central de Ajuda
        </Link>
        <h1 className="text-3xl font-bold text-vivant-navy">Ajuda Contextual</h1>
        <p className="text-gray-600 mt-1 max-w-[760px]">
          Gerencie os textos de ajuda exibidos pelo ícone de interrogação (?) nas telas do painel. 
          Esses textos aparecem de forma contextual quando o usuário clica no ícone em cada área.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-vivant-navy">Como funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600 max-w-[760px]">
          <p>
            A <strong>ajuda contextual</strong> permite que você defina um pequeno texto explicativo para cada tela ou módulo. 
            Quando um operador ou administrador vê o ícone (?) ao lado do título da página, pode clicar para abrir um popover 
            com as instruções que você configurou aqui.
          </p>
          <p>
            Use os blocos abaixo para editar o conteúdo por rota ou chave. As alterações passam a valer para todos os usuários 
            que têm acesso àquela tela. A seção de permissões documenta como o sistema de permissões do painel está organizado.
          </p>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-xl font-semibold text-vivant-navy mb-4">Conteúdo por tela</h2>
        <HelpContentManager />
      </section>

      <section className="border-t border-gray-200 pt-8">
        <PermissionsDocSection />
      </section>
    </div>
  );
}
