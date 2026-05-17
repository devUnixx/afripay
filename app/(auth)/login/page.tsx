"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { login, authenticated, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) router.replace("/dashboard");
  }, [ready, authenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-green-600">
            AfriPay 💸
          </Link>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
        </div>
        <button
          onClick={login}
          disabled={!ready}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {ready ? "Continue with Email / Google" : "Loading..."}
        </button>
        <p className="text-center text-sm text-gray-400 mt-6">
          No account?{" "}
          <Link href="/register" className="text-green-600 hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
