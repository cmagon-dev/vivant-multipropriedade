/**
 * Mapeamento centralizado entre rotas do painel e slugs de tópicos da Central de Ajuda.
 * Usado pela ajuda contextual automática (primeira visita) e por qualquer UI que precise
 * saber qual tópico de ajuda corresponde a uma tela.
 *
 * Rotas mais específicas devem vir primeiro para que o match seja exato (ex.: /admin/capital/ativos
 * antes de /admin/capital). A função getHelpSlugForRoute faz match por prefixo e retorna o mais específico.
 */

export const ROUTE_TO_HELP_SLUG: { route: string; slug: string }[] = [
  // Dashboard / Visão geral
  { route: "/admin/overview", slug: "visao-do-dono" },
  // Comercial
  { route: "/dashboard/comercial/leads", slug: "leads" },
  { route: "/dashboard/comercial", slug: "inicio-comercial" },
  { route: "/admin/crm", slug: "funis-crm" },
  // Operações
  { route: "/admin/tasks", slug: "tarefas" },
  { route: "/admin/events", slug: "eventos" },
  // Propriedades
  { route: "/admin/casas", slug: "casas" },
  { route: "/admin/destinos", slug: "destinos" },
  // Vivant Care
  { route: "/admin/vivant-care/assembleias", slug: "assembleias-care" },
  { route: "/admin/vivant-care/trocas", slug: "trocas-care" },
  { route: "/admin/vivant-care/documentos", slug: "documentos-care" },
  { route: "/admin/vivant-care/avisos", slug: "avisos-care" },
  { route: "/admin/vivant-care/financeiro", slug: "financeiro-care" },
  { route: "/admin/vivant-care/propriedades", slug: "propriedades-care" },
  { route: "/admin/vivant-care/convites", slug: "convites-care" },
  { route: "/admin/vivant-care/cotistas", slug: "cotistas-care" },
  { route: "/admin/vivant-care", slug: "vivant-care" },
  // Vivant Capital
  { route: "/admin/capital/relatorios", slug: "relatorios-capital" },
  { route: "/admin/capital/solicitacoes", slug: "solicitacoes-capital" },
  { route: "/admin/capital/distribuicoes", slug: "distribuicoes-capital" },
  { route: "/admin/capital/participacoes", slug: "participacoes-capital" },
  { route: "/admin/capital/investidores", slug: "investidores-capital" },
  { route: "/admin/capital/ativos", slug: "ativos-capital" },
  { route: "/admin/capital", slug: "vivant-capital" },
  // Administração
  { route: "/admin/usuarios", slug: "usuarios-admin" },
  { route: "/admin/roles", slug: "permissoes-admin" },
];

/**
 * Retorna o slug do tópico de ajuda correspondente à rota atual (pathname).
 * Usa o match mais específico: se pathname for /admin/capital/ativos, retorna "ativos-capital".
 * Retorna undefined se não houver tópico mapeado para essa rota.
 */
export function getHelpSlugForRoute(pathname: string): string | undefined {
  const normalized = pathname.replace(/\/$/, "") || "/";
  let best: { route: string; slug: string } | undefined;
  for (const entry of ROUTE_TO_HELP_SLUG) {
    const routeNorm = entry.route.replace(/\/$/, "") || "/";
    if (normalized === routeNorm || normalized.startsWith(routeNorm + "/")) {
      if (!best || routeNorm.length > best.route.length) {
        best = entry;
      }
    }
  }
  return best?.slug;
}
