import { MarketplaceSubnav } from "@/components/cotista/marketplace/marketplace-subnav";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B]">
          Marketplace de semanas
        </h1>
        <p className="text-sm text-[#1A2F4B]/70 mt-1 max-w-2xl">
          Troca e venda direta entre cotistas da mesma propriedade. O sistema não intermedia
          pagamento — apenas executa o acordo após confirmação mútua.
        </p>
      </div>
      <MarketplaceSubnav />
      {children}
    </div>
  );
}
