import { notFound } from "next/navigation";
import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { CopyButton } from "@/components/ui/copy-button";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  return { title: invoice?.title ?? "Invoice" };
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { lineItems: true },
  });

  if (!invoice || invoice.userId !== user?.id) notFound();

  const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoice.token}`;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/invoices" className="text-sm text-gray-400 hover:text-gray-600">
            ← Invoices
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{invoice.title}</h1>
        </div>
        <StatusBadge status={invoice.status} />
      </div>

      {/* Payment link */}
      {invoice.status === "PENDING" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-sm font-medium text-green-800 mb-2">Share this payment link</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-xs bg-white border border-green-200 rounded-lg px-3 py-2 truncate text-gray-700">
              {paymentUrl}
            </code>
            <CopyButton text={paymentUrl} />
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Invoice details */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Client</p>
            <p className="font-medium text-gray-900">{invoice.clientName}</p>
            <p className="text-gray-400">{invoice.clientEmail}</p>
          </div>
          <div>
            <p className="text-gray-500">Created</p>
            <p className="font-medium text-gray-900">{formatDate(invoice.createdAt)}</p>
            {invoice.dueDate && (
              <>
                <p className="text-gray-500 mt-2">Due</p>
                <p className="font-medium text-gray-900">{formatDate(invoice.dueDate)}</p>
              </>
            )}
          </div>
        </div>

        {invoice.description && (
          <div>
            <p className="text-gray-500 text-sm">Description</p>
            <p className="text-gray-700 text-sm mt-1">{invoice.description}</p>
          </div>
        )}
      </div>

      {/* Line items */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Description</th>
              <th className="text-right px-5 py-3 text-gray-500 font-medium">Qty</th>
              <th className="text-right px-5 py-3 text-gray-500 font-medium">Unit Price</th>
              <th className="text-right px-5 py-3 text-gray-500 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoice.lineItems.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3">{item.description}</td>
                <td className="px-5 py-3 text-right">{Number(item.quantity)}</td>
                <td className="px-5 py-3 text-right">${Number(item.unitPrice).toFixed(2)}</td>
                <td className="px-5 py-3 text-right font-medium">
                  ${(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-gray-200 bg-gray-50">
            <tr>
              <td colSpan={3} className="px-5 py-3 text-right font-semibold text-gray-700">
                Total
              </td>
              <td className="px-5 py-3 text-right font-bold text-gray-900 text-base">
                ${Number(invoice.amountUsd).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {invoice.stellarTxHash && (
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-sm">
          <p className="text-gray-500 mb-1">Stellar Transaction</p>
          <a
            href={`https://stellar.expert/explorer/public/tx/${invoice.stellarTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline font-mono text-xs break-all"
          >
            {invoice.stellarTxHash}
          </a>
        </div>
      )}
    </div>
  );
}
