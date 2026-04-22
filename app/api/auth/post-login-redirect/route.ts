import { getSession } from "@/lib/auth";
import { getPostLoginRedirectRoute } from "@/lib/auth/postLoginRedirect";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  const route = getPostLoginRedirectRoute(session);
  return NextResponse.json({ url: route });
}
