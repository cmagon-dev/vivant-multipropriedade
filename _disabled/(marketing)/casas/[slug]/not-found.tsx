import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-vivant-navy mb-4">404</div>
          <h1 className="text-2xl font-serif font-bold text-vivant-navy mb-2">
            Casa não encontrada
          </h1>
          <p className="text-gray-600">
            A propriedade que você está procurando não existe ou não está mais disponível.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-vivant-navy hover:bg-vivant-navy/90">
            <Link href="/casas">
              <Search className="w-4 h-4 mr-2" />
              Ver Todas as Casas
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Ir para Início
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
