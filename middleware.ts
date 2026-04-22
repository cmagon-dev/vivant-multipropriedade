import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getPostLoginRedirectFromToken } from "@/lib/auth/middlewareRedirect";
import { hasPermissionKey } from "@/lib/auth/permissions";

function isPublicPath(pathname: string): boolean {
  if (
    pathname === "/capital" ||
    pathname === "/casas" ||
    pathname === "/destinos" ||
    pathname === "/modelo" ||
    pathname === "/contato" ||
    pathname === "/parceiros" ||
    pathname === "/care" ||
    pathname === "/simulador-investimentos" ||
    pathname === "/apresentacao" ||
    pathname === "/403"
  ) {
    return true;
  }

  if (pathname.startsWith("/casas/")) return true;
  if (pathname === "/captar" || pathname.startsWith("/captar/")) return true;
  if (pathname.startsWith("/convite/")) return true;

  return false;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    (pathname.includes(".") && !pathname.startsWith("/api"))
  ) {
    return NextResponse.next();
  }

  // Lê os dois tokens independentes: admin (cookie dedicado) e cotista (cookie dedicado).
  // Isso permite que ambas as sessões coexistam simultaneamente no mesmo browser.
  const adminToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "vivant.admin.session-token",
  });
  const cotistaToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "vivant.cotista.session-token",
  });
  // "token" genérico: admin tem prioridade para rotas compartilhadas (ex: redirecionamento pós-login)
  const token = adminToken ?? cotistaToken;

  // Redirecionar /portal-cotista para login do cotista
  if (pathname === "/portal-cotista") {
    if (cotistaToken?.userType === "cotista") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    const url = new URL("/login-cotista", request.url);
    url.searchParams.set("callbackUrl", "/dashboard");
    return NextResponse.redirect(url);
  }

  // Raiz sempre pública, independente de autenticação
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Login admin: se já tem sessão admin ativa, redireciona; caso contrário deixa passar
  if (pathname === "/login") {
    if (adminToken) {
      const redirectUrl = getPostLoginRedirectFromToken(adminToken);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // Login cotista: se já tem sessão cotista ativa, redireciona; caso contrário deixa passar
  // (sessão admin não bloqueia login cotista — são sessões independentes)
  if (pathname === "/login-cotista") {
    if (cotistaToken) {
      const redirectUrl = getPostLoginRedirectFromToken(cotistaToken);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // Demais rotas públicas de marketing/institucional
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Proteção /admin: exige sessão admin (cookie vivant.admin.session-token)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin-portal")) {
    if (!adminToken || adminToken.userType !== "admin") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    /** Usuário com role COTISTA (portal) não acessa o painel admin — só o portal em /dashboard */
    if (adminToken.roleKey === "COTISTA") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    const token = adminToken;
    const permissions = (token.permissions as string[] | undefined) ?? [];
    const isOwner = token.roleKey === "OWNER" || token.roleKey === "SUPER_ADMIN";
    const hasAdminView = isOwner || hasPermissionKey(permissions, "admin.view") || token.roleKey === "ADMIN";
    if (pathname === "/admin") {
      if (hasAdminView) return NextResponse.redirect(new URL("/admin/overview", request.url));
      if (hasPermissionKey(permissions, "comercial.view")) return NextResponse.redirect(new URL("/dashboard/comercial", request.url));
      if (hasPermissionKey(permissions, "properties.view")) return NextResponse.redirect(new URL("/admin/casas", request.url));
      if (hasPermissionKey(permissions, "destinations.view")) return NextResponse.redirect(new URL("/admin/destinos", request.url));
      return NextResponse.redirect(new URL("/403", request.url));
    }
    if (pathname === "/admin/overview" && !hasAdminView) {
      return NextResponse.redirect(new URL("/403", request.url));
    }
    if (pathname.startsWith("/admin/roles") && !isOwner && !hasPermissionKey(permissions, "roles.manage")) {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
    if (pathname.startsWith("/admin/permissions") && !isOwner && !hasPermissionKey(permissions, "permissions.manage")) {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
    if (pathname.startsWith("/admin/usuarios") && !isOwner && !hasPermissionKey(permissions, "users.manage")) {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
    if (pathname.startsWith("/admin/help-contextual") && !isOwner && !hasPermissionKey(permissions, "help.manage")) {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
    if (pathname.startsWith("/admin/help") && !isOwner && !hasPermissionKey(permissions, "help.view") && !hasPermissionKey(permissions, "help.manage")) {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
    if (pathname.startsWith("/admin/events") && !isOwner && !hasPermissionKey(permissions, "events.view")) {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
    if (pathname.startsWith("/admin/tasks") && !isOwner && !hasPermissionKey(permissions, "tasks.view")) {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
    if (pathname.startsWith("/admin/crm") && !isOwner && !hasPermissionKey(permissions, "crm.manage")) {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
    if (pathname.startsWith("/admin/casas")) {
      if (pathname === "/admin/casas/nova" || pathname.endsWith("/nova")) {
        if (!isOwner && !hasPermissionKey(permissions, "properties.create") && !hasPermissionKey(permissions, "properties.manage")) {
          return NextResponse.redirect(new URL("/admin/overview", request.url));
        }
      } else if (pathname.includes("/editar")) {
        if (!isOwner && !hasPermissionKey(permissions, "properties.edit") && !hasPermissionKey(permissions, "properties.manage")) {
          return NextResponse.redirect(new URL("/admin/overview", request.url));
        }
      } else {
        if (!isOwner && !hasPermissionKey(permissions, "properties.view") && !hasPermissionKey(permissions, "properties.manage")) {
          return NextResponse.redirect(new URL("/admin/overview", request.url));
        }
      }
    }
    if (pathname.startsWith("/admin/destinos")) {
      if (pathname === "/admin/destinos/novo" || pathname.endsWith("/novo")) {
        if (!isOwner && !hasPermissionKey(permissions, "destinations.create") && !hasPermissionKey(permissions, "destinations.manage")) {
          return NextResponse.redirect(new URL("/admin/overview", request.url));
        }
      } else if (pathname.includes("/editar")) {
        if (!isOwner && !hasPermissionKey(permissions, "destinations.edit") && !hasPermissionKey(permissions, "destinations.manage")) {
          return NextResponse.redirect(new URL("/admin/overview", request.url));
        }
      } else {
        if (!isOwner && !hasPermissionKey(permissions, "destinations.view") && !hasPermissionKey(permissions, "destinations.manage")) {
          return NextResponse.redirect(new URL("/admin/overview", request.url));
        }
      }
    }
    // Vivant Care: rotas sob /admin/vivant-care exigem permissão correspondente
    if (pathname.startsWith("/admin/vivant-care")) {
      const hasVcView = isOwner || hasPermissionKey(permissions, "vivantCare.view");
      const hasCotistas = hasVcView || hasPermissionKey(permissions, "vivantCare.cotistas.view") || hasPermissionKey(permissions, "vivantCare.cotistas.manage");
      const hasProp = hasVcView || hasPermissionKey(permissions, "vivantCare.propriedades.view") || hasPermissionKey(permissions, "vivantCare.propriedades.manage");
      const hasFin = hasVcView || hasPermissionKey(permissions, "vivantCare.financeiro.view") || hasPermissionKey(permissions, "vivantCare.financeiro.manage");
      const hasAvisos = hasVcView || hasPermissionKey(permissions, "vivantCare.avisos.view") || hasPermissionKey(permissions, "vivantCare.avisos.manage");
      const hasDocs = hasVcView || hasPermissionKey(permissions, "vivantCare.documentos.view") || hasPermissionKey(permissions, "vivantCare.documentos.manage");
      const hasConvites = hasVcView || hasPermissionKey(permissions, "vivantCare.convites.view") || hasPermissionKey(permissions, "vivantCare.convites.manage");
      const hasAssembleias = hasVcView || hasPermissionKey(permissions, "vivantCare.assembleias.view") || hasPermissionKey(permissions, "vivantCare.assembleias.manage");
      const hasTrocas = hasVcView || hasPermissionKey(permissions, "vivantCare.trocas.view") || hasPermissionKey(permissions, "vivantCare.trocas.manage");
      const baseOrDashboard = pathname === "/admin/vivant-care" || pathname === "/admin/vivant-care/";
      if (baseOrDashboard && !hasVcView) return NextResponse.redirect(new URL("/403", request.url));
      if (pathname.startsWith("/admin/vivant-care/cotistas") && !hasCotistas) return NextResponse.redirect(new URL("/403", request.url));
      if (pathname.startsWith("/admin/vivant-care/convites") && !hasConvites) return NextResponse.redirect(new URL("/403", request.url));
      if (pathname.startsWith("/admin/vivant-care/propriedades") && !hasProp) return NextResponse.redirect(new URL("/403", request.url));
      if (pathname.startsWith("/admin/vivant-care/financeiro") && !hasFin) return NextResponse.redirect(new URL("/403", request.url));
      if (pathname.startsWith("/admin/vivant-care/avisos") && !hasAvisos) return NextResponse.redirect(new URL("/403", request.url));
      if (pathname.startsWith("/admin/vivant-care/documentos") && !hasDocs) return NextResponse.redirect(new URL("/403", request.url));
      if (pathname.startsWith("/admin/vivant-care/assembleias") && !hasAssembleias) return NextResponse.redirect(new URL("/403", request.url));
      if (pathname.startsWith("/admin/vivant-care/trocas") && !hasTrocas) return NextResponse.redirect(new URL("/403", request.url));
    }
    // Vivant Capital: rotas sob /admin/capital exigem capital.view ou capital.manage
    if (pathname.startsWith("/admin/capital")) {
      const hasCapital = isOwner || hasPermissionKey(permissions, "capital.view") || hasPermissionKey(permissions, "capital.manage");
      if (!hasCapital) return NextResponse.redirect(new URL("/403", request.url));
    }
    return NextResponse.next();
  }

  // Portal do investidor /capital: apenas role INVESTOR (userType admin com role INVESTOR)
  // A landing pública é /capital; as rotas protegidas começam em /capital/...
  if (pathname.startsWith("/capital/")) {
    if (!adminToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    const roleKey = adminToken.roleKey as string | undefined;
    const permissions = (adminToken.permissions as string[] | undefined) ?? [];
    const isInvestor = roleKey === "INVESTOR" || hasPermissionKey(permissions, "capital.portal");
    if (!isInvestor) return NextResponse.redirect(new URL("/403", request.url));
    return NextResponse.next();
  }

  // OWNER/SUPER_ADMIN: nunca /dashboard (exceto /dashboard/comercial para Leads), sempre /admin
  if (pathname.startsWith("/dashboard")) {
    const roleKey = adminToken?.roleKey as string | undefined;
    const isComercialLeads = pathname.startsWith("/dashboard/comercial");
    if ((roleKey === "OWNER" || roleKey === "SUPER_ADMIN") && !isComercialLeads) {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
  }

  // Proteção /dashboard/comercial: comercial.view (sessão admin)
  if (pathname.startsWith("/dashboard/comercial")) {
    if (!adminToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    const permissions = (adminToken.permissions as string[] | undefined) ?? [];
    const isOwner = adminToken.roleKey === "OWNER" || adminToken.roleKey === "SUPER_ADMIN";
    const hasComercial = isOwner || hasPermissionKey(permissions, "comercial.view");
    if (!hasComercial) {
      return NextResponse.redirect(new URL("/403", request.url));
    }
    return NextResponse.next();
  }

  // Proteção /admin-portal (sessão admin)
  if (pathname.startsWith("/admin-portal")) {
    if (!adminToken || adminToken.userType !== "admin") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Proteção /dashboard (portal cotista): usa sessão cotista; admin com permissão também pode acessar
  if (pathname.startsWith("/dashboard")) {
    if (cotistaToken?.userType === "cotista") return NextResponse.next();
    if (adminToken) {
      const permissions = (adminToken.permissions as string[] | undefined) ?? [];
      const hasDashboard =
        adminToken.roleKey === "COTISTA" ||
        adminToken.roleKey === "OWNER" ||
        adminToken.roleKey === "SUPER_ADMIN" ||
        hasPermissionKey(permissions, "dashboard.view");
      if (hasDashboard) return NextResponse.next();
    }
    const url = new URL("/login-cotista", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Proteção /cotista: apenas sessão cotista ativa
  if (pathname.startsWith("/cotista")) {
    if (!cotistaToken || cotistaToken.userType !== "cotista") {
      const url = new URL("/login-cotista", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.headers.set("x-vivant-domain", "residences");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
