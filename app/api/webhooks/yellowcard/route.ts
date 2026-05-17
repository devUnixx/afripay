import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();

  await prisma.webhookEvent.create({
    data: { source: "yellowcard", eventType: body.event ?? "unknown", payload: body },
  });

  const ref = body.reference as string | undefined;
  if (!ref) return NextResponse.json({ received: true });

  const statusMap: Record<string, "PROCESSING" | "COMPLETED" | "FAILED"> = {
    pending: "PROCESSING",
    processing: "PROCESSING",
    completed: "COMPLETED",
    failed: "FAILED",
  };

  const newStatus = statusMap[body.status as string];
  if (newStatus) {
    await prisma.withdrawal.updateMany({
      where: { id: ref },
      data: { status: newStatus, ...(newStatus === "FAILED" ? { failureReason: body.reason } : {}) },
    });
  }

  return NextResponse.json({ received: true });
}
