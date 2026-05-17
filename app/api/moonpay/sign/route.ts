import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildSignedMoonPayUrl } from "@/lib/moonpay";

const schema = z.object({
  invoiceToken: z.string(),
  amountUsd: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const { invoiceToken, amountUsd } = schema.parse(await req.json());

    const invoice = await prisma.invoice.findUnique({
      where: { token: invoiceToken },
      include: { user: { select: { stellarAddress: true } } },
    });

    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    if (invoice.status !== "PENDING")
      return NextResponse.json({ error: "Invoice is not payable" }, { status: 400 });
    if (!invoice.user.stellarAddress)
      return NextResponse.json({ error: "Freelancer wallet not set up" }, { status: 400 });

    const url = buildSignedMoonPayUrl({
      invoiceToken,
      amountUsd,
      walletAddress: invoice.user.stellarAddress,
    });

    return NextResponse.json({ url });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
