import { getBrandConfig } from "@/lib/domain";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/3f614ec6-ea6c-4578-ae73-c4919008ee09',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/(dashboard)/layout.tsx:8',message:'DashboardLayout: início',data:{},timestamp:Date.now(),hypothesisId:'B,C'})}).catch(()=>{});
  // #endregion
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
