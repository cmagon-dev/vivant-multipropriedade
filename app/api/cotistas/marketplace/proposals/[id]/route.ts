import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import {
  applyProposalAction,
  type MarketplaceProposalAction,
} from "@/lib/vivant/week-marketplace-service";

export const dynamic = "force-dynamic";

const ACTIONS: MarketplaceProposalAction[] = [
  "owner_accept",
  "proposer_confirm_exchange",
  "seller_confirm_sale",
  "buyer_confirm_sale",
  "reject",
  "cancel",
];

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const { id } = await ctx.params;
    const body = (await request.json()) as { action?: string };

    if (!body.action || !ACTIONS.includes(body.action as MarketplaceProposalAction)) {
      return NextResponse.json({ error: "action inválida" }, { status: 400 });
    }

    const result = await applyProposalAction({
      proposalId: id,
      actorCotistaId: auth.cotistaId,
      action: body.action as MarketplaceProposalAction,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao processar proposta" }, { status: 500 });
  }
}
