import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Cron: Cancel overdue invoices.
 * Runs daily at 02:00 UTC via Vercel Cron.
 * Cancels PENDING invoices with dueDate > 90 days ago,
 * unless they have active escrow, active dispute, or doNotAutoCancel=true.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);

  const result = await prisma.invoice.updateMany({
    where: {
      status: "PENDING",
      dueDate: { lt: cutoff },
      doNotAutoCancel: false,
      hasActiveEscrow: false,
      hasActiveDispute: false,
    },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ cancelled: result.count, cutoff });
}
