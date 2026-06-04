# Payment Integration Skill

Comprehensive payment integration skill for SePay (Vietnamese payment gateway).

## Features

### SePay Integration
- Vietnamese payment gateway with VietQR, NAPAS, bank transfers, and cards
- 44+ supported banks
- Webhook verification with API Key/OAuth2 authentication
- QR code generation API
- Order-based virtual accounts
- SDK support for Node.js, PHP, and Laravel

## Structure

```
payment-integration/
├── SKILL.md                      # Main skill definition
├── README.md                     # This file
├── references/                   # Progressive disclosure documentation
│   └── sepay/                   # SePay integration guides
│       ├── overview.md          # Auth, capabilities, environments
│       ├── api.md               # API endpoints and operations
│       ├── webhooks.md          # Webhook setup and handling
│       ├── sdk.md               # SDK usage (Node.js, PHP, Laravel)
│       ├── qr-codes.md          # VietQR generation
│       └── best-practices.md    # Security, patterns, monitoring
└── scripts/                      # Integration helper scripts
    ├── sepay-webhook-verify.js   # SePay webhook verification
    ├── checkout-helper.js        # Checkout session generation
    ├── test-scripts.js           # Test suite for all scripts
    ├── package.json              # Node.js package configuration
    └── .env.example              # Environment variable template
```

## Usage

### Activate the Skill

Claude Code will automatically activate this skill when you mention payment integration, webhooks, or SePay-specific terms.

### Manual Activation

In conversations, reference:
- "Implement SePay payment integration"
- "Create webhook handler for SePay payment notifications"
- "Generate VietQR code for an order"

### Using Scripts

**SePay Webhook Verification:**
```bash
cd .claude/skills/payment-integration/scripts
node sepay-webhook-verify.js '{"id":12345,"gateway":"Vietcombank",...}'
```

**Checkout Helper:**
```bash
node checkout-helper.js sepay '{"orderInvoiceNumber":"ORD001","orderAmount":100000,...}'
```

**Run Tests:**
```bash
npm test
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# SePay
SEPAY_MERCHANT_ID=SP-TEST-XXXXXXX
SEPAY_SECRET_KEY=spsk_test_xxxxxxxxxxxxx
SEPAY_ENV=sandbox
SEPAY_WEBHOOK_API_KEY=your_key
```

## Progressive Disclosure

The skill uses progressive disclosure to minimize context usage:
1. **SKILL.md** - Overview and quick reference
2. **references/** - Detailed guides loaded as needed (<100 lines each)
3. **scripts/** - Executable helpers with embedded examples

Load only the references you need for your current task.

## Examples

### SePay Payment Flow
1. Load `references/sepay/overview.md` for authentication
2. Load `references/sepay/sdk.md` for integration
3. Use `checkout-helper.js` to generate payment form
4. Load `references/sepay/webhooks.md` for notifications
5. Use `sepay-webhook-verify.js` to verify authenticity

## Testing

All scripts include comprehensive test coverage:
- SePay webhook verification (with/without authentication)
- Checkout configuration generation
- Error handling and edge cases

Run `npm test` in the scripts directory to verify functionality.

## Support

### SePay
- Docs: https://developer.sepay.vn/en
- Email: info@sepay.vn
- Hotline: 02873059589

## License

MIT

## Version

2.0.0
