# Copilot Instructions — Fivee Business Frontend

## Commands

```bash
npm run dev        # development server (Turbopack)
npm run build      # production build (Turbopack)
npm run start      # run production build
```

No test or lint scripts are configured.

---

## Architecture

**Next.js 16 App Router** with React 19 and TypeScript.

### Route structure (`src/app/`)
- `auth/` — login, signup, forgot/reset password
- `dashboard/` — main app shell; contains sub-routes for each IRS form
  - `433a-oic/` — Form 433-A (OIC) multi-step flow
  - `433b-oic/` — Form 433-B (OIC) multi-step flow
  - `form-656/` — Form 656-B multi-step flow
  - `signatures/`, `videos/`, `manage-payment-methods/`, `onboard/`
- `(terms)/` — route group for terms/legal pages
- `verify-email/` — post-signup email verification

### Data layer
All API calls go through `src/lib/services.ts`, which exports a single `api` object. Every function is wrapped in `apiHandler()` — this standardizes error extraction and throws if the response has `status: false`.

Redux (RTK) manages client state. The store (`src/lib/store.ts`) has slices for:
`user`, `form433a`, `form433b`, `form656`, `signatures`, `cards`, `forms`, `chats`, `popup`

### Authentication
- Email/password: custom backend JWT
- Social (Google, Apple): Firebase Auth (`src/lib/firebase.ts`) — credential is passed to the backend signup endpoint
- Tokens stored in `localStorage` under keys `accessToken` and `user`
- `AuthGuard` (`src/components/global/AuthGuard.tsx`) hydrates Redux from localStorage on mount and handles all redirect logic client-side

### Form architecture
Each IRS form (433A, 433B, 656) follows the same pattern:
1. Multi-step form flow with skippable sections
2. Zod validation schemas per section in `src/lib/validation/{form433a,form433b,form656}/`
3. Section names are typed as union types in `src/types/global.d.ts`
4. Custom hooks in `src/hooks/{433a-form-hooks,433b-form-hooks,656-form-hooks}/` manage section state
5. Section data is fetched by key using `get{form}SectionInfo(caseId, section)` and saved per-section

---

## Key Conventions

### Typed Redux hooks
Always use the typed wrappers from `src/lib/hooks.ts`, never the raw react-redux hooks:
```ts
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
```

### Class merging
Use `cn()` from `src/utils/helper.ts` for all conditional Tailwind classes:
```ts
import { cn } from "@/utils/helper";
```

### localStorage access
Always use the `storage` utility from `src/utils/helper.ts` — it is SSR-safe (no-ops on server):
```ts
import { storage } from "@/utils/helper";
storage.get<string>("accessToken");
storage.set("user", userData);
```

### Global types
Shared interfaces and form types (`User`, `FormCase`, `Form433aSection`, etc.) are declared globally in `src/types/global.d.ts` — no import needed. Form data types are derived directly from Zod schemas using `z.infer<>`.

### Error handling
`apiHandler()` in `src/lib/services.ts` is the single point for API error normalization. Do not wrap API calls in additional try/catch unless you need component-specific behavior — handle errors at the hook layer using `showError()` from `useGlobalPopup`.

### Real-time (Socket.io)
Use the singleton `socketService` from `src/lib/socket.ts`:
```ts
import { socketService } from "@/lib/socket";
socketService.connect(); // call once after login
socketService.on("event", handler);
```

### Styling
Tailwind CSS v4 (PostCSS plugin, no `tailwind.config.js`). Global styles are in `src/app/globals.css`.

### Form section skipping
To skip a section without filling it, use `api.skipSection(caseId, stepNumber, formType)` — this sends a POST to the appropriate endpoint with a `?skipped=<sectionName>` query param.

### API base URL
Defined in `src/lib/services.ts` as `BASE_URL = "https://api.fiveebusiness.com/"`. A commented-out localhost alternative is present for local backend development.
