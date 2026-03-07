import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminPortalSidebar } from "@/components/admin-portal/sidebar";
import { AdminPortalHeader } from "@/components/admin-portal/header";

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.userType !== "admin") {
    redirect("/login");
  }
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminPortalSidebar user={session.user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminPortalHeader user={session.user} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 min-h-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
