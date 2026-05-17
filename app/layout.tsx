import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "AfriPay", template: "%s | AfriPay" },
  description:
    "Instant international payments for Nigerian freelancers — powered by Stellar and stablecoins.",
  keywords: ["payments", "freelance", "nigeria", "stellar", "usdc", "fintech"],
  openGraph: {
    title: "AfriPay",
    description: "Get paid globally in minutes, not days. Fees under 1%.",
    url: "https://afripay.io",
    siteName: "AfriPay",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "AfriPay" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
