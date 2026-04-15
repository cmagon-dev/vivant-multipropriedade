"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { signOutAndGoToLogin } from "@/lib/auth/signOutClient";

type NotificacaoItem = {
  id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  url: string | null;
  propertyId?: string | null;
  expiresAt?: string | null;
  createdAt: string;
};

function destinoNotificacao(n: NotificacaoItem): string {
  if (n.url && n.url.startsWith("/")) return n.url;
  const t = (n.tipo || "").toUpperCase();
  if (t === "COBRANCA") return "/dashboard/financeiro";
  if (t === "AVISO") return "/dashboard/avisos";
  if (t === "ASSEMBLEIA") return "/dashboard/assembleias";
  if (t === "TROCA_SOLICITACAO" || t === "TROCA_OPORTUNIDADE" || t === "TROCA_ADMIN") {
    return "/dashboard/solicitacoes-trocas";
  }
  if (t === "TROCA_INTERESSE") return "/dashboard/oportunidades-trocas";
  return "/dashboard";
}

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [notificacoes, setNotificacoes] = useState<NotificacaoItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadNotificacoes = async () => {
      try {
        const r = await fetch("/api/cotistas/me/notificacoes", {
          credentials: "include",
          cache: "no-store",
        });
        const data = r.ok ? await r.json() : { notificacoes: [] };
        if (!cancelled && Array.isArray(data?.notificacoes)) {
          setNotificacoes(data.notificacoes);
        }
      } catch {
        if (!cancelled) setNotificacoes([]);
      } finally {
        if (!cancelled) setLoadingNotifs(false);
      }
    };

    void loadNotificacoes();
    const interval = window.setInterval(() => {
      void loadNotificacoes();
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const unreadCount = notificacoes.length;

  const markAsRead = async (id: string) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
    try {
      await fetch(`/api/cotistas/me/notificacoes/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
    } catch {
      // Em caso de falha, o polling recarrega o estado em seguida.
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3">
            <img 
              src="/logo-vivant-care.png" 
              alt="Vivant Care" 
              className="h-8 w-auto lg:hidden"
            />
            <h1 className="text-lg font-semibold text-[#1A2F4B] hidden sm:block">
              Portal do Cotista
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {loadingNotifs ? (
                <div className="px-3 py-4 text-sm text-slate-500">Carregando...</div>
              ) : notificacoes.length === 0 ? (
                <div className="px-3 py-4 text-sm text-slate-500">
                  Nenhuma notificação no momento.
                </div>
              ) : (
                notificacoes.map((n) => {
                  const rel = formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  });
                  const href = destinoNotificacao(n);
                  return (
                    <DropdownMenuItem
                      key={n.id}
                      className="flex flex-col items-start p-3 bg-slate-50 cursor-pointer"
                      onSelect={() => {
                        void markAsRead(n.id);
                        router.push(href);
                      }}
                    >
                      <p className="font-medium text-sm">{n.titulo}</p>
                      {n.mensagem ? (
                        <p className="text-xs text-slate-600 line-clamp-2">{n.mensagem}</p>
                      ) : null}
                      <p className="text-xs text-slate-400 mt-1 capitalize">{rel}</p>
                    </DropdownMenuItem>
                  );
                })
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-vivant-green/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-vivant-green">
                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="hidden sm:inline text-sm font-medium text-[#1A2F4B]">
                  {session?.user?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/perfil">Meu Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/configuracoes">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/propriedades">Minhas Cotas / Propriedades</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer"
                onClick={() => void signOutAndGoToLogin()}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
