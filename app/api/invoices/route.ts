import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { sendInvoiceEmail } from "@/lib/resend";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  dueDate: z.string().optional(),
  lineItems: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().positive(),
        unitPrice: z.number().positive(),
      })
    )
    .min(1),
});

export async function GET() {
  try {
    const user = await requireUser();
    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      include: { lineItems: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = createSchema.parse(await req.json());

    const amountUsd = body.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        title: body.title,
        description: body.description,
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        amountUsd,
        status: "PENDING",
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        lineItems: { create: body.lineItems },
      },
      include: { lineItems: true },
    });

    // Send invoice email to client (non-blocking)
    sendInvoiceEmail({
      to: body.clientEmail,
      clientName: body.clientName,
      freelancerName: user.name ?? user.email,
      invoiceTitle: body.title,
      amountUsd,
      paymentToken: invoice.token,
    }).catch(console.error);

    return NextResponse.json(invoice, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
