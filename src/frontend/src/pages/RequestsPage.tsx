import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock, MessageSquare, User } from "lucide-react";
import { useMemo } from "react";
import { useLang } from "../contexts/LanguageContext";
import { useAllLearningRequests, useAllUsers } from "../hooks/useQueries";
import { formatTimestamp, getSkillEmoji } from "../utils/helpers";

export function RequestsPage() {
  const { t } = useLang();
  const {
    data: requests,
    isLoading: requestsLoading,
    isError: requestsError,
  } = useAllLearningRequests();
  const { data: users } = useAllUsers();

  const usersMap = useMemo(() => {
    if (!users) return new Map();
    return new Map(users.map((u) => [u.id.toString(), u]));
  }, [users]);

  const enrichedRequests = useMemo(() => {
    if (!requests) return [];
    return [...requests].sort(
      (a, b) => Number(b.timestamp) - Number(a.timestamp),
    );
  }, [requests]);

  return (
    <main className="flex-1">
      {/* Hero */}
      <div className="bg-navy py-10 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 animate-slide-up">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-white">
                {t("requests_title")}
              </h1>
              <p className="text-white/60 font-body text-sm mt-1">
                {requestsLoading
                  ? "Loading..."
                  : `${enrichedRequests.length} ${t("requests_submitted")}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {requestsLoading ? (
          <div className="space-y-4">
            {["r1", "r2", "r3"].map((k) => (
              <div key={k} className="bg-card rounded-xl shadow-card p-5">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : requestsError ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="font-display font-semibold text-foreground text-xl mb-2">
              {t("requests_failed")}
            </h3>
            <p className="text-muted-foreground font-body text-sm">
              {t("error_something_wrong")}
            </p>
          </div>
        ) : enrichedRequests.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="font-display font-semibold text-foreground text-xl mb-2">
              {t("requests_none")}
            </h3>
            <p className="text-muted-foreground font-body text-sm max-w-xs mx-auto mb-6">
              {t("requests_none_desc")}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary font-body text-sm font-medium hover:underline"
            >
              {t("requests_browse")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {enrichedRequests.map((req, index) => {
              const target = usersMap.get(req.targetUserId.toString());
              const skillEmoji = target ? getSkillEmoji(target.skill) : "⚒️";
              const staggerClass =
                index < 4 ? `animate-stagger-${(index % 4) + 1}` : "";

              return (
                <article
                  key={req.id.toString()}
                  className={`bg-card rounded-xl shadow-card p-5 hover:shadow-card-hover transition-all duration-200 animate-slide-up ${staggerClass}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Requester avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground font-display font-bold text-sm">
                      {req.requesterId.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-semibold text-foreground text-sm">
                              {req.requesterId}
                            </span>
                            <span className="text-muted-foreground text-xs font-body">
                              →
                            </span>
                            {target ? (
                              <Link
                                to="/profile/$id"
                                params={{ id: target.id.toString() }}
                                className="inline-flex items-center gap-1 text-primary text-sm font-body font-medium hover:underline"
                              >
                                <span>{skillEmoji}</span>
                                {target.name}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground text-sm font-body">
                                User #{req.targetUserId.toString()}
                              </span>
                            )}
                          </div>
                          {target && (
                            <Link
                              to="/community/$skill"
                              params={{ skill: target.skill }}
                              className="text-muted-foreground text-xs font-body hover:text-foreground transition-colors"
                            >
                              {target.skill} · {target.location}
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="bg-muted rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                          <p className="font-body text-sm text-foreground leading-relaxed">
                            {req.message}
                          </p>
                        </div>
                      </div>

                      {/* Footer meta */}
                      <div className="flex items-center gap-3 text-muted-foreground text-xs font-body">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {req.requesterId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(req.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
