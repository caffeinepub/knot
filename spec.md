# KNOT

## Current State
- Full-stack vocational platform with worker profiles, endorsements, certification test, multilingual support
- Backend has 10 hardcoded fake workers (Ravi Kumar, Sunita Devi, etc.) that always appear regardless
- Worker registration stores blob:// URLs in the backend which expire on page refresh, making newly registered workers lose their video
- Search on the home page filters the in-memory list but fake workers always show
- The "Nearby Search" filter works only if distance is stored; newly registered workers get distance=0 (always within 5km)
- No backend search function — all filtering done client-side after fetching all users

## Requested Changes (Diff)

### Add
- `searchUsers(query: Text): [User]` backend function that returns users matching name OR skill (case-insensitive substring match)
- `distance` parameter to `registerWorker` so workers can enter their approximate distance from city center when registering

### Modify
- Remove ALL 10 hardcoded fake workers from backend — `var users` starts empty
- Worker registration: if uploaded video is a local file (blob://), store empty string `""` in backend instead; store the blob URL only in localStorage for same-session preview
- `nextUserId` starts at 1 (was 11 due to fake data)
- Frontend home page: show "No workers registered yet" when feed is empty instead of showing fake data
- Frontend worker registration form: add a distance/location-radius input (optional, defaults to 5) so workers can be found by nearby search
- Frontend search: use `searchUsers` backend call for name/skill search instead of only client-side filter
- Frontend nearby filter: properly filter by distance stored in each worker's profile

### Remove
- All 10 hardcoded sample worker records from `main.mo`

## Implementation Plan
1. Regenerate backend Motoko with empty users array, searchUsers function, distance param in registerWorker
2. Update LoginPage worker registration: pass distance field to registerWorker; store blob URL locally only, pass "" to backend
3. Update useQueries.ts: use searchUsers backend call for text search
4. Update HomePage: empty state message only, no fallback to fake data
