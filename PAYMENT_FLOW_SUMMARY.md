# Payment + Shipment Flow

## Overview

This app collects buyer details during checkout, creates a Supabase `orders` row, processes payment with Razorpay, and on successful verification creates a shipment in Delhivery. We then persist the Delhivery waybill into `orders.metadata.shipment`.

## End-to-end Steps

1. Client triggers payment via `components/ui/razorpay-button.tsx`.
   - Sends amount, currency, app_order_id, and shipping details (name/email/phone/address/city/state/pincode) to `/api/payment/create-order`.
2. Server proxies to Supabase Edge Function `payments-create-order`.
   - Inserts draft order in `orders` with `metadata.shipping`.
   - Creates Razorpay order and saves `razorpay_order_id` to `orders`.
3. Client opens Razorpay modal and completes payment.
4. Client calls `/api/payment/verify` with Razorpay ids (order/payment/signature).
5. Server proxies to `payments-verify` Edge Function.
   - Verifies signature, marks `orders.status` = `paid`, upserts `payments`.
6. On success, our route `app/api/payment/verify/route.ts` synchronously creates a Delhivery shipment using `lib/delhivery.ts`.
   - Reads shipping details from `orders.metadata.shipping`.
   - Sends shipment create request to Delhivery.
   - Saves waybill and provider response in `orders.metadata.shipment`.
   - Best-effort fetches packing slip.

## Delhivery Payload Mapping

We follow Delhivery's CMU create API as shown in their Python example, while including alternate keys accepted by some deployments. Body is sent as `application/x-www-form-urlencoded` with `format=json` and `data=<json>`.

```
format=json&data={
  "shipments": [
    {
      "name": "<consignee name>",
      "add": "<address>",
      "pin": "<pincode>",
      "city": "<city>",
      "state": "<state>",
      "country": "India",
      "phone": "<phone>",
      "email": "<email>",
      "order": "<orderId>",
      "payment_mode": "Prepaid" | "COD",
      "cod_amount": <number>,
      "shipment_width": "<cm>",
      "shipment_height": "<cm>",
      "weight": "<kg>",
      "products_desc": "<joined item names>",

      // Also sent for compatibility with variants
      "consignee": "<consignee name>",
      "address": "<address>",
      "consignee_phone": "<phone>",
      "consignee_email": "<email>"
    }
  ],
  "pickup_location": { "name": "<warehouse_name>" }
}
```

Notes:
- We default missing shipping name to `nava`.
- Ensure `<warehouse_name>` matches your pre-approved ClientWarehouse NAME in Delhivery.

## Environment Variables

Required:
- `DELHIVERY_API_BASE` — e.g., `https://staging-express.delhivery.com` or prod base
- `DELHIVERY_API_TOKEN`
- `DELHIVERY_DEFAULT_PICKUP_NAME` — must match ClientWarehouse name
- `DELHIVERY_DEFAULT_PICKUP_PIN` — your pickup pincode
- `DELHIVERY_DEFAULT_PICKUP_PHONE` — your pickup phone
- `EDGE_FUNCTIONS_SHARED_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

## Troubleshooting

- Auth test: GET `/api/logistics/delhivery/auth/test` should return `ok: true` and 2xx.
- If shipment fails, check `orders.metadata.shipment.provider_response` for exact message.
  - Pickup not approved → Fix `DELHIVERY_DEFAULT_PICKUP_NAME` or get it approved.
  - Invalid pincode/address → Correct consignee address/pincode.
  - 404 base → Fix `DELHIVERY_API_BASE` to correct env.

## Data Fields Summary

- Sent to Delhivery: `name/add/pin/city/state/country/phone/email/order/payment_mode/cod_amount/weight/length/breadth/height/products_desc` and also `consignee/address/consignee_phone/consignee_email` for compatibility.
- Inserted to `orders` on create: `user_id, status, amount, currency, idempotency_key, metadata.shipping{ name,address,city,state,pincode,email,phone }`.
- Read for shipping: `orders.metadata.shipping` and optional `orders.metadata.parcel`.
# 🎉 Complete Payment Flow with Success/Failure Pages

## ✅ **What I've Implemented**

### 1. **Payment Success Page** (`/payment-success`)
- **Auto-redirect**: Automatically redirects to home page after 10 seconds
- **Beautiful Design**: Green gradient background with success animations
- **Order Details**: Shows payment ID, order ID, amount, date, and time
- **Next Steps**: Clear instructions on what happens next
- **Action Buttons**: Continue Shopping, View Orders

### 2. **Payment Failure Page** (`/payment-failed`)
- **Auto-redirect**: Automatically redirects to home page after 15 seconds
- **Error Details**: Shows error code, description, and order ID
- **Help Section**: Provides solutions for common payment issues
- **Action Buttons**: Try Again, Go Home, Contact Support

### 3. **Support Page** (`/support`)
- **Payment Troubleshooting**: Common solutions for payment issues
- **Contact Information**: Email and phone support details
- **Quick Actions**: Try payment again or go back home

### 4. **Enhanced Razorpay Integration**
- **Success Handling**: Redirects to success page with payment details
- **Failure Handling**: Redirects to failure page with error details
- **Modal Dismissal**: Handles when user cancels payment
- **Network Errors**: Handles connection issues

## 🔄 **Complete Payment Flow**

### **Success Flow:**
1. User clicks "Pay ₹269" on checkout page
2. Razorpay modal opens
3. User completes payment successfully
4. Payment is verified on server
5. **Redirects to**: `/payment-success?payment_id=xxx&order_id=xxx`
6. Success page shows order details
7. **Auto-redirects to home page after 10 seconds**

### **Failure Flow:**
1. User clicks "Pay ₹269" on checkout page
2. Razorpay modal opens
3. Payment fails or user cancels
4. **Redirects to**: `/payment-failed?error_code=xxx&error_description=xxx&order_id=xxx`
5. Failure page shows error details and solutions
6. **Auto-redirects to home page after 15 seconds**

## 🎨 **Features**

### **Success Page Features:**
- ✅ Animated success icon with pulse effect
- ✅ Beautiful gradient background
- ✅ Complete order details display
- ✅ Auto-redirect countdown (10 seconds)
- ✅ Multiple action buttons
- ✅ Responsive design

### **Failure Page Features:**
- ✅ Animated failure icon
- ✅ Error details with codes
- ✅ Helpful troubleshooting tips
- ✅ Auto-redirect countdown (15 seconds)
- ✅ Multiple recovery options
- ✅ Support contact information

### **Support Page Features:**
- ✅ Common payment issue solutions
- ✅ Contact information
- ✅ Quick action buttons
- ✅ Professional layout

## 🚀 **How to Test**

### **Test Success Flow:**
1. Go to checkout page
2. Fill in details
3. Select "Online Payment (Razorpay)"
4. Use test card: `4111 1111 1111 1111`
5. Complete payment
6. Should redirect to success page
7. Wait 10 seconds for auto-redirect

### **Test Failure Flow:**
1. Go to checkout page
2. Fill in details
3. Select "Online Payment (Razorpay)"
4. Cancel the payment modal
5. Should redirect to failure page
6. Wait 15 seconds for auto-redirect

## 📱 **User Experience**

### **Success Experience:**
- 🎉 Celebratory design with green theme
- 📋 Clear order confirmation
- ⏰ Automatic redirect with countdown
- 🔄 Multiple navigation options

### **Failure Experience:**
- 😔 Empathetic design with red theme
- 🔍 Detailed error information
- 💡 Helpful troubleshooting tips
- 🆘 Easy access to support

## 🎯 **Benefits**

1. **Professional UX**: Users get clear feedback on payment status
2. **Auto-Navigation**: No need to manually navigate back
3. **Error Recovery**: Clear paths to retry or get help
4. **Mobile Friendly**: Responsive design works on all devices
5. **Brand Consistency**: Matches your eco-friendly theme

Your payment system is now complete with a professional user experience! 🎉 