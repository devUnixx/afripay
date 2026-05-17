# Contributing to AfriPay

Thank you for your interest in contributing! AfriPay is open source and welcomes contributions of all kinds.

## Getting Started

### Prerequisites
- Node.js ≥ 20
- PostgreSQL (or a [Neon](https://neon.tech) free tier account)
- A [Privy](https://privy.io) app (free tier works)

### Local Setup

```bash
# 1. Fork and clone
git clone https://github.com/devUnixx/afripay.git
cd afripay

# 2. Install dependencies
npm install

# 3. Copy env and fill in values
cp .env.example .env.local

# 4. Push the database schema
npx prisma db push

# 5. (Optional) Seed demo data
npm run db:seed

# 6. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Development Workflow

1. **Branch** — create a branch from `main`: `git checkout -b feat/your-feature`
2. **Code** — follow the style guide below
3. **Test** — `npm test`
4. **Lint** — `npm run lint`
5. **PR** — open a pull request against `main` with a clear description

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add invoice PDF export
fix: correct USDC balance rounding
docs: update API reference
chore: bump stellar-sdk to 13.x
```

## Code Style

- TypeScript strict mode — no `any` without a comment explaining why
- Tailwind for all styling — no inline styles, no CSS modules
- Server Components by default — add `"use client"` only when needed
- Zod for all API input validation
- No secrets in code — use environment variables

## Project Structure

```
app/
  (auth)/          # Login, register, onboarding pages
  (dashboard)/     # Authenticated app pages
  api/             # API route handlers
  pay/[token]/     # Public payment page
components/        # Reusable React components
hooks/             # Custom React hooks
lib/               # Utilities and third-party clients
prisma/            # Schema and migrations
docs/              # Technical documentation
```

## Testing

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
npm run test:ci    # CI mode with coverage
```

## Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

## Security Issues

**Do not open a public issue for security vulnerabilities.** See [SECURITY.md](SECURITY.md).

## License

By contributing, you agree your contributions will be licensed under the [Apache 2.0 License](LICENSE).
