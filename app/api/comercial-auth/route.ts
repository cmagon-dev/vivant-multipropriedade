import { NextResponse } from "next/server";
import { encode, type JWT } from "next-auth/jwt";

const COOKIE_NAME = "vivant.comercial.session";

export async function POST(req: Request) {
  const { senha } = await req.json();

  if (!process.env.COMERCIAL_PASSWORD || senha !== process.env.COMERCIAL_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const secret = process.env.NEXTAUTH_SECRET!;
  const token = await encode({
    token: { comercialAccess: true } as JWT,
    secret,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // sem maxAge → session cookie; persiste enquanto o browser não limpar
  });

  return response;
}
