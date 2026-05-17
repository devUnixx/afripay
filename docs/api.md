# API Reference

All API routes are under `/api`. Authenticated routes require a valid Privy session cookie (`privy-token`).

---

## Invoices

### `GET /api/invoices`
Returns all invoices for the authenticated user.

**Response** `200`
```json
[{ "id": "...", "title": "...", "status": "PENDING", "amountUsd": "500.00", ... }]
```

---

### `POST /api/invoices`
Create a new invoice.

**Body**
```json
{
  "title": "Website Redesign",
  "clientName": "Acme Corp",
  "clientEmail": "client@acme.com",
  "dueDate": "2026-06-01",
  "lineItems": [
    { "description": "UI Design", "quantity": 1, "unitPrice": 200 }
  ]
}
```

**Response** `201` — created invoice with `token` (used for payment link).

---

### `GET /api/invoices/:id`
Get a single invoice by ID (must belong to authenticated user).

---

### `DELETE /api/invoices/:id`
Delete an invoice. Returns `400` if the invoice is already paid.

---

## Payments

### `POST /api/moonpay/sign`
Generate a signed MoonPay widget URL for a given invoice.

**Body**
```json
{ "invoiceToken": "abc123", "amountUsd": 500 }
```

**Response** `200`
```json
{ "url": "https://buy.moonpay.com?..." }
```

---

## Webhooks

### `POST /api/webhooks/moonpay`
Receives MoonPay transaction events. Validates `moonpay-signature-v2` header.

On `transaction_updated` with `status: completed`:
- Marks invoice as `PAID`
- Sends payment notification email to freelancer

### `POST /api/webhooks/yellowcard`
Receives Yellow Card payment status updates.

Updates withdrawal status: `PROCESSING` → `COMPLETED` or `FAILED`.

---

## Wallet

### `GET /api/wallet/balance`
Returns the authenticated user's USDC balance on Stellar.

**Response** `200`
```json
{ "balance": 245.50, "address": "GABC...XYZ" }
```

---

## Withdrawals

### `GET /api/withdrawals`
Returns all withdrawals for the authenticated user.

---

### `POST /api/withdrawals`
Initiate a USDC → NGN withdrawal to the user's registered bank account.

**Body**
```json
{ "amountUsdc": 100 }
```

**Response** `201` — withdrawal record with `status: PROCESSING`.

**Errors**
- `400` — insufficient balance, or profile incomplete (no bank details)

---

## Users

### `POST /api/users/onboard`
Complete user onboarding (name + bank details). Called after first login.

**Body**
```json
{
  "privyId": "did:privy:...",
  "name": "Chidi Okeke",
  "bankAccountName": "CHIDI OKEKE",
  "bankAccountNo": "0123456789",
  "bankCode": "058"
}
```

---

## Cron

### `GET /api/cron/cancel-overdue-invoices`
Auto-cancels overdue invoices. Protected by `Authorization: Bearer <CRON_SECRET>`.

**Response** `200`
```json
{ "cancelled": 3, "cutoff": "2026-02-16T02:00:00.000Z" }
```
