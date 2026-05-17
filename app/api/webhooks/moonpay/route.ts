import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMoonPayWebhook } from "@/lib/moonpay";
import { sendPaymentReceivedEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("moonpay-signature-v2") ?? "";

  if (!verifyMoonPayWebhook(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  // Store raw event for audit
  await prisma.webhookEvent.create({
    data: { source: "moonpay", eventType: event.type, payload: event },
  });

  if (event.type === "transaction_updated" && event.data?.status === "completed") {
    const invoiceToken = event.data?.externalTransactionId as string | undefined;
    const txHash = event.data?.cryptoTransactionId as string | undefined;

    if (!invoiceToken) return NextResponse.json({ received: true });

    const invoice = await prisma.invoice.findUnique({
      where: { token: invoiceToken },
      include: { user: true },
    });

    if (!invoice || invoice.status === "PAID") return NextResponse.json({ received: true });

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
        moonpayTxId: event.data?.id,
        stellarTxHash: txHash,
      },
    });

    // Notify freelancer
    if (invoice.user.email) {
      sendPaymentReceivedEmail({
        to: invoice.user.email,
        freelancerName: invoice.user.name ?? "Freelancer",
        invoiceTitle: invoice.title,
        amountUsd: Number(invoice.amountUsd),
        txHash: txHash ?? "",
      }).catch(console.error);
    }
  }

  await prisma.webhookEvent.updateMany({
    where: { source: "moonpay", processed: false },
    data: { processed: true },
  });

  return NextResponse.json({ received: true });
}
