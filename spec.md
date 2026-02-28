# KNOT

## Current State
Full-stack vocational networking app with worker/citizen login, video portfolios (stored in IndexedDB), peer endorsements, trust badge system, multilingual support (EN/TE/HI/ML/KN), voice search, skill certification test, and certificate generation. Backend is Motoko on ICP.

## Requested Changes (Diff)

### Add
- `findWorkerByName(name: Text, skill: Text)` backend query to look up existing worker by name + skill for re-login
- `findCitizenByName(name: Text)` backend query to look up existing citizen by name for re-login
- Multilingual question banks for the certification test (TE, HI, ML, KN translations of all 9 MCQ questions and options + practical task description)
- Worker name stored in IndexedDB mapped to their backend ID, so video can be retrieved correctly when re-logging in

### Modify
- **LoginPage**: on "Register as Worker" / "Enter as Citizen" — first check if a worker/citizen with the same name already exists (via new backend lookup), and if so, re-use that profile ID instead of creating a duplicate. Show "Welcome back!" toast for returning users.
- **CertificationTestPage**: `getQuestionBank()` now accepts both `skill` AND `lang` parameters and returns translated questions/options/practical descriptions for TE, HI, ML, KN. The `speakText` call already reads in the selected language — questions must be in that language too.
- **WorkerDashboardPage / ProfilePage**: When looking up the video in IndexedDB, also check a `knot_worker_name_index` key in localStorage that maps `workerName → workerId`, so re-logins retrieve the correct video.

### Remove
- Nothing removed

## Implementation Plan
1. Add `findWorkerByName` and `findCitizenByName` query functions to `main.mo`
2. Update `backend.d.ts` to expose the new functions
3. Update `LoginPage.tsx`: before registering, call `searchUsers(name)` / `findCitizenByName(name)` to check for existing profile; if found, set that ID and skip registration
4. Update `CertificationTestPage.tsx`: add full TE/HI/ML/KN translations of question text and options; pass `lang` into `getQuestionBank`
5. Update `LoginPage.tsx` + `WorkerDashboardPage.tsx` + `ProfilePage.tsx`: store/retrieve a `workerName → id` mapping in localStorage so the right video is fetched after re-login
