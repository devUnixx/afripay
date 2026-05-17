"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

export default function SettingsPage() {
  const { user, logout } = usePrivy();
  const [copied, setCopied] = useState(false);

  const stellarAddress = (user?.linkedAccounts?.find((a) => a.type === "wallet") as { address?: string })?.address;

  function copyAddress() {
    if (!stellarAddress) return;
    navigator.clipboard.writeText(stellarAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Profile</h2>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Email</label>
          <p className="text-sm text-gray-900">{user?.email?.address ?? "—"}</p>
        </div>
      </div>

      {/* Stellar Wallet */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Stellar Wallet</h2>
        <p className="text-xs text-gray-500">
          Your embedded Stellar wallet is managed by Privy. You never need to handle private keys.
        </p>
        {stellarAddress ? (
          <div className="flex items-center gap-3">
            <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 truncate">
              {stellarAddress}
            </code>
            <button
              onClick={copyAddress}
              className="text-xs text-green-600 hover:underline whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Wallet not yet created</p>
        )}
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-100 p-6">
        <h2 className="font-semibold text-red-600 mb-4">Danger Zone</h2>
        <button
          onClick={logout}
          className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
