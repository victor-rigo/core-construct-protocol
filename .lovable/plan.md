

# Plan: Fix Auth Loading Deadlock

## Problem
The app is stuck on the "KOR" loading spinner. The root cause is a race condition in `AuthContext.tsx`: the `onAuthStateChange` callback uses `await loadProfile(...)`, which can block the auth event processing and prevent `setLoading(false)` from being called reliably.

The session replay confirms: user clicks a CTA on Landing, gets redirected to a ProtectedRoute, which shows the loading spinner forever because `loading` never becomes `false`.

## Solution
Rewrite `AuthContext.tsx` following the recommended pattern: call `getSession()` first to restore the session, mark as ready, then subscribe to `onAuthStateChange` for subsequent changes without awaiting async operations inside the callback.

## Changes

### 1. Rewrite `src/contexts/AuthContext.tsx`
- Remove `await` from inside `onAuthStateChange` callback (causes deadlock)
- Use `getSession()` as the primary initialization path
- Fire-and-forget `loadProfile` in `onAuthStateChange`
- Add a timeout safety net (5s) to guarantee `loading` becomes `false`

### 2. Verify `src/pages/Landing.tsx` CTAs
- Ensure CTA buttons navigate to `/auth` (not a protected route directly)

## Files Modified
- `src/contexts/AuthContext.tsx` — fix auth initialization race condition

