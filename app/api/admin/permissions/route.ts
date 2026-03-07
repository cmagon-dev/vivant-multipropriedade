import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/api/withPermission";

async function getHandler() {
  const permissions = await prisma.permission.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });
  return NextResponse.json(permissions);
}

export const GET = withPermission("permissions.manage")(getHandler);
