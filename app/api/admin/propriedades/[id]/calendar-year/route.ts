import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { deletePropertyCalendarYearByYear } from "@/lib/vivant/calendar-import-service";

function canDelete(session: unknown) {
  const s = session as { user?: { userType?: string } } | null;
  return (
    s?.user?.userType === "admin" &&
    hasPermission(session as any, "vivantCare.propriedades.manage")
  );
}

/** Exclui o calendário oficial de um ano (semanas, distribuição, reservas em cascata; trocas ligadas às semanas antes). */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canDelete(session)) {
      return NextResponse.json(
        { error: "Sem permissão para excluir calendário" },
        { status: 403 }
      );
    }

    const propertyId = params.id;
    const yearParam = request.nextUrl.searchParams.get("year");
    const year = yearParam ? parseInt(yearParam, 10) : NaN;
    if (!Number.isFinite(year) || year < 2000 || year > 2100) {
      return NextResponse.json({ error: "Parâmetro year inválido" }, { status: 400 });
    }

    const result = await deletePropertyCalendarYearByYear(propertyId, year);
    if (!result.deleted) {
      return NextResponse.json(
        { error: "Não há calendário cadastrado para este ano." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, deleted: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao excluir calendário" },
      { status: 500 }
    );
  }
}
