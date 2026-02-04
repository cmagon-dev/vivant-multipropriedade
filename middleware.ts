import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  
  // Normaliza o hostname (remove www. e porta se houver)
  const domain = hostname.replace("www.", "").split(":")[0].toLowerCase();
  
  // Não interceptar assets estáticos, fontes e APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // Qualquer arquivo com extensão (css, js, woff2, etc)
  ) {
    return NextResponse.next();
  }
  
  // Roteamento multi-domínio para produção
  // Vivant Capital → Página de apresentação + Simulador
  if (domain === "vivantcapital.com.br") {
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
