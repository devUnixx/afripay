import axios from "axios";
import crypto from "crypto";

const BASE_URL =
  process.env.YELLOW_CARD_ENV === "production"
    ? "https://api.yellowcard.io"
    : "https://sandbox.yellowcard.io";

function getHeaders(method: string, path: string, body: string) {
  const apiKey = process.env.YELLOW_CARD_API_KEY!;
  const secret = process.env.YELLOW_CARD_API_SECRET!;
  const timestamp = Date.now().toString();
  const message = `${timestamp}${method.toUpperCase()}${path}${body}`;
  const signature = crypto.createHmac("sha256", secret).update(message).digest("hex");

  return {
    "X-YC-Timestamp": timestamp,
    "X-YC-Key": apiKey,
    "X-YC-Signature": signature,
    "Content-Type": "application/json",
  };
}

export interface YellowCardRate {
  rate: number; // NGN per USDC
  fee: number;
}

/** Get current USDC → NGN exchange rate */
export async function getUsdcToNgnRate(): Promise<YellowCardRate> {
  const path = "/business/rates?currency=NGN&crypto=USDC";
  const headers = getHeaders("GET", path, "");
  const res = await axios.get(`${BASE_URL}${path}`, { headers });
  return { rate: res.data.rate, fee: res.data.fee ?? 0 };
}

export interface WithdrawalPayload {
  amountUsdc: number;
  bankAccountNo: string;
  bankCode: string;
  accountName: string;
  reference: string;
}

/** Initiate a USDC → NGN bank withdrawal via Yellow Card */
export async function initiateWithdrawal(payload: WithdrawalPayload): Promise<string> {
  const path = "/business/payments";
  const body = JSON.stringify({
    amount: payload.amountUsdc,
    currency: "NGN",
    crypto: "USDC",
    destination: {
      accountNumber: payload.bankAccountNo,
      bankCode: payload.bankCode,
      accountName: payload.accountName,
    },
    reference: payload.reference,
    reason: "freelance_payment",
  });

  const headers = getHeaders("POST", path, body);
  const res = await axios.post(`${BASE_URL}${path}`, body, { headers });
  return res.data.id as string;
}

/** Get status of a Yellow Card payment */
export async function getPaymentStatus(
  yellowCardRef: string
): Promise<"pending" | "processing" | "completed" | "failed"> {
  const path = `/business/payments/${yellowCardRef}`;
  const headers = getHeaders("GET", path, "");
  const res = await axios.get(`${BASE_URL}${path}`, { headers });
  return res.data.status;
}
