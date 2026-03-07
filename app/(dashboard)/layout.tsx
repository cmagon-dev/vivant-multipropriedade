import { getBrandConfig } from "@/lib/domain";
import { DashboardLayoutWrapper } from "@/components/dashboard/DashboardLayoutWrapper";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  const brandConfig = getBrandConfig();
  return (
    <DashboardLayoutWrapper brandConfig={brandConfig}>
      {children}
    </DashboardLayoutWrapper>
  );
}
