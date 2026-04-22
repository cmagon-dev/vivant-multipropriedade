import { AdminProvider } from "@/app/providers-admin";

export default function LoginAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProvider>{children}</AdminProvider>;
}
