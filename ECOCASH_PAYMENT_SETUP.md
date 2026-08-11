# EcoCash Payment System - Implementation Guide

## Overview

A complete production-ready EcoCash payment processing system has been implemented for iPhone Hub Zimbabwe. This system follows security best practices and is designed to integrate with the official EcoCash merchant API.

## ⚠️ IMPORTANT: EcoCash Credentials Required

**The EcoCash payment system is not yet active because official EcoCash merchant credentials are required.**

To activate the payment system, you must obtain the following from EcoCash:

- **ECOCASH_MERCHANT_ID** - Your EcoCash merchant identifier
- **ECOCASH_API_KEY** - Your EcoCash API key
- **ECOCASH_API_SECRET** - Your EcoCash API secret (NEVER expose to frontend)
- **ECOCASH_API_URL** - The official EcoCash API endpoint
- **ECOCASH_CALLBACK_URL** - Your webhook callback URL

## Architecture Overview

### Database Schema Updates

**Payment Model:**
- `provider` - Payment provider (default: "ecocash")
- `providerTransactionId` - Unique EcoCash transaction ID
- `merchantReference` - Unique merchant reference for reconciliation
- `amount` - Payment amount
- `currency` - Payment currency (default: "USD")
- `customerPhone` - Customer's EcoCash phone number
- `status` - Payment status (PENDING, PROCESSING, SUCCESS, FAILED, CANCELLED, EXPIRED, REFUNDED)
- `failureReason` - Reason for payment failure
- `completedAt` - Timestamp when payment completed
- `metadata` - Additional payment metadata
- `rawResponse` - Raw EcoCash API response

**Order Status Updates:**
- `PENDING_PAYMENT` - Order created, awaiting payment
- `PAYMENT_PROCESSING` - Payment initiated, processing
- `PAID` - Payment successfully verified
- `CONFIRMED` - Order confirmed by admin
- `PROCESSING` - Order being prepared
- `READY_FOR_PICKUP` - Ready for customer pickup
- `OUT_FOR_DELIVERY` - Out for delivery
- `DELIVERED` - Order delivered
- `CANCELLED` - Order cancelled
- `REFUNDED` - Order refunded

### Security Features

✅ **Server-Side Price Calculation**
- All prices calculated server-side from database
- Frontend prices ignored for security
- Prevents price manipulation

✅ **Payment Verification**
- Never trust frontend payment status
- Verify against authoritative EcoCash API
- Check amount, currency, merchant reference
- Only mark successful after verification

✅ **Idempotency**
- Unique constraints on providerTransactionId and merchantReference
- Prevents duplicate payments
- Prevents double inventory reduction

✅ **No PIN Storage**
- EcoCash PIN never requested by our system
- PIN only entered in official EcoCash authorization flow
- No sensitive credentials stored

✅ **Webhook Security**
- Signature verification (if EcoCash provides)
- Transaction validation
- Merchant validation
- Replay attack prevention

## API Endpoints

### Customer-Facing

**POST /api/payments/ecocash/initiate**
- Initiates EcoCash payment for an order
- Body: `{ orderId, customerPhone }`
- Returns: Payment details with authorization URL

**GET /api/payments/ecocash/status?paymentId=xxx**
- Checks current payment status
- Polls EcoCash API for authoritative status
- Updates database and inventory on success

### Admin-Facing

**GET /api/admin/payments**
- Fetches all payment transactions
- Requires admin authentication
- Supports filtering by status

**GET /api/admin/payments/stats**
- Fetches payment statistics
- Total, successful, pending, failed counts
- Revenue metrics (today, week, month)

### Webhook

**POST /api/payments/ecocash/webhook**
- Handles EcoCash payment callbacks
- Validates authenticity
- Updates payment status
- Updates order status
- Reduces inventory on success

## Customer Payment Flow

1. **Customer adds items to cart**
2. **Customer proceeds to checkout**
3. **Customer enters details** (name, phone, email, address)
4. **Customer selects EcoCash** as payment method
5. **Customer submits order** → Order created with status `PENDING_PAYMENT`
6. **Redirected to EcoCash payment page** → `/checkout/ecocash?orderId=xxx`
7. **Customer enters EcoCash phone number**
8. **Customer clicks "Pay with EcoCash"**
9. **System initiates EcoCash payment** → Payment record created with status `PROCESSING`
10. **Customer authorizes payment** in official EcoCash flow
11. **System polls for payment status** → Every 5 seconds for up to 5 minutes
12. **Payment verified** → Status updated to `SUCCESS`
13. **Order marked PAID** → Inventory reduced
14. **Customer redirected to success page**

## Admin Payment Dashboard

**Location:** `/admin/payments`

**Features:**
- Total payments count
- Successful payments count
- Pending payments count
- Failed payments count
- Today's revenue
- This week's revenue
- This month's revenue
- Payment transactions table with:
  - Order number
  - Customer name
  - Phone number
  - Amount
  - Status
  - Date
  - Actions (view, verify, export)

## Integration Checklist

To activate the EcoCash payment system:

1. **Obtain EcoCash merchant credentials** from EcoCash
2. **Add environment variables** to Vercel:
   - `ECOCASH_MERCHANT_ID`
   - `ECOCASH_API_KEY`
   - `ECOCASH_API_SECRET`
   - `ECOCASH_API_URL`
   - `ECOCASH_CALLBACK_URL`
3. **Configure webhook URL** in EcoCash merchant portal
4. **Test payment flow** in test mode (if available)
5. **Monitor admin dashboard** for payment activity
6. **Verify inventory reduction** on successful payments

## Files Created/Modified

### Database
- `prisma/schema.prisma` - Updated Payment model and OrderStatus enum

### Payment Provider
- `src/lib/payment/provider.ts` - Payment provider interface
- `src/lib/payment/ecocash-provider.ts` - EcoCash provider implementation

### API Endpoints
- `src/app/api/payments/ecocash/initiate/route.ts` - Payment initiation
- `src/app/api/payments/ecocash/status/route.ts` - Payment status checking
- `src/app/api/payments/ecocash/webhook/route.ts` - Webhook handler
- `src/app/api/admin/payments/route.ts` - Admin payments list
- `src/app/api/admin/payments/stats/route.ts` - Admin payment statistics
- `src/app/api/orders/[id]/route.ts` - Order details endpoint

### UI Components
- `src/app/checkout/ecocash/page.tsx` - EcoCash payment page
- `src/app/admin/payments/page.tsx` - Admin payment dashboard

### Checkout Integration
- `src/app/checkout/page.tsx` - Updated to redirect to EcoCash page
- `src/app/api/orders/route.ts` - Updated order status logic

### Configuration
- `.env.example` - Environment variables template

## Testing Without Credentials

The system is designed to fail gracefully when EcoCash credentials are not configured. It will:
- Log a warning message
- Return user-friendly error messages
- Not attempt fake/simulated payments
- Not mark orders as paid without verification

## Important Notes

- **Never** hard-code EcoCash credentials
- **Never** store EcoCash PINs
- **Never** mark payments successful without verification
- **Never** trust frontend payment status
- **Always** calculate prices server-side
- **Always** verify against authoritative EcoCash API
- **Always** use environment variables for credentials

## Deployment

The system has been deployed to: https://iphone-hub-masvingo.vercel.app

The payment infrastructure is ready. Once EcoCash merchant credentials are obtained and configured in Vercel environment variables, the payment system will be fully functional.

## Support

For issues or questions about the EcoCash integration:
1. Check environment variables are configured correctly
2. Verify webhook URL is accessible
3. Check admin payment dashboard for error logs
4. Review payment status in database
5. Contact EcoCash merchant support for API issues
