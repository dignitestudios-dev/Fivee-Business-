# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # dev server (Turbopack) on http://localhost:3000
npm run build   # production build (Turbopack)
npm run start   # serve the production build
```

No test or lint scripts are configured — there is no test runner, ESLint config, or `tailwind.config.js` in this repo.

**Run only one `next dev` per checkout, and don't run `next build` while it is up.** Two dev servers in the same folder share `.next/dev` and corrupt it, which shows up as intermittent `404`s on routes that exist and `missing required error components, refreshing...`. If a route 404s intermittently, look for a second `next dev` process first; the fix is to stop everything, delete `.next`, and start one server. Tools that auto-pick a free port when 3000 is busy will happily start that second server for you.

## What this app is

A Next.js 16 (App Router) / React 19 / TypeScript client for preparing IRS paperwork: the Offer in Compromise set (**Form 433-A (OIC)**, **Form 433-B (OIC)**, **Form 656-B**) and **Form W-7** (ITIN application). Users complete a multi-step form per "case", pay a flat fee, and sign. Reference PDFs and the Figma link are listed at the bottom of `src/lib/constants.ts`.

## Architecture

### Routes (`src/app/`)
- `auth/` — login, signup, forgot/reset password; `verify-email/` for post-signup verification
- `dashboard/` — app shell: `433a-oic/`, `433b-oic/`, `form-656/`, `form-w7/` (each with a `payment/` or `start/` sub-route), plus `signatures/`, `videos/`, `manage-payment-methods/`, `onboard/`
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
Redux Toolkit; store in [src/lib/store.ts](src/lib/store.ts) with slices `user`, `form433a`, `form433b`, `form656`, `formW7`, `signatures`, `cards`, `forms`, `chats`, `popup`. Always use the typed wrappers from `@/lib/hooks` (`useAppDispatch`, `useAppSelector`), never raw react-redux.

### Auth
Email/password uses a custom backend JWT. Google/Apple sign-in goes through Firebase Auth (`src/lib/firebase.ts`) and the resulting credential is handed to the backend signup endpoint. `accessToken` and `user` live in `localStorage`; [AuthGuard](src/components/global/AuthGuard.tsx) hydrates Redux from them on mount and performs all redirect logic client-side.

### Form architecture (the core of the app)
All four forms follow the same shape — learn one and the others follow:

1. **Container** (`src/components/forms/Form433AOIC.tsx`, `Form433BOIC.tsx`, `Form656.tsx`) is a client component that owns `currentStep`, `completedSteps`, `skippedSteps`, hydration, and a read-only mode for paid/submitted cases. The `steps` array in the container is the source of truth for step numbers and titles.
2. **Case identity** comes from the `?caseId=` search param. Step progress is mirrored to `localStorage` under keys like `433a_progress`.
3. **Sections** render from `src/components/forms/{form433a,form433b,form656}-sections/`, one file per step, plus shared `form-stepper.tsx` / `form-navigation.tsx`.
4. **Validation** is Zod, one schema file per section under `src/lib/validation/{form433a,form433b,form656}/`, wired to react-hook-form via `@hookform/resolvers`.
5. **Section hooks** in `src/hooks/{433a,433b,656}-form-hooks/` pair a `handleSave<X>` and `handleGet<X>` per section; get calls `api.get{form}SectionInfo(caseId, section)` and dispatches into the matching slice.
6. **Section names** are string union types (`Form433aSection`, etc.) declared in `src/types/global.d.ts` and enumerated in `FORM_433A_SECTIONS` / `FORM_433B_SECTIONS` / `FORM_656_SECTIONS` in `src/lib/constants.ts`. Adding or reordering a section means touching the type, the constants array, the container's `steps`, the validation dir, and the hooks dir together.
7. **Skipping** a section uses `useSkipSection` → `api.skipSection(caseId, stepNumber, formType)`, which POSTs with a `?skipped=<sectionName>` query param.

### Form W-7 specifics
W-7 follows the pattern above but differs from the OIC forms in ways that matter:

- **Strict DTO validation.** The API runs `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`, so any field the DTO does not declare makes the whole request fail. All conversion between the react-hook-form shapes and the DTO payloads lives in [src/utils/formw7.ts](src/utils/formw7.ts) — never post a form object straight to `api.saveW7*`. UI-only discriminators (`primaryReason`, `includeOtherReason`, `hasDifferentBirthName`, `hasUsVisa`, `entryStatus`) exist only in the form and are mapped away there.
- **Cross-section validation.** Rules in Other Information depend on answers saved in Application Info (renewal requires an ITIN; reason f requires an institution; reason g requires a visa and entry date), so the resolver is built per case with `makeOtherInformationSchema(context)`.
- **Skipping** uses a dedicated `POST /formw7/:caseId/skip/:section` route (not the `?skipped=` query param), and `acceptanceAgentInfo` is the only skippable section.
- **Section order.** The API requires applicationInfo, personalInfo, otherInformation and signatureDelegateInfo (saving the signature section marks the case complete). The wizard follows the PDF, so the optional acceptanceAgentInfo comes last, after Signatures.
- **Supporting documents** go through the shared `/media/image` endpoint (images only, 5 MB). That endpoint does not return the new media id, so [useW7SupportingDocuments](src/hooks/w7-form-hooks/useW7SupportingDocuments.ts) uploads with a generated unique title and reads the id back from the list endpoint.
- **PDF download always regenerates** (`GET /formw7/:caseId/generate-pdf`) rather than reusing a cached `downloadUrl`, because the API does not clear that URL when the signature section is re-saved. With `NODE_ENV=dev` the API returns a server `filePath` instead of a URL; `isDownloadableUrl()` guards that case.
- Case state is `incompleted | completed | edited` (the OIC `FormCase` type has no `edited`), so W-7 uses its own `FormW7Case` type.
- **Payment gates the download, and the API does not.** `GET /formw7/:caseId/generate-pdf` works for unpaid cases, so the rule is enforced client-side in one place: `useDownloadW7Pdf` re-checks `paymentStatus` before every generate. Lists decide between **Pay now** and **Download** from `useW7PaidCaseIds` (the paid subset of `my-cases`), which fails closed. A paid form is read-only. The payment page redirects away from an already-paid case so it can't be charged twice.
- **Finishing the form.** The last step's Submit (or Skip) shows a "submitted" screen that counts down and redirects to payment; Pay later cancels it. `FormW7List`/`Form656List` are the 5-item dashboard cards; the paginated lists live at `dashboard/form-w7/all` and `dashboard/form-656/all` (`usePaginatedList` + `Pagination`).

### Types
Shared interfaces (`User`, `FormCase`, section unions, …) are declared globally in `src/types/global.d.ts` — no import needed.

**Caveat worth knowing:** that file never imports `zod`, so every `type X = z.infer<typeof schema>` alias in it silently resolves to `any`. This is why the 433-A/433-B/656 section hooks all take `info: any`. The W-7 schemas therefore export their types directly (`export type W7PersonalInfoForm = z.infer<...>`) and `global.d.ts` aliases those imported types, which keeps the W-7 module genuinely type-checked. Adding `import * as z from "zod"` to `global.d.ts` would type the older forms too, but expect a wave of pre-existing errors to surface.

### Payments
Stripe via `@stripe/react-stripe-js`; the shared card UI is `src/components/payment/PaymentForm.tsx`. Prices live in `src/lib/constants.ts` — change them there, never inline: `pricing` ($149) for the `433a-oic` and `433b-oic` payment pages, and `w7Pricing` ($25) for `form-w7` and its "submitted" screen. `formModel` must be one of `Form433A-OIC`, `Form433B-OIC`, `FormW7` (the backend enum does not include Form 656-B).

### Real-time & notifications
Socket.io through the singleton `socketService` in `src/lib/socket.ts` (`connect()` once after login, then `.on(...)`). Push notifications use Firebase Cloud Messaging with `public/firebase-messaging-sw.js` and `src/hooks/notification/useFcmSubscription.ts`.

## Conventions

- **Styling**: Tailwind CSS v4 via the PostCSS plugin; no config file, theme tokens live in `src/app/globals.css`. Merge conditional classes with `cn()` from `@/utils/helper`.
- **localStorage**: always via the SSR-safe `storage` helper in `@/utils/helper` (`storage.get<T>`, `.set`, `.remove`); it no-ops on the server. `getCaseId()`/`setCaseId()` there wrap the current case.
- **Imports**: `@/*` maps to `src/*`.
- **Helpers worth reusing** before writing new ones: `getError`, `formatEIN`, `formatPhone`, `dataURLtoFile`, `getBase64FromUrl`, `toTitleCase`, `getInitials` in `src/utils/helper.ts`.
- **Env**: everything is `NEXT_PUBLIC_*` (Stripe publishable key, Firebase config + VAPID key) in `.env`.
