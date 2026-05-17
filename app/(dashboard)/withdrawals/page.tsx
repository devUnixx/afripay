"use client";

import { useState } from "react";
import { useWithdrawals } from "@/hooks/use-withdrawals";
import { useWallet } from "@/hooks/use-wallet";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function WithdrawalsPage() {
  const { withdrawals, loading, mutate } = useWithdrawals();
  const { balance } = useWallet();
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountUsdc: parseFloat(amount) }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setAmount("");
      mutate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>
        <p className="text-gray-500 text-sm mt-1">Convert USDC to NGN and send to your bank</p>
      </div>

      {/* Withdraw form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Withdraw to Bank</h2>
          <span className="text-sm text-gray-500">
            Balance: <span className="font-semibold text-gray-900">${balance?.toFixed(2) ?? "—"} USDC</span>
          </span>
        </div>
        <form onSubmit={handleWithdraw} className="flex gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in USDC"
            min="1"
            step="0.01"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            disabled={submitting || !amount}
            className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Withdraw"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <p className="text-xs text-gray-400 mt-3">
          Funds arrive in your Nigerian bank account via Yellow Card. Fee: ~0.8%.
        </p>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Withdrawal History</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : withdrawals.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No withdrawals yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Amount (USDC)</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Amount (NGN)</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {withdrawals.map((w) => (
                <tr key={w.id}>
                  <td className="px-5 py-4 font-semibold">${Number(w.amountUsdc).toFixed(2)}</td>
                  <td className="px-5 py-4 text-gray-500">
                    {w.amountNgn ? `₦${Number(w.amountNgn).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={w.status} />
                  </td>
                  <td className="px-5 py-4 text-gray-400">{formatDate(new Date(w.createdAt))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
