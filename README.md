# Fivee Business — Customer Web Portal (`FiveeBusiness-Frontend`)

The customer-facing web application for **Fivee Business**. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript 5.7**, **Tailwind CSS v4**, **Redux Toolkit**, **React Hook Form**, and **Zod**.

---

## What this Application Does

Guides taxpayers through preparing, reviewing, digitally signing, paying for, and generating official IRS tax relief and tax identification documents:
1. **IRS Form 433-A (OIC)**: Collection Information Statement for Individuals.
2. **IRS Form 433-B (OIC)**: Collection Information Statement for Businesses.
3. **IRS Form 656-B**: Main Offer in Compromise booklet and settlement proposal.
4. **IRS Form W-7**: Application for IRS Individual Taxpayer Identification Number (ITIN).

---

## Active Git Branch

> [!IMPORTANT]
> The primary active branch containing the complete **Form W-7** module alongside the **OIC (433-A/B, 656-B)** workflows is:
> `feat/additional-module-fw7`
>
> Ensure you are on this branch when developing or testing Form W-7 features.

---

## Local Development Setup

### 1. Installation
```bash
npm install
```

### 2. Environment Variables (`.env`)
Create or verify `.env` in `FiveeBusiness-Frontend/`:
```env
# Stripe Publishable Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Firebase Client Configuration (for Auth & Web Push FCM)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=...
```

### 3. Run Development Server (Turbopack)
```bash
npm run dev
```
- Listens on `http://localhost:3000`
- **Turbopack Warning**: Run only one `next dev` instance per checkout. Multiple dev servers will corrupt `.next/dev`, causing spurious 404s.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## Application Route Map (`src/app/`)

```
src/app/
├── auth/
│   ├── login/                     # Email/password & Google/Apple OAuth sign-in
│   ├── signup/                    # New user registration
│   ├── forgot-password/           # Password reset request
│   └── reset-password/            # Password reset confirmation
│
├── dashboard/                     # Authenticated customer portal shell
│   ├── 433a-oic/                  # Form 433-A wizard & /payment
│   ├── 433b-oic/                  # Form 433-B wizard & /payment
│   ├── form-656/                  # Form 656 wizard, /start & /all (paginated list)
│   ├── form-w7/                   # Form W-7 wizard, /start, /all & /payment
│   ├── signatures/                # Digital signature canvas & S3 storage
│   ├── videos/                    # Educational IRS guidance video library
│   ├── manage-payment-methods/    # Stripe credit card management
│   └── onboard/                   # Taxpayer profile onboarding
│
├── verify-email/                  # Post-signup verification handler
├── terms-and-conditions/          # Legal disclaimer
└── privacy-policy/                # Privacy policy
```

---

## Form Architecture & Validation Engine

All IRS form flows share an architectural pattern:
1. **Container Component**: Manages multi-step wizard state, read-only mode for paid cases, and progress synchronization (`localStorage`).
2. **Strict DTO Mapping (`src/utils/formw7.ts`)**: The NestJS backend enforces strict whitelist validation. The form maps UI-only helper discriminators into exact DTO payloads before sending.
3. **Box-Limit Enforcement (`src/lib/validation/formw7/rules.ts`)**:
   - IRS AcroForm text fields have fixed visual widths at 8 pt Helvetica.
   - The validation rules define `W7_BOX` and `fitsBox()` ensuring that applicant text fits neatly in printed boxes without clipping.
4. **Masked Inputs (`maskedRegister`)**: Formats SSNs, ITINs, EINs, PTINs, and phone numbers in real time while preserving the cursor/caret position and backspace behavior.
5. **Live Validation (`useLiveValidation`)**: After initial submit attempt, forms re-validate live on every change so list errors clear immediately.
6. **Payment Gating**: Paid cases become read-only and unlock final IRS PDF downloads.
