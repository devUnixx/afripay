# AfriPay 💸

> Instant international payments for Nigerian freelancers — powered by Stellar and stablecoins.

[![CI](https://github.com/your-org/afripay/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/afripay/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Built on Stellar](https://img.shields.io/badge/Built%20on-Stellar-7B2FBE)](https://stellar.org)

AfriPay enables freelancers to receive payments from global clients in **minutes, not days**, with fees under **1%**. Blockchain complexity is completely abstracted — users see invoices, balances, and bank withdrawals, nothing else.

---

## 🎯 The Problem

- Traditional payment methods (PayPal, Wise) charge **5–10% fees** and take **3–7 days** to settle
- Nigerian freelancers lose significant portions of their earnings to fees and exchange rate markups
- Crypto solutions are too complex for non-technical users

## ✅ Our Solution

1. **Create invoice** → Get a shareable payment link
2. **Client pays** → Card payment converts to USDC on Stellar
3. **Instant settlement** → Funds arrive in 3–5 seconds
4. **Withdraw to bank** → Convert to NGN via Yellow Card, instant bank transfer
5. **Keep 99%+** → Fees under 1%, zero crypto knowledge required

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS v4 |
| Backend | Next.js API Routes, Prisma ORM, PostgreSQL (Neon) |
| Auth | [Privy](https://privy.io) — OAuth + embedded Stellar wallets |
| Blockchain | Stellar Network — USDC stablecoin |
| On-ramp | [MoonPay](https://moonpay.com) — card → USDC |
| Off-ramp | [Yellow Card](https://yellowcard.io) — USDC → NGN bank transfer |
| Email | [Resend](https://resend.com) |
| Deployment | Vercel |

---

## 🌟 Why Stellar?

- ⚡ **3–5 second settlement** with fees < $0.01
- 🏦 **Yellow Card integration** — direct off-ramp to Nigerian banks in 20+ African countries
- 🌍 **475,000+ on/off-ramp access points** worldwide
- 🔒 **Battle-tested** — used by MoneyGram, Onafriq, and major African payment providers
- 💰 **Low cost** — ~$0.75 per wallet (XLM reserves) vs building custom infrastructure

---

## 🔄 How It Works

```
Client Card Payment
    ↓
MoonPay (Fiat → USDC on Stellar)
    ↓
Freelancer's Stellar Wallet (Privy embedded)
    ↓
Yellow Card API (USDC → NGN)
    ↓
Nigerian Bank Account
```

---

## 📁 Project Structure

```
afripay/
├── app/
│   ├── (auth)/              # Login, register, onboarding
│   ├── (dashboard)/         # Authenticated app pages
│   │   ├── dashboard/       # Overview with stats
│   │   ├── invoices/        # Invoice list + create + detail
│   │   ├── withdrawals/     # Withdrawal history + initiate
│   │   └── settings/        # Profile & wallet settings
│   ├── api/
│   │   ├── invoices/        # CRUD
│   │   ├── moonpay/sign/    # Signed widget URL
│   │   ├── webhooks/        # MoonPay + Yellow Card
│   │   ├── withdrawals/     # Initiate + list
│   │   ├── wallet/balance/  # USDC balance
│   │   ├── users/onboard/   # Onboarding
│   │   └── cron/            # Scheduled jobs
│   ├── pay/[token]/         # Public payment page (no auth)
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Badge, CopyButton, Toaster
│   ├── dashboard/           # Stats, RecentInvoices
│   ├── sidebar.tsx
│   ├── navbar.tsx
│   ├── payment-widget.tsx
│   └── providers.tsx
├── hooks/
│   ├── use-invoices.ts
│   ├── use-wallet.ts
│   └── use-withdrawals.ts
├── lib/
│   ├── stellar.ts           # Stellar SDK helpers
│   ├── moonpay.ts           # MoonPay URL signing + webhook verify
│   ├── yellowcard.ts        # Yellow Card API client
│   ├── resend.ts            # Email templates
│   ├── auth.ts              # Privy server-side auth
│   ├── prisma.ts            # Prisma singleton
│   └── utils.ts             # cn(), formatDate(), formatCurrency()
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Demo data
└── docs/
    ├── architecture.md      # System design
    └── api.md               # API reference
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20
- PostgreSQL database ([Neon](https://neon.tech) free tier works)
- [Privy](https://privy.io) app (free tier)
- [MoonPay](https://moonpay.com) sandbox account
- [Yellow Card](https://yellowcard.io) sandbox account
- [Resend](https://resend.com) account

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/afripay.git
cd afripay

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Push database schema
npx prisma db push

# (Optional) Seed demo data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See [`.env.example`](.env.example) for all required variables. Key ones:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID |
| `PRIVY_APP_SECRET` | Privy app secret |
| `NEXT_PUBLIC_MOONPAY_API_KEY` | MoonPay publishable key |
| `MOONPAY_SECRET_KEY` | MoonPay secret key |
| `MOONPAY_WEBHOOK_SECRET` | MoonPay webhook signing secret |
| `YELLOW_CARD_API_KEY` | Yellow Card API key |
| `YELLOW_CARD_API_SECRET` | Yellow Card API secret |
| `RESEND_API_KEY` | Resend API key |
| `CRON_SECRET` | Secret for cron job authorization |

---

## 🧪 Testing

```bash
npm test           # Run all tests
npm run test:ci    # CI mode with coverage
npm run type-check # TypeScript check
npm run lint       # ESLint
```

---

## 🕰️ Cron Jobs

Configured in [`vercel.json`](vercel.json) and protected by `CRON_SECRET`.

| Job | Schedule | Description |
|-----|----------|-------------|
| `cancel-overdue-invoices` | `0 2 * * *` (daily 2AM UTC) | Cancels PENDING invoices with dueDate > 90 days ago. Skips invoices with active escrow, active dispute, or `doNotAutoCancel: true`. |

**Test locally:**
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cron/cancel-overdue-invoices
```

---

## 🚢 Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy — cron jobs are configured automatically via `vercel.json`

### Webhooks Setup

After deploying, configure these webhook URLs in your provider dashboards:

| Provider | Webhook URL |
|----------|-------------|
| MoonPay | `https://your-domain.com/api/webhooks/moonpay` |
| Yellow Card | `https://your-domain.com/api/webhooks/yellowcard` |

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `feat: add invoice PDF export`
4. Open a pull request

---

## 📖 Documentation

- [Architecture](docs/architecture.md) — system design and payment flow
- [API Reference](docs/api.md) — all API endpoints
- [Contributing](CONTRIBUTING.md) — how to contribute
- [Security](SECURITY.md) — reporting vulnerabilities

---

## 📄 License

Licensed under the [Apache License 2.0](LICENSE).

---

Built with ❤️ for Nigerian freelancers. Powered by [Stellar](https://stellar.org).
