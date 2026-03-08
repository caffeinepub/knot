# KNOT — Skills • Trust • Community

A full-stack vocational networking platform with video portfolios, peer endorsements, trust badges, and certification.

## Local Development

### 1. Start the Backend

```bash
cd backend
npm install
npm start
# Runs on http://localhost:3001
```

### 2. Start the Frontend

```bash
cd src/frontend
npm install
npm run dev
# Runs on http://localhost:5173
# /api requests are proxied to localhost:3001 automatically
```

Open http://localhost:5173 in your browser.

---

## Production Deployment

### Backend → Render.com (Free Tier)

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repository
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
4. Note the deployed URL, e.g. `https://knot-backend.onrender.com`

### Frontend → Netlify / Vercel (Free Tier)

```bash
cd src/frontend
VITE_API_URL=https://knot-backend.onrender.com/api npm run build
```

Then deploy the `src/frontend/dist/` folder to Netlify or Vercel as a static site.

---

## Admin Access

- URL: `/admin`
- Username: `admin`
- Password: `knot@admin2026`

---

## Environment Variables

### Frontend (.env or build-time)

| Variable | Description | Default |
|---|---|---|
| `VITE_USE_MOCK` | Enable REST API mode (always true) | `true` |
| `VITE_API_URL` | Backend API base URL | `/api` (dev proxy) |

### Backend

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3001` |

---

## Features

- Dual login: Citizens and Workers
- Video-based skill portfolios (stored as base64 on server)
- Peer endorsement system with Bronze/Silver/Gold badges
- 10-question skill certification tests (MCQ + practical video)
- Admin approval workflow for practical video review
- Voice search (Web Speech API — Chrome/Edge)
- Google Maps integration via Leaflet + OpenStreetMap
- 5-language support (English, Telugu, Hindi, Malayalam, Kannada)
- Real-time notifications (localStorage bell)
- Propeller Ads integration (replace Zone ID in `PopupAd.tsx`)
