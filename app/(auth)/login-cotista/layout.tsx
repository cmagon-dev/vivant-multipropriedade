import { CotistaProvider } from "@/app/providers-cotista";

export default function LoginCotistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CotistaProvider>{children}</CotistaProvider>;
}
