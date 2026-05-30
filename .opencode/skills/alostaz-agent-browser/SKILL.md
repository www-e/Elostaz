---
name: alostaz-agent-browser
description: Human-like E2E browser testing for Sportology (Edrak) with agent-browser CLI. Connects to REAL Chrome via --auto-connect (auth preserved). Uses ref-based snapshots (@e1, @e2) — deterministic, 93% fewer tokens than DOM. Detects 7 failure modes. Think like a human tester, never ignore errors. Uses test-automation category for model routing.
argument-hint: describe which flow to test or what to investigate (e.g., "run INT-01 coupon-purchase flow", "investigate why wallet deduction fails", "verify INT-02 course lifecycle")
---

# Edrak Agent-Browser — Human-Like E2E Testing

> **Tool**: `agent-browser` CLI (NOT Playwright MCP)
> **Connection**: `--headed --auto-connect` to user's REAL Chrome
> **Snapshots**: ref-based (`@e1`, `@e2`) — deterministic, no a11y guessing
> **Fix Cycle**: `/ulw-loop` — investigate every failure before continuing
> **Model Routing**: `test-automation` category → kimi-k2.6 → minimax-m2.7 → deepseek-v4-flash

## 🧠 Core Philosophy: Think Like a Human Tester

A human tester does NOT:
- Search for accessibility labels that don't exist and loop forever
- Click invisible elements or guess selectors
- Navigate to broken links without noticing
- Silence errors to pretend the test passed
- Waste time re-snapshotting the same page

A human tester DOES:
- Look at the page and think: **"Is this what I expect to see?"**
- Click buttons naturally, not through abstract selectors
- Notice when something feels wrong: **"This data should have loaded"**
- Check the browser console for errors after each action
- Verify navigation actually happened: **"The URL changed, good"**
- When stuck, stop, re-assess the page, and try a different approach
- **Never ignore a failure** — investigate root cause before moving on

## 🚀 How agent-browser Works

### Connect to Their REAL Chrome (NOT headless)

```bash
agent-browser open http://localhost:3000 --headed --auto-connect
```

**Why this matters:**
- All login sessions are preserved (student, professor, admin — already authenticated in their Chrome)
- No bot detection — uses their real browser fingerprint
- Different from headless Playwright MCP which loses auth

### Snapshot → Ref System (No Accessibility Guessing)

```bash
agent-browser snapshot -i
# Returns:
#   - link "Courses" [ref=e5]
#   - button "Login" [ref=e12]
#   - textbox "Email" [ref=e18]
```

Click using refs — **deterministic, no guessing**:
```bash
agent-browser click @e5        # Clicks exactly "Courses" link
agent-browser fill @e18 "text" # Types into exactly "Email" field
agent-browser select @eX "option"  # Select dropdown option
```

### Dev Tools (Always Check After Each Action)

```bash
agent-browser console --json   # Console errors?
agent-browser errors --json    # JS errors only
agent-browser url              # Did navigation actually happen?
agent-browser network requests --json # API calls ok?
agent-browser screenshot       # Visual check if unsure
```

## 🔍 The 7 Failure Modes — Detection Patterns

| # | Failure Mode | Detection Command | Human Check |
|---|-------------|-------------------|-------------|
| 1 | Runtime errors | `agent-browser errors --json` | "Did the page crash after that click?" |
| 2 | Data not fetching | `agent-browser network requests --json` | "API returned 500/empty?" |
| 3 | Stale data after navigation | `agent-browser snapshot -i` | "Old data showing after create/edit?" |
| 4 | UI crashes after state change | `agent-browser console --json` | "React error boundary? Null pointer?" |
| 5 | Data not stored correctly | Re-check page after submit | "Button click did nothing?" |
| 6 | Buttons not working | `snapshot -i`, check disabled/covered | "Is onClick attached? JS error?" |
| 7 | Infinite navigation loops | `agent-browser url` | "Stuck in redirect loop?" |

## 🧪 The Human-Like Workflow (Per Action)

```bash
# 1. Open → 2. Check page → 3. Act → 4. Verify → 5. Investigate if fail
agent-browser open http://localhost:3000/<page> --headed --auto-connect
agent-browser url                    # Page loaded?
agent-browser console --json        # No errors on load?
agent-browser snapshot -i           # See what's clickable
agent-browser click @eX             # Perform action
agent-browser wait 2                # Let page settle
agent-browser url                   # Navigated where expected?
agent-browser console --json        # Any errors after action?
agent-browser errors --json         # JS errors only
agent-browser network requests --json # API calls successful?
agent-browser snapshot -i           # Page looks correct?
```

**NEVER skip the verify step.** If any check fails → investigate → fix → re-verify.

## 📋 All 54 Test Flows — Priority Order

Always test in this order. Reference docs at `__tests__/docs/00-master-index.md`.

### P0 🔴 (Must pass before any deployment)

| Flow ID | Description | Roles | Doc |
|---------|-------------|-------|-----|
| AUTH-01 | Student Sign In | Student | `01-auth/01-student-signin.md` |
| AUTH-02 | Professor Sign In | Professor | `01-auth/02-professor-signin.md` |
| AUTH-03 | Admin Sign In | Admin | `01-auth/03-admin-signin.md` |
| PAY-01 | Course Payment Wallet+Coupon | Admin, Student | `06-payment/01-course-payment-wallet-coupon.md` |
| **INT-01** | **Admin Coupon → Student Purchase** | **Admin, Student** | **`07-intertwined/01-admin-coupon-student-purchase.md`** |
| **INT-03** | **Case & Dynamic Plan Lifecycle** | **Admin, Professor, Student** | **`07-intertwined/03-admin-case-professor-plan.md`** |

### P1 🟠 (Core user journeys)

| Flow ID | Description | Roles |
|---------|-------------|-------|
| AUTH-04 | Sign Up Flow | New User |
| STU-01 | Browse & Purchase Course | Student |
| STU-02 | Watch Lesson, Quiz & Certificate | Student |
| PROF-01 | Dashboard & Cases | Professor |
| PROF-02 | Create Plan for Student | Professor |
| PROF-03 | Create Blog + Admin Approval | Professor, Admin |
| PROF-04 | Create Quiz + Admin Approval | Professor, Admin |
| ADM-01 | Manage Courses & Lessons | Admin |
| ADM-04 | Create Coupon | Admin |
| ADM-05 | Add Wallet Funds | Admin |
| ADM-06 | Case Assignment | Admin |
| CAR-02 | Employer Post Job | Employer |
| CAR-05 | Professional Apply to Job | Professional |
| **INT-02** | **Course Lifecycle → Certificate** | **Admin, Professor, Student** |
| **INT-04** | **Service Lifecycle** | **Student, Admin, Professor** |

### P2 🟡 (Supporting features)

| Flow ID | Description | Roles |
|---------|-------------|-------|
| STU-03 | Service Purchase Form | Student |
| STU-04 | View Professor Plan | Student |
| STU-05 | Wallet & Cashback | Student |
| ADM-02 | Manage Blogs | Admin |
| ADM-03 | Manage Quizzes Approval | Admin |
| ADM-08 | Warehouse Dynamic Plans | Admin |
| CAR-01 | Employer Registration | Employer |
| CAR-03 | Employer View Applications | Employer |
| CAR-04 | Professional Registration | Professional |
| PAY-02 | Service Payment Flow | Student |
| PAY-03 | Payment with Wallet Only | Student |
| PAY-04 | Payment Failure & Recovery | Student |
| **INT-05** | **Careers Employer Hire** | **Employer, Professional** |

### P3 ⚪ (Stretch)

| Flow ID | Description |
|---------|-------------|
| PROF-05 | View Course Revenue |
| ADM-07 | Service Tier Pricing |
| CAR-06 | Professional Bookmark Job |

## 🔴 INT-01: Admin Coupon → Student Purchase (KNOWN BROKEN)

**Doc**: `__tests__/docs/07-intertwined/01-admin-coupon-student-purchase.md`
**Cross-feature**: ADM-04 → ADM-05 → STU-01 → PAY-01

### Steps
1. `agent-browser open http://localhost:3000/auth/admin/signin --headed --auto-connect`
2. Login admin → `/admin/dashboard`
3. `/admin/commerce/coupons/new` — Create `TEST20`, PERCENTAGE 20%, all courses, max 100, valid 30 days
4. `/admin/wallet` — search `student1`, add 200 EGP
5. Sign out
6. `agent-browser open http://localhost:3000/auth/student/signin --headed --auto-connect`
7. Login student1 → `/student/dashboard`
8. `/courses` → pick course (e.g., 500 EGP) → "Enroll Now" → `/student/checkout?courseId=X`
9. Apply `TEST20` → Verify discount (-100 EGP), subtotal (400 EGP)
10. Check "Use wallet" → Verify wallet -200 EGP, remaining 200 EGP
11. "Complete Purchase" → PayMob redirect → Simulate payment success
12. **Verify**: Enrolled in course, wallet = 25 EGP (5% cashback), coupon usage = 1

### Known Bug: Coupon + Wallet Calculation
- Check: `finalTotal = coursePrice - couponDiscount - walletUsed`
- If wrong → investigate checkout backend (tRPC router or service layer)

### Failure Modes
- Coupon not applied (no discount shown after apply)
- Wallet not deducted correctly
- Coupon usage count not incremented
- PayMob redirect doesn't happen
- Cashback not credited to wallet
- Enrollment not created

## 🟠 INT-02: Full Course Lifecycle → Certificate

**Doc**: `__tests__/docs/07-intertwined/02-admin-course-professor-teach-student-learn.md`
**Cross-feature**: ADM-01 → PROF-04 → STU-01 → STU-02

### Steps
1. Admin login → `/admin/courses/new` → Create "Test Course - Full Lifecycle", 300 EGP, prof Dr. Ahmed
2. Add 3 lessons → Publish (DRAFT → PUBLISHED)
3. Professor login → `/professor/courses` → click course → "Add Quiz"
4. Create quiz: 3 questions (2 MCQ + 1 TF), passing 70% → Submit for Review
5. Admin login → `/admin/quizzes` → Approve quiz (PENDING → APPROVED)
6. Student login → Browse `/courses` → Enroll → Pay 300 EGP
7. `/student/courses/[slug]` → Complete all 3 lessons (Mark as Complete)
8. "Take Final Quiz" → Answer all correctly → Submit → 100%
9. **Verify**: Certificate generated with unique hash, PDF downloadable, course complete

### Critical Checks
- Quiz button hidden until all lessons complete and quiz approved
- Certificate has unique hash, not sequential ID
- PDF download returns correct MIME type

## 🟠 INT-03: Case & Dynamic Plan Lifecycle

**Doc**: `__tests__/docs/07-intertwined/03-admin-case-professor-plan.md`
**Cross-feature**: ADM-06 → PROF-02 → STU-04

### Steps
1. Admin login → `/admin/case-assignments` → New → student1, Nutrition Plan, Dr. Ahmed → Assign
2. Professor login → `/professor/cases` → sees new case → "Create Plan"
3. `/professor/dynamic-plans/plans/new` → "Weight Management - 4 Weeks", 28 days, add warehouse items
4. Student login → `/student/dynamic-plans/my-plans` → sees plan → click → day-by-day breakdown
5. Check off items → progress updates → day marks complete
6. **Verify**: All days completable, plan progress bar works, plan marks COMPLETED

### Edge Cases
- Empty warehouse → can't create plan
- Wrong student's plan → 404/access denied
- Case status not synced

## 🟠 INT-04: Full Service Lifecycle

**Doc**: `__tests__/docs/07-intertwined/04-student-service-lifecycle.md`
**Cross-feature**: STU-03 → PAY-02 → ADM-06 → PROF-02 → STU-04

### Steps
1. Student login → `/student/services` → Nutrition Plan Premium (800 EGP) → Buy
2. Fill form (age, weight, height, goal) → Submit → Pay 800 EGP
3. Status should go: PENDING → PAID
4. Admin login → `/admin/case-assignments` → New → student1, service, prof → Assign
5. Professor login → `/professor/cases` → Create Plan
6. Student login → `/student/dynamic-plans/my-plans` → View → Track
7. **Verify**: Form data persisted, admin sees purchase, plan has correct warehouse items

## 🟡 INT-05: Careers Employer Hire Lifecycle

**Doc**: `__tests__/docs/07-intertwined/05-careers-employer-hire-professional.md`
**Cross-feature**: CAR-01 → CAR-02 → CAR-04 → CAR-05 → CAR-03

### Steps (need fresh signups)
1. Employer: `/careers/employers/(auth)/register` → "Al Ahlam Sports Club"
2. `/careers/employers/post-job` → "Youth Football Coach"
3. Verify at `/careers/jobs`
4. Professional: `/careers/register` → "Ahmed Mahmoud" profile
5. `/careers/jobs` → Find job → "Apply Now" → cover letter submit
6. Employer: sign in → `/careers/employers/applications` → Review → Shortlist → Hire
7. **Verify**: Roles CAREERS_EMPLOYER/CAREERS_PROFESSIONAL, duplicate blocked, status SHORTLISTED → HIRED

## ⚠️ Common Mistakes

| Mistake | Why Bad | Fix |
|---------|---------|-----|
| Using `@ref` from old snapshot | Page changed, ref stale | Re-snapshot |
| Not checking URL after navigation | Page might not have moved | Always `agent-browser url` |
| Ignoring console errors | Hidden bugs accumulate | Always `console --json` |
| Clicking without waiting | Action on loading state | `wait 2` after navigation |
| Assuming data is there | API might have failed | Check `network requests --json` |
| Using headless | Auth sessions lost | Use `--headed --auto-connect` |
| Skipping a failing test | Bug goes unfixed | Investigate and fix |
| Using Playwright MCP | Breaks auth, wrong selectors | NEVER — use agent-browser only |

## 🧠 Human-Like Thinking Checklist

Before each action: **"Is this the right page? Is the element visible? Did my last action succeed?"**
After each action: **"Any errors? Did the page respond? Is the data fresh?"**
When something fails: **"STOP. Investigate. Read the error. Check git log. Fix before moving on."**

## 🔄 Ralph Loop / Auto-Fix Pattern

```bash
/ulw-loop — run this flow, fix all failures, keep going until 100% pass
```

The agent will:
1. agent-browser open → perform action → verify (url, console, errors, network, snapshot)
2. If error → investigate root cause → fix code → re-verify
3. Repeat until all steps in the flow pass

## Handoff File

`.opencode/handoffs/intertwined-testing-handoff.md` — Complete step-by-step guide for running all 5 intertwined flows.
