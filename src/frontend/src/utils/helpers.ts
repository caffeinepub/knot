import type { User } from "../backend.d.ts";

export function getRankScore(user: User): number {
  return Number(user.trustScore) * 2 + Number(user.endorsementCount);
}

export function sortByRank(users: User[]): User[] {
  return [...users].sort((a, b) => getRankScore(b) - getRankScore(a));
}

export function getSkillThumbClass(skill: string): string {
  const lower = skill.toLowerCase();
  if (lower.includes("carpenter")) return "thumb-carpenter";
  if (lower.includes("tailor")) return "thumb-tailor";
  if (lower.includes("plumber")) return "thumb-plumber";
  if (lower.includes("potter")) return "thumb-potter";
  if (lower.includes("electrician")) return "thumb-carpenter";
  if (lower.includes("painter")) return "thumb-tailor";
  if (lower.includes("mason")) return "thumb-default";
  if (lower.includes("welder")) return "thumb-plumber";
  if (lower.includes("blacksmith")) return "thumb-default";
  if (lower.includes("cobbler")) return "thumb-potter";
  if (lower.includes("barber")) return "thumb-tailor";
  if (lower.includes("chef")) return "thumb-carpenter";
  if (lower.includes("driver")) return "thumb-default";
  if (lower.includes("farmer")) return "thumb-potter";
  return "thumb-default";
}

export function getSkillEmoji(skill: string): string {
  const lower = skill.toLowerCase();
  if (lower.includes("carpenter")) return "🪵";
  if (lower.includes("tailor")) return "🧵";
  if (lower.includes("plumber")) return "🔧";
  if (lower.includes("potter")) return "🏺";
  if (lower.includes("electrician")) return "⚡";
  if (lower.includes("painter")) return "🎨";
  if (lower.includes("mason")) return "🧱";
  if (lower.includes("welder")) return "🔩";
  if (lower.includes("blacksmith")) return "⚒️";
  if (lower.includes("cobbler")) return "👞";
  if (lower.includes("barber")) return "✂️";
  if (lower.includes("chef")) return "👨‍🍳";
  if (lower.includes("driver")) return "🚗";
  if (lower.includes("farmer")) return "🌾";
  return "⚒️";
}

export function getBadgeConfig(badge: string): {
  label: string;
  className: string;
  icon: string;
} | null {
  switch (badge) {
    case "Bronze":
      return {
        label: "Bronze",
        className: "bg-amber-100 text-amber-800 border-amber-300",
        icon: "🥉",
      };
    case "Silver":
      return {
        label: "Silver",
        className: "bg-slate-100 text-slate-700 border-slate-300",
        icon: "🥈",
      };
    case "Gold":
      return {
        label: "Gold",
        className: "bg-yellow-100 text-yellow-800 border-yellow-400",
        icon: "🥇",
      };
    default:
      return null;
  }
}

export function formatTimestamp(ts: bigint): string {
  // Motoko timestamps are in nanoseconds
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const SKILL_CATEGORIES = [
  "All",
  "Carpenter",
  "Tailor",
  "Plumber",
  "Potter",
  "Electrician",
  "Painter",
  "Mason",
  "Welder",
  "Blacksmith",
  "Cobbler",
  "Barber",
  "Chef",
  "Driver",
  "Farmer",
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const DISTANCE_OPTIONS = [
  { labelKey: "dist_any" as const, value: "all" },
  { labelKey: "dist_5km" as const, value: "5" },
  { labelKey: "dist_10km" as const, value: "10" },
  { labelKey: "dist_20km" as const, value: "20" },
];

export function getTranslatedSkillName(
  skill: string,
  t: (key: any) => string,
): string {
  const map: Record<string, string> = {
    All: "skill_all",
    Carpenter: "skill_carpenter",
    Tailor: "skill_tailor",
    Plumber: "skill_plumber",
    Potter: "skill_potter",
    Electrician: "skill_electrician",
    Painter: "skill_painter",
    Mason: "skill_mason",
    Welder: "skill_welder",
    Blacksmith: "skill_blacksmith",
    Cobbler: "skill_cobbler",
    Barber: "skill_barber",
    Chef: "skill_chef",
    Driver: "skill_driver",
    Farmer: "skill_farmer",
  };
  const key = map[skill];
  return key ? t(key) : skill;
}
