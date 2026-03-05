import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  PhoneCall,
  Play,
  Share2,
  Shield,
  Star,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { CertificationResult } from "../backend.d.ts";
import { useLang } from "../contexts/LanguageContext";
import { addNotificationForUser } from "../contexts/NotificationsContext";
import { useActor } from "../hooks/useActor";
import {
  useEndorseUser,
  useSubmitLearningRequest,
  useUser,
} from "../hooks/useQueries";
import { getAuthUser } from "../utils/auth";
import {
  getBadgeConfig,
  getSkillEmoji,
  getSkillThumbClass,
  getTranslatedSkillName,
} from "../utils/helpers";
import { getVideoObjectURLWithFallback } from "../utils/videoDB";

export function ProfilePage() {
  const { id } = useParams({ from: "/main/profile/$id" });
  const userId = id ? BigInt(id) : undefined;
  const { t } = useLang();
  const authUser = getAuthUser();
  const authUserRef = useRef(authUser);
  authUserRef.current = authUser;
  const isCitizen = authUser?.role === "citizen";
  const navigate = useNavigate();
  const { actor } = useActor();

  const { data: user, isLoading, isError, refetch } = useUser(userId);
  const endorseMutation = useEndorseUser();
  const submitRequestMutation = useSubmitLearningRequest();

  const [learnModalOpen, setLearnModalOpen] = useState(false);
  const [requesterName, setRequesterName] = useState(authUser?.name ?? "");
  const [learnMessage, setLearnMessage] = useState("");
  const [endorsed, setEndorsed] = useState(false);
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);

  // Load video: try backend first (cross-device), then local IndexedDB/localStorage
  useEffect(() => {
    if (!userId) return;
    let objectUrl: string | null = null;
    let cancelled = false;

    const loadVideo = async () => {
      // 1. Try backend (works on any device)
      if (actor) {
        try {
          const backendDataURI = await actor.getWorkerVideo(userId);
          if (!cancelled && backendDataURI && backendDataURI.length > 10) {
            setVideoObjectUrl(backendDataURI);
            return;
          }
        } catch {
          // fall through
        }
      }

      // 2. Try local IndexedDB + localStorage fallback (same device)
      try {
        const url = await getVideoObjectURLWithFallback(userId.toString());
        if (!cancelled && url) {
          objectUrl = url;
          setVideoObjectUrl(url);
        }
      } catch {
        // silently ignore
      }
    };

    loadVideo();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [userId, actor]);

  // Query worker's certification (for all viewers — citizen and worker alike)
  const { data: workerCert } = useQuery<CertificationResult | null>({
    queryKey: ["cert", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      // Also check localStorage as a fast/offline fallback
      const localCert = localStorage.getItem(`knot_cert_${userId.toString()}`);
      if (localCert) {
        try {
          return JSON.parse(localCert) as CertificationResult;
        } catch {
          // fall through to backend
        }
      }
      return actor.getCertification(userId);
    },
    enabled: !!userId,
  });

  // Fire a profile_view notification to the WORKER whose profile is being viewed.
  // We intentionally only run this once when the profile id changes, so we read
  // authUser from a ref to avoid re-triggering on every render.
  useEffect(() => {
    if (!userId) return;
    const viewer = authUserRef.current;
    // Don't fire for self-views
    if (viewer && String(viewer.id) === String(userId)) return;
    const viewerName = viewer?.name ?? "Someone";
    addNotificationForUser(userId.toString(), {
      type: "profile_view",
      message: `${viewerName} viewed your profile`,
    });
  }, [userId]);

  async function handleEndorse() {
    if (!userId) return;
    try {
      await endorseMutation.mutateAsync(userId);
      setEndorsed(true);
      await refetch();
      toast.success(t("success_endorsed"));
      // Fire real-time endorsement notification to the endorsed worker
      addNotificationForUser(userId.toString(), {
        type: "endorsement",
        message: `${authUser?.name ?? "Someone"} endorsed your profile`,
      });
    } catch {
      toast.error(t("error_endorse_failed"));
    }
  }

  async function handleSubmitRequest() {
    if (!userId) return;
    if (!requesterName.trim()) {
      toast.error(t("error_enter_name"));
      return;
    }
    if (!learnMessage.trim()) {
      toast.error(t("error_enter_message"));
      return;
    }
    try {
      await submitRequestMutation.mutateAsync({
        requesterId: requesterName.trim(),
        targetUserId: userId,
        message: learnMessage.trim(),
      });
      toast.success(t("success_request_sent"));
      setLearnModalOpen(false);
      // Fire real-time learning request notification to the worker
      if (userId) {
        addNotificationForUser(userId.toString(), {
          type: "learning_request",
          message: `${requesterName.trim()} sent you a learning request`,
        });
      }
      setRequesterName(authUser?.name ?? "");
      setLearnMessage("");
    } catch {
      toast.error(t("error_request_failed"));
    }
  }

  async function handleShareProfile() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("profile_share_copied"));
    } catch {
      toast.error("Could not copy link. Please copy it manually.");
    }
  }

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Skeleton className="h-8 w-24 mb-6" />
          <Skeleton className="h-64 w-full rounded-xl mb-6" />
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-32 mb-6" />
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </main>
    );
  }

  if (isError || !user) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            {t("profile_not_found")}
          </h2>
          <p className="text-muted-foreground font-body mb-6">
            {t("profile_not_found_desc")}
          </p>
          <Link to="/">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("profile_back")}
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const badge = getBadgeConfig(user.badgeLevel);
  const thumbClass = getSkillThumbClass(user.skill);
  const emoji = getSkillEmoji(user.skill);

  const getYouTubeEmbed = (url: string): string | null => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/,
    );
    return match ? match[1] : null;
  };
  const ytId = getYouTubeEmbed(user.videoURL);

  /* ────────── Citizen simplified view ────────── */
  if (isCitizen) {
    return (
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          {/* Back + Share row */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-body group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              {t("profile_back")}
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareProfile}
              className="gap-2 font-body text-sm"
            >
              <Share2 className="w-4 h-4" />
              {t("profile_share")}
            </Button>
          </div>

          <div className="bg-card rounded-2xl shadow-card overflow-hidden mb-5 animate-slide-up">
            {/* Video / Cover */}
            <div
              className={`relative h-64 ${!(ytId || videoObjectUrl || user.videoURL) ? thumbClass : "bg-black"} overflow-hidden`}
            >
              {ytId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${ytId}?mute=1&enablejsapi=1`}
                  title={`${user.name}'s skill video`}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : videoObjectUrl ? (
                <video
                  key={videoObjectUrl}
                  className="w-full h-full object-contain"
                  src={videoObjectUrl}
                  muted
                  playsInline
                  controls
                  preload="metadata"
                />
              ) : user.videoURL ? (
                <video
                  className="w-full h-full object-contain"
                  src={user.videoURL}
                  muted
                  playsInline
                  controls
                  preload="metadata"
                />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-15">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 600 256"
                      preserveAspectRatio="xMidYMid slice"
                      aria-hidden="true"
                    >
                      <defs>
                        <pattern
                          id="profileGrid"
                          width="30"
                          height="30"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 30 0 L 0 0 0 30"
                            fill="none"
                            stroke="white"
                            strokeWidth="0.75"
                          />
                        </pattern>
                      </defs>
                      <rect width="600" height="256" fill="url(#profileGrid)" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <p className="text-white text-sm font-body font-medium">
                        No video uploaded by this worker
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Citizen profile info */}
            <div className="p-6">
              {/* Name + Badge */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-14 h-14 rounded-xl shrink-0 ${thumbClass} flex items-center justify-center text-2xl`}
                >
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h1 className="font-display font-bold text-2xl text-foreground leading-tight">
                      {user.name}
                    </h1>
                    {badge && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${badge.className}`}
                      >
                        <span className="text-sm">{badge.icon}</span>
                        {t(`badge_${user.badgeLevel.toLowerCase()}` as any)}{" "}
                        {t("badge_member")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-body">{user.location}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-muted rounded-xl p-4 mb-4">
                <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {t("profile_about")}
                </h2>
                <p className="font-body text-foreground text-sm leading-relaxed">
                  {user.bio}
                </p>
              </div>

              {/* Contact */}
              <div className="bg-muted rounded-xl p-4 mb-5">
                <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {t("profile_contact")}
                </h2>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  {user.contact?.trim() ? (
                    <span className="font-body text-foreground text-sm font-medium">
                      {user.contact}
                    </span>
                  ) : (
                    <span className="font-body text-muted-foreground text-sm italic">
                      No contact is provided by the worker
                    </span>
                  )}
                </div>
              </div>

              {/* Request to Learn */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setLearnModalOpen(true)}
                  className="w-full h-11 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold"
                >
                  <BookOpen className="w-4 h-4" />
                  {t("profile_request_learn")}
                </Button>

                {/* Book for Work button */}
                {user.contact?.trim() ? (
                  <a
                    href={`tel:${user.contact.trim()}`}
                    data-ocid="profile.book_for_work.button"
                    className="w-full h-11 gap-2 bg-green-600 hover:bg-green-700 text-white font-body font-semibold inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onClick={() => {
                      // Fire notification to the worker
                      addNotificationForUser(userId!.toString(), {
                        type: "learning_request",
                        message: `${authUser?.name ?? "Someone"} wants to book you for work`,
                      });
                    }}
                  >
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Book for Work — Call {user.contact}
                  </a>
                ) : (
                  <Button
                    disabled
                    className="w-full h-11 gap-2 bg-muted text-muted-foreground font-body font-semibold cursor-not-allowed opacity-60"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Book for Work (No contact provided)
                  </Button>
                )}

                {/* Certification status */}
                {(() => {
                  let certData = workerCert;
                  if (!certData && userId) {
                    const localCert = localStorage.getItem(
                      `knot_cert_${userId.toString()}`,
                    );
                    if (localCert) {
                      try {
                        certData = JSON.parse(localCert) as CertificationResult;
                      } catch {
                        /* ignore */
                      }
                    }
                  }
                  const hasCert = certData?.passed === true;
                  return hasCert ? (
                    <Button
                      variant="outline"
                      className="w-full h-11 gap-2 font-body font-semibold border-amber-400 text-amber-700 hover:bg-amber-50"
                      onClick={() => {
                        localStorage.setItem("knot_view_cert_name", user.name);
                        localStorage.setItem(
                          "knot_view_cert_skill",
                          user.skill,
                        );
                        navigate({ to: "/certificate" });
                      }}
                    >
                      <Award className="w-4 h-4" />
                      View Certificate
                    </Button>
                  ) : (
                    <div className="w-full h-11 flex items-center justify-center gap-2 rounded-lg border border-muted bg-muted/40 text-muted-foreground text-sm font-body font-medium">
                      <Shield className="w-4 h-4" />
                      No certification completed
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Learn request modal */}
        <Dialog open={learnModalOpen} onOpenChange={setLearnModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-xl">
                {t("profile_request_learn")} — {user.name}
              </DialogTitle>
              <DialogDescription className="font-body text-muted-foreground">
                {t("profile_learn_placeholder")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="font-body font-medium text-sm">
                  {t("profile_your_name")}
                </Label>
                <Input
                  placeholder={t("login_enter_name")}
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="font-body h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body font-medium text-sm">
                  {t("profile_message")}
                </Label>
                <Textarea
                  placeholder={`${t("profile_learn_placeholder")}`}
                  value={learnMessage}
                  onChange={(e) => setLearnMessage(e.target.value)}
                  className="font-body resize-none"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setLearnModalOpen(false)}
                className="font-body"
              >
                {t("profile_cancel")}
              </Button>
              <Button
                onClick={handleSubmitRequest}
                disabled={submitRequestMutation.isPending}
                className="gap-2 bg-primary text-primary-foreground font-body font-semibold"
              >
                {submitRequestMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {submitRequestMutation.isPending
                  ? t("profile_sending")
                  : t("profile_send_request")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    );
  }

  /* ────────── Worker / default full view ────────── */
  return (
    <main className="flex-1 bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Back + Share row */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-body group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {t("profile_back")}
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareProfile}
            className="gap-2 font-body text-sm"
          >
            <Share2 className="w-4 h-4" />
            {t("profile_share")}
          </Button>
        </div>

        {/* Profile card */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden mb-5 animate-slide-up">
          {/* Cover / Video area */}
          <div
            className={`relative h-64 ${!(ytId || videoObjectUrl || user.videoURL) ? thumbClass : "bg-black"} overflow-hidden`}
          >
            {ytId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${ytId}?mute=1&enablejsapi=1`}
                title={`${user.name}'s skill video`}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : videoObjectUrl ? (
              <video
                key={videoObjectUrl}
                className="w-full h-full object-contain"
                src={videoObjectUrl}
                muted
                playsInline
                controls
                preload="metadata"
              />
            ) : user.videoURL ? (
              <video
                className="w-full h-full object-contain"
                src={user.videoURL}
                muted
                playsInline
                controls
                preload="metadata"
              />
            ) : (
              <>
                <div className="absolute inset-0 opacity-15">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 600 256"
                    preserveAspectRatio="xMidYMid slice"
                    aria-hidden="true"
                  >
                    <defs>
                      <pattern
                        id="profileGrid2"
                        width="30"
                        height="30"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 30 0 L 0 0 0 30"
                          fill="none"
                          stroke="white"
                          strokeWidth="0.75"
                        />
                      </pattern>
                    </defs>
                    <rect width="600" height="256" fill="url(#profileGrid2)" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <p className="text-white text-sm font-body font-medium">
                      No video uploaded by this worker
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile info */}
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-16 h-16 rounded-xl shrink-0 ${thumbClass} flex items-center justify-center text-2xl`}
              >
                {emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <h1 className="font-display font-bold text-2xl text-foreground leading-tight">
                    {user.name}
                  </h1>
                  {badge && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${badge.className}`}
                    >
                      <span className="text-sm">{badge.icon}</span>
                      {t(`badge_${user.badgeLevel.toLowerCase()}` as any)}{" "}
                      {t("badge_member")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-body">{user.location}</span>
                </div>
                <Link
                  to="/community/$skill"
                  params={{ skill: user.skill }}
                  className="inline-flex items-center gap-1 text-primary text-sm font-body font-medium hover:underline"
                >
                  {emoji} {getTranslatedSkillName(user.skill, t)}{" "}
                  {t("community_link_suffix")}
                </Link>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-muted rounded-xl p-4 mb-5">
              <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {t("profile_about")}
              </h2>
              <p className="font-body text-foreground text-sm leading-relaxed">
                {user.bio}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-muted rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <div className="font-display font-bold text-2xl text-foreground">
                  {Number(user.trustScore)}
                </div>
                <div className="text-muted-foreground text-xs font-body">
                  {t("profile_trust_score")}
                </div>
              </div>
              <div className="bg-muted rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ThumbsUp className="w-4 h-4 text-primary" />
                </div>
                <div className="font-display font-bold text-2xl text-foreground">
                  {Number(user.endorsementCount)}
                </div>
                <div className="text-muted-foreground text-xs font-body">
                  {t("profile_endorsements")}
                </div>
              </div>
              <div className="bg-muted rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Navigation className="w-4 h-4 text-accent" />
                </div>
                <div className="font-display font-bold text-2xl text-foreground">
                  {Number(user.distance)}
                </div>
                <div className="text-muted-foreground text-xs font-body">
                  {t("profile_km_away")}
                </div>
              </div>
            </div>

            {/* Badge progress */}
            <div className="bg-knot-green-muted rounded-xl p-4 mb-6">
              <h3 className="font-display font-semibold text-sm text-foreground mb-3">
                {t("profile_badge_progress")}
              </h3>
              <div className="space-y-2">
                {[
                  { level: "Bronze", required: 3, icon: "🥉" },
                  { level: "Silver", required: 7, icon: "🥈" },
                  { level: "Gold", required: 15, icon: "🥇" },
                ].map(({ level, required, icon }) => {
                  const count = Number(user.endorsementCount);
                  const achieved = count >= required;
                  return (
                    <div key={level} className="flex items-center gap-3">
                      <span className="text-lg w-6 text-center">{icon}</span>
                      <div className="flex-1 bg-white/60 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            achieved ? "bg-knot-green" : "bg-knot-green/40"
                          }`}
                          style={{
                            width: `${Math.min(100, (count / required) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-body text-foreground/60 w-24 text-right">
                        {achieved ? (
                          <span className="text-knot-green font-semibold">
                            {t("profile_achieved")}
                          </span>
                        ) : (
                          `${count}/${required}`
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons — endorse only for workers viewing another worker */}
            <div className="flex flex-col sm:flex-row gap-3">
              {authUser?.role === "worker" &&
                String(authUser?.id) !== String(userId) && (
                  <Button
                    onClick={handleEndorse}
                    disabled={endorseMutation.isPending || endorsed}
                    className="flex-1 h-11 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold"
                  >
                    {endorseMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : endorsed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <ThumbsUp className="w-4 h-4" />
                    )}
                    {endorseMutation.isPending
                      ? t("profile_endorsing")
                      : endorsed
                        ? t("profile_endorsed")
                        : `${t("profile_endorse")} ${user.name.split(" ")[0]}`}
                  </Button>
                )}

              <Button
                variant="outline"
                onClick={() => setLearnModalOpen(true)}
                className={`h-11 gap-2 border-border hover:bg-accent hover:text-accent-foreground font-body font-semibold ${
                  authUser?.role !== "citizen" ? "flex-1" : "w-full"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                {t("profile_request_learn")}
              </Button>
            </div>

            {/* Certification button — always visible */}
            {(() => {
              // Check localStorage first (fast/offline), then fall back to query result
              let certData = workerCert;
              if (!certData && userId) {
                const localCert = localStorage.getItem(
                  `knot_cert_${userId.toString()}`,
                );
                if (localCert) {
                  try {
                    certData = JSON.parse(localCert) as CertificationResult;
                  } catch {
                    // ignore
                  }
                }
              }
              const hasCert = certData?.passed === true;
              return (
                <div className="mt-3">
                  {hasCert ? (
                    <Button
                      className="w-full h-11 gap-2 font-body font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25"
                      onClick={() => {
                        localStorage.setItem("knot_view_cert_name", user.name);
                        localStorage.setItem(
                          "knot_view_cert_skill",
                          user.skill,
                        );
                        navigate({ to: "/certificate" });
                      }}
                    >
                      <Award className="w-4 h-4" />
                      View Certificate
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full h-11 gap-2 font-body font-semibold border-muted text-muted-foreground cursor-not-allowed opacity-60"
                    >
                      <Shield className="w-4 h-4" />
                      Not Certified Yet
                    </Button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Learn request modal */}
      <Dialog open={learnModalOpen} onOpenChange={setLearnModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl">
              {t("profile_request_learn")} — {user.name}
            </DialogTitle>
            <DialogDescription className="font-body text-muted-foreground">
              {t("profile_learn_placeholder")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="font-body font-medium text-sm">
                {t("profile_your_name")}
              </Label>
              <Input
                placeholder={t("login_enter_name")}
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="font-body h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body font-medium text-sm">
                {t("profile_message")}
              </Label>
              <Textarea
                placeholder={`${t("profile_learn_placeholder")}`}
                value={learnMessage}
                onChange={(e) => setLearnMessage(e.target.value)}
                className="font-body resize-none"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setLearnModalOpen(false)}
              className="font-body"
            >
              {t("profile_cancel")}
            </Button>
            <Button
              onClick={handleSubmitRequest}
              disabled={submitRequestMutation.isPending}
              className="gap-2 bg-primary text-primary-foreground font-body font-semibold"
            >
              {submitRequestMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {submitRequestMutation.isPending
                ? t("profile_sending")
                : t("profile_send_request")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
