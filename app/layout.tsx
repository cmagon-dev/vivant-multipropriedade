import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { getBrandConfig } from "@/lib/domain";

// Importação absoluta do CSS global
import "@/app/globals.css";

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
  const brandConfig = getBrandConfig();
  
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
        {children}
      </body>
    </html>
  );
}
