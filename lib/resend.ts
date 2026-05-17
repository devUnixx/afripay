import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@afripay.io";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://afripay.io";

export async function sendInvoiceEmail(params: {
  to: string;
  clientName: string;
  freelancerName: string;
  invoiceTitle: string;
  amountUsd: number;
  paymentToken: string;
}) {
  const paymentUrl = `${APP_URL}/pay/${params.paymentToken}`;
  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Invoice from ${params.freelancerName}: ${params.invoiceTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#16a34a">AfriPay 💸</h2>
        <p>Hi ${params.clientName},</p>
        <p><strong>${params.freelancerName}</strong> has sent you an invoice for <strong>${params.invoiceTitle}</strong>.</p>
        <p style="font-size:24px;font-weight:bold">$${params.amountUsd.toFixed(2)}</p>
        <a href="${paymentUrl}" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Pay Now
        </a>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px">
          Powered by AfriPay · Stellar Network
        </p>
      </div>
    `,
  });
}

export async function sendPaymentReceivedEmail(params: {
  to: string;
  freelancerName: string;
  invoiceTitle: string;
  amountUsd: number;
  txHash: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Payment received: ${params.invoiceTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#16a34a">AfriPay 💸</h2>
        <p>Hi ${params.freelancerName},</p>
        <p>You received a payment of <strong>$${params.amountUsd.toFixed(2)} USDC</strong> for <strong>${params.invoiceTitle}</strong>.</p>
        <p style="color:#6b7280;font-size:12px">
          Stellar TX: <a href="https://stellar.expert/explorer/public/tx/${params.txHash}">${params.txHash}</a>
        </p>
        <a href="${APP_URL}/dashboard" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          View Dashboard
        </a>
      </div>
    `,
  });
}
