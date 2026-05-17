import crypto from "crypto";

interface MoonPayUrlParams {
  invoiceToken: string;
  amountUsd: number;
  walletAddress?: string;
}

/**
 * Generate a signed MoonPay widget URL for USDC purchase.
 * Called client-side via a server action to keep the secret key safe.
 */
export async function getMoonPayUrl({
  invoiceToken,
  amountUsd,
  walletAddress,
}: MoonPayUrlParams): Promise<string> {
  const res = await fetch("/api/moonpay/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invoiceToken, amountUsd, walletAddress }),
  });
  if (!res.ok) throw new Error("Failed to generate payment URL");
  const { url } = await res.json();
  return url;
}

/**
 * Server-side: build and sign a MoonPay URL.
 */
export function buildSignedMoonPayUrl(params: {
  invoiceToken: string;
  amountUsd: number;
  walletAddress: string;
}): string {
  const base = "https://buy.moonpay.com";
  const apiKey = process.env.NEXT_PUBLIC_MOONPAY_API_KEY!;
  const secret = process.env.MOONPAY_SECRET_KEY!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const query = new URLSearchParams({
    apiKey,
    currencyCode: "usdc_stellar",
    walletAddress: params.walletAddress,
    baseCurrencyAmount: params.amountUsd.toFixed(2),
    redirectURL: `${appUrl}/pay/${params.invoiceToken}?status=success`,
    externalTransactionId: params.invoiceToken,
  });

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`?${query.toString()}`)
    .digest("base64");

  query.set("signature", signature);
  return `${base}?${query.toString()}`;
}

/**
 * Verify a MoonPay webhook signature.
 */
export function verifyMoonPayWebhook(body: string, signature: string): boolean {
  const secret = process.env.MOONPAY_WEBHOOK_SECRET!;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
