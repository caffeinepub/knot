# KNOT - SkillReel

## Current State
Full-stack vocational worker platform. Workers register with name, skill, location, bio, video. Citizens search for workers. Features: endorsements, certifications, learning requests, community pages, multilingual support (EN/TE/HI/ML/KN), voice search, notifications, nearby filter.

Backend uses `var users` (non-stable) which resets on canister upgrades. Pre-seed data of 10 fake workers was used. The `getAllUsers` call fails in some browser environments causing "Unable to load professionals" error. Search is client-side only on loaded data.

## Requested Changes (Diff)

### Add
- `stable var` for all storage (users, citizens, learningRequests, certificationResults, counters) so data persists across upgrades
- `contactNumber: Text` field in User type
- `searchUsers(query: Text)` backend function - case-insensitive partial match on name, skill, location - returns sorted results
- `searchNearby(skill: Text, maxDistance: Nat)` backend function - filter by skill + distance, sorted by rank
- `registerWorkerFull(name, skill, location, bio, videoURL, contactNumber)` function
- `getWorkerCount()` function
- Frontend: contact number input in worker registration form
- Frontend: search now calls backend `searchUsers` API with debounce for real-time results
- Frontend: nearby filter calls `searchNearby` backend API
- Frontend: stats on homepage load from real worker count

### Modify
- Remove ALL hardcoded/seed fake worker data from backend - start with empty `users = []`
- `getAllUsers` uses `Array.sort` instead of `.sort()` for compatibility
- `getUsersBySkill` uses case-insensitive matching
- All array operations use `Array.filter`, `Array.map`, `Array.append`, `Array.find` instead of method syntax
- Frontend `useQueries.ts`: add `useSearchUsers` and `useSearchNearby` hooks
- Frontend `HomePage.tsx`: wire search bar to backend search, show empty state with "Register as worker to appear here" message when no workers

### Remove
- All 10 hardcoded seed workers from backend
- Client-side-only filtering (replace with backend queries where appropriate)

## Implementation Plan
1. Generate new Motoko backend with stable storage, searchUsers, searchNearby, contactNumber field, no seed data
2. Update frontend hooks to add useSearchUsers and useSearchNearby
3. Update HomePage to use backend search with debounce
4. Update LoginPage worker registration form to include optional contact number field
5. Update UserCard to show contact number for citizen view
