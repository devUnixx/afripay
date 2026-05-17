# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| latest  | ✅        |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Email **security@afripay.io** with:

1. A description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Any suggested mitigations

You will receive a response within **48 hours**. We aim to release a fix within **7 days** for critical issues.

## Scope

In scope:
- Authentication bypass
- Payment flow manipulation
- Webhook signature bypass
- Data exposure (user PII, wallet addresses)
- Injection vulnerabilities (SQL, XSS, CSRF)

Out of scope:
- Denial of service
- Social engineering
- Issues in third-party services (Privy, MoonPay, Yellow Card)

## Disclosure Policy

We follow responsible disclosure. Once a fix is deployed, we will publish a security advisory crediting the reporter (unless they prefer to remain anonymous).
