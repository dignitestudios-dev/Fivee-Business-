# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # dev server (Turbopack) on http://localhost:3000
npm run build   # production build (Turbopack)
npm run start   # serve the production build
```

No test or lint scripts are configured — there is no test runner, ESLint config, or `tailwind.config.js` in this repo.

## What this app is

A Next.js 16 (App Router) / React 19 / TypeScript client for preparing IRS Offer in Compromise paperwork: **Form 433-A (OIC)**, **Form 433-B (OIC)**, and **Form 656-B**. Users complete a multi-step form per "case", pay a flat fee, and sign. Reference PDFs and the Figma link are listed at the bottom of `src/lib/constants.ts`.

## Architecture

### Routes (`src/app/`)
- `auth/` — login, signup, forgot/reset password; `verify-email/` for post-signup verification
- `dashboard/` — app shell: `433a-oic/`, `433b-oic/`, `form-656/` (each with a `payment/` or `start/` sub-route), plus `signatures/`, `videos/`, `manage-payment-methods/`, `onboard/`
- `(terms)/` — route group for legal pages

`src/app/layout.tsx` wraps everything in `ToastProvider` → `StoreProvider` → `GlobalPopup` + `AuthGuard`, and registers a service worker for FCM push.

### Data layer
All HTTP goes through the single `api` object in [src/lib/services.ts](src/lib/services.ts) (~600 lines). It owns:
- the axios instance and `BASE_URL` (`https://api.fiveebusiness.com/`; a commented-out localhost line is there for local backend work)
- a request interceptor that attaches the bearer token for every non-public endpoint (the `publicEndpoints` list) and rejects outright if no token exists
- a response interceptor that clears storage and hard-redirects to `/auth/login` on a 401
- `apiHandler()`, which normalizes errors and throws when the backend returns `status: false`

Don't add try/catch around `api.*` calls except at the hook layer, where errors are surfaced via `showError()` from `useGlobalPopup` (or `react-hot-toast` in a few hooks).

### State
Redux Toolkit; store in [src/lib/store.ts](src/lib/store.ts) with slices `user`, `form433a`, `form433b`, `form656`, `signatures`, `cards`, `forms`, `chats`, `popup`. Always use the typed wrappers from `@/lib/hooks` (`useAppDispatch`, `useAppSelector`), never raw react-redux.

### Auth
Email/password uses a custom backend JWT. Google/Apple sign-in goes through Firebase Auth (`src/lib/firebase.ts`) and the resulting credential is handed to the backend signup endpoint. `accessToken` and `user` live in `localStorage`; [AuthGuard](src/components/global/AuthGuard.tsx) hydrates Redux from them on mount and performs all redirect logic client-side.

### Form architecture (the core of the app)
All three forms follow the same shape — learn one and the others follow:

1. **Container** (`src/components/forms/Form433AOIC.tsx`, `Form433BOIC.tsx`, `Form656.tsx`) is a client component that owns `currentStep`, `completedSteps`, `skippedSteps`, hydration, and a read-only mode for paid/submitted cases. The `steps` array in the container is the source of truth for step numbers and titles.
2. **Case identity** comes from the `?caseId=` search param. Step progress is mirrored to `localStorage` under keys like `433a_progress`.
3. **Sections** render from `src/components/forms/{form433a,form433b,form656}-sections/`, one file per step, plus shared `form-stepper.tsx` / `form-navigation.tsx`.
4. **Validation** is Zod, one schema file per section under `src/lib/validation/{form433a,form433b,form656}/`, wired to react-hook-form via `@hookform/resolvers`.
5. **Section hooks** in `src/hooks/{433a,433b,656}-form-hooks/` pair a `handleSave<X>` and `handleGet<X>` per section; get calls `api.get{form}SectionInfo(caseId, section)` and dispatches into the matching slice.
6. **Section names** are string union types (`Form433aSection`, etc.) declared in `src/types/global.d.ts` and enumerated in `FORM_433A_SECTIONS` / `FORM_433B_SECTIONS` / `FORM_656_SECTIONS` in `src/lib/constants.ts`. Adding or reordering a section means touching the type, the constants array, the container's `steps`, the validation dir, and the hooks dir together.
7. **Skipping** a section uses `useSkipSection` → `api.skipSection(caseId, stepNumber, formType)`, which POSTs with a `?skipped=<sectionName>` query param.

### Types
Shared interfaces (`User`, `FormCase`, section unions, …) are declared globally in `src/types/global.d.ts` — no import needed. Form data types are derived from the Zod schemas with `z.infer<>`, so schema edits propagate to types automatically.

### Payments
Stripe via `@stripe/react-stripe-js`; the shared card UI is `src/components/payment/PaymentForm.tsx`. The single price lives in `pricing` in `src/lib/constants.ts` and is consumed by both `433a-oic/payment/page.tsx` and `433b-oic/payment/page.tsx` — change it there, never inline.

### Real-time & notifications
Socket.io through the singleton `socketService` in `src/lib/socket.ts` (`connect()` once after login, then `.on(...)`). Push notifications use Firebase Cloud Messaging with `public/firebase-messaging-sw.js` and `src/hooks/notification/useFcmSubscription.ts`.

## Conventions

- **Styling**: Tailwind CSS v4 via the PostCSS plugin; no config file, theme tokens live in `src/app/globals.css`. Merge conditional classes with `cn()` from `@/utils/helper`.
- **localStorage**: always via the SSR-safe `storage` helper in `@/utils/helper` (`storage.get<T>`, `.set`, `.remove`); it no-ops on the server. `getCaseId()`/`setCaseId()` there wrap the current case.
- **Imports**: `@/*` maps to `src/*`.
- **Helpers worth reusing** before writing new ones: `getError`, `formatEIN`, `formatPhone`, `dataURLtoFile`, `getBase64FromUrl`, `toTitleCase`, `getInitials` in `src/utils/helper.ts`.
- **Env**: everything is `NEXT_PUBLIC_*` (Stripe publishable key, Firebase config + VAPID key) in `.env`.
