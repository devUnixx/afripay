import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { getUsdcBalance } from "@/lib/stellar";
import { initiateWithdrawal, getUsdcToNgnRate } from "@/lib/yellowcard";

const schema = z.object({ amountUsdc: z.number().positive().min(1) });

export async function GET() {
  try {
    const user = await requireUser();
    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(withdrawals);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    if (!user.stellarAddress || !user.bankAccountNo || !user.bankCode) {
      return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
    }

    const { amountUsdc } = schema.parse(await req.json());

    // Check balance
    const balance = await getUsdcBalance(user.stellarAddress);
    if (balance < amountUsdc) {
      return NextResponse.json({ error: "Insufficient USDC balance" }, { status: 400 });
    }

    // Get rate
    const { rate } = await getUsdcToNgnRate();
    const amountNgn = amountUsdc * rate;

    // Create withdrawal record
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: user.id,
        amountUsdc,
        amountNgn,
        exchangeRate: rate,
        status: "PROCESSING",
      },
    });

    // Initiate Yellow Card payout (non-blocking)
    initiateWithdrawal({
      amountUsdc,
      bankAccountNo: user.bankAccountNo,
      bankCode: user.bankCode,
      accountName: user.bankAccountName ?? user.name ?? "",
      reference: withdrawal.id,
    })
      .then((ref) =>
        prisma.withdrawal.update({
          where: { id: withdrawal.id },
          data: { yellowCardRef: ref },
        })
      )
      .catch(async (err) => {
        console.error("Yellow Card error:", err);
        await prisma.withdrawal.update({
          where: { id: withdrawal.id },
          data: { status: "FAILED", failureReason: (err as Error).message },
        });
      });

    return NextResponse.json(withdrawal, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
