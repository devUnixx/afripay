"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Bell } from "lucide-react";

export function Navbar() {
  const { user } = usePrivy();

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-sm font-semibold">
            {user?.email?.address?.[0]?.toUpperCase() ?? "U"}
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">
            {user?.email?.address ?? ""}
          </span>
        </div>
      </div>
    </header>
  );
}
