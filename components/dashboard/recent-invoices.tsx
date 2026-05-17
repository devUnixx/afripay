import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export async function RecentInvoices() {
  const user = await getCurrentUser();
  if (!user) return null;

  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Recent Invoices</h2>
        <Link href="/invoices" className="text-sm text-green-600 hover:underline">
          View all
        </Link>
      </div>
      {invoices.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm">
          No invoices yet.{" "}
          <Link href="/invoices/create" className="text-green-600 hover:underline">
            Create your first invoice
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {invoices.map((inv) => (
            <Link
              key={inv.id}
              href={`/invoices/${inv.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{inv.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{inv.clientName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ${Number(inv.amountUsd).toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-1 justify-end">
                  <StatusBadge status={inv.status} />
                  <span className="text-xs text-gray-400">{formatDate(inv.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
