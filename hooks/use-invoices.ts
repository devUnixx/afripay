"use client";

import { useState, useEffect, useCallback } from "react";

export interface Invoice {
  id: string;
  token: string;
  title: string;
  clientName: string;
  clientEmail: string;
  amountUsd: number;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
  createdAt: string;
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices");
      if (!res.ok) throw new Error("Failed to load invoices");
      setInvoices(await res.json());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { invoices, loading, error, mutate: fetch_ };
}
