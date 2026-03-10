import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HELP_TOPICS } from "@/lib/help/help-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminHelpPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const canView = hasPermission(session as any, "help.view") || hasPermission(session as any, "help.manage");
  if (!canView) redirect("/admin/overview");

  const canManage = hasPermission(session as any, "help.manage");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Central de Ajuda</h1>
        <p className="text-gray-600 mt-1 max-w-[760px]">
          Encontre explicações sobre cada módulo do painel administrativo e como utilizá-los no dia a dia.
        </p>
        {canManage && (
          <p className="text-sm text-gray-500 mt-2">
            Para editar os textos do ícone (?) nas telas, acesse{" "}
            <Link href="/admin/help-contextual" className="text-vivant-gold hover:underline font-medium">
              Ajuda Contextual
            </Link>
            .
          </p>
        )}
      </div>

      {/* Grid de categorias principais */}
      <section>
        <h2 className="text-xl font-semibold text-vivant-navy mb-4">Categorias de ajuda</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {HELP_TOPICS.map((topic) => (
            <Link key={topic.slug} href={`/admin/help/${topic.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-vivant-navy">{topic.title}</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">{topic.module}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">{topic.shortDescription}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
