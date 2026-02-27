import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronRight, MapPin, Play, Star, ThumbsUp } from "lucide-react";
import type { User } from "../backend.d.ts";
import {
  getBadgeConfig,
  getSkillEmoji,
  getSkillThumbClass,
} from "../utils/helpers";

interface UserCardProps {
  user: User;
  index?: number;
}

export function UserCard({ user, index = 0 }: UserCardProps) {
  const badge = getBadgeConfig(user.badgeLevel);
  const thumbClass = getSkillThumbClass(user.skill);
  const emoji = getSkillEmoji(user.skill);
  const staggerClass = index < 4 ? `animate-stagger-${(index % 4) + 1}` : "";

  return (
    <article
      className={`bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 group animate-slide-up ${staggerClass}`}
    >
      {/* Video thumbnail */}
      <div className={`relative h-44 ${thumbClass} overflow-hidden`}>
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 176"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id={`grid-${user.id}`}
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="200" height="176" fill={`url(#grid-${user.id})`} />
          </svg>
        </div>

        {/* Skill emoji + label */}
        <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5">
          <span className="text-sm">{emoji}</span>
          <span className="text-white text-xs font-body font-medium">
            {user.skill}
          </span>
        </div>

        {/* Distance badge */}
        <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-white text-xs font-body">
            {Number(user.distance)} km
          </span>
        </div>

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Rank badge */}
        <div className="absolute bottom-3 right-3 bg-black/25 backdrop-blur-sm rounded px-1.5 py-0.5">
          <span className="text-white/80 text-[10px] font-body font-medium tracking-wide">
            #{index + 1} Ranked
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Name + badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-display font-semibold text-foreground truncate text-base leading-tight">
              {user.name}
            </h3>
            {badge && (
              <span
                className={`inline-flex items-center gap-0.5 text-[10px] font-body font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${badge.className}`}
              >
                <span>{badge.icon}</span>
                {badge.label}
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="font-body truncate">{user.location}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-4 py-2.5 px-3 bg-muted rounded-lg">
          <div className="flex items-center gap-1.5 text-xs text-foreground/70 font-body">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-foreground">
              {Number(user.trustScore)}
            </span>
            <span className="text-muted-foreground">trust</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1.5 text-xs text-foreground/70 font-body">
            <ThumbsUp className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-foreground">
              {Number(user.endorsementCount)}
            </span>
            <span className="text-muted-foreground">endorsements</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/profile/$id"
            params={{ id: user.id.toString() }}
            className="flex-1"
          >
            <Button
              size="sm"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-body font-medium text-xs h-8"
            >
              View Profile
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link to="/community/$skill" params={{ skill: user.skill }}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-body font-medium h-8 px-3 border-border hover:bg-accent hover:text-accent-foreground"
            >
              {user.skill}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
