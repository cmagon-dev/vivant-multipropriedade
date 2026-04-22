import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getHelpTopicBySlug } from "@/lib/help/help-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpContentMarkdown } from "@/components/help/HelpContentMarkdown";
import { ExternalLink } from "lucide-react";

type Params = {
  slug: string;
};

export default async function HelpDetailPage(props: { params: Promise<Params> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const canView = hasPermission(session as any, "help.view") || hasPermission(session as any, "help.manage");
  if (!canView) redirect("/admin/overview");

  const { slug } = await props.params;
  const topic = getHelpTopicBySlug(slug);
  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href="/admin/help" className="text-sm text-gray-600 hover:underline">
          ← Voltar para Central de Ajuda
        </Link>
        <h1 className="text-3xl font-bold text-vivant-navy">{topic.title}</h1>
        <p className="text-sm text-gray-500">{topic.module}</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-vivant-navy">Tela principal relacionada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">{topic.shortDescription}</p>
          <Button asChild variant="default" size="sm" className="gap-2">
            <Link href={topic.routeReference}>
              <ExternalLink className="w-4 h-4" />
              Abrir esta tela
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-vivant-navy">Conteúdo do manual</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="help-content-wrapper">
            <HelpContentMarkdown content={topic.content} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

