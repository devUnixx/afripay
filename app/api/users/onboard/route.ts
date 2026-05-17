import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PrivyClient } from "@privy-io/server-auth";

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

const schema = z.object({
  privyId: z.string(),
  name: z.string().min(2),
  bankAccountName: z.string().min(2),
  bankAccountNo: z.string().length(10),
  bankCode: z.string().min(3),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());

    // Verify the Privy user exists
    const privyUser = await privy.getUser(body.privyId);
    const email = privyUser.email?.address;
    if (!email) return NextResponse.json({ error: "No email on Privy account" }, { status: 400 });

    // Get Stellar wallet from Privy embedded wallets
    const stellarWallet = privyUser.linkedAccounts?.find(
      (a) => a.type === "wallet" && (a as { chainType?: string }).chainType === "stellar"
    ) as { address?: string } | undefined;

    const user = await prisma.user.upsert({
      where: { privyId: body.privyId },
      update: {
        name: body.name,
        bankAccountName: body.bankAccountName,
        bankAccountNo: body.bankAccountNo,
        bankCode: body.bankCode,
        onboarded: true,
        stellarAddress: stellarWallet?.address,
      },
      create: {
        privyId: body.privyId,
        email,
        name: body.name,
        bankAccountName: body.bankAccountName,
        bankAccountNo: body.bankAccountNo,
        bankCode: body.bankCode,
        onboarded: true,
        stellarAddress: stellarWallet?.address,
      },
    });

    return NextResponse.json(user);
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
