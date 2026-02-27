import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Users } from "lucide-react";
import { CardSkeletonGrid } from "../components/CardSkeleton";
import { UserCard } from "../components/UserCard";
import { useLang } from "../contexts/LanguageContext";
import { useUsersBySkill } from "../hooks/useQueries";
import { getSkillEmoji, sortByRank } from "../utils/helpers";

export function CommunityPage() {
  const { skill } = useParams({ from: "/main/community/$skill" });
  const safeSkill = skill ?? "All";
  const { t } = useLang();

  const { data: users, isLoading, isError } = useUsersBySkill(safeSkill);
  const emoji = getSkillEmoji(safeSkill);
  const ranked = users ? sortByRank(users) : [];

  return (
    <main className="flex-1">
      {/* Community hero */}
      <div className="bg-navy py-10 px-4">
        <div className="container mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-body mb-5 group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {t("community_back")}
          </Link>
          <div className="flex items-center gap-4 animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-3xl backdrop-blur-sm border border-white/20">
              {emoji}
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-white">
                {safeSkill} {t("nav_community_suffix")}
              </h1>
              <p className="text-white/60 font-body text-sm mt-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {isLoading
                  ? t("community_loading")
                  : `${ranked.length} ${t("community_members_suffix")}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <CardSkeletonGrid count={6} />
        ) : isError ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="font-display font-semibold text-foreground text-xl mb-2">
              {t("community_failed")}
            </h3>
            <p className="text-muted-foreground font-body text-sm">
              {t("error_something_wrong")}
            </p>
          </div>
        ) : ranked.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">{emoji}</div>
            <h3 className="font-display font-semibold text-foreground text-xl mb-2">
              {t("community_no_members")}
            </h3>
            <p className="text-muted-foreground font-body text-sm max-w-xs mx-auto">
              {t("community_empty_desc")}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-6 text-primary font-body text-sm font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("community_browse")}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-muted-foreground text-sm font-body">
                <span className="font-semibold text-foreground">
                  {ranked.length}
                </span>{" "}
                {safeSkill} {t("filter_professionals")}
                {ranked.length !== 1 ? "s" : ""}, {t("community_sorted")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ranked.map((user, index) => (
                <UserCard key={user.id.toString()} user={user} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
