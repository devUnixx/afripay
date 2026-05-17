import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getUsdcBalance } from "@/lib/stellar";

export async function GET() {
  try {
    const user = await requireUser();
    const balance = user.stellarAddress ? await getUsdcBalance(user.stellarAddress) : 0;
    return NextResponse.json({ balance, address: user.stellarAddress });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 });
  }
}
