# KNOT

## Current State
Full-stack vocational skills platform with Motoko backend and React frontend. Features: dual login (citizen/worker), worker registration with skill/bio/video, home feed, profile pages, community pages, certification test, certificate display, multilingual support (5 languages), voice search, notifications, nearby filter, endorsements (worker-only), learning requests, badge system.

**Known bug**: Registration (both citizen and worker) fails with "Registration failed. Please try again." error because the `actor` from `useActor` hook is `null` when the form is submitted -- the ICP actor takes a moment to initialize asynchronously, but the form doesn't wait for it.

## Requested Changes (Diff)

### Add
- Loading state on login page that blocks form submission until actor is ready
- Auto-retry mechanism: when actor is null on submit, wait up to 5 seconds for it to become available before showing error
- Visual indicator on login page showing "Connecting to network..." when actor is initializing

### Modify
- `LoginPage.tsx`: replace immediate `actor` null check with a wait/retry loop that polls for the actor up to 5 times with 1-second delays before giving up
- Both `handleCitizenSubmit` and `handleWorkerSubmit` should use the retry approach
- Disable submit buttons while actor is still loading (show spinner + "Connecting..." text)

### Remove
- Nothing removed

## Implementation Plan
1. Update `LoginPage.tsx` to add actor polling/retry logic in both submit handlers
2. Add loading indicator when actor is initializing (disable buttons with "Connecting..." state)
3. The actor is available via `useActor()` which returns `{ actor, isFetching }` -- use `isFetching` to show connecting state on buttons
