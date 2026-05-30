---
name: alostaz-setup-workflow
description: MUST LOAD before ANY testing work. Covers Windows/PowerShell-specific dev environment setup for Sportology (Edrak): Chrome remote debugging, persistent dev server, agent-browser connection setup, and common Windows pitfalls. Prevents the setup-loops that waste time.
argument-hint: describe what needs to be set up (e.g., "start dev server and Chrome for INT-01 testing", "verify database is seeded", "setup complete environment")
---

# Edrak Setup Workflow — Windows/PowerShell Dev Environment

> **Environment**: Windows 10/11, PowerShell 5.1
> **Framework**: Next.js 15 (App Router) + pnpm
> **Testing**: agent-browser CLI (NOT Playwright MCP)
> **Project root**: `D:\clones\edrak`

## 🚨 CRITICAL: PowerShell != Bash

Every command in this skill is written for **Windows PowerShell 5.1**. Do NOT use bash/linux patterns.

| Bash Pattern | PowerShell Equivalent | Why |
|---|---|---|
| `cmd1 && cmd2` | `cmd1; if ($?) { cmd2 }` | PowerShell doesn't support `&&` |
| `cmd1; cmd2` | `cmd1; cmd2` | `;` works same in both |
| `cd dir && pnpm dev` | Use `-WorkingDirectory` param or `cd dir; pnpm dev` | `cd` + `&&` doesn't work |
| `export VAR=val` | `$env:VAR = "val"` | Environment variables are different |
| `Start-Process` | `Start-Process` | Works, but cannot run `.ps1` scripts directly (use `powershell.exe`) |

## 🔴 GOLDEN RULE: Dev Server + Chrome Setup Sequence

This sequence MUST be followed exactly. Deviating causes the frustrating loops.

### Step 1: Kill Everything First

```powershell
# Kill ALL Chrome processes (user must confirm they're okay with this)
Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force

# Also kill any previous pnpm dev servers
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.StartTime -gt (Get-Date).AddHours(-1) } | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait for clean slate
Start-Sleep -Seconds 3
```

**Why**: Chrome with `--remote-debugging-port` only binds the port when it's the FIRST instance launched. If Chrome is already running, the flag is silently forwarded to the existing process and ignored.

### Step 2: Start Dev Server (PERSISTENT)

Dev server MUST be launched in a **persistent window** — it cannot be a foreground command that gets killed when the shell times out.

```powershell
# ✅ CORRECT: Opens a new cmd window that stays open
Start-Process -FilePath "cmd.exe" -ArgumentList "/c start ""Edrak Dev"" cmd /k cd /d D:\clones\edrak && pnpm run dev"

# Wait for it to be ready (Next.js takes ~5-15s)
Start-Sleep -Seconds 15

# Verify
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Where-Object State -eq "Listen"
try { Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing } catch { "NOT_READY" }
```

**DO NOT** use `pnpm run dev` directly in the shell tool — it will be killed when the tool times out.

**DO NOT** use `Start-Process -FilePath "pnpm" ...` — pnpm is a PowerShell script (.ps1), not an executable.

### Step 3: Launch Chrome with Remote Debugging

```powershell
# Kill ALL existing Chrome first (required for --remote-debugging-port to work)
Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# ✅ CORRECT: Launch with explicit user data dir and debugging port
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList `
    "--remote-debugging-port=9222", `
    "--user-data-dir=C:\Users\omara\AppData\Local\Google\Chrome\User Data", `
    "--no-first-run", `
    "--new-window", `
    "about:blank"

# Wait for Chrome to initialize
Start-Sleep -Seconds 8

# Verify CDP endpoint is responsive
try {
    $cdp = Invoke-WebRequest -Uri "http://localhost:9222/json/version" -TimeoutSec 5 -UseBasicParsing
    Write-Output "CHROME_READY: Chrome/$($cdp.Browser)"
} catch {
    Write-Output "CHROME_NOT_READY: $_"
}
```

**Common failure**: Port 9222 not listening even though Chrome launched with the flag. This happens if Chrome was already running when you launched the second instance. Kill ALL Chrome and retry.

### Step 4: Verify agent-browser Connection

```powershell
# Test that agent-browser can connect
agent-browser --auto-connect open http://localhost:3000 --headed

# Close daemon if reconfig needed
agent-browser close --all
```

### Step 5: Quick DB Seed Check (Optional)

```powershell
# Hit a page that requires DB data
$res = Invoke-WebRequest -Uri "http://localhost:3000/auth/admin/signin" -TimeoutSec 5 -UseBasicParsing
Write-Output "Page loaded: $($res.StatusCode) ($($res.Content.Length) bytes)"
```

---

## 🚀 agent-browser Execution Patterns

### Use BATCH for Multi-Command Sequences

```powershell
# ✅ CORRECT: Use batch for sequential commands (avoids shell splitting issues)
agent-browser batch --bail "fill @e19 admin" "fill @e20 Password123!" "click @e11" "wait 3000"

# ❌ WRONG: Sequential standalone commands may have parsing issues
agent-browser click @e43  # May fail with "Missing arguments"
```

### Snapshot Before Every Action

Refs can shift when DOM changes (e.g., after a form submission error adds/removes elements).

```powershell
agent-browser snapshot -i  # ALWAYS re-snapshot before interacting
agent-browser click @eX    # Use the FRESH ref, not a ref from 3 commands ago
```

### Verification After Every Action

```powershell
agent-browser get url                    # Navigated where expected?
agent-browser errors --json              # Any JS errors?
agent-browser console --json             # Console errors/warnings?
agent-browser network requests --json    # API calls successful?
agent-browser snapshot -i                # Page looks correct?
```

### Full Workflow Example

```powershell
# Open page
agent-browser --auto-connect open http://localhost:3000/auth/admin/signin --headed

# Login
agent-browser batch --bail "fill @e19 admin" "fill @e20 Password123!" "click @e11" "wait 3000"

# Verify
agent-browser get url        # Should be /admin
agent-browser errors --json  # Should be empty
agent-browser snapshot -i    # Dashboard visible
```

---

## ⚠️ Common Windows Pitfalls

### 1. `&&` doesn't work
PowerShell DOES NOT support `&&`. Use `;` (always execute) or `; if ($?) { }` (conditional).

### 2. `Start-Process` can't run `.ps1` scripts
pnpm, npx, and many Node tools are `.ps1` scripts. Use `Start-Process powershell.exe -ArgumentList "-Command pnpm dev"` or use `cmd /c start cmd /k pnpm dev`.

### 3. Chrome remote debugging port not binding
If Chrome was already running when you launched with `--remote-debugging-port`, the port won't bind. Kill ALL Chrome processes and retry.

### 4. agent-browser `--auto-connect` fails
Same root cause as #3. Chrome must have been launched WITH `--remote-debugging-port` for auto-connect to find it.

### 5. Snapshot refs shift between calls
Refs are assigned based on DOM position. If the DOM changes (e.g., a form validation error message appears), ALL refs after the change shift. Always re-snapshot.

### 6. Dev server killed after timeout
`pnpm run dev` is a long-running process. When the shell tool times out (default 120s), the process is killed. Launch in a persistent window instead.

### 7. Tab/window issues with agent-browser daemon
If agent-browser daemon was started with specific flags, it ignores flags on subsequent commands. Use `agent-browser close --all` to restart fresh.

---

## 📋 Quick Setup Reference (Copy-Paste)

Use this exact sequence to get running:

```powershell
# 1. Kill everything
Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# 2. Start dev server (persistent window)
Start-Process -FilePath "cmd.exe" -ArgumentList "/c start ""Edrak Dev"" cmd /k cd /d D:\clones\edrak && pnpm run dev"
Start-Sleep -Seconds 15

# 3. Launch Chrome with remote debugging
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--remote-debugging-port=9222", "--user-data-dir=C:\Users\omara\AppData\Local\Google\Chrome\User Data", "--no-first-run", "--new-window", "about:blank"
Start-Sleep -Seconds 8

# 4. Verify
$dev = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Where-Object State -eq "Listen"
$cdp = Get-NetTCPConnection -LocalPort 9222 -ErrorAction SilentlyContinue | Where-Object State -eq "Listen"
if ($dev -and $cdp) { Write-Output "✅ READY: Dev=3000 ChromeCDP=9222" } else { Write-Output "❌ FAILED" }
```

---

## 🔄 Recovery From Common Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ERR_CONNECTION_REFUSED` | Dev server down | Restart dev server (sequence above) |
| `No running Chrome instance found` | No debug port | Kill Chrome → relaunch with `--remote-debugging-port=9222` |
| `Missing arguments for: click` | Shell arg parsing | Use `agent-browser batch` instead |
| `⚠ --headed ignored: daemon already running` | Daemon has config stale | `agent-browser close --all` then retry |
| Page shows old data | No refresh | `agent-browser reload` or navigate away and back |
| Spinbutton value not updating | `fill` may not work on number inputs | Use `agent-browser batch "click @eX"` to increment/decrement instead |
