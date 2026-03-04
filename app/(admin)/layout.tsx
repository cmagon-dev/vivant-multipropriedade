import { AdminProvider } from "@/app/providers-admin";

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProvider>{children}</AdminProvider>;
}
