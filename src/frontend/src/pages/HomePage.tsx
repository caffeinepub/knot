import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import { Award, MapPin, RefreshCw, TrendingUp, Users } from "lucide-react";
import React, { useMemo, useState } from "react";
import { CardSkeletonGrid } from "../components/CardSkeleton";
import { BannerAd, PopupAd } from "../components/PopupAd";
import { UserCard } from "../components/UserCard";
import { VoiceSearch } from "../components/VoiceSearch";
import { useLang } from "../contexts/LanguageContext";
import {
  useAllUsers,
  useNearbyUsers,
  useSearchUsers,
} from "../hooks/useQueries";
import { getAuthUser } from "../utils/auth";
import {
  DISTANCE_OPTIONS,
  SKILL_CATEGORIES,
  getTranslatedSkillName,
  sortByRank,
} from "../utils/helpers";
import type { SkillCategory } from "../utils/helpers";
import { LANGUAGE_OPTIONS } from "../utils/translations";

export function HomePage() {
  const authUser = getAuthUser();
  const isCitizen = authUser?.role === "citizen";
  const { lang, t } = useLang();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<SkillCategory>("All");
  const [selectedDistance, setSelectedDistance] = useState(
    isCitizen ? "10" : "all",
  );

  const {
    data: allUsers,
    isLoading: allLoading,
    isError,
    refetch,
  } = useAllUsers();
  const { data: searchResults, isLoading: searchLoading } =
    useSearchUsers(searchQuery);
  const nearbyDistanceVal =
    selectedDistance !== "all" ? Number.parseInt(selectedDistance, 10) : 0;
  const { data: nearbyUsers, isLoading: nearbyLoading } =
    useNearbyUsers(nearbyDistanceVal);

  const isLoading = searchQuery.trim()
    ? searchLoading
    : selectedDistance !== "all"
      ? nearbyLoading
      : allLoading;

  // Use backend-filtered data as the source depending on active filters
  const users = allUsers;

  const filteredUsers = useMemo(() => {
    let source = searchQuery.trim()
      ? (searchResults ?? [])
      : selectedDistance !== "all"
        ? (nearbyUsers ?? [])
        : (allUsers ?? []);

    let result = sortByRank(source);

    // Apply skill filter client-side on top of whichever source
    if (selectedSkill !== "All") {
      result = result.filter(
        (u) => u.skill.toLowerCase() === selectedSkill.toLowerCase(),
      );
    }

    // If both search + distance active, apply distance filter client-side on search results
    if (searchQuery.trim() && selectedDistance !== "all") {
      const maxDist = Number.parseInt(selectedDistance, 10);
      result = result.filter((u) => Number(u.distance) <= maxDist);
    }

    return result;
  }, [
    allUsers,
    searchResults,
    nearbyUsers,
    selectedSkill,
    selectedDistance,
    searchQuery,
  ]);

  const stats = useMemo(() => {
    if (!users) return { total: 0, skilled: 0, avgTrust: 0, badged: 0 };
    return {
      total: users.length,
      skilled: new Set(users.map((u) => u.skill)).size,
      avgTrust: Math.round(
        users.reduce((s, u) => s + Number(u.trustScore), 0) /
          (users.length || 1),
      ),
      badged: users.filter((u) => u.badgeLevel !== "None").length,
    };
  }, [users]);

  const voiceLang =
    LANGUAGE_OPTIONS.find((o) => o.code === lang)?.bcp47 ?? "en-IN";

  return (
    <main className="flex-1">
      {/* Hero banner */}
      <div className="bg-navy py-10 px-4">
        <div className="container mx-auto">
          <div className="max-w-2xl">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight mb-2 animate-fade-in">
              {t("home_hero_title_1")}{" "}
              <span className="text-knot-green-light">
                {t("home_hero_title_2")}
              </span>
              <br />
              {t("home_hero_title_3")}
            </h1>
            {isCitizen && authUser?.address ? (
              <p className="text-white/60 font-body text-base mb-6 animate-fade-in animate-stagger-1">
                {t("home_hero_welcome")},{" "}
                <span className="text-white font-medium">{authUser.name}</span>!{" "}
                {t("home_hero_showing_near")}{" "}
                <span className="text-amber-300 font-medium">
                  {authUser.address}
                </span>
                .
              </p>
            ) : (
              <p className="text-white/60 font-body text-base mb-6 animate-fade-in animate-stagger-1">
                {t("home_hero_connect")}
              </p>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 animate-slide-up animate-stagger-2">
            {[
              {
                icon: Users,
                labelKey: "stat_professionals" as const,
                value: stats.total,
              },
              {
                icon: Award,
                labelKey: "stat_skill_types" as const,
                value: stats.skilled,
              },
              {
                icon: TrendingUp,
                labelKey: "stat_avg_trust" as const,
                value: stats.avgTrust,
              },
              {
                icon: Award,
                labelKey: "stat_badged" as const,
                value: stats.badged,
              },
            ].map(({ icon: Icon, labelKey, value }) => (
              <div
                key={labelKey}
                className="bg-white/10 rounded-lg px-4 py-3 flex items-center gap-3"
              >
                <Icon className="w-5 h-5 text-knot-green-light shrink-0" />
                <div>
                  <div className="font-display font-bold text-white text-xl leading-none">
                    {value}
                  </div>
                  <div className="text-white/50 text-xs font-body mt-0.5">
                    {t(labelKey)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-card border-b border-border sticky top-16 z-40 shadow-xs">
        <div className="container mx-auto px-4 py-3">
          {isCitizen && (
            <p className="text-xs text-muted-foreground font-body mb-2 flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              {t("search_by_name_hint")}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <VoiceSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={t("search_placeholder")}
                lang={voiceLang}
                listenLabel={t("voice_listening")}
                heardLabel={t("voice_heard")}
                failedLabel={t("voice_failed")}
                chromeLabel={t("voice_chrome_required")}
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <Select
                value={selectedDistance}
                onValueChange={setSelectedDistance}
              >
                <SelectTrigger className="h-11 w-48 font-body text-sm border-border">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                  {isCitizen && selectedDistance === "all" ? (
                    <span className="text-sm font-body">
                      {t("nearby_workers_label")}
                    </span>
                  ) : (
                    <SelectValue />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {DISTANCE_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="font-body text-sm"
                    >
                      {t(opt.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skill tabs */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
            {SKILL_CATEGORIES.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => setSelectedSkill(skill)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all ${
                  selectedSkill === skill
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {getTranslatedSkillName(skill, t)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="container mx-auto px-4 py-8">
        {isLoading || (!users && !isError) ? (
          <CardSkeletonGrid count={6} />
        ) : isError ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="font-display font-semibold text-foreground text-xl mb-2">
              {t("error_load_professionals")}
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-6">
              {t("error_something_wrong")}
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="font-body gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t("action_retry")}
            </Button>
          </div>
        ) : users &&
          users.length === 0 &&
          !searchQuery.trim() &&
          selectedSkill === "All" &&
          selectedDistance === "all" ? (
          // No workers have registered yet
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="font-display font-semibold text-foreground text-xl mb-2">
              {t("home_no_workers")}
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-6 max-w-xs mx-auto">
              {t("home_no_workers_desc")}
            </p>
            <Link to="/login">
              <Button className="font-body bg-amber-600 hover:bg-amber-700 text-white gap-2">
                {t("login_register_as_worker")}
              </Button>
            </Link>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display font-semibold text-foreground text-xl mb-2">
              {searchQuery.trim()
                ? `${t("error_no_professionals")}: "${searchQuery}"`
                : t("error_no_professionals")}
            </h3>
            <p className="text-muted-foreground font-body text-sm max-w-xs mx-auto mb-4">
              {searchQuery.trim()
                ? t("search_try_different")
                : t("error_adjust_filters")}
            </p>
            {searchQuery.trim() && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="font-body text-sm"
              >
                {t("action_clear_search")}
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-muted-foreground text-sm font-body">
                {t("filter_showing")}{" "}
                <span className="font-semibold text-foreground">
                  {filteredUsers.length}
                </span>{" "}
                {t("filter_professionals")}
                {filteredUsers.length !== 1 ? "s" : ""}
                {selectedSkill !== "All" && (
                  <span>
                    {" "}
                    {t("filter_in")}{" "}
                    <span className="text-foreground font-semibold">
                      {getTranslatedSkillName(selectedSkill, t)}
                    </span>
                  </span>
                )}
                {selectedDistance !== "all" && (
                  <span>
                    {" "}
                    <span className="text-foreground font-semibold">
                      {t("filter_within_km").replace("{n}", selectedDistance)}
                    </span>
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-muted-foreground text-xs font-body hidden sm:block">
                  {t("filter_sorted_trust")}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredUsers.map((user, index) => (
                <React.Fragment key={user.id.toString()}>
                  <UserCard user={user} index={index} />
                  {/* Insert banner ad after every 3rd card */}
                  {(index + 1) % 3 === 0 && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <BannerAd />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            {/* Show at least one banner ad even with few results */}
            {filteredUsers.length > 0 && filteredUsers.length < 3 && (
              <div className="mt-5">
                <BannerAd />
              </div>
            )}
            <PopupAd />
          </>
        )}
      </div>
    </main>
  );
}
