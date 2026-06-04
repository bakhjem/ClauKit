#!/usr/bin/env node

/**
 * Test suite for payment integration scripts
 */

const SePayWebhookVerifier = require('./sepay-webhook-verify');
const CheckoutHelper = require('./checkout-helper');

class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    try {
      fn();
      console.log(`✓ ${name}`);
      this.passed++;
    } catch (error) {
      console.error(`✗ ${name}`);
      console.error(`  Error: ${error.message}`);
      this.failed++;
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  summary() {
    console.log(`\nTest Summary: ${this.passed} passed, ${this.failed} failed`);
    return this.failed === 0;
  }
}

// Run tests
console.log('Running Payment Integration Script Tests\n');
const runner = new TestRunner();

// SePay Webhook Verifier Tests
console.log('SePay Webhook Verifier Tests:');

runner.test('should verify valid SePay webhook', () => {
  const verifier = new SePayWebhookVerifier('none');
  const payload = {
    id: 12345,
    gateway: 'Vietcombank',
    transactionDate: '2025-01-13 10:00:00',
    accountNumber: '0123456789',
    transferType: 'in',
    transferAmount: 100000,
    referenceCode: 'REF123',
    content: 'Order payment'
  };

  const result = verifier.process(payload);
  runner.assert(result.success === true, 'Should verify successfully');
  runner.assert(result.transaction.id === 12345, 'Should parse transaction ID');
  runner.assert(result.isIncoming === true, 'Should detect incoming transfer');
});

runner.test('should reject invalid SePay transfer type', () => {
  const verifier = new SePayWebhookVerifier('none');
  const payload = {
    id: 12345,
    gateway: 'Vietcombank',
    transactionDate: '2025-01-13 10:00:00',
    accountNumber: '0123456789',
    transferType: 'invalid',
    transferAmount: 100000,
    referenceCode: 'REF123'
  };

  const result = verifier.process(payload);
  runner.assert(result.success === false, 'Should fail validation');
  runner.assert(result.error.includes('Invalid transferType'), 'Should report invalid transfer type');
});

runner.test('should verify SePay webhook with API key', () => {
  const verifier = new SePayWebhookVerifier('api_key', 'test_key_123');
  const payload = {
    id: 12345,
    gateway: 'Vietcombank',
    transactionDate: '2025-01-13 10:00:00',
    accountNumber: '0123456789',
    transferType: 'in',
    transferAmount: 100000,
    referenceCode: 'REF123'
  };

  const headers = { Authorization: 'Apikey test_key_123' };
  const result = verifier.process(payload, headers);
  runner.assert(result.success === true, 'Should verify with valid API key');
});

runner.test('should reject SePay webhook with invalid API key', () => {
  const verifier = new SePayWebhookVerifier('api_key', 'test_key_123');
  const payload = {
    id: 12345,
    gateway: 'Vietcombank',
    transactionDate: '2025-01-13 10:00:00',
    accountNumber: '0123456789',
    transferType: 'in',
    transferAmount: 100000,
    referenceCode: 'REF123'
  };

  const headers = { Authorization: 'Apikey wrong_key' };
  const result = verifier.process(payload, headers);
  runner.assert(result.success === false, 'Should reject invalid API key');
});

// Checkout Helper Tests
console.log('\nCheckout Helper Tests:');

runner.test('should generate SePay checkout fields', () => {
  const config = {
    merchantId: 'SP-TEST-123',
    secretKey: 'test_secret',
    orderInvoiceNumber: 'ORD001',
    orderAmount: 100000,
    successUrl: 'https://example.com/success',
    errorUrl: 'https://example.com/error',
    cancelUrl: 'https://example.com/cancel',
    env: 'sandbox'
  };

  const result = CheckoutHelper.generateSePayCheckout(config);
  runner.assert(result.fields !== undefined, 'Should generate fields');
  runner.assert(result.fields.signature !== undefined, 'Should generate signature');
  runner.assertEqual(result.fields.merchant_id, 'SP-TEST-123', 'Should include merchant ID');
  runner.assert(result.formUrl.includes('sandbox'), 'Should use sandbox URL');
});

// Run summary
const success = runner.summary();
process.exit(success ? 0 : 1);
