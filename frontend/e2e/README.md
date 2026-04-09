# Playwright E2E Tests with Video Recording

This folder contains end-to-end tests using Playwright with automatic video recording on test failures and successes.

## Setup

Playwright has been installed as a dev dependency. The configuration is in `playwright.config.ts`.

## Video Recording

Videos are configured to be retained on test failure by default:
- **retain-on-failure**: Videos saved only when tests fail
- Videos stored in: `test-results/` directory

To change video recording behavior, edit `playwright.config.ts`:
```typescript
video: 'on', // Always record
video: 'off', // Never record
video: 'retain-on-failure', // Only on failure (default)
```

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
