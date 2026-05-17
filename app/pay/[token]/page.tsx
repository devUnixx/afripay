import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PaymentWidget } from "@/components/payment-widget";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { token } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { token } });
  return { title: invoice ? `Pay ${invoice.title}` : "Payment" };
}

export default async function PayPage({ params }: Props) {
  const { token } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { token },
    include: { lineItems: true, user: { select: { name: true } } },
  });

  if (!invoice) notFound();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <span className="text-2xl font-bold text-green-600">AfriPay 💸</span>
          <p className="text-gray-500 text-sm mt-1">Secure payment powered by Stellar</p>
        </div>

        {/* Invoice summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Invoice from</p>
            <p className="font-semibold text-gray-900">{invoice.user.name ?? "Freelancer"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">For</p>
            <p className="font-medium text-gray-900">{invoice.title}</p>
            {invoice.description && (
              <p className="text-sm text-gray-500 mt-1">{invoice.description}</p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="space-y-2">
              {invoice.lineItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.description} × {Number(item.quantity)}
                  </span>
                  <span className="font-medium">
                    ${(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                ${Number(invoice.amountUsd).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment widget */}
        <PaymentWidget invoice={invoice} />

        <p className="text-center text-xs text-gray-400">
          Payments are processed via MoonPay and settled on the Stellar network.
          <br />
          Your card details are never stored by AfriPay.
        </p>
      </div>
    </div>
  );
}
