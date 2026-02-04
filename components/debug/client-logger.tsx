"use client";

import { useEffect } from "react";

interface ClientLoggerProps {
  brandName: string;
}

/**
 * Componente para logar informações no console do navegador
 * Apenas para debug - remover em produção
 */
export function ClientLogger({ brandName }: ClientLoggerProps): null {
  useEffect(() => {
    console.log("🎨 [Client] Hostname detectado:", window.location.hostname);
    console.log("🎨 [Client] Porta:", window.location.port);
    console.log("🎨 [Client] URL completa:", window.location.href);
    console.log("🎨 [Client] Marca detectada:", brandName);
    
    // Verificar se fontes estão carregadas
    const html = document.documentElement;
    const computedStyle = window.getComputedStyle(html);
    console.log("🎨 [Client] Classes HTML:", html.className);
    console.log("🎨 [Client] Font variables:", {
      inter: computedStyle.getPropertyValue("--font-inter"),
      playfair: computedStyle.getPropertyValue("--font-playfair"),
    });
    
    // Verificar se CSS está carregado
    const body = document.body;
    const bodyStyle = window.getComputedStyle(body);
    console.log("🎨 [Client] Body font-family:", bodyStyle.fontFamily);
    console.log("🎨 [Client] Body background:", bodyStyle.backgroundColor);
    
    // Verificar stylesheets
    const stylesheets = Array.from(document.styleSheets);
    console.log("🎨 [Client] Stylesheets carregadas:", stylesheets.length);
    stylesheets.forEach((sheet, index) => {
      try {
        console.log(`🎨 [Client] Stylesheet ${index}:`, sheet.href || "inline");
      } catch (e) {
        console.log(`🎨 [Client] Stylesheet ${index}: (CORS bloqueado)`);
      }
    });
  }, [brandName]);

  return null;
}
