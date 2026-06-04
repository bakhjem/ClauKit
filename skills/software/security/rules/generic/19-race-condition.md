<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/19-race-condition.md (MIT) -->

---
id: RACE-CONDITION
severity_max: HIGH
applies_to: all
---

# Race Condition (TOCTOU)

## Intent
Detects Time-of-Check to Time-of-Use (TOCTOU) patterns where a resource is read, a condition is evaluated, and then an action is taken — without atomic transaction or lock — allowing concurrent requests to bypass business logic (e.g., double-spend, coupon reuse, limit bypass).

## Detection
- Look for: check-then-act without transaction — `SELECT balance → check → UPDATE balance` as separate operations
- Look for: read-modify-write without atomic operation — `count = getCount(); if (count < limit) { increment(); }`
- Look for: file existence check then creation — `if (!fileExists) { createFile() }` without locking
- Look for: coupon/voucher redemption — `find coupon → check used → mark used` as separate DB calls
- Look for: inventory decrement — `check stock → reduce stock` without transaction
- Look for: session/token invalidation — checking validity and then using in separate non-atomic operations
- Look for: async code with multiple await calls that read then write without transaction wrapper

## Severity assessment
- HIGH when: financial operations (balance, payment, credit) susceptible to double-spend
- HIGH when: unique constraint (coupon, invite code, feature limit) bypassable via race
- Downgrade to MEDIUM when: operation is non-financial but can lead to duplicate records or limit bypass
- Downgrade to LOW when: race window is very small and impact is low
- Skip when: operations wrapped in DB transaction, optimistic locking used (`UPDATE ... WHERE version = ?`), or atomic operations used (`INCR`, `compareAndSwap`)

## Remediation
1. Wrap check-and-update in a single DB transaction with appropriate isolation level
2. Use database-level atomic operations — `UPDATE balance SET amount = amount - $1 WHERE id = $2 AND amount >= $1`
3. Use optimistic locking with version field
4. Use Redis atomic operations (`SET NX`, `INCR`, Lua scripts) for distributed locks
5. Use `SELECT FOR UPDATE` to lock rows during check-then-act

## Example (vulnerable)
```javascript
// Express — race condition in wallet debit
app.post('/transfer', authenticate, async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.user.id });  // check
  if (wallet.balance < req.body.amount) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }
  // RACE: another request can pass the check before this update
  await Wallet.updateOne({ userId: req.user.id }, { $inc: { balance: -req.body.amount } });
  res.json({ success: true });
});
```

## Example (safe)
```javascript
// Atomic update with condition — no separate read needed
app.post('/transfer', authenticate, async (req, res) => {
  const result = await Wallet.updateOne(
    { userId: req.user.id, balance: { $gte: req.body.amount } },  // check + update atomically
    { $inc: { balance: -req.body.amount } }
  );
  if (result.matchedCount === 0) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }
  res.json({ success: true });
});

// OR: use DB transaction (PostgreSQL example)
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const { rows } = await client.query('SELECT balance FROM wallets WHERE user_id = $1 FOR UPDATE', [userId]);
  if (rows[0].balance < amount) throw new Error('Insufficient funds');
  await client.query('UPDATE wallets SET balance = balance - $1 WHERE user_id = $2', [amount, userId]);
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
}
```
