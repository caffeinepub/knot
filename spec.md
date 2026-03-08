# KNOT – Manual Deploy Conversion

## Current State
Full-stack app on Caffeine/ICP with:
- Motoko backend (ICP canister) with all data models: User, Citizen, LearningRequest, CertificationResult, PracticalVideoSubmission, WorkerCredential, CitizenCredential, VideoEntry
- React + TypeScript + Tailwind CSS frontend using ICP actor calls via `useActor()` hook
- All business logic: auth (worker/citizen/admin), video upload (IndexedDB + base64 + ICP backend), peer certification flow (MCQ test → practical video → admin approval → certificate), endorsements, learning requests, notifications, multilingual (5 languages), Leaflet map, voice search, pop-up ads, admin dashboard

## Requested Changes (Diff)

### Add
- `/backend` folder: Node.js + Express server (`server.js`) with all API endpoints matching Motoko logic
- `/backend/db.json`: flat-file mock database storing all runtime data
- `/backend/routes/`: separate route files for users, citizens, certification, admin
- `/backend/utils/`: badge calculation, ranking, hash helpers
- CORS support so frontend can call the backend
- `/backend/package.json` with Express, cors, fs dependencies
- Vite proxy config in frontend so `API_BASE_URL` works in dev and production
- New `src/frontend/src/utils/api.ts`: thin REST client replacing `useActor()` and `backend.d.ts` ICP calls
- Frontend environment variable `VITE_API_URL` to configure backend URL

### Modify
- `src/frontend/src/hooks/useActor.ts` → replaced with a no-op / stub (actor is gone, API calls go through api.ts)
- `src/frontend/src/hooks/useQueries.ts` → replace all `actor.*` calls with `api.*` REST calls
- `src/frontend/src/pages/LoginPage.tsx` → replace `actor.registerWorker`, `actor.loginWorker`, `actor.loginCitizen`, `actor.loginAdmin`, `actor.findWorkerByName`, `actor.findCitizenByName`, `actor.saveWorkerVideo` with `api.*` equivalents
- `src/frontend/src/pages/WorkerDashboardPage.tsx` → replace actor calls with api calls
- `src/frontend/src/pages/ProfilePage.tsx` → replace actor calls with api calls
- `src/frontend/src/pages/AdminDashboardPage.tsx` → replace actor calls with api calls
- `src/frontend/src/pages/CertificationTestPage.tsx` → replace actor calls with api calls
- `src/frontend/src/pages/CertificatePage.tsx` → replace actor calls with api calls
- `src/frontend/src/App.tsx` → remove AppInitializer ICP clear logic, remove useActor import
- `src/frontend/src/backend.d.ts` + `src/frontend/src/backend.ts` → replace with REST types
- All `bigint` IDs in frontend converted to `number` (Express JSON doesn't handle bigint)
- `vite.config.js` → add proxy for `/api` to localhost:3001 in dev
- Root `package.json` → add scripts to run both backend + frontend

### Remove
- `useActor` / ICP actor integration
- `src/frontend/src/hooks/useInternetIdentity.ts` (ICP-specific)
- `src/frontend/src/declarations/` folder (ICP-generated)
- `AppInitializer` component that called `actor.clearAllData()` on ICP
- All `BigInt()` conversions (backend uses plain numbers)

## Implementation Plan
1. Create `/backend/package.json`, `/backend/server.js`, `/backend/db.json`, route files, utils
2. Replace `backend.d.ts` with plain TS types (number instead of bigint)
3. Create `src/frontend/src/utils/api.ts` with all REST call wrappers
4. Replace `useActor` hook with a stub / remove ICP dependencies
5. Update `useQueries.ts` to use api.ts instead of actor
6. Update all pages (Login, WorkerDashboard, Profile, Admin, CertificationTest, Certificate)
7. Update `App.tsx` to remove AppInitializer and ICP imports
8. Update `vite.config.js` with proxy
9. Update root `package.json` with concurrently dev/start scripts
10. Validate build passes
