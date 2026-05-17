"use client";

import { useState } from "react";
import { getMoonPayUrl } from "@/lib/moonpay";

interface Invoice {
  id: string;
  token: string;
  amountUsd: unknown;
  status: string;
  user: { name: string | null };
}

export function PaymentWidget({ invoice }: { invoice: Invoice }) {
  const [loading, setLoading] = useState(false);

  if (invoice.status === "PAID") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <p className="font-semibold text-green-800">Payment received!</p>
        <p className="text-sm text-green-600 mt-1">This invoice has been paid.</p>
      </div>
    );
  }

  if (invoice.status === "CANCELLED") {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
        <p className="font-semibold text-gray-700">This invoice has been cancelled.</p>
      </div>
    );
  }

  async function handlePay() {
    setLoading(true);
    try {
      const url = await getMoonPayUrl({
        invoiceToken: invoice.token,
        amountUsd: Number(invoice.amountUsd),
      });
      window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50"
    >
      {loading ? "Redirecting..." : `Pay $${Number(invoice.amountUsd).toFixed(2)} with Card`}
    </button>
  );
}
