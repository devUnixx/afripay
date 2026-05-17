"use client";

import { useState, useEffect, useCallback } from "react";

export function useWallet() {
  const [balance, setBalance] = useState<number | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wallet/balance");
      if (!res.ok) return;
      const data = await res.json();
      setBalance(data.balance);
      setAddress(data.address);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { balance, address, loading, mutate: fetch_ };
}
