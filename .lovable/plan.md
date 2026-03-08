

# Plan: Fix App Flow and Protocol Generation

## Problem Analysis

Two issues identified:

1. **Broken flow**: Onboarding is NOT a protected route, so users complete it without being logged in. Profile data never reaches the database, and the `generate-protocol` Edge Function is never called (confirmed: zero invocation logs — only boot/shutdown).

2. **Dashboard is a redirect**: Currently just redirects to `/protocol`, not a real page.

## Root Cause

When a non-authenticated user completes onboarding:
- `handleComplete` in Onboarding.tsx checks `if (user)` — user is null
- Profile is stored in memory only (Zustand), never saved to DB
- User goes to `/auth`, signs up, but Auth.tsx only calls `generateRuleBasedProtocol` (not the AI one)
- After login, Protocol.tsx tries to load from DB (nothing there) and generate from store (store may be empty after page refresh)

## Desired Flow

```text
Landing → Auth (login/signup) → Onboarding (protected) → Dashboard (real page) → Protocol
```

## Changes

### 1. Make Onboarding a protected route (`src/App.tsx`)
- Wrap `/onboarding` in `<ProtectedRoute>`
- Update Landing.tsx CTAs to navigate to `/auth` instead of `/onboarding`

### 2. Fix ProtectedRoute (`src/components/ProtectedRoute.tsx`)
- Allow onboarding access for authenticated users who haven't completed it
- Redirect to `/dashboard` (not `/protocol`) after onboarding

### 3. Fix Onboarding completion (`src/pages/Onboarding.tsx`)
- Since user is now always authenticated, `handleComplete` always has `user`
- Navigate to `/dashboard` after completion instead of `/protocol`
- Ensure AI protocol generation is called

### 4. Restore Dashboard as real page (`src/pages/Dashboard.tsx`)
- Show a summary/overview with user greeting
- Show protocol status (generated or generating)
- Button to view full protocol at `/protocol`
- Button to regenerate protocol

### 5. Fix Auth redirect (`src/pages/Auth.tsx`)
- After login: redirect to `/dashboard` if onboarding complete, `/onboarding` if not
- After signup: redirect to `/onboarding`

### 6. Fix protocol generation reliability
- Add better error logging in `generateAIProtocol`
- If Protocol.tsx has no protocol and no store profile, load profile from DB directly as fallback
- Ensure `loadOrGenerate` in Protocol.tsx fetches profile from DB if store is empty

## Files Modified
- `src/App.tsx` — make onboarding protected
- `src/components/ProtectedRoute.tsx` — fix redirect logic
- `src/pages/Landing.tsx` — CTAs point to `/auth`
- `src/pages/Auth.tsx` — fix redirects
- `src/pages/Onboarding.tsx` — navigate to `/dashboard`
- `src/pages/Dashboard.tsx` — real dashboard page with protocol status
- `src/pages/Protocol.tsx` — fallback to load profile from DB if store is empty

