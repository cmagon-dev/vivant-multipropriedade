"use client";

import { usePathname } from "next/navigation";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";

const PANEL_PREFIXES = ["/admin", "/dashboard", "/admin-portal", "/capital", "/cotista"];

export function GlobalWhatsAppFloating(): JSX.Element | null {
  const pathname = usePathname() ?? "/";

  const isPanel = PANEL_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isPanel) return null;

  return <WhatsAppButton />;
}
