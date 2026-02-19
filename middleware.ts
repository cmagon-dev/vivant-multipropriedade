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
  
  // Proteção de rotas admin
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    
    // Redirecionar /admin para /admin/dashboard
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    
    // Verificar permissões específicas
    if (pathname.startsWith("/admin/usuarios") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }
  
  // Redirecionar /login para /admin/dashboard se já autenticado
  if (pathname === "/login") {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
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
