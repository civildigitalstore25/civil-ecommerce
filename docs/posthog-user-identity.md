# PostHog User Identity — Civil Ecommerce (Softzcart)

> Shared playbook: see Teksage Website `docs/posthog-user-identity-playbook.md` (Vite/React notes below).

## Overview

The Softzcart frontend links PostHog session recordings and events to logged-in users so **email** appears in PostHog **Persons**.

---

## Canonical user ID

| Layer | Field |
|-------|-------|
| MongoDB PK | `User._id` (ObjectId) |
| Login / register API | `user.id` (string) |
| `GET /api/auth/current-user` | Mongoose document (`id` virtual or `_id`) |
| Frontend `User` type | `User.id` — see [`api/auth.ts`](../frontend/src/api/auth.ts) |
| PostHog `distinct_id` | Same string via `resolveCanonicalUserId()` |

---

## Auth source

- Email/password → `useSignIn` / `saveAuth` in [`useSigninPage.ts`](../frontend/src/pages/auth/signin/useSigninPage.ts)
- Google OAuth → [`AuthCallbackPage.tsx`](../frontend/src/pages/auth/AuthCallbackPage.tsx)
- Session → React Query `["currentUser"]` via [`useCurrentUser`](../frontend/src/api/auth.ts)
- Logout → [`useLogout`](../frontend/src/api/auth.ts) clears token + query cache

Identity sync uses `useAuth()` inside [`PostHogProvider.tsx`](../frontend/src/components/providers/PostHogProvider.tsx). Login/logout components are unchanged.

---

## Files

| File | Role |
|------|------|
| [`frontend/src/lib/analytics/posthog-client.ts`](../frontend/src/lib/analytics/posthog-client.ts) | `posthogShouldTrack`, init options, traits, helpers |
| [`frontend/src/components/providers/PostHogProvider.tsx`](../frontend/src/components/providers/PostHogProvider.tsx) | Init, `PostHogIdentitySync`, wraps app |
| [`frontend/src/App.tsx`](../frontend/src/App.tsx) | `QueryClientProvider` → `PostHogProvider` (identity needs React Query) |
| [`frontend/src/main.tsx`](../frontend/src/main.tsx) | No PostHog init (moved to provider) |

---

## Environment variables (Vite)

```env
VITE_PUBLIC_POSTHOG_KEY=phc_...
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
# Opt-in for `vite dev` (production builds track automatically via import.meta.env.PROD)
VITE_PUBLIC_POSTHOG_ENABLE_IN_DEV=true
```

**Production:** only `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` are required. Do **not** need `VITE_PUBLIC_POSTHOG_ENABLE_IN_DEV`.

---

## Testing

1. Set `VITE_PUBLIC_POSTHOG_ENABLE_IN_DEV=true` in `frontend/.env.local`
2. `npm run dev` → sign in
3. PostHog **Persons** → distinct ID = MongoDB user id; `email` property set
4. Log out → anonymous session; different user → separate Person
5. Refresh while logged in → still identified

---

## Vite vs Next.js (playbook addendum)

| | Next.js (Teksage) | Vite (Civil Ecommerce) |
|--|-------------------|-------------------------|
| Env prefix | `NEXT_PUBLIC_*` | `VITE_PUBLIC_*` |
| Production gate | `process.env.NODE_ENV === 'production'` | `import.meta.env.PROD` |
| Auth adapter | Zustand `subscribe` | React Query `useAuth()` effect |
| Provider order | PostHog outside or inside auth store | `QueryClientProvider` **before** `PostHogProvider` |
