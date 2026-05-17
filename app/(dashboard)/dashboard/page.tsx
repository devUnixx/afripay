import { Suspense } from "react";
import { DashboardStats } from "@/components/dashboard/stats";
import { RecentInvoices } from "@/components/dashboard/recent-invoices";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Your payment overview</p>
      </div>
      <Suspense fallback={<div className="h-32 bg-gray-100 rounded-xl animate-pulse" />}>
        <DashboardStats />
      </Suspense>
      <Suspense fallback={<div className="h-64 bg-gray-100 rounded-xl animate-pulse" />}>
        <RecentInvoices />
      </Suspense>
    </div>
  );
}
