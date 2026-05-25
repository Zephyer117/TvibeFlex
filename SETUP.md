# 🚀 Luxe Store — Full Setup Guide

## What's New in This Version

- ✅ **Orders saved to Sanity** — Cash on Delivery checkout creates an Order document
- ✅ **Order tracking** — `/account/orders` (sign in) for order history
- ✅ **Live shop filters** — category, search, sort all work client-side
- ✅ **Sanity Studio** — run separately via `npm run studio` (port 3333), not embedded in the Next.js app
- ✅ **Form validation** — checkout form validates before submitting

---

## Step 1 — Install Dependencies

```bash
# Main app
npm install

# Sanity Studio
cd sanity-studio && npm install && cd ..
```

---

## Step 2 — Environment variables

Copy `.env.example` to `.env.local` and set Clerk + Sanity keys.  
Checkout is **Cash on Delivery only** (no Stripe required).

---

## Step 3 — Add Order Schema to Sanity

The new `order` schema is already in `sanity-studio/schemas/order.ts`.  
You need to push it to your Sanity project. Just start the studio and it will auto-sync:

```bash
npm run studio
```

Open **http://localhost:3333** — you'll see "Orders" in the left sidebar.

---

## Step 4 — Run the App

```bash
# Terminal 1 — Next.js storefront
npm run dev

# Terminal 2 — Sanity Studio (content & orders admin)
npm run studio
```

Open the store at **http://localhost:3000** and the studio at **http://localhost:3333**.

---

## How It All Works

```
Customer fills checkout form (signed in)
         │
         ▼
POST /api/orders/cod
  - Validates cart & stock
  - Creates "pending" Order in Sanity
         │
         ▼
Redirect to /order/success?order=LX-XXXXX
  - Clears cart
  - Shows order confirmation
```

---

## Sanity Studio Order Management

Go to **http://localhost:3333** → Orders

You can:
- View all orders sorted by date
- Change order status (Pending → Paid → Processing → Shipped → Delivered)
- Add internal notes
- See full order items, customer info, and shipping address

---

## Adding Products to Sanity

1. Open **http://localhost:3333**
2. Click **Products** → **Create**
3. Fill in name, price, description, upload images
4. Set `featured: true` to show on homepage
5. Create categories first under **Categories**

---

## Deploying to Vercel

```bash
# Deploy app
vercel deploy

# Set these environment variables in Vercel dashboard:
# NEXT_PUBLIC_SANITY_PROJECT_ID
# NEXT_PUBLIC_SANITY_DATASET
# SANITY_API_TOKEN
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# STRIPE_SECRET_KEY
# STRIPE_WEBHOOK_SECRET (create a new Stripe webhook pointing to your Vercel URL)
# NEXT_PUBLIC_BASE_URL (your Vercel URL)

# Deploy Sanity Studio
cd sanity-studio && sanity deploy
```
