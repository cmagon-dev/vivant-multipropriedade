import { getBrandConfig } from "@/lib/domain";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  const brandConfig = getBrandConfig();
  
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-vivant-navy font-serif">
            {brandConfig.name}
          </h1>
          <p className="text-sm text-slate-600">
            {brandConfig.description.split(".")[0]}
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
