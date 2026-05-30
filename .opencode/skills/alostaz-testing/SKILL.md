---
name: alostaz-testing
description: Automated testing for the Sportology (Edrak) platform. For E2E browser testing, use edrak-agent-browser skill (agent-browser CLI, real Chrome, human-like). For unit/integration/tRPC testing, use Playwright programmatic API. Detects 7 failure modes, fixes, and re-verifies in a loop via /ulw-loop. Uses test-automation category for optimal model routing.
argument-hint: describe what to test or validate (e.g., "run all P0 flows with agent-browser", "fix the INT-01 coupon calculation bug", "verify all auth navigation works")
---

# Edrak Testing — Automated Test-Fix-Verify

## 🚨 IMPORTANT: Two Complementary Testing Methods

| Method | When to Use | Tool |
|--------|------------|------|
| **agent-browser CLI** | E2E browser testing, multi-role flows, visual verification | `agent-browser --headed --auto-connect` |
| **Playwright programmatic** | Unit tests, API/query tests, setup/teardown, DB seeding | `pnpm exec playwright test` |

**For E2E flows** (auth, purchase, checkout, lifecycle tests):
→ Use `edrak-agent-browser` skill (load with `skill edrak-agent-browser`)
→ NEVER use Playwright MCP (breaks auth sessions, uses inaccessible selectors)

**For backend/API tests** (tRPC routers, DB queries, validation):
→ Use Playwright programmatic API via spec files
→ These run headless, no browser needed

---

## Playwright Infrastructure (for unit/integration)

- **Config**: `__tests__/playwright.config.ts`
- **Base URL**: `http://localhost:3000`
- **Specs**: `__tests__/e2e/flows/*.spec.ts` (10 spec files)
- **Helpers**: `__tests__/e2e/helpers/` (auth, navigation, payment, db)
- **Docs**: `__tests__/docs/00-master-index.md`

```bash
# All Playwright tests (unit/integration only)
pnpm exec playwright test --config __tests__/playwright.config.ts

# Specific flow
pnpm exec playwright test --config __tests__/playwright.config.ts __tests__/e2e/flows/01-auth-navigation.spec.ts

# With visible browser
pnpm exec playwright test --config __tests__/playwright.config.ts --headed

# View HTML report
pnpm exec playwright show-report __tests__/test-results/report
```

## Priority / Flow Reference

| Priority | Flows | Doc Section |
|----------|-------|-------------|
| **P0 🔴** | AUTH-01/02/03, PAY-01, INT-01, INT-03 | `01-auth/`, `06-payment/`, `07-intertwined/` |
| **P1 🟠** | AUTH-04, STU-01/02, PROF-01/02/03/04, ADM-01/04/05/06, CAR-02/05, INT-02/04 | `02-student/`, `03-professor/`, `04-admin/`, `05-careers/` |
| **P2 🟡** | STU-03/04/05, ADM-02/03/08, CAR-01/03/04, PAY-02/03/04, INT-05 | Supporting features |
| **P3 ⚪** | PROF-05, ADM-07, CAR-06 | Stretch |

Full index: `__tests__/docs/00-master-index.md`

## Intertwined Flows (Multi-Role E2E)

These MUST be tested with **agent-browser CLI** (load `edrak-agent-browser` skill), NOT Playwright MCP:

| Flow | Description | Priority | Roles | Handoff |
|------|-------------|----------|-------|---------|
| INT-01 | Admin Coupon → Student Purchase | P0 🔴 (known broken) | Admin → Student | `.opencode/handoffs/intertwined-testing-handoff.md` |
| INT-02 | Course Lifecycle → Certificate | P1 🟠 | Admin → Professor → Student | same handoff |
| INT-03 | Case & Dynamic Plan Lifecycle | P0 🔴 | Admin → Professor → Student | same handoff |
| INT-04 | Full Service Lifecycle | P1 🟠 | Student → Admin → Professor → Student | same handoff |
| INT-05 | Careers Employer Hire | P2 🟡 | Employer → Professional → Employer | same handoff |

## E2E Agent-Browser Workflow (for intertwined tests)

```bash
# 1. Start server
pnpm run dev

# 2. Open real Chrome (auth preserved)
agent-browser open http://localhost:3000 --headed --auto-connect

# 3. For each flow step:
agent-browser snapshot -i           # See page
agent-browser click @eX             # Act
agent-browser wait 2
agent-browser url                   # Verify navigation
agent-browser console --json        # Check errors
agent-browser errors --json         # Check JS errors
agent-browser network requests --json # Check API calls
agent-browser snapshot -i           # Verify page state

# 4. If any failure → investigate → fix → re-verify
# 5. Use /ulw-loop for automatic fix-test cycles
```

## The 7 Failure Modes (Same as agent-browser skill)

| # | Failure Mode | How to Detect |
|---|-------------|---------------|
| 1 | Runtime errors | `agent-browser errors --json`, check stack trace |
| 2 | Data not fetching | `agent-browser network requests --json` — 500/empty responses |
| 3 | Stale data after navigation | Snapshot shows old data, refresh doesn't update |
| 4 | UI crashes after state change | React error boundary, "null is not iterable" |
| 5 | Data not stored correctly | Form submit does nothing, button unresponsive |
| 6 | Buttons not working | Element visible but click does nothing — check JS errors |
| 7 | Infinite navigation loops | URL keeps redirecting to same page |

## Model Routing

`test-automation` category resolves to:
- **Primary**: `opencode-go/kimi-k2.6` — strongest coding model for complex test debugging
- **Fallback 1**: `opencode-go/minimax-m2.7` — fast utility for quick fixes
- **Fallback 2**: `opencode-go/deepseek-v4-flash` — cheapest fallback, 1M context

## Key Files

| File | Purpose |
|------|---------|
| `__tests__/docs/00-master-index.md` | All flow documentation index |
| `__tests__/e2e/flows/*.spec.ts` | Playwright test specs |
| `__tests__/e2e/helpers/` | Auth, navigation, payment, DB helpers |
| `__tests__/docs/07-intertwined/` | Intertwined multi-role flow docs |
| `.opencode/skills/edrak-agent-browser/SKILL.md` | Agent-browser E2E testing skill |
| `.opencode/handoffs/intertwined-testing-handoff.md` | Handoff prompt for intertwined flow execution |
