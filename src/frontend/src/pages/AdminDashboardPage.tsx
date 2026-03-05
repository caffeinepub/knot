import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  LogOut,
  RefreshCw,
  Shield,
  Trash2,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  CertificationResult,
  Citizen,
  LearningRequest,
  PracticalVideoSubmission,
  User,
} from "../backend.d.ts";
import { useActor } from "../hooks/useActor";
import { clearAuthUser, getAuthUser } from "../utils/auth";
import { getVideoObjectURLWithFallback } from "../utils/videoDB";

function StatCard({
  icon: Icon,
  label,
  value,
  colorClass,
  bgClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <Card className="border border-slate-700 bg-slate-800 shadow-lg">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-body uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className={`text-3xl font-display font-bold ${colorClass}`}>
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${bgClass}`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BadgePill({ level }: { level: string }) {
  const map: Record<string, string> = {
    Gold: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Silver: "bg-slate-400/20 text-slate-300 border-slate-400/30",
    Bronze: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    None: "bg-slate-600/30 text-slate-400 border-slate-600/30",
  };
  return (
    <span
      className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full border ${map[level] ?? map.None}`}
    >
      {level}
    </span>
  );
}

// Helper: read all localStorage-registered workers
function getLocalWorkers(): User[] {
  const result: User[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("knot_worker_profile_")) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const p = JSON.parse(raw);
        result.push({
          id: BigInt(p.id ?? 0),
          name: p.name ?? "Unknown",
          skill: p.skill ?? "—",
          location: p.location ?? "—",
          trustScore: BigInt(p.trustScore ?? 0),
          endorsementCount: BigInt(p.endorsementCount ?? 0),
          badgeLevel: p.badgeLevel ?? "None",
          distance: BigInt(p.distance ?? 5),
          bio: p.bio ?? "",
          videoURL: p.videoURL ?? "",
          contact: p.contact ?? "",
        } as User);
      }
    }
  } catch {
    // ignore
  }
  return result;
}

// Helper: read all localStorage-registered citizens
function getLocalCitizens(): Citizen[] {
  const result: Citizen[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("knot_citizen_profile_")) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const p = JSON.parse(raw);
        result.push({
          id: BigInt(p.id ?? 0),
          name: p.name ?? "Unknown",
          address: p.address ?? "—",
          username: p.username ?? "",
          passwordHash: "",
        } as Citizen);
      }
    }
  } catch {
    // ignore
  }
  return result;
}

export function AdminDashboardPage() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authUser = getAuthUser();
  const [clearing, setClearing] = useState(false);

  // Stats — always available immediately from localStorage
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Build stats from localStorage first, backend refines it
      const lw = getLocalWorkers();
      const lc = getLocalCitizens();
      let certifiedCount = 0;
      let requestCount = 0;
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (
            key?.startsWith("knot_cert_status_") &&
            localStorage.getItem(key) === "approved"
          )
            certifiedCount++;
          if (key?.startsWith("knot_request_")) requestCount++;
        }
      } catch {
        /**/
      }

      if (actor) {
        try {
          const backendStats = await actor.getAdminStats();
          return {
            totalWorkers: BigInt(
              Math.max(lw.length, Number(backendStats.totalWorkers)),
            ),
            totalCitizens: BigInt(
              Math.max(lc.length, Number(backendStats.totalCitizens)),
            ),
            totalCertified: BigInt(
              Math.max(certifiedCount, Number(backendStats.totalCertified)),
            ),
            totalRequests: BigInt(
              Math.max(requestCount, Number(backendStats.totalRequests)),
            ),
          };
        } catch {
          /**/
        }
      }
      return {
        totalWorkers: BigInt(lw.length),
        totalCitizens: BigInt(lc.length),
        totalCertified: BigInt(certifiedCount),
        totalRequests: BigInt(requestCount),
      };
    },
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 15,
  });

  // Workers — merge backend + localStorage
  const {
    data: workers = [],
    isLoading: workersLoading,
    refetch: refetchWorkers,
  } = useQuery<User[]>({
    queryKey: ["admin-workers"],
    queryFn: async () => {
      const lw = getLocalWorkers();
      if (!actor) return lw;
      try {
        const backendWorkers = await actor.getAllUsers();
        // Merge: keep backend workers, add local-only ones not in backend
        const backendIds = new Set(backendWorkers.map((w) => w.id.toString()));
        const localOnly = lw.filter((w) => !backendIds.has(w.id.toString()));
        return [...backendWorkers, ...localOnly];
      } catch {
        return lw;
      }
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });

  // Citizens — merge backend + localStorage
  const {
    data: citizens = [],
    isLoading: citizensLoading,
    refetch: refetchCitizens,
  } = useQuery<Citizen[]>({
    queryKey: ["admin-citizens"],
    queryFn: async () => {
      const lc = getLocalCitizens();
      if (!actor) return lc;
      try {
        const backendCitizens = await actor.getAllCitizens();
        const backendIds = new Set(backendCitizens.map((c) => c.id.toString()));
        const localOnly = lc.filter((c) => !backendIds.has(c.id.toString()));
        return [...backendCitizens, ...localOnly];
      } catch {
        return lc;
      }
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });

  // Learning Requests
  const {
    data: requests = [],
    isLoading: requestsLoading,
    refetch: refetchRequests,
  } = useQuery<LearningRequest[]>({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllLearningRequests();
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });

  // Extended submission type that includes MCQ score for display
  interface PracticalSubmissionWithScore extends PracticalVideoSubmission {
    mcqScore: number;
    videoSrc: string; // resolved video source (may differ from videoDataURI if loaded from IndexedDB)
  }

  // Practical Video Submissions — also check localStorage for pending videos
  const {
    data: practicalVideos = [],
    isLoading: practicalLoading,
    refetch: refetchPractical,
  } = useQuery<PracticalSubmissionWithScore[]>({
    queryKey: ["admin-practical-videos"],
    queryFn: async () => {
      // Check localStorage for ALL practical video submissions (pending + approved + rejected)
      const localSubs: PracticalSubmissionWithScore[] = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith("knot_practical_submission_")) {
            const raw = localStorage.getItem(key);
            if (!raw) continue;
            try {
              const sub = JSON.parse(raw);
              const workerIdStr = String(sub.workerId ?? "");

              // Read MCQ score from localStorage
              const mcqRaw = localStorage.getItem(
                `knot_cert_mcq_${workerIdStr}`,
              );
              const mcqScore = mcqRaw ? Number.parseInt(mcqRaw, 10) || 0 : 0;

              // Only show submissions where MCQ was passed (6+)
              // If mcqScore is 0/unknown (backward compat), still show
              if (mcqScore > 0 && mcqScore < 6) continue;

              // Resolve video source with multi-layer fallback:
              // 1. base64 stored in practical submission (videoDataURI)
              // 2. base64 stored at registration time (knot_video_b64_<id>)
              // 3. IndexedDB blob saved under "practical_<id>" key (from test submission)
              // 4. IndexedDB blob saved under "<id>" key (from registration)
              let videoSrc = sub.videoDataURI ?? "";
              if (!videoSrc || videoSrc.length < 10) {
                // Try registration-time base64 backup
                const regB64 = localStorage.getItem(
                  `knot_video_b64_${workerIdStr}`,
                );
                if (regB64 && regB64.length > 10) {
                  videoSrc = regB64;
                } else {
                  // Try IndexedDB: practical key first, then registration key
                  try {
                    const practicalIdxUrl = await getVideoObjectURLWithFallback(
                      `practical_${workerIdStr}`,
                    );
                    if (practicalIdxUrl) {
                      videoSrc = practicalIdxUrl;
                    } else {
                      const regIdxUrl =
                        await getVideoObjectURLWithFallback(workerIdStr);
                      if (regIdxUrl) videoSrc = regIdxUrl;
                    }
                  } catch {
                    // All fallbacks exhausted
                  }
                }
              }

              localSubs.push({
                workerId: BigInt(sub.workerId ?? 0),
                workerName: sub.workerName ?? "Unknown",
                skill: sub.skill ?? "—",
                videoDataURI: sub.videoDataURI ?? "",
                videoSrc,
                mcqScore,
                submittedAt: BigInt(
                  sub.submittedAt
                    ? sub.submittedAt * 1_000_000
                    : Date.now() * 1_000_000,
                ),
                status: sub.status ?? "pending",
              } as PracticalSubmissionWithScore);
            } catch {
              /**/
            }
          }
        }
      } catch {
        /**/
      }

      // Also check backend for pending submissions (without MCQ filter since backend may not have score)
      if (!actor) return localSubs;
      try {
        const backendSubs = await actor.getPendingPracticalVideos();
        const localIds = new Set(localSubs.map((s) => s.workerId.toString()));
        const backendOnly: PracticalSubmissionWithScore[] = await Promise.all(
          backendSubs
            .filter((s) => !localIds.has(s.workerId.toString()))
            .map(async (s) => {
              const wIdStr = s.workerId.toString();
              const mcqRaw = localStorage.getItem(`knot_cert_mcq_${wIdStr}`);
              const mcqScore = mcqRaw ? Number.parseInt(mcqRaw, 10) || 0 : 0;
              let videoSrc = s.videoDataURI ?? "";
              if (!videoSrc || videoSrc.length < 10) {
                const regB64 = localStorage.getItem(`knot_video_b64_${wIdStr}`);
                if (regB64 && regB64.length > 10) {
                  videoSrc = regB64;
                } else {
                  try {
                    const practicalIdxUrl = await getVideoObjectURLWithFallback(
                      `practical_${wIdStr}`,
                    );
                    if (practicalIdxUrl) {
                      videoSrc = practicalIdxUrl;
                    } else {
                      const regIdxUrl =
                        await getVideoObjectURLWithFallback(wIdStr);
                      if (regIdxUrl) videoSrc = regIdxUrl;
                    }
                  } catch {
                    /* ignore */
                  }
                }
              }
              return { ...s, mcqScore, videoSrc };
            }),
        );
        return [...localSubs, ...backendOnly];
      } catch {
        return localSubs;
      }
    },
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 15,
  });

  // Certifications — fetch per worker (backend + localStorage certs)
  const {
    data: certs = [],
    isLoading: certsLoading,
    refetch: refetchCerts,
  } = useQuery<Array<CertificationResult & { workerName: string }>>({
    queryKey: ["admin-certs", workers.map((w) => w.id.toString()).join(",")],
    queryFn: async () => {
      const results: Array<CertificationResult & { workerName: string }> = [];

      // Check localStorage certs first — only include admin-approved workers
      for (const w of workers) {
        const wIdStr = w.id.toString();
        const certStatus = localStorage.getItem(`knot_cert_status_${wIdStr}`);
        const certRaw = localStorage.getItem(`knot_cert_${wIdStr}`);
        // Strict check: only "approved" by admin qualifies for the Certified tab
        if (certStatus !== "approved") continue;
        if (certRaw) {
          try {
            const parsed = JSON.parse(certRaw);
            results.push({
              workerId: w.id,
              skill: parsed.skill ?? w.skill,
              level: parsed.level ?? "Basic",
              passed: true,
              issuedDate: BigInt(parsed.issuedDate ?? 0),
              certificateId: parsed.certificateId ?? "",
              mcqScore: BigInt(parsed.mcqScore ?? 0),
              practicalPassed: true,
              workerName: parsed.workerName ?? w.name,
            });
          } catch {
            /**/
          }
        } else {
          // certStatus === "approved" but no cert record — add minimal entry
          results.push({
            workerId: w.id,
            skill: w.skill,
            level: "Basic",
            passed: true,
            issuedDate: BigInt(0),
            certificateId: "",
            mcqScore: BigInt(0),
            practicalPassed: true,
            workerName: w.name,
          });
        }
      }

      if (!actor || workers.length === 0) return results;

      // Supplement with backend certs for workers not already in results
      // Only include workers that have been admin-approved (certStatus === 'approved')
      const localWorkerIds = new Set(results.map((r) => r.workerId.toString()));
      const backendResults = await Promise.all(
        workers
          .filter((w) => {
            if (localWorkerIds.has(w.id.toString())) return false;
            // Only include if admin approved
            const certStatus = localStorage.getItem(
              `knot_cert_status_${w.id.toString()}`,
            );
            return certStatus === "approved";
          })
          .map(async (w) => {
            try {
              const cert = await actor.getCertification(w.id);
              if (cert?.passed) return { ...cert, workerName: w.name };
            } catch {
              /**/
            }
            return null;
          }),
      );
      const backendCerts = backendResults.filter(
        (c): c is CertificationResult & { workerName: string } => c !== null,
      );
      return [...results, ...backendCerts];
    },
    enabled: workers.length > 0,
    staleTime: 1000 * 30,
  });

  function handleLogout() {
    clearAuthUser();
    navigate({ to: "/login" });
  }

  function handleRefreshAll() {
    void Promise.all([
      refetchWorkers(),
      refetchCitizens(),
      refetchRequests(),
      refetchCerts(),
      refetchPractical(),
    ]);
    toast.success("Data refreshed");
  }

  async function handleApproveVideo(workerId: bigint) {
    try {
      if (actor) {
        await actor.approvePracticalVideo(workerId);
      }
    } catch (err) {
      console.warn("Backend approve error:", err);
    }
    const workerIdStr = workerId.toString();

    // Find worker info from submission
    const submissionRaw = localStorage.getItem(
      `knot_practical_submission_${workerIdStr}`,
    );
    let workerSkill = "General";
    let workerName = "Worker";
    let mcqScore = 6;
    if (submissionRaw) {
      try {
        const sub = JSON.parse(submissionRaw);
        workerSkill = sub.skill ?? workerSkill;
        workerName = sub.workerName ?? workerName;
      } catch {
        /**/
      }
    }
    const mcqRaw = localStorage.getItem(`knot_cert_mcq_${workerIdStr}`);
    if (mcqRaw) mcqScore = Number.parseInt(mcqRaw, 10) || 6;

    // Update cert record with practicalPassed: true so worker appears in Certified tab
    const certId = `KNOT-${Date.now().toString(36).toUpperCase()}-${workerIdStr.slice(-4)}`;
    const certRecord = {
      passed: true,
      skill: workerSkill,
      mcqScore,
      practicalPassed: true,
      certificateId: certId,
      level: "Basic",
      issuedDate: Date.now(),
      workerId: workerIdStr,
      pendingReview: false,
      workerName,
    };
    localStorage.setItem(
      `knot_cert_${workerIdStr}`,
      JSON.stringify(certRecord),
    );
    localStorage.setItem(`knot_cert_approved_${workerIdStr}`, "true");
    localStorage.setItem("knot_cert_passed", "true");
    localStorage.setItem(`knot_cert_status_${workerIdStr}`, "approved");

    // Mark the practical submission as approved (remove from pending)
    if (submissionRaw) {
      try {
        const sub = JSON.parse(submissionRaw);
        sub.status = "approved";
        localStorage.setItem(
          `knot_practical_submission_${workerIdStr}`,
          JSON.stringify(sub),
        );
      } catch {
        /**/
      }
    }

    // Notify worker via localStorage bell
    const notifKey = `knot_notifs_${workerIdStr}`;
    const newNotif = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: "endorsement" as const,
      message:
        "🎉 Your practical video was approved! Your certificate is now available. Visit My Certificates.",
      timestamp: Date.now(),
      read: false,
    };
    try {
      const raw = localStorage.getItem(notifKey);
      const existing = raw ? JSON.parse(raw) : [];
      localStorage.setItem(notifKey, JSON.stringify([newNotif, ...existing]));
    } catch {
      // ignore
    }
    toast.success("Practical video approved! Worker is now certified.");
    void refetchPractical();
    void refetchCerts();
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  }

  async function handleRejectVideo(workerId: bigint) {
    try {
      if (actor) {
        await actor.rejectPracticalVideo(workerId);
      }
    } catch (err) {
      console.warn("Backend reject error:", err);
    }
    const workerIdStr = workerId.toString();

    // Mark submission as rejected
    const submissionRaw = localStorage.getItem(
      `knot_practical_submission_${workerIdStr}`,
    );
    if (submissionRaw) {
      try {
        const sub = JSON.parse(submissionRaw);
        sub.status = "rejected";
        localStorage.setItem(
          `knot_practical_submission_${workerIdStr}`,
          JSON.stringify(sub),
        );
      } catch {
        /**/
      }
    }

    localStorage.setItem(`knot_cert_status_${workerIdStr}`, "rejected");

    // Notify worker via localStorage bell
    const notifKey = `knot_notifs_${workerIdStr}`;
    const newNotif = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: "endorsement" as const,
      message:
        "❌ Your practical video was rejected. Please retake the assessment and upload a new video.",
      timestamp: Date.now(),
      read: false,
    };
    try {
      const raw = localStorage.getItem(notifKey);
      const existing = raw ? JSON.parse(raw) : [];
      localStorage.setItem(notifKey, JSON.stringify([newNotif, ...existing]));
    } catch {
      // ignore
    }
    toast.error("Practical video rejected. Worker has been notified.");
    void refetchPractical();
  }

  async function handleClearAllData() {
    setClearing(true);
    try {
      if (actor) {
        try {
          await actor.clearAllData();
        } catch (err) {
          console.warn(
            "clearAllData backend error (expected if anonymous):",
            err,
          );
        }
      }
      // Clear all local data
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("knot_")) keysToRemove.push(key);
      }
      for (const key of keysToRemove) {
        localStorage.removeItem(key);
      }
      queryClient.clear();
      toast.success("All data cleared successfully.");
      navigate({ to: "/login" });
    } catch (err) {
      console.error("Clear all data error:", err);
      toast.error("Failed to clear data.");
    } finally {
      setClearing(false);
    }
  }

  function formatTimestamp(ts: bigint): string {
    try {
      const ms = Number(ts / BigInt(1_000_000));
      return new Date(ms).toLocaleString();
    } catch {
      return "—";
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Admin Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden ring-2 ring-amber-400/40 shrink-0">
                <img
                  src="/assets/uploads/image-27-4.png"
                  alt="KNOT"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-lg text-white tracking-tight">
                    KNOT
                  </span>
                  <Badge className="bg-red-600 text-white text-[10px] px-1.5 py-0 font-body font-bold border-0">
                    ADMIN
                  </Badge>
                </div>
                <p className="text-slate-400 text-[10px] font-body">
                  Welcome, {authUser?.name ?? "Administrator"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshAll}
                className="text-slate-300 hover:text-white hover:bg-slate-700 gap-2 font-body text-xs"
                data-ocid="admin.refresh.button"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 gap-2 font-body text-xs"
                    data-ocid="admin.clear_data.open_modal_button"
                    disabled={clearing}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-100">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-white">
                      Clear All Platform Data?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400 font-body">
                      This will permanently delete all workers, citizens,
                      learning requests, and certifications. This action cannot
                      be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      data-ocid="admin.clear_data.cancel_button"
                      className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 font-body"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      data-ocid="admin.clear_data.confirm_button"
                      onClick={handleClearAllData}
                      className="bg-red-600 hover:bg-red-700 text-white font-body"
                    >
                      Yes, Clear Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="w-px h-6 bg-slate-600 mx-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                data-ocid="admin.logout.button"
                className="text-slate-300 hover:text-white hover:bg-slate-700 gap-2 font-body text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Total Workers"
            value={statsLoading ? "…" : Number(stats?.totalWorkers ?? 0)}
            colorClass="text-blue-400"
            bgClass="bg-blue-500/10"
          />
          <StatCard
            icon={Shield}
            label="Total Citizens"
            value={statsLoading ? "…" : Number(stats?.totalCitizens ?? 0)}
            colorClass="text-green-400"
            bgClass="bg-green-500/10"
          />
          <StatCard
            icon={Award}
            label="Certified Workers"
            value={statsLoading ? "…" : Number(stats?.totalCertified ?? 0)}
            colorClass="text-amber-400"
            bgClass="bg-amber-500/10"
          />
          <StatCard
            icon={BookOpen}
            label="Learning Requests"
            value={statsLoading ? "…" : Number(stats?.totalRequests ?? 0)}
            colorClass="text-purple-400"
            bgClass="bg-purple-500/10"
          />
        </div>

        {/* Tables */}
        <Tabs defaultValue="workers" className="w-full">
          <TabsList className="bg-slate-800 border border-slate-700 p-1 mb-6 rounded-xl">
            <TabsTrigger
              value="workers"
              data-ocid="admin.workers.tab"
              className="font-body text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 rounded-lg transition-all"
            >
              <Users className="w-4 h-4 mr-1.5" />
              Workers ({workers.length})
            </TabsTrigger>
            <TabsTrigger
              value="citizens"
              data-ocid="admin.citizens.tab"
              className="font-body text-sm data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-400 rounded-lg transition-all"
            >
              <Shield className="w-4 h-4 mr-1.5" />
              Citizens ({citizens.length})
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              data-ocid="admin.requests.tab"
              className="font-body text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400 rounded-lg transition-all"
            >
              <BookOpen className="w-4 h-4 mr-1.5" />
              Requests ({requests.length})
            </TabsTrigger>
            <TabsTrigger
              value="certs"
              data-ocid="admin.certs.tab"
              className="font-body text-sm data-[state=active]:bg-amber-600 data-[state=active]:text-white text-slate-400 rounded-lg transition-all"
            >
              <Award className="w-4 h-4 mr-1.5" />
              Certified ({certs.length})
            </TabsTrigger>
            <TabsTrigger
              value="practical"
              data-ocid="admin.practical.tab"
              className="font-body text-sm data-[state=active]:bg-orange-600 data-[state=active]:text-white text-slate-400 rounded-lg transition-all"
            >
              <Video className="w-4 h-4 mr-1.5" />
              Practical Approval ({practicalVideos.length})
            </TabsTrigger>
          </TabsList>

          {/* Workers Table */}
          <TabsContent value="workers">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3 border-b border-slate-700">
                <CardTitle className="font-display text-base text-white">
                  Registered Workers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {workersLoading ? (
                  <div
                    data-ocid="admin.workers.loading_state"
                    className="py-12 text-center text-slate-400 font-body text-sm"
                  >
                    Loading workers…
                  </div>
                ) : workers.length === 0 ? (
                  <div
                    data-ocid="admin.workers.empty_state"
                    className="py-12 text-center text-slate-400 font-body text-sm"
                  >
                    No workers registered yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-transparent">
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            ID
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Name
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Skill
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Location
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Badge
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Trust
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Endorsements
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Contact
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workers.map((worker, idx) => (
                          <TableRow
                            key={worker.id.toString()}
                            data-ocid={`admin.workers.item.${idx + 1}`}
                            className="border-slate-700 hover:bg-slate-700/40 transition-colors"
                          >
                            <TableCell className="text-slate-500 font-mono text-xs">
                              {idx + 1}
                            </TableCell>
                            <TableCell className="text-white font-body font-medium text-sm">
                              {worker.name}
                            </TableCell>
                            <TableCell className="text-slate-300 font-body text-sm">
                              {worker.skill}
                            </TableCell>
                            <TableCell className="text-slate-400 font-body text-xs">
                              {worker.location}
                            </TableCell>
                            <TableCell>
                              <BadgePill level={worker.badgeLevel} />
                            </TableCell>
                            <TableCell className="text-slate-300 font-body text-sm">
                              {Number(worker.trustScore)}
                            </TableCell>
                            <TableCell className="text-slate-300 font-body text-sm">
                              {Number(worker.endorsementCount)}
                            </TableCell>
                            <TableCell className="text-slate-400 font-body text-xs">
                              {worker.contact || (
                                <span className="text-slate-600 italic">
                                  None
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Citizens Table */}
          <TabsContent value="citizens">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3 border-b border-slate-700">
                <CardTitle className="font-display text-base text-white">
                  Registered Citizens
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {citizensLoading ? (
                  <div
                    data-ocid="admin.citizens.loading_state"
                    className="py-12 text-center text-slate-400 font-body text-sm"
                  >
                    Loading citizens…
                  </div>
                ) : citizens.length === 0 ? (
                  <div
                    data-ocid="admin.citizens.empty_state"
                    className="py-12 text-center text-slate-400 font-body text-sm"
                  >
                    No citizens registered yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-transparent">
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            ID
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Name
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Address
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {citizens.map((citizen, idx) => (
                          <TableRow
                            key={citizen.id.toString()}
                            data-ocid={`admin.citizens.item.${idx + 1}`}
                            className="border-slate-700 hover:bg-slate-700/40 transition-colors"
                          >
                            <TableCell className="text-slate-500 font-mono text-xs">
                              {idx + 1}
                            </TableCell>
                            <TableCell className="text-white font-body font-medium text-sm">
                              {citizen.name}
                            </TableCell>
                            <TableCell className="text-slate-400 font-body text-sm">
                              {citizen.address}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Requests Table */}
          <TabsContent value="requests">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3 border-b border-slate-700">
                <CardTitle className="font-display text-base text-white">
                  Learning Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {requestsLoading ? (
                  <div
                    data-ocid="admin.requests.loading_state"
                    className="py-12 text-center text-slate-400 font-body text-sm"
                  >
                    Loading requests…
                  </div>
                ) : requests.length === 0 ? (
                  <div
                    data-ocid="admin.requests.empty_state"
                    className="py-12 text-center text-slate-400 font-body text-sm"
                  >
                    No learning requests yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-transparent">
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            ID
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Requester
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Target Worker
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Message
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Timestamp
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((req, idx) => (
                          <TableRow
                            key={req.id.toString()}
                            data-ocid={`admin.requests.item.${idx + 1}`}
                            className="border-slate-700 hover:bg-slate-700/40 transition-colors"
                          >
                            <TableCell className="text-slate-500 font-mono text-xs">
                              {idx + 1}
                            </TableCell>
                            <TableCell className="text-white font-body text-sm">
                              {req.requesterId}
                            </TableCell>
                            <TableCell className="text-slate-300 font-body text-xs font-mono">
                              {req.targetUserId.toString().slice(-6)}
                            </TableCell>
                            <TableCell className="text-slate-400 font-body text-sm max-w-xs truncate">
                              {req.message}
                            </TableCell>
                            <TableCell className="text-slate-500 font-body text-xs whitespace-nowrap">
                              {formatTimestamp(req.timestamp)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certified Workers Table */}
          <TabsContent value="certs">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3 border-b border-slate-700">
                <CardTitle className="font-display text-base text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Certified Workers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {certsLoading ? (
                  <div
                    data-ocid="admin.certs.loading_state"
                    className="py-12 text-center text-slate-400 font-body text-sm"
                  >
                    Loading certified workers…
                  </div>
                ) : certs.length === 0 ? (
                  <div
                    data-ocid="admin.certs.empty_state"
                    className="py-12 text-center text-slate-400 font-body text-sm"
                  >
                    <Award className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    No certified workers yet. Approve practical videos to
                    certify workers.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-transparent">
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            #
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Worker Name
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Skill
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Level
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            MCQ Score
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Certified On
                          </TableHead>
                          <TableHead className="text-slate-400 font-body text-xs uppercase tracking-wider">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {certs.map((cert, idx) => (
                          <TableRow
                            key={cert.certificateId || idx}
                            data-ocid={`admin.certs.item.${idx + 1}`}
                            className="border-slate-700 hover:bg-slate-700/40 transition-colors"
                          >
                            <TableCell className="text-slate-500 font-mono text-xs">
                              {idx + 1}
                            </TableCell>
                            <TableCell className="text-white font-body font-medium text-sm">
                              {cert.workerName}
                            </TableCell>
                            <TableCell className="text-slate-300 font-body text-sm">
                              {cert.skill}
                            </TableCell>
                            <TableCell className="text-amber-400 font-body text-sm font-semibold">
                              {cert.level || "Basic"}
                            </TableCell>
                            <TableCell className="text-slate-300 font-body text-sm">
                              {Number(cert.mcqScore)} / 9
                            </TableCell>
                            <TableCell className="text-slate-500 font-body text-xs whitespace-nowrap">
                              {formatTimestamp(cert.issuedDate)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-body text-xs font-semibold">
                                  Certified
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Practical Approval Tab */}
          <TabsContent value="practical">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3 border-b border-slate-700">
                <CardTitle className="font-display text-base text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  Practical Approval — Pending Video Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {practicalLoading ? (
                  <div
                    data-ocid="admin.practical.loading_state"
                    className="py-12 text-center text-slate-400 font-body text-sm"
                  >
                    Loading practical video submissions…
                  </div>
                ) : practicalVideos.length === 0 ? (
                  <div
                    data-ocid="admin.practical.empty_state"
                    className="py-12 text-center text-slate-400 font-body text-sm"
                  >
                    <Video className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    No practical video submissions pending review.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {practicalVideos.map((submission, idx) => (
                      <div
                        key={submission.workerId.toString()}
                        data-ocid={`admin.practical.item.${idx + 1}`}
                        className="bg-slate-700/50 rounded-xl border border-slate-600 overflow-hidden"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between px-4 py-3 border-b border-slate-600 gap-3">
                          <div className="min-w-0">
                            <p className="font-body font-semibold text-white text-sm">
                              {submission.workerName}
                            </p>
                            <p className="font-body text-xs text-slate-400 mt-0.5">
                              Skill: {submission.skill}
                            </p>
                            <p className="font-body text-xs text-slate-500 mt-0.5">
                              Submitted:{" "}
                              {formatTimestamp(submission.submittedAt)}
                            </p>
                            {/* MCQ Score badge */}
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-body font-semibold border border-blue-500/30">
                                📋 MCQ:{" "}
                                {submission.mcqScore > 0
                                  ? `${submission.mcqScore}/9 ✓ Passed`
                                  : "Score not recorded"}
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0">
                            {submission.status === "approved" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-body font-semibold border border-green-500/30">
                                <CheckCircle className="w-3 h-3" />
                                Approved
                              </span>
                            ) : submission.status === "rejected" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-body font-semibold border border-red-500/30">
                                <XCircle className="w-3 h-3" />
                                Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-body font-semibold border border-orange-500/30">
                                <Clock className="w-3 h-3" />
                                Pending Review
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Video player — use resolved videoSrc (IndexedDB or base64 URI) */}
                        {submission.videoSrc &&
                        submission.videoSrc.length > 10 ? (
                          <div className="bg-black aspect-video">
                            <video
                              src={submission.videoSrc}
                              controls
                              className="w-full h-full object-contain"
                            >
                              <track kind="captions" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : (
                          <div className="bg-slate-900 aspect-video flex items-center justify-center">
                            <div className="text-center text-slate-500">
                              <Video className="w-10 h-10 mx-auto mb-2 opacity-40" />
                              <p className="font-body text-sm">
                                Video not available
                              </p>
                              <p className="font-body text-xs text-slate-600 mt-1">
                                The video may be stored on the worker's device
                                only
                              </p>
                            </div>
                          </div>
                        )}
                        {/* Action buttons — only show for pending */}
                        {submission.status === "pending" ? (
                          <div className="flex gap-3 p-4">
                            <button
                              type="button"
                              data-ocid={`admin.practical.approve.button.${idx + 1}`}
                              onClick={() =>
                                handleApproveVideo(submission.workerId)
                              }
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-green-600 hover:bg-green-500 text-white font-body font-semibold text-sm transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve & Certify
                            </button>
                            <button
                              type="button"
                              data-ocid={`admin.practical.reject.button.${idx + 1}`}
                              onClick={() =>
                                handleRejectVideo(submission.workerId)
                              }
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-700 hover:bg-red-600 text-white font-body font-semibold text-sm transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-center">
                            <p className="font-body text-xs text-slate-500">
                              {submission.status === "approved"
                                ? "✅ You approved this video. Worker has been certified."
                                : "❌ You rejected this video. Worker has been notified to retake."}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
