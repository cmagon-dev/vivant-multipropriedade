import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/auth/permissions";
import { ComercialOverviewClient } from "./comercial-overview-client";

export default async function ComercialDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "comercial.view")) redirect("/403");

  return <ComercialOverviewClient />;
}
