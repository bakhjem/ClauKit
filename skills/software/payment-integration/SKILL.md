---
name: payment-integration
description: Implement payment integration with SePay (Vietnamese payment gateway with VietQR, NAPAS, bank transfers, and cards). Use when integrating Vietnamese payment processing, implementing checkout flows, handling webhooks, processing bank transfers, generating QR codes, or building billing systems for the Vietnamese market. Supports API Key/OAuth2 authentication, virtual accounts, bank account monitoring, and SDK integrations (Node.js, PHP, Laravel).
license: MIT
---

# Payment Integration

Implement payment processing with SePay (Vietnamese payments).

## When to Use

Use when implementing:
- Vietnamese payment gateway integration (checkout, processing)
- Webhook handling (payment notifications)
- QR code payments (VietQR, NAPAS)
- Bank transfer automation (Vietnamese banks)
- Virtual account creation for orders
- Product catalogs with VND pricing

## Platform

**SePay** — Vietnamese payment gateway:
- VND currency
- Bank transfer automation
- VietQR/NAPAS payments
- Local payment methods
- Direct bank account monitoring

## Quick Reference

### SePay Integration
- **Overview & Auth**: `references/sepay/overview.md` - Platform capabilities, API/OAuth2 auth, supported banks
- **API Reference**: `references/sepay/api.md` - Endpoints, transactions, bank accounts, virtual accounts
- **Webhooks**: `references/sepay/webhooks.md` - Setup, payload structure, verification, retry logic
- **SDK Usage**: `references/sepay/sdk.md` - Node.js, PHP, Laravel implementations
- **QR Codes**: `references/sepay/qr-codes.md` - VietQR generation, templates, integration
- **Best Practices**: `references/sepay/best-practices.md` - Security, patterns, monitoring

### Integration Scripts
- **SePay Webhook Verification**: `scripts/sepay-webhook-verify.js` - Verify SePay webhook authenticity
- **Checkout Helper**: `scripts/checkout-helper.js` - Generate SePay checkout sessions

## Implementation Workflow

1. Load `references/sepay/overview.md` for auth setup
2. Load `references/sepay/api.md` or `references/sepay/sdk.md` for integration
3. Load `references/sepay/webhooks.md` for payment notifications
4. Use `scripts/sepay-webhook-verify.js` for webhook verification
5. Load `references/sepay/best-practices.md` for production readiness

## Key Capabilities

**SePay:**
- Payment gateway (QR, bank transfer, cards)
- Bank account monitoring with webhooks
- Order-based virtual accounts
- VietQR generation API
- 44+ Vietnamese banks supported
- Rate limit: 2 calls/second

## Instructions

When implementing payment integration:

1. **Load relevant references** progressively as needed
2. **Implement authentication** using API Key or OAuth2
3. **Set up products/pricing** according to business model
4. **Implement checkout flow** (hosted, embedded, or API-driven)
5. **Configure webhooks** with proper verification
6. **Handle payment events** (success, failure, refund)
7. **Test thoroughly** in sandbox before production
8. **Monitor and optimize** using platform analytics

Load only the references needed for current implementation step to maintain context efficiency.
