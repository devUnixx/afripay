# Architecture

## Overview

AfriPay is a Next.js 15 application using the App Router. It abstracts Stellar blockchain complexity behind a simple invoicing and payments UI.

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        AfriPay App                         │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Auth Pages  │    │  Dashboard   │    │  Pay Page    │  │
│  │  (Privy)     │    │  (RSC + API) │    │  (public)    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    API Routes                        │  │
│  │  /api/invoices  /api/withdrawals  /api/webhooks/*    │  │
│  │  /api/moonpay/sign  /api/wallet/balance  /api/cron/* │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    lib/                              │  │
│  │  stellar.ts  moonpay.ts  yellowcard.ts  resend.ts    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │              │                │
         ▼              ▼                ▼
    PostgreSQL      Stellar          Privy
    (Neon)          Network          (Auth +
                    (USDC)           Wallets)
```

## Payment Flow

```
Client (browser)
    │
    │  1. Opens /pay/:token
    ▼
AfriPay Pay Page
    │
    │  2. POST /api/moonpay/sign → signed MoonPay URL
    ▼
MoonPay Widget (redirect)
    │
    │  3. Client pays with card
    │  4. MoonPay converts fiat → USDC on Stellar
    │  5. USDC sent to freelancer's Stellar wallet
    ▼
MoonPay Webhook → POST /api/webhooks/moonpay
    │
    │  6. Invoice marked PAID
    │  7. Email sent to freelancer
    ▼
Freelancer Dashboard
    │
    │  8. Freelancer clicks Withdraw
    │  9. POST /api/withdrawals
    ▼
Yellow Card API
    │
    │  10. USDC → NGN conversion
    │  11. NGN sent to Nigerian bank account
    ▼
Yellow Card Webhook → POST /api/webhooks/yellowcard
    │
    │  12. Withdrawal marked COMPLETED
    ▼
Freelancer's Bank Account ✅
```

## Database Schema

See [`prisma/schema.prisma`](../prisma/schema.prisma) for the full schema.

Key models:
- **User** — freelancer profile, Stellar address, bank details
- **Invoice** — invoice with line items, payment token, status
- **LineItem** — individual line items on an invoice
- **Withdrawal** — USDC → NGN withdrawal record
- **WebhookEvent** — raw webhook payloads for audit/replay

## Authentication

Authentication is handled by [Privy](https://privy.io):
- Email, Google, and GitHub login
- Embedded Stellar wallets created automatically on first login
- Server-side auth via `PrivyClient.verifyAuthToken()` using the `privy-token` cookie

## Stellar Integration

- Network: Stellar Mainnet (USDC issued by Circle)
- Testnet USDC issuer used in development
- Wallet management: Privy embedded wallets (no private key exposure)
- SDK: `@stellar/stellar-sdk` v13

## Cron Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| `cancel-overdue-invoices` | `0 2 * * *` | Cancels PENDING invoices with dueDate > 90 days ago |

Protected by `CRON_SECRET` bearer token. Configured in [`vercel.json`](../vercel.json).

## Environment Variables

See [`.env.example`](../.env.example) for all required variables with descriptions.
