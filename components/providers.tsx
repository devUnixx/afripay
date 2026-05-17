"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "google", "github"],
        appearance: {
          theme: "light",
          accentColor: "#16a34a",
          logo: "/logo.svg",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          noPromptOnSignature: true,
        },
      }}
    >
      {children}
      <Toaster />
    </PrivyProvider>
  );
}
