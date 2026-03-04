import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  
  // Normaliza o hostname (remove www. e porta se houver)
  const domain = hostname.replace("www.", "").split(":")[0].toLowerCase();
  
  // Não interceptar assets estáticos, fontes e APIs (exceto proteção admin)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    (pathname.includes(".") && !pathname.startsWith("/api")) // Qualquer arquivo com extensão (css, js, woff2, etc)
  ) {
    return NextResponse.next();
  }
  
  // Função helper para obter token de admin
  async function getAdminToken() {
    return await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: 'vivant.admin.session-token'
    });
  }
  
  // Função helper para obter token de cotista
  async function getCotistaToken() {
    return await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: 'vivant.cotista.session-token'
    });
  }
  
  // Proteção de rotas admin (Site Vivant)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin-portal")) {
    const token = await getAdminToken();
    
    if (!token || token.userType !== "admin") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    
    if (pathname.startsWith("/admin/usuarios") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }
  
  // Proteção de rotas admin-portal (Portal do Cotista Admin)
  if (pathname.startsWith("/admin-portal")) {
    const token = await getAdminToken();
    
    if (!token || token.userType !== "admin") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // Proteção de rotas dashboard (cotistas)
  if (pathname.startsWith("/dashboard")) {
    const token = await getCotistaToken();
    
    if (!token || token.userType !== "cotista") {
      const url = new URL("/portal-cotista", request.url);
      return NextResponse.redirect(url);
    }
  }
  
  // Redirecionar /login para dashboard apropriado se já autenticado
  if (pathname === "/login") {
    const adminToken = await getAdminToken();
    
    if (adminToken && adminToken.userType === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    
    // Se não está autenticado como admin, permite acessar /login normalmente
    return NextResponse.next();
  }
  
  // Redirecionar /portal-cotista para dashboard se já autenticado como cotista
  if (pathname === "/portal-cotista") {
    const cotistaToken = await getCotistaToken();
    
    if (cotistaToken && cotistaToken.userType === "cotista") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Se não está autenticado como cotista, permite acessar /portal-cotista normalmente
    return NextResponse.next();
  }
  
  // Não interceptar APIs que não sejam admin
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }
  
  // Roteamento multi-domínio para produção
  // Vivant Capital → Página de apresentação + Simulador
  if (domain === "vivantcapital.com.br") {
    // Permitir acesso direto às rotas /dashboard/* (simulador, etc)
    if (pathname.startsWith("/dashboard")) {
      const response = NextResponse.next();
      response.headers.set("x-vivant-domain", "capital");
      return response;
    }
    
    // Página principal capital
    const url = new URL("/capital", request.url);
    const response = NextResponse.rewrite(url);
    response.headers.set("x-vivant-domain", "capital");
    return response;
  }
  
  // Vivant Care → Portal do Cotista
  if (domain === "vivantcare.com.br") {
    const url = new URL("/portal-cotista", request.url);
    const response = NextResponse.rewrite(url);
    response.headers.set("x-vivant-domain", "care");
    return response;
  }
  
  // Vivant Residences (domínio principal) → Home de Marketing
  if (domain === "vivantresidences.com.br") {
    const response = NextResponse.next();
    response.headers.set("x-vivant-domain", "residences");
    return response;
  }
  
  // Default: Vercel preview URLs ou outros domínios → Home de Marketing
  const response = NextResponse.next();
  response.headers.set("x-vivant-domain", "residences");
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internals)
     * - static files
     */
    "/((?!api|_next|static|favicon.ico).*)",
  ],
};
