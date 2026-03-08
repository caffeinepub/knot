/**
 * WorkerMap — Interactive Leaflet map showing one pin per worker.
 * Uses OpenStreetMap Nominatim for geocoding (free, no API key).
 * Pins are colour-coded by skill and open a popup with the worker's name,
 * skill, badge, and a "View Profile" link.
 *
 * Leaflet is loaded from CDN at runtime (not bundled) to avoid
 * package.json / type dependency issues.
 */

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { User } from "../backend.d.ts";
import { getSkillEmoji } from "../utils/helpers";

// Declare a minimal Leaflet type so TS doesn't complain
declare global {
  interface Window {
    L?: LType;
  }
}

// Minimal type stubs for the Leaflet APIs we use
interface LType {
  map(el: HTMLElement, opts?: Record<string, unknown>): LMap;
  tileLayer(url: string, opts?: Record<string, unknown>): LLayer;
  marker(latlng: [number, number], opts?: Record<string, unknown>): LMarker;
  latLngBounds(a: [number, number][]): LBounds;
  divIcon(opts: Record<string, unknown>): unknown;
  Icon: {
    Default: {
      prototype: Record<string, unknown>;
      mergeOptions(opts: Record<string, unknown>): void;
    };
  };
  Marker: { new (...args: unknown[]): unknown };
}
interface LMap {
  addTo(m: LMap): void;
  setView(ll: [number, number], z: number): void;
  fitBounds(b: LBounds, opts?: Record<string, unknown>): void;
  eachLayer(fn: (l: LLayer) => void): void;
  removeLayer(l: LLayer): void;
  remove(): void;
  readonly _leaflet_id?: number;
}
interface LLayer {
  addTo(m: LMap): LLayer;
}
interface LMarker extends LLayer {
  bindPopup(html: string): LMarker;
}
interface LBounds {
  extend(ll: [number, number]): void;
  isValid(): boolean;
}

// ─── Leaflet CDN loader ───────────────────────────────────────────────────────

let leafletLoaded = false;

function loadLeaflet(): Promise<LType> {
  if (leafletLoaded && window.L) return Promise.resolve(window.L);

  return new Promise((resolve, reject) => {
    // CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // JS
    if (document.getElementById("leaflet-js")) {
      if (window.L) {
        leafletLoaded = true;
        resolve(window.L);
      }
      return;
    }
    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      if (window.L) {
        leafletLoaded = true;
        // Fix default icon paths (reset _getIconUrl to let mergeOptions work)
        // biome-ignore lint/performance/noDelete: required for Leaflet CDN icon patching
        delete (window.L.Icon.Default.prototype as Record<string, unknown>)
          ._getIconUrl;
        window.L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
        resolve(window.L);
      } else {
        reject(new Error("Leaflet failed to load"));
      }
    };
    script.onerror = () => reject(new Error("Leaflet script load error"));
    document.head.appendChild(script);
  });
}

// ─── Colour helpers ───────────────────────────────────────────────────────────

const SKILL_HUES: Record<string, number> = {
  carpenter: 30,
  tailor: 280,
  plumber: 200,
  potter: 20,
  electrician: 55,
  painter: 160,
  mason: 10,
  welder: 0,
  blacksmith: 240,
  cobbler: 90,
  barber: 320,
  chef: 45,
  driver: 185,
  farmer: 120,
};

function skillColour(skill: string): string {
  const key = skill.toLowerCase();
  for (const [k, hue] of Object.entries(SKILL_HUES)) {
    if (key.includes(k)) return `hsl(${hue},70%,45%)`;
  }
  return "hsl(220,60%,45%)";
}

function makeIcon(L: LType, skill: string): unknown {
  const colour = skillColour(skill);
  const emoji = getSkillEmoji(skill);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <path fill="${colour}" stroke="white" stroke-width="2"
        d="M18 2 C9.2 2 2 9.2 2 18 C2 29 18 42 18 42 S34 29 34 18 C34 9.2 26.8 2 18 2Z"/>
      <circle cx="18" cy="18" r="11" fill="white" opacity="0.95"/>
      <text x="18" y="22" font-size="13" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </svg>`;
  return L.divIcon({
    html: `<div style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.35))">${svg}</div>`,
    className: "",
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -46],
  });
}

// ─── Nominatim geocoding ──────────────────────────────────────────────────────

const geoCache = new Map<string, [number, number] | null>();

async function geocode(location: string): Promise<[number, number] | null> {
  const key = location.toLowerCase().trim();
  if (geoCache.has(key)) return geoCache.get(key)!;
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${location}, India`)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "en", "User-Agent": "KNOT-app/1.0" },
    });
    const data = await res.json();
    if (data.length > 0) {
      const coord: [number, number] = [
        Number.parseFloat(data[0].lat),
        Number.parseFloat(data[0].lon),
      ];
      geoCache.set(key, coord);
      return coord;
    }
  } catch {
    /* silently ignore */
  }
  geoCache.set(key, null);
  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WorkerMapProps {
  workers: User[];
  centre?: string;
  onClose: () => void;
  workersLabel: string;
  hideLabel: string;
  nearbyTitle: string;
  activeSkill?: string;
}

interface PinData {
  user: User;
  latlng: [number, number];
}

export function WorkerMap({
  workers,
  centre,
  onClose,
  workersLabel,
  hideLabel,
  nearbyTitle,
  activeSkill,
}: WorkerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const [pins, setPins] = useState<PinData[]>([]);
  const [geocoding, setGeocoding] = useState(true);
  const [leafletReady, setLeafletReady] = useState(false);

  // Load Leaflet from CDN
  useEffect(() => {
    loadLeaflet()
      .then(() => setLeafletReady(true))
      .catch(() => setLeafletReady(false));
  }, []);

  // Geocode all workers once
  useEffect(() => {
    let cancelled = false;
    setGeocoding(true);

    async function run() {
      const results: PinData[] = [];
      for (let i = 0; i < workers.length; i += 3) {
        const batch = workers.slice(i, i + 3);
        const coords = await Promise.all(batch.map((w) => geocode(w.location)));
        for (let j = 0; j < batch.length; j++) {
          if (coords[j]) results.push({ user: batch[j], latlng: coords[j]! });
        }
        if (cancelled) return;
        if (i + 3 < workers.length)
          await new Promise((r) => setTimeout(r, 600));
      }
      if (!cancelled) {
        setPins(results);
        setGeocoding(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [workers]);

  // Initialise Leaflet map
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || mapRef.current) return;
    const L = window.L!;
    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [leafletReady]);

  // Add/refresh markers
  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    if (!map || !L) return;

    map.eachLayer((layer: LLayer) => {
      if (layer instanceof (L.Marker as unknown as new () => LLayer)) {
        map.removeLayer(layer);
      }
    });

    if (pins.length === 0) return;

    const bounds = L.latLngBounds([]);
    for (const { user, latlng } of pins) {
      const marker = L.marker(latlng, { icon: makeIcon(L, user.skill) }).addTo(
        map,
      ) as LMarker;
      const badge =
        user.badgeLevel !== "None"
          ? `<span style="background:#fbbf24;color:#78350f;padding:1px 6px;border-radius:999px;font-size:11px;font-weight:600;">${user.badgeLevel}</span>`
          : "";
      marker.bindPopup(`
        <div style="min-width:160px;font-family:sans-serif;">
          <div style="font-weight:700;font-size:14px;margin-bottom:2px;">${user.name}</div>
          <div style="color:#6b7280;font-size:12px;margin-bottom:4px;">
            ${getSkillEmoji(user.skill)} ${user.skill} · 📍 ${user.location}
          </div>
          ${badge}
          <div style="margin-top:8px;">
            <a href="/profile/${user.id.toString()}"
               style="display:inline-block;background:#d97706;color:white;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;">
              View Profile
            </a>
          </div>
        </div>
      `);
      bounds.extend(latlng);
    }

    if (bounds.isValid())
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [pins]);

  // Pan to citizen's city
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !centre || pins.length === 0) return;
    geocode(centre).then((coord) => {
      if (coord) map.setView(coord, 10);
    });
  }, [centre, pins]);

  return (
    <div className="container mx-auto px-4 pt-6">
      <div className="rounded-2xl overflow-hidden border border-amber-200 shadow-md mb-6">
        {/* Header */}
        <div className="bg-amber-50 px-4 py-3 flex items-center justify-between border-b border-amber-200">
          <div className="flex items-center gap-2 flex-wrap">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-display font-semibold text-amber-900 text-sm">
              {nearbyTitle}
            </span>
            {activeSkill && activeSkill !== "All" && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-semibold text-white"
                style={{ backgroundColor: skillColour(activeSkill) }}
              >
                {getSkillEmoji(activeSkill)} {activeSkill}
              </span>
            )}
            <span className="text-amber-600 text-xs font-body">
              ({workers.length} {workersLabel})
            </span>
            {geocoding && workers.length > 0 && (
              <span className="text-amber-500 text-xs font-body animate-pulse">
                · locating…
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-amber-500 hover:text-amber-700 text-xs font-body underline transition-colors shrink-0"
          >
            {hideLabel}
          </button>
        </div>

        {/* Map canvas */}
        <div
          ref={mapContainerRef}
          className="w-full"
          style={{ height: 360 }}
          data-ocid="home.map.canvas_target"
        />

        {/* Legend chips */}
        {pins.length > 0 && (
          <div className="p-3 bg-white flex flex-wrap gap-2 border-t border-amber-100">
            {pins.map(({ user }) => (
              <a
                key={user.id.toString()}
                href={`/profile/${user.id.toString()}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-body text-amber-800 hover:bg-amber-100 transition-colors"
                data-ocid="home.map.map_marker"
              >
                <span>{getSkillEmoji(user.skill)}</span>
                <span className="font-medium">{user.name}</span>
                <span className="text-amber-400">·</span>
                <span>{user.location}</span>
              </a>
            ))}
          </div>
        )}

        {!geocoding && pins.length === 0 && workers.length > 0 && (
          <div className="p-4 text-center text-amber-600 text-xs font-body italic bg-white">
            Could not locate workers on map — location names may be too
            specific.
          </div>
        )}
      </div>
    </div>
  );
}
