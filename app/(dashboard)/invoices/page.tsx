import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Invoices" };

export default async function InvoicesPage() {
  const user = await getCurrentUser();
  const invoices = user
    ? await prisma.invoice.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">{invoices.length} total</p>
        </div>
        <Link
          href="/invoices/create"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Invoice
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm mb-4">No invoices yet</p>
            <Link
              href="/invoices/create"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
            >
              <Plus className="w-4 h-4" /> Create Invoice
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Invoice</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Client</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Amount</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/invoices/${inv.id}`} className="font-medium text-gray-900 hover:text-green-600">
                      {inv.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{inv.clientName}</td>
                  <td className="px-5 py-4 font-semibold">${Number(inv.amountUsd).toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-5 py-4 text-gray-400">{formatDate(inv.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
