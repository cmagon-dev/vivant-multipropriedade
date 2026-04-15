import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";
import { logMarketplaceEvent } from "@/lib/vivant/week-marketplace-service";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const { id } = await ctx.params;
    const body = (await request.json()) as { action?: "publish" | "cancel" };

    const listing = await prisma.weekMarketplaceListing.findFirst({
      where: { id, ownerCotistaId: auth.cotistaId },
    });
    if (!listing) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 });
    }

    if (body.action === "publish") {
      if (listing.status !== "DRAFT") {
        return NextResponse.json({ error: "Só é possível publicar rascunhos." }, { status: 400 });
      }
      const updated = await prisma.$transaction(async (tx) => {
        const u = await tx.weekMarketplaceListing.update({
          where: { id },
          data: { status: "PUBLISHED" },
        });
        await logMarketplaceEvent(tx, {
          listingId: id,
          actorCotistaId: auth.cotistaId,
          action: "LISTING_PUBLISHED",
        });
        return u;
      });
      return NextResponse.json({ listing: updated });
    }

    if (body.action === "cancel") {
      if (listing.status === "COMPLETED" || listing.status === "CANCELLED") {
        return NextResponse.json({ error: "Anúncio já encerrado." }, { status: 400 });
      }
      await prisma.$transaction(async (tx) => {
        await tx.weekMarketplaceProposal.updateMany({
          where: {
            listingId: id,
            status: { in: ["PENDING", "ACCEPTED_BY_OWNER", "ACCEPTED_BY_PROPOSER"] },
          },
          data: { status: "CANCELLED" },
        });
        await tx.weekMarketplaceListing.update({
          where: { id },
          data: { status: "CANCELLED" },
        });
        await logMarketplaceEvent(tx, {
          listingId: id,
          actorCotistaId: auth.cotistaId,
          action: "LISTING_CANCELLED",
        });
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao atualizar anúncio" }, { status: 500 });
  }
}
