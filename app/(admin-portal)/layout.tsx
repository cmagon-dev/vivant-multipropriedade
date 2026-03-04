import { AdminProvider } from "@/app/providers-admin";

export default function AdminPortalGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProvider>{children}</AdminProvider>;
}
