import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { getBrandConfig } from "@/lib/domain";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { Providers } from "./providers";

// Importação absoluta do CSS global
import "@/app/globals.css";

// #region agent log
console.log('[ROOT LAYOUT DEBUG] Module loading');
// #endregion

// Configuração das fontes Google com otimização Next.js
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
});

/**
 * Metadados dinâmicos baseados no domínio acessado
 */
export async function generateMetadata(): Promise<Metadata> {
  const brandConfig = getBrandConfig();
  
  return {
    title: brandConfig.title,
    description: brandConfig.description,
    openGraph: {
      title: brandConfig.title,
      description: brandConfig.description,
      type: "website",
      locale: "pt_BR",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/3f614ec6-ea6c-4578-ae73-c4919008ee09',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/layout.tsx:48',message:'RootLayout: início da função',data:{},timestamp:Date.now(),hypothesisId:'A,B,C'})}).catch(()=>{});
  // #endregion
  const brandConfig = getBrandConfig();
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/3f614ec6-ea6c-4578-ae73-c4919008ee09',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/layout.tsx:51',message:'RootLayout: brandConfig obtido',data:{brandName:brandConfig.name},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  return (
    <html 
      lang="pt-BR" 
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Force preload das fontes */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
