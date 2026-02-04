import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  
  // Remove porta para desenvolvimento local
  const domain = hostname.split(":")[0];
  
  // Não interceptar assets estáticos, fontes e APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // Qualquer arquivo com extensão (css, js, woff2, etc)
  ) {
    return NextResponse.next();
  }
  
  // Lógica de roteamento baseada no domínio (apenas para páginas HTML)
  if (domain.includes("vivantcapital.com.br")) {
    // Vivant Capital → Simulador de Engenharia Financeira
    const url = new URL("/dashboard/simulador", request.url);
    const response = NextResponse.rewrite(url);
    response.headers.set("x-vivant-domain", "capital");
    return response;
  }
  
  if (domain.includes("vivantcare.com.br")) {
    // Vivant Care → Portal do Cotista
    const url = new URL("/portal-cotista", request.url);
    const response = NextResponse.rewrite(url);
    response.headers.set("x-vivant-domain", "care");
    return response;
  }
  
  // Vivant Residences ou localhost → Deixa seguir o fluxo normal
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
