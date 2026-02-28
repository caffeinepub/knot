import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Clock,
  MapPin,
  RefreshCw,
  Shield,
  Star,
  ThumbsUp,
  TrendingUp,
  Trophy,
  User,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { CertificationResult, LearningRequest } from "../backend.d.ts";
import { useLang } from "../contexts/LanguageContext";
import { useActor } from "../hooks/useActor";
import { getAuthUser } from "../utils/auth";
import { getBadgeConfig, getSkillEmoji } from "../utils/helpers";
import { getVideoObjectURL } from "../utils/videoDB";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-0.5">
              {label}
            </p>
            <p className="font-display font-bold text-2xl text-foreground leading-none">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WorkerDashboardPage() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const { actor, isFetching } = useActor();
  const { t } = useLang();

  useEffect(() => {
    if (!authUser || authUser.role !== "worker") {
      navigate({ to: "/login" });
    }
  }, [authUser, navigate]);

  const workerId = authUser?.id;

  const { data: workerData } = useQuery({
    queryKey: ["worker-stats", workerId?.toString()],
    queryFn: async () => {
      if (!actor || workerId === undefined) return null;
      return actor.getWorkerStats(workerId);
    },
    enabled: !!actor && !isFetching && workerId !== undefined,
    staleTime: 1000 * 30,
  });

  const { data: learningRequests, isLoading: reqLoading } = useQuery<
    LearningRequest[]
  >({
    queryKey: ["worker-requests", workerId?.toString()],
    queryFn: async () => {
      if (!actor || workerId === undefined) return [];
      return actor.getLearningRequestsForWorker(workerId);
    },
    enabled: !!actor && !isFetching && workerId !== undefined,
    staleTime: 1000 * 30,
  });

  const { data: certification } = useQuery<CertificationResult | null>({
    queryKey: ["certification", workerId?.toString()],
    queryFn: async () => {
      if (!actor || workerId === undefined) return null;
      return actor.getCertification(workerId);
    },
    enabled: !!actor && !isFetching && workerId !== undefined,
    staleTime: 1000 * 60,
  });

  const [videoURL, setVideoURL] = useState<string>("");

  // Load video: first try IndexedDB (persisted), then session blob URL
  useEffect(() => {
    const workerId =
      localStorage.getItem("knot_worker_id") ?? authUser?.id?.toString();
    if (!workerId) {
      // Fall back to session blob URL
      const sessionUrl =
        localStorage.getItem("knot_worker_video_preview_url") ?? "";
      setVideoURL(sessionUrl);
      return;
    }
    let objectUrl: string | null = null;
    getVideoObjectURL(workerId)
      .then((url) => {
        if (url) {
          objectUrl = url;
          setVideoURL(url);
        } else {
          // Fall back to session blob URL
          const sessionUrl =
            localStorage.getItem("knot_worker_video_preview_url") ?? "";
          setVideoURL(sessionUrl);
        }
      })
      .catch(() => {
        const sessionUrl =
          localStorage.getItem("knot_worker_video_preview_url") ?? "";
        setVideoURL(sessionUrl);
      });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [authUser?.id]);

  if (!authUser || authUser.role !== "worker") {
    return null;
  }

  const badgeConfig = workerData ? getBadgeConfig(workerData.badgeLevel) : null;
  const skillEmoji = workerData ? getSkillEmoji(workerData.skill) : "⚒️";

  const badgeLevelDisplay = workerData?.badgeLevel ?? "—";
  const trustScore = workerData ? Number(workerData.trustScore) : 0;
  const endorsementCount = workerData ? Number(workerData.endorsementCount) : 0;

  return (
    <main className="flex-1 bg-background">
      {/* Dashboard Header */}
      <div className="bg-navy py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl ring-2 ring-white/20 shrink-0">
              {skillEmoji}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-display font-bold text-2xl text-white">
                  {authUser.name}
                </h1>
                {badgeConfig && workerData && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-body font-semibold border ${badgeConfig.className}`}
                  >
                    {badgeConfig.icon}{" "}
                    {t(`badge_${workerData.badgeLevel.toLowerCase()}` as any)}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-white/60 text-sm font-body">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {authUser.skill ?? workerData?.skill ?? "—"}
                </span>
                {workerData?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {workerData.location}
                  </span>
                )}
              </div>
            </div>

            {/* Worker badge */}
            <div className="shrink-0">
              <Badge className="bg-white/20 text-white border-white/30 font-body text-xs px-3 py-1.5">
                {t("dashboard_title")}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Certification / Peer Validation Section */}
        <section>
          <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            {t("cert_section_title")}
          </h2>

          {certification?.passed ? (
            /* PASSED state */
            <Card className="border-2 border-green-300 bg-green-50/50 shadow-sm">
              <CardContent className="py-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-display font-bold text-base text-green-800">
                        {t("cert_passed")}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-200 text-green-800 text-xs font-body font-semibold">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="font-body text-sm text-green-700">
                      {certification.skill} · MCQ:{" "}
                      {Number(certification.mcqScore)}/9
                    </p>
                    {certification.certificateId && (
                      <p className="font-body text-xs text-green-600/70 mt-0.5 truncate">
                        ID: {certification.certificateId}
                      </p>
                    )}
                  </div>
                  <Link to="/certificate">
                    <Button
                      size="sm"
                      className="shrink-0 bg-green-600 hover:bg-green-700 text-white font-body gap-1.5"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      {t("cert_view_cert")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : certification && !certification.passed ? (
            /* FAILED state */
            <Card className="border-2 border-orange-300 bg-orange-50/50 shadow-sm">
              <CardContent className="py-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold text-base text-orange-800 mb-1">
                      {t("cert_failed")}
                    </p>
                    <p className="font-body text-sm text-orange-700">
                      MCQ: {Number(certification.mcqScore)}/9 · Need 6+ to pass
                    </p>
                  </div>
                  <Link to="/certification-test">
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 border-orange-400 text-orange-700 hover:bg-orange-50 font-body gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {t("cert_retry")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* NOT TESTED state */
            <Card className="border-2 border-dashed border-border bg-muted/20">
              <CardContent className="py-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold text-base text-foreground mb-1">
                      {t("cert_not_tested")}
                    </p>
                    <p className="font-body text-sm text-muted-foreground">
                      {t("cert_not_tested_desc")}
                    </p>
                  </div>
                  <Link to="/certification-test">
                    <Button
                      size="sm"
                      className="shrink-0 font-body font-semibold gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {t("cert_take_test")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        <Separator />

        {/* Stats Row */}
        <section>
          <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            {t("dashboard_your_stats")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={TrendingUp}
              label={t("dashboard_trust_score")}
              value={trustScore}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              icon={ThumbsUp}
              label={t("dashboard_endorsements")}
              value={endorsementCount}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              icon={Award}
              label={t("dashboard_badge_level")}
              value={badgeLevelDisplay}
              color="bg-amber-100 text-amber-600"
            />
          </div>

          {/* Badge progress bar */}
          {workerData && (
            <div className="mt-4 p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-sm text-muted-foreground">
                  {t("dashboard_badge_progress")}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {endorsementCount} {t("dashboard_endorsements_count")}
                </p>
              </div>
              <div className="relative w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (endorsementCount / 15) * 100)}%`,
                    background:
                      endorsementCount >= 15
                        ? "oklch(0.75 0.18 75)"
                        : endorsementCount >= 7
                          ? "oklch(0.62 0.02 260)"
                          : "oklch(0.65 0.14 55)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {[
                  { labelKey: "badge_bronze" as const, icon: "🥉", count: 3 },
                  { labelKey: "badge_silver" as const, icon: "🥈", count: 7 },
                  { labelKey: "badge_gold" as const, icon: "🥇", count: 15 },
                ].map(({ labelKey, icon, count }) => (
                  <span
                    key={labelKey}
                    className={`text-xs font-body ${
                      endorsementCount >= count
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {icon} {t(labelKey)} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <Separator />

        {/* Video Section */}
        <section>
          <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-amber-500" />
            {t("dashboard_video_title")}
          </h2>
          {videoURL ? (
            <Card className="overflow-hidden border border-border shadow-sm">
              <div className="relative bg-black aspect-video">
                <video
                  src={videoURL}
                  controls
                  className="w-full h-full object-contain"
                >
                  <track kind="captions" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <CardContent className="py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-sm font-body text-muted-foreground">
                    {t("dashboard_video_live")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-amber-300 bg-amber-50/40">
              <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                  <Video className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground text-base">
                    {t("dashboard_no_video")}
                  </p>
                  <p className="text-muted-foreground font-body text-sm mt-1">
                    {t("dashboard_add_video")}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        <Separator />

        {/* Learning Requests */}
        <section>
          <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            {t("dashboard_requests_title")}
            {learningRequests && learningRequests.length > 0 && (
              <span className="ml-1 bg-amber-600 text-white text-xs font-body font-bold px-2 py-0.5 rounded-full">
                {learningRequests.length}
              </span>
            )}
          </h2>

          {reqLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-muted rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : !learningRequests || learningRequests.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
                <div className="text-5xl">📬</div>
                <div>
                  <p className="font-display font-semibold text-foreground text-base">
                    {t("dashboard_no_requests")}
                  </p>
                  <p className="text-muted-foreground font-body text-sm mt-1">
                    {t("dashboard_requests_hint")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {learningRequests.map((req) => (
                <Card
                  key={req.id.toString()}
                  className="border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <CardTitle className="font-body font-semibold text-sm text-foreground">
                            {req.requesterId}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground font-body flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            Request #{req.id.toString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="font-body text-xs shrink-0"
                      >
                        {t("dashboard_pending")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-muted-foreground font-body text-sm leading-relaxed bg-muted rounded-lg px-3 py-2.5">
                      "{req.message}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Bio section if available */}
        {workerData?.bio && (
          <>
            <Separator />
            <section>
              <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-500" />
                {t("dashboard_about_you")}
              </h2>
              <Card className="border border-border">
                <CardContent className="py-4">
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {workerData.bio}
                  </p>
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
