import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { DollarSign, FileText, TrendingUp, Clock } from "lucide-react";

export async function DashboardStats() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [totalPaid, pendingCount, paidCount, totalWithdrawn] = await Promise.all([
    prisma.invoice.aggregate({
      where: { userId: user.id, status: "PAID" },
      _sum: { amountUsd: true },
    }),
    prisma.invoice.count({ where: { userId: user.id, status: "PENDING" } }),
    prisma.invoice.count({ where: { userId: user.id, status: "PAID" } }),
    prisma.withdrawal.aggregate({
      where: { userId: user.id, status: "COMPLETED" },
      _sum: { amountUsdc: true },
    }),
  ]);

  const stats = [
    {
      label: "Total Earned",
      value: `$${Number(totalPaid._sum.amountUsd ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Paid Invoices",
      value: paidCount,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Total Withdrawn",
      value: `$${Number(totalWithdrawn._sum.amountUsdc ?? 0).toFixed(2)}`,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
          <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
