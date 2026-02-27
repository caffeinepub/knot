# KNOT – Feature Updates v11

## Current State

KNOT is a full-stack vocational skills platform on ICP with:
- Dual login (Citizen / Worker roles stored in localStorage)
- Home feed with voice search, skill tabs, distance filter
- Worker ProfilePage with endorse + request-to-learn buttons (shown for ALL roles)
- Notification icon: absent
- Share Profile button: absent
- Name-based search: exists in VoiceSearch bar but only filters by skill/name/location — not prominently labelled as "name search"
- Video autoplay on profile: absent (manual play only)
- Endorsement role gating: absent (both citizens and workers see the endorse button)
- Citizen-specific profile view: absent (same view for all roles)
- Nearby Workers filter: exists (distance dropdown) but not labelled "Nearby Workers"
- Notifications (endorsements, learning requests, profile views): absent
- Mock data: 10 pre-seeded workers in Motoko backend; no dummy/fake DB logic outside backend

## Requested Changes (Diff)

### Add
- **Share Profile button** on ProfilePage: copies `window.location.href` to clipboard, shows a toast confirmation
- **Notification icon** in Navbar (bell icon) with a count badge; mock notifications for new endorsements, learning requests, and profile views stored in React state/localStorage
- **Name search** on HomePage: make the existing search bar prominent for name-based search (label update, search by name prioritised)
- **Auto-play video** on ProfilePage: video element uses `autoPlay muted` attributes; YouTube embeds get `?autoplay=1&mute=1` query params
- **Nearby Workers filter label**: rename distance dropdown label to "Nearby Workers" for citizen users

### Modify
- **Endorsement visibility**: hide the Endorse button entirely when `authUser.role === "citizen"`; citizens only see Request to Learn
- **Citizen view mode on ProfilePage**: when `authUser.role === "citizen"`, show a simplified view with: skill video, trust badge, bio, contact number (mock: `+91 98XXX XXXXX`), and Request to Learn button only — hide endorsement stats panel and badge progress section
- **VoiceSearch / search bar**: add explicit "Search by name" placeholder and label for citizens
- **Navbar**: add bell notification icon with badge count; clicking opens a dropdown panel listing mock notifications

### Remove
- No features to remove; mock data in backend stays as-is (it is the only data source)

## Implementation Plan

1. **NotificationsContext** – Create `src/contexts/NotificationsContext.tsx` with mock notifications (3–5 items: endorsement received, learning request from citizen, profile viewed). Expose `notifications`, `unreadCount`, and `markAllRead`.

2. **Navbar update** – Import Bell icon from lucide-react. Add notification icon button with red badge showing `unreadCount`. Clicking shows a DropdownMenu with notification items and a "Mark all read" action.

3. **ProfilePage – Share Profile button** – Add a "Share Profile" button next to Back link. On click: `navigator.clipboard.writeText(window.location.href)` + `toast.success("Link copied!")`.

4. **ProfilePage – Auto-play video** – For `<video>` elements add `autoPlay muted playsInline controls`. For YouTube iframes update src to include `?autoplay=1&mute=1`.

5. **ProfilePage – Endorsement role gating** – Wrap the Endorse button in `{authUser?.role !== 'citizen' && ...}`. When citizen: show only video, trust badge chip, bio section, mock contact number, and Request to Learn button. Hide badge progress, stats grid, and endorse button.

6. **HomePage – Search label** – Update `search_placeholder` to mention name search; add a small label "Search by name or skill" above the search bar for citizens.

7. **Translations** – Add new translation keys: `profile_share`, `profile_share_copied`, `profile_contact`, `notif_title`, `notif_mark_read`, `notif_empty` to all 5 language objects.

8. **Nearby Workers label** – In the distance dropdown trigger, show "Nearby Workers" label for citizens; keep existing label for workers.
