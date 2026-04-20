# Playwright E2E Tests with Video Recording

This folder contains end-to-end tests using Playwright with automatic video recording on test failures and successes.

## Setup

Playwright has been installed as a dev dependency. The configuration is in `playwright.config.ts`.

## Video Recording

In `playwright.config.ts`, **local** runs use `video: on` (full recording). On **CI** (`CI=true`), video mode is **`retain-on-failure`** to save disk and time. Outputs go under `test-results/` (gitignored).

To change behavior, edit the `video` block in `playwright.config.ts`.

## Test Files

- **auth.spec.ts**: Login, register, and logout flows
- **shopping.spec.ts**: Product browsing, cart management, filtering
- **orders.spec.ts**: Checkout, order history, admin operations

## Running Tests

### Run all tests headless (with video on failure)
```bash
npm run test:e2e
```

### Run tests in headed mode (see browser, watch videos live)
```bash
npm run test:e2e:headed
```

### Run tests in UI mode (interactive dashboard)
```bash
npm run test:e2e:ui
```

### Run tests in watch mode (re-run on file change)
```bash
npm run test:e2e:watch
```

### Run specific test file
```bash
npx playwright test e2e/auth.spec.ts
```

### Run specific test
```bash
npx playwright test -g "user can login"
```

## Viewing Test Results

After tests run, view the HTML report:
```bash
npx playwright show-report
```

Videos are in: `test-results/` (only saved on failures)

## Test Configuration

- **Base URL**: http://localhost:5173 (Vite dev server)
- **Auto-launch dev server**: Yes (configured in playwright.config.ts)
- **Browsers**: Chromium, Firefox, WebKit
- **Parallel execution**: Yes
- **Retries**: 0 (local), 2 (CI)
- **Trace**: On first retry

## Recording Videos

All videos are MP4 format stored alongside test results:
```
test-results/
  ├── auth.spec.ts-chromium/
  │   ├── user-can-register.webm
  │   └── user-can-login.webm
  └── shopping.spec.ts-chromium/
      └── user-can-browse-products.webm
```

## Tips

1. Use `--headed` mode to see browser during test execution
2. Videos help debug test failures visually
3. Update selectors in tests if your UI structure changes
4. Use `data-testid` attributes in your UI for more stable selectors
5. Tests run automatically before each test (no manual setup needed)

## Customizing Tests

Edit test files to match your actual UI selectors:
- Replace generic selectors with your actual HTML ids/classes
- Example: `await page.fill('input[name="email"]', email);`
- Use browser DevTools to find correct selectors during test editing

## Merge checklist (automate / PR hygiene)

**Sitemap (`frontend/public/sitemap.xml`).** It is generated during `npm run build` by `frontend/scripts/generate-sitemap.ts`, which calls `VITE_API_BASE_URL` (default `http://127.0.0.1:5000`). A local build therefore embeds whatever products exist in that API. Do not merge a PR that replaces production URLs with local/E2E data. Either restore `sitemap.xml` from `main` or regenerate with production API and `VITE_PUBLIC_SITE_URL` set, then document both in the PR.

**Backend HTTP tests.** From repo root: `cd backend && npm test` (Vitest + Supertest). Shared mocks live in `backend/tests/httpTestEnv.ts` (loaded via `setupFiles` in `backend/vitest.config.ts`).

**Playwright `auth.spec` / `signInAsAdmin`.** [`e2e/utils/auth.ts`](e2e/utils/auth.ts) signs in with a fixed email/password (`softzcart@gmail.com`). Your MongoDB must contain that user with a matching password, or those tests will stay on `/signin`. Other flows can register via API (`signUpAsTestUser`).

**Paste for GitHub PR description (optional).**

- Backend: `cd backend && npm test`
- Frontend E2E: `cd frontend && npm run test:e2e` (starts backend + frontend dev servers per `playwright.config.ts`; seed admin above for auth specs)
- Sitemap: only commit changes generated against the intended production API and site URL; never from default localhost unless that file is not meant for production.
