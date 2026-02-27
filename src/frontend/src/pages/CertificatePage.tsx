import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Award, Download, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import type { CertificationResult } from "../backend.d.ts";
import { useLang } from "../contexts/LanguageContext";
import { useActor } from "../hooks/useActor";
import { getAuthUser } from "../utils/auth";

function formatCertDate(ts: bigint): string {
  // Motoko timestamps in nanoseconds
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime()))
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function CertificatePage() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const { actor, isFetching } = useActor();
  const { t } = useLang();
  const certRef = useRef<HTMLDivElement>(null);

  const workerId = authUser?.id;

  const { data: cert, isLoading } = useQuery<CertificationResult | null>({
    queryKey: ["certification", workerId?.toString()],
    queryFn: async () => {
      if (!actor || workerId === undefined) return null;
      return actor.getCertification(workerId);
    },
    enabled: !!actor && !isFetching && workerId !== undefined,
    staleTime: 1000 * 60,
  });

  const workerName = authUser?.name ?? "Worker";
  const workerSkill = cert?.skill ?? authUser?.skill ?? "Vocational Skill";
  const certId =
    cert?.certificateId ?? `KNOT-${Date.now().toString(36).toUpperCase()}`;
  const certDate = cert?.issuedDate
    ? formatCertDate(cert.issuedDate)
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  function handleDownload() {
    window.print();
  }

  if (!authUser || authUser.role !== "worker") {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-display font-semibold text-foreground">
            Workers only
          </p>
          <Button className="mt-4" onClick={() => navigate({ to: "/login" })}>
            Go to Login
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[500px] w-full rounded-2xl" />
        </div>
      </main>
    );
  }

  // Block access if assessment not passed
  // Also check localStorage (set by CertificationTestPage on submit)
  const localPassed =
    typeof window !== "undefined" &&
    localStorage.getItem("knot_cert_passed") === "true";
  if (!cert?.passed && !localPassed) {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
            <Award className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            Certificate Not Unlocked Yet
          </h2>
          <p className="font-body text-muted-foreground text-sm mb-6 leading-relaxed">
            You need to pass the peer validation assessment to earn your
            certificate. Score 6 or more on the MCQ questions and submit your
            practical video.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate({ to: "/certification-test" })}
              className="gap-2 font-body font-semibold"
            >
              <Shield className="w-4 h-4" />
              Take the Assessment
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/worker-dashboard" })}
              className="font-body"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background">
      {/* Print-only styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .cert-container { box-shadow: none !important; }
        }
        @page {
          size: landscape;
          margin: 0;
        }
      `}</style>

      {/* Actions bar — hidden on print */}
      <div className="no-print bg-navy py-4 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/worker-dashboard" })}
            className="flex items-center gap-2 text-white/80 hover:text-white font-body text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("cert_go_dashboard")}
          </button>
          <Button
            onClick={handleDownload}
            className="gap-2 font-body font-semibold bg-white text-navy hover:bg-white/90"
            size="sm"
          >
            <Download className="w-4 h-4" />
            {t("cert_download")}
          </Button>
        </div>
      </div>

      {/* Certificate container */}
      <div className="container mx-auto px-4 py-8 max-w-5xl no-print">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CertificateDocument
            ref={certRef}
            workerName={workerName}
            workerSkill={workerSkill}
            certId={certId}
            certDate={certDate}
            t={t}
          />
        </motion.div>

        {/* Mobile download nudge */}
        <div className="mt-6 text-center no-print">
          <Button
            onClick={handleDownload}
            size="lg"
            className="gap-2 font-body font-semibold"
          >
            <Download className="w-5 h-5" />
            {t("cert_download")}
          </Button>
        </div>
      </div>

      {/* Print version — always rendered for window.print() */}
      <div className="hidden print:block">
        <CertificateDocument
          workerName={workerName}
          workerSkill={workerSkill}
          certId={certId}
          certDate={certDate}
          t={t}
        />
      </div>
    </main>
  );
}

// ─── Certificate Document Component ──────────────────────────────────────────

interface CertDocProps {
  workerName: string;
  workerSkill: string;
  certId: string;
  certDate: string;
  t: (key: any) => string;
}

import { forwardRef } from "react";

const CertificateDocument = forwardRef<HTMLDivElement, CertDocProps>(
  function CertificateDocument(
    { workerName, workerSkill, certId: _certId, certDate: _certDate },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className="cert-container relative w-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        style={{
          aspectRatio: "1200/850",
          backgroundColor: "#0a3d2e",
          borderRadius: "12px",
          fontFamily: "serif",
        }}
      >
        {/* ── Right-side decorative gold wave lines (SVG) ── */}
        <svg
          aria-hidden="true"
          className="absolute right-0 top-0 h-full"
          style={{ width: "22%", opacity: 0.45 }}
          viewBox="0 0 220 850"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[0, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180, 198].map(
            (offset) => (
              <path
                key={offset}
                d={`M${220 - offset},0 Q${180 - offset},212 ${210 - offset},425 Q${240 - offset},637 ${220 - offset},850`}
                stroke="#D4AF37"
                strokeWidth="1.2"
                fill="none"
              />
            ),
          )}
        </svg>

        {/* ── Bottom-left dark blob ── */}
        <svg
          aria-hidden="true"
          className="absolute bottom-0 left-0"
          style={{ width: "28%", opacity: 0.6 }}
          viewBox="0 0 340 280"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,280 Q80,160 160,200 Q260,240 340,140 L340,280 Z"
            fill="#051f17"
          />
        </svg>

        {/* ── Subtle top corner accent ── */}
        <svg
          aria-hidden="true"
          className="absolute top-0 left-0"
          style={{ width: "20%", opacity: 0.35 }}
          viewBox="0 0 240 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,0 Q120,80 0,200 Z" fill="#1a6645" />
        </svg>

        {/* ── Certificate content ── */}
        <div
          className="absolute inset-0 flex flex-col items-center"
          style={{ padding: "4% 12% 4% 8%", gap: 0 }}
        >
          {/* CERTIFICATE title */}
          <div className="text-center" style={{ marginBottom: "1.5%" }}>
            <h1
              className="font-display font-bold text-white uppercase tracking-[0.35em]"
              style={{
                fontSize: "clamp(20px, 4.5vw, 56px)",
                letterSpacing: "0.35em",
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
            >
              CERTIFICATE
            </h1>
          </div>

          {/* OF BASIC ON [skill] — gold with divider lines */}
          <div
            className="flex items-center gap-3 w-full justify-center"
            style={{ marginBottom: "2%" }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#D4AF37",
                opacity: 0.7,
              }}
            />
            <p
              className="font-body font-bold uppercase tracking-[0.18em] whitespace-nowrap"
              style={{
                color: "#D4AF37",
                fontSize: "clamp(8px, 1.6vw, 20px)",
                letterSpacing: "0.18em",
              }}
            >
              OF BASIC ON {workerSkill.toUpperCase()}
            </p>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#D4AF37",
                opacity: 0.7,
              }}
            />
          </div>

          {/* PROUDLY PRESENTED TO */}
          <p
            className="font-body uppercase tracking-[0.22em] text-center"
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "clamp(6px, 1.1vw, 13px)",
              letterSpacing: "0.22em",
              marginBottom: "1.2%",
            }}
          >
            PROUDLY PRESENTED TO
          </p>

          {/* Candidate Name */}
          <h2
            className="font-display font-bold text-white text-center leading-tight"
            style={{
              fontSize: "clamp(22px, 5vw, 64px)",
              textShadow: "0 3px 16px rgba(0,0,0,0.5)",
              letterSpacing: "0.04em",
              marginBottom: "2%",
            }}
          >
            {workerName}
          </h2>

          {/* Description paragraph */}
          <p
            className="font-body text-center leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.68)",
              fontSize: "clamp(6px, 1vw, 12px)",
              maxWidth: "75%",
              marginBottom: "3.5%",
              lineHeight: 1.7,
            }}
          >
            This certificate is awarded for successful completion and verified
            demonstration of foundational vocational skills. The recipient has
            showcased basic practical competence through video evidence and has
            been validated by peer professionals within the community for
            essential workmanship and reliability.
          </p>

          {/* Bottom signature + badge row */}
          <div
            className="w-full flex items-end justify-between"
            style={{ marginTop: "auto" }}
          >
            {/* Left signature */}
            <div className="text-left" style={{ minWidth: "22%" }}>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(212,175,55,0.5)",
                  marginBottom: "4px",
                }}
              />
              <p
                className="font-display font-bold"
                style={{
                  color: "#D4AF37",
                  fontSize: "clamp(7px,1.1vw,13px)",
                  letterSpacing: "0.05em",
                }}
              >
                G. LAKSHMI LATHIKA
              </p>
              <p
                className="font-body font-bold uppercase tracking-widest"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(5px,0.8vw,10px)",
                }}
              >
                CEO &amp; FOUNDER
              </p>
            </div>

            {/* Center — gold medallion badge */}
            <div className="flex flex-col items-center gap-1">
              {/* Gold circle badge */}
              <div
                style={{
                  width: "clamp(50px,7.5vw,90px)",
                  height: "clamp(50px,7.5vw,90px)",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 35% 35%, #f5e07a 0%, #D4AF37 45%, #a07810 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 4px 20px rgba(212,175,55,0.5), inset 0 1px 3px rgba(255,255,255,0.4)",
                  position: "relative",
                  border: "2px solid #f0d060",
                }}
              >
                {/* Stars */}
                <span
                  style={{
                    fontSize: "clamp(5px,0.9vw,11px)",
                    color: "#5a3800",
                    letterSpacing: "1px",
                  }}
                >
                  ★★★
                </span>
                <p
                  className="font-body font-bold text-center"
                  style={{
                    color: "#3a2000",
                    fontSize: "clamp(4px,0.7vw,9px)",
                    lineHeight: 1.2,
                    textAlign: "center",
                    padding: "0 4px",
                  }}
                >
                  KNOT
                  <br />
                  TRUSTED
                </p>
                <span
                  style={{
                    fontSize: "clamp(5px,0.9vw,11px)",
                    color: "#5a3800",
                    letterSpacing: "1px",
                  }}
                >
                  ★★★
                </span>
              </div>
              {/* Blue ribbon */}
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "clamp(8px,1.2vw,14px)",
                    height: "clamp(16px,2.5vw,30px)",
                    background: "linear-gradient(180deg,#1e40af,#1d4ed8)",
                    borderRadius: "0 0 3px 3px",
                  }}
                />
                <div
                  style={{
                    width: "clamp(8px,1.2vw,14px)",
                    height: "clamp(16px,2.5vw,30px)",
                    background: "linear-gradient(180deg,#1e40af,#1d4ed8)",
                    borderRadius: "0 0 3px 3px",
                  }}
                />
              </div>
            </div>

            {/* Right signature */}
            <div className="text-right" style={{ minWidth: "22%" }}>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(212,175,55,0.5)",
                  marginBottom: "4px",
                }}
              />
              <p
                className="font-display font-bold"
                style={{
                  color: "#D4AF37",
                  fontSize: "clamp(7px,1.1vw,13px)",
                  letterSpacing: "0.05em",
                }}
              >
                MD. ABDUL MUSAVEER
              </p>
              <p
                className="font-body font-bold uppercase tracking-widest"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(5px,0.8vw,10px)",
                }}
              >
                MANAGING DIRECTOR
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
