---
name: payment-integration
description: Use this skill when implementing payment flows, webhook handling, or transaction management. Covers Paymob integration, idempotency, webhook security, and wallet transactions.
---

# Payment Integration Skill

## Payment Flow Architecture

### Create Payment
```typescript
// 1. Generate idempotency key
const idempotencyKey = crypto.randomUUID();

// 2. Create payment record
const payment = await db.payment.create({
  data: {
    amount,
    currency: 'EGP',
    status: 'PENDING',
    userId,
    courseId,
    idempotencyKey,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
  },
});

// 3. Initialize Paymob transaction
const paymobResponse = await paymob.initiatePayment({
  amount: amount * 100, // Paymob uses cents
  currency: 'EGP',
  paymentId: payment.id,
});

// 4. Return payment URL to client
return { paymentUrl: paymobResponse.redirect_url, paymentId: payment.id };
```

## Webhook Handling

### Secure Webhook Endpoint
```typescript
// app/api/webhooks/paymob/route.ts
export async function POST(req: Request) {
  const signature = req.headers.get('x-paymob-signature');
  const body = await req.text();
  
  // Verify signature
  if (!verifyWebhookSignature(body, signature)) {
    return new Response('Invalid signature', { status: 401 });
  }
  
  const payload = JSON.parse(body);
  
  // Idempotency check
  const existing = await db.paymentWebhook.findUnique({
    where: { paymobTransactionId: payload.obj.id },
  });
  
  if (existing?.processedAt) {
    return new Response('Already processed', { status: 200 });
  }
  
  // Process payment
  await processPaymentWebhook(payload);
  
  return new Response('OK', { status: 200 });
}
```

### Webhook Processing
```typescript
async function processPaymentWebhook(payload: PaymobPayload) {
  await db.$transaction(async (tx) => {
    // Update payment status
    await tx.payment.update({
      where: { paymobOrderId: payload.obj.order.id },
      data: {
        status: payload.obj.success ? 'COMPLETED' : 'FAILED',
        paymobTransactionId: payload.obj.id,
        paymobResponse: payload,
        completedAt: payload.obj.success ? new Date() : null,
      },
    });
    
    // Create enrollment on success
    if (payload.obj.success) {
      await tx.enrollment.create({
        data: {
          userId: payment.userId,
          courseId: payment.courseId,
          status: 'ACTIVE',
        },
      });
    }
    
    // Mark webhook as processed
    await tx.paymentWebhook.create({
      data: {
        paymentId: payment.id,
        paymobTransactionId: payload.obj.id,
        webhookPayload: payload,
        processedAt: new Date(),
      },
    });
  });
}
```

## Wallet Integration

### Wallet Transactions
```typescript
// Debit wallet
await db.walletTransaction.create({
  data: {
    userId,
    type: 'PURCHASE_DEBIT',
    amount,
    balanceBefore: user.walletBalance,
    balanceAfter: new Decimal(user.walletBalance).minus(amount),
    description: `Payment for course: ${course.title}`,
    relatedPaymentId: payment.id,
  },
});

// Update user balance
await db.user.update({
  where: { id: userId },
  data: { walletBalance: { decrement: amount } },
});
```

### Cashback
```typescript
if (course.cashbackType !== 'NONE') {
  const cashbackAmount = course.cashbackType === 'PERCENTAGE'
    ? amount * (course.cashbackValue / 100)
    : course.cashbackValue;
    
  await db.walletTransaction.create({
    data: {
      userId,
      type: 'CASHBACK_CREDIT',
      amount: cashbackAmount,
      balanceBefore: user.walletBalance,
      balanceAfter: new Decimal(user.walletBalance).plus(cashbackAmount),
      description: `Cashback for ${course.title}`,
    },
  });
}
```

## Error Handling

### Payment Failures
- Log all failed payment attempts
- Implement retry mechanism with exponential backoff
- Notify user of failure with clear reason
- Auto-cancel expired pending payments

### Retry Logic
```typescript
if (payment.retryCount < 3) {
  await db.payment.update({
    where: { id: payment.id },
    data: {
      retryCount: { increment: 1 },
      lastRetryAt: new Date(),
    },
  });
  // Retry payment initialization
}
```

## Security

### Idempotency
- Always generate idempotency key for payment initiation
- Check for existing payment with same key
- Prevent duplicate charges

### Signature Verification
- Verify webhook signatures
- Use secure comparison (timing-safe)
- Reject requests with invalid signatures

## Testing

### Test Scenarios
1. Successful payment flow
2. Failed payment handling
3. Webhook replay (idempotency)
4. Expired payment cleanup
5. Wallet balance updates
6. Cashback calculations
7. Partial wallet payment

## Checklist
- [ ] Idempotency implemented
- [ ] Webhook signatures verified
- [ ] Transactions atomic
- [ ] Error handling comprehensive
- [ ] Retry logic implemented
- [ ] Expired payments cleaned up
- [ ] Wallet updates consistent
- [ ] Testing complete
- [ ] Monitoring configured
