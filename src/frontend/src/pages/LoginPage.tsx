import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { Briefcase, Loader2, MapPin, Upload, User, Video } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "../contexts/LanguageContext";
import { useActor } from "../hooks/useActor";
import { setAuthUser } from "../utils/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const { t } = useLang();

  // Keep a ref to the latest actor so async handlers can access it after retries
  const actorRef = useRef(actor);
  useEffect(() => {
    actorRef.current = actor;
  }, [actor]);

  // Citizen state
  const [citizenName, setCitizenName] = useState("");
  const [citizenAddress, setCitizenAddress] = useState("");
  const [citizenLoading, setCitizenLoading] = useState(false);

  // Worker state
  const [workerName, setWorkerName] = useState("");
  const [workerSkill, setWorkerSkill] = useState("");
  const [workerLocation, setWorkerLocation] = useState("");
  const [workerBio, setWorkerBio] = useState("");
  const [workerVideoFile, setWorkerVideoFile] = useState<File | null>(null);
  const [workerDistance, setWorkerDistance] = useState("5");
  const [workerLoading, setWorkerLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleVideoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setWorkerVideoFile(file);
    // Create an object URL for local video preview in the dashboard
    const previewUrl = URL.createObjectURL(file);
    localStorage.setItem("knot_worker_video_preview_url", previewUrl);
  }

  async function handleCitizenSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!citizenName.trim() || !citizenAddress.trim()) {
      toast.error(t("error_please_fill"));
      return;
    }
    setCitizenLoading(true);

    // Try to register citizen on backend, with fallback to local ID
    let backendId: bigint | null = null;
    const maxRetries = 8;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const currentActor = actorRef.current;
      if (currentActor) {
        try {
          backendId = await currentActor.registerCitizen(
            citizenName.trim(),
            citizenAddress.trim(),
          );
          break;
        } catch (err) {
          console.warn(
            `Citizen registration attempt ${attempt + 1} failed:`,
            err,
          );
          if (attempt < maxRetries - 1) {
            await new Promise((res) => setTimeout(res, 1000));
          }
        }
      } else {
        await new Promise((res) => setTimeout(res, 1000));
      }
    }

    const userId = backendId ?? BigInt(Date.now() % 1000000);

    setAuthUser({
      role: "citizen",
      id: userId,
      name: citizenName.trim(),
      address: citizenAddress.trim(),
    });

    toast.success(
      `${t("home_hero_welcome")}, ${citizenName}! ${t("login_welcome_citizen")}`,
    );
    setCitizenLoading(false);
    navigate({ to: "/" });
  }

  async function handleWorkerSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!workerName.trim() || !workerSkill || !workerLocation.trim()) {
      toast.error(t("error_please_fill_required"));
      return;
    }
    setWorkerLoading(true);

    // Store blob URL only for local session preview — never send to backend
    const blobPreviewUrl = localStorage.getItem(
      "knot_worker_video_preview_url",
    );
    if (blobPreviewUrl) {
      // Keep existing blob URL for same-session dashboard preview
    }

    // Store video filename separately so dashboard can display it
    if (workerVideoFile?.name) {
      localStorage.setItem("knot_worker_video", workerVideoFile.name);
    }

    const distanceValue = Math.max(
      1,
      Math.min(50, Number.parseInt(workerDistance, 10) || 5),
    );

    // Try to register on backend with retries
    let backendId: bigint | null = null;
    const maxRetries = 10;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const currentActor = actorRef.current;
      if (currentActor) {
        try {
          backendId = await currentActor.registerWorker(
            workerName.trim(),
            workerSkill,
            workerLocation.trim(),
            workerBio.trim(),
            "", // Empty string: blob URLs expire on refresh; backend stores "" and frontend uses local preview
            BigInt(distanceValue),
          );
          break; // Success — exit retry loop
        } catch (err) {
          console.warn(
            `Worker registration attempt ${attempt + 1} failed:`,
            err,
          );
          if (attempt < maxRetries - 1) {
            await new Promise((res) => setTimeout(res, 1000));
          }
        }
      } else {
        // Actor not ready yet, wait and retry
        await new Promise((res) => setTimeout(res, 1000));
      }
    }

    // Use backend ID if we got one, otherwise local fallback
    const userId = backendId ?? BigInt(Date.now() % 1000000);

    setAuthUser({
      role: "worker",
      id: userId,
      name: workerName.trim(),
      skill: workerSkill,
    });

    toast.success(
      `${t("home_hero_welcome")} to KNOT, ${workerName}! ${t("login_welcome_worker")}`,
    );
    setWorkerLoading(false);
    navigate({ to: "/worker-dashboard" });
  }

  return (
    <main className="flex-1 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, oklch(0.75 0.18 75 / 0.4) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, oklch(0.65 0.14 55 / 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, oklch(0.7 0.16 65 / 0.2) 0%, transparent 70%)`,
        }}
      />

      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, oklch(0.3 0.08 245) 0px, oklch(0.3 0.08 245) 1px, transparent 1px, transparent 20px)",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4 py-8 animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-amber-400/50 shadow-2xl mb-4">
            <img
              src="/assets/uploads/WhatsApp-Image-2026-02-27-at-10.42.55-1.jpeg"
              alt="KNOT Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-display font-extrabold text-3xl text-amber-900 tracking-tight">
            KNOT
          </h1>
          <p className="text-amber-700/70 text-sm font-body mt-1">
            Skills • Trust • Community
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-xl text-center text-foreground">
              {t("login_join_community")}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground font-body text-sm">
              {t("login_subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="citizen" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-amber-50 p-1 rounded-xl">
                <TabsTrigger
                  value="citizen"
                  className="rounded-lg font-body font-semibold text-sm data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                >
                  <User className="w-4 h-4 mr-1.5" />
                  {t("login_im_citizen")}
                </TabsTrigger>
                <TabsTrigger
                  value="worker"
                  className="rounded-lg font-body font-semibold text-sm data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                >
                  <Briefcase className="w-4 h-4 mr-1.5" />
                  {t("login_im_worker")}
                </TabsTrigger>
              </TabsList>

              {/* Citizen Tab */}
              <TabsContent value="citizen" className="mt-0">
                <form onSubmit={handleCitizenSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="citizen-name"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      {t("login_your_name")}
                    </Label>
                    <Input
                      id="citizen-name"
                      type="text"
                      placeholder={t("login_enter_name")}
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="font-body border-border h-11"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="citizen-address"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      <MapPin className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
                      {t("login_your_location")}
                    </Label>
                    <Input
                      id="citizen-address"
                      type="text"
                      placeholder={t("login_enter_city")}
                      value={citizenAddress}
                      onChange={(e) => setCitizenAddress(e.target.value)}
                      className="font-body border-border h-11"
                      required
                    />
                  </div>

                  <div className="bg-amber-50 rounded-lg px-3 py-2.5 border border-amber-200/60">
                    <p className="text-amber-800 text-xs font-body">
                      🔍 {t("login_citizen_hint")}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white font-body font-semibold shadow-lg shadow-amber-600/20 transition-all"
                    disabled={citizenLoading}
                  >
                    {citizenLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("login_finding_workers")}
                      </>
                    ) : (
                      t("login_enter_as_citizen")
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Worker Tab */}
              <TabsContent value="worker" className="mt-0">
                <form onSubmit={handleWorkerSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="worker-name"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      {t("login_your_name")}
                    </Label>
                    <Input
                      id="worker-name"
                      type="text"
                      placeholder={t("login_enter_name")}
                      value={workerName}
                      onChange={(e) => setWorkerName(e.target.value)}
                      className="font-body border-border h-11"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="worker-skill"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      {t("login_your_skill")}
                    </Label>
                    <Input
                      id="worker-skill"
                      type="text"
                      placeholder={t("login_select_skill")}
                      value={workerSkill}
                      onChange={(e) => setWorkerSkill(e.target.value)}
                      className="font-body border-border h-11"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="worker-location"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      <MapPin className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
                      {t("login_location_label")}
                    </Label>
                    <Input
                      id="worker-location"
                      type="text"
                      placeholder={t("login_enter_city")}
                      value={workerLocation}
                      onChange={(e) => setWorkerLocation(e.target.value)}
                      className="font-body border-border h-11"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="worker-distance"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      <MapPin className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
                      Distance from city center (km)
                    </Label>
                    <Input
                      id="worker-distance"
                      type="number"
                      min={1}
                      max={50}
                      placeholder="5"
                      value={workerDistance}
                      onChange={(e) => setWorkerDistance(e.target.value)}
                      className="font-body border-border h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="worker-bio"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      {t("login_bio")}{" "}
                      <span className="text-muted-foreground font-normal">
                        ({t("login_optional")})
                      </span>
                    </Label>
                    <Textarea
                      id="worker-bio"
                      placeholder={t("login_bio_placeholder")}
                      value={workerBio}
                      onChange={(e) => setWorkerBio(e.target.value)}
                      className="font-body border-border resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Video Upload */}
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm font-medium text-foreground">
                      <Video className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
                      {t("login_video_profile")}{" "}
                      <span className="text-muted-foreground font-normal">
                        ({t("login_optional")})
                      </span>
                    </Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoSelect}
                    />
                    {workerVideoFile ? (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Video className="w-5 h-5 text-green-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-green-800 text-sm font-body font-medium truncate">
                            {workerVideoFile.name}
                          </p>
                          <p className="text-green-600 text-xs font-body">
                            {(workerVideoFile.size / (1024 * 1024)).toFixed(1)}{" "}
                            MB · {t("login_ready_upload")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setWorkerVideoFile(null);
                          }}
                          className="text-green-600 hover:text-green-800 text-xs font-body underline"
                        >
                          {t("login_remove")}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-20 border-2 border-dashed border-amber-300 rounded-lg flex flex-col items-center justify-center gap-1.5 text-amber-600 hover:border-amber-500 hover:bg-amber-50 transition-all group"
                      >
                        <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-body font-medium">
                          {t("login_upload_video")}
                        </span>
                        <span className="text-xs font-body text-amber-500">
                          {t("login_video_formats")}
                        </span>
                      </button>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white font-body font-semibold shadow-lg shadow-amber-600/20 transition-all"
                    disabled={workerLoading}
                  >
                    {workerLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("login_creating_profile")}
                      </>
                    ) : (
                      t("login_register_as_worker")
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-amber-700/50 text-xs font-body mt-5">
          © {new Date().getFullYear()} KNOT · Built with love using{" "}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-700"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </main>
  );
}
