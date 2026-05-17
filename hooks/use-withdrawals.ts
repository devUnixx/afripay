"use client";

import { useState, useEffect, useCallback } from "react";

export interface Withdrawal {
  id: string;
  amountUsdc: number;
  amountNgn: number | null;
  exchangeRate: number | null;
  status: string;
  yellowCardRef: string | null;
  createdAt: string;
}

export function useWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/withdrawals");
      if (!res.ok) throw new Error("Failed to load withdrawals");
      setWithdrawals(await res.json());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { withdrawals, loading, error, mutate: fetch_ };
}
