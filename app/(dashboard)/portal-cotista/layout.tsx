import { CotistaProvider } from "@/app/providers-cotista";

export default function PortalCotistaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return <CotistaProvider>{children}</CotistaProvider>;
}
