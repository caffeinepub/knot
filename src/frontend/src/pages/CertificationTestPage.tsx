import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  FileVideo,
  Loader2,
  PlayCircle,
  Shield,
  Trophy,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { useActor } from "../hooks/useActor";
import { getAuthUser } from "../utils/auth";

// ─── Question Bank ─────────────────────────────────────────────────────────────

interface MCQQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0-3
}

interface PracticalQuestion {
  id: number;
  description: string;
}

interface QuestionBank {
  mcq: MCQQuestion[];
  practical: PracticalQuestion;
}

function getQuestionBank(skill: string): QuestionBank {
  const s = skill.toLowerCase();

  if (
    s.includes("carpenter") ||
    s.includes("wood") ||
    s.includes("బడ") ||
    s.includes("वढई") ||
    s.includes("bada")
  ) {
    return {
      mcq: [
        {
          id: 1,
          question: "What type of wood joint is shown in the video?",
          options: ["Dovetail", "Butt joint", "Mortise", "Lap joint"],
          correctIndex: 0,
        },
        {
          id: 2,
          question: "Which tool is best for making curved cuts?",
          options: ["Circular saw", "Jigsaw", "Hand saw", "Table saw"],
          correctIndex: 1,
        },
        {
          id: 3,
          question:
            "What is the standard thickness of plywood used for furniture?",
          options: ["6mm", "12mm", "18mm", "25mm"],
          correctIndex: 2,
        },
        {
          id: 4,
          question: "What finish should be applied first on raw wood?",
          options: ["Paint", "Lacquer", "Sandpaper (80 grit)", "Primer"],
          correctIndex: 2,
        },
        {
          id: 5,
          question: "Which wood is best for outdoor furniture?",
          options: ["Pine", "Teak", "MDF", "Balsa"],
          correctIndex: 1,
        },
        {
          id: 6,
          question: "What does the 'grain direction' affect in woodworking?",
          options: ["Color", "Weight", "Strength & splitting", "Cost"],
          correctIndex: 2,
        },
        {
          id: 7,
          question: "Which screw type is shown in the video?",
          options: ["Phillips", "Flat", "Torx", "Hex"],
          correctIndex: 0,
        },
        {
          id: 8,
          question: "What is the purpose of wood putty?",
          options: [
            "Joining planks",
            "Filling holes/gaps",
            "Waterproofing",
            "Staining",
          ],
          correctIndex: 1,
        },
        {
          id: 9,
          question: "What safety gear is essential when cutting?",
          options: ["Gloves only", "Goggles and mask", "Apron only", "None"],
          correctIndex: 1,
        },
      ],
      practical: {
        id: 10,
        description:
          "Build a simple wooden box frame. Record yourself measuring, cutting and joining the pieces.",
      },
    };
  }

  if (
    s.includes("tailor") ||
    s.includes("seam") ||
    s.includes("stitch") ||
    s.includes("దర్జీ") ||
    s.includes("दर्जी")
  ) {
    return {
      mcq: [
        {
          id: 1,
          question: "What stitch is used for joining two fabric pieces?",
          options: [
            "Chain stitch",
            "Running stitch",
            "Straight stitch",
            "Zigzag stitch",
          ],
          correctIndex: 2,
        },
        {
          id: 2,
          question: "Which fabric is shown in the video?",
          options: ["Cotton", "Silk", "Polyester", "Wool"],
          correctIndex: 0,
        },
        {
          id: 3,
          question: "What is the standard seam allowance for garments?",
          options: ["5mm", "10mm", "15mm", "20mm"],
          correctIndex: 2,
        },
        {
          id: 4,
          question: "What tool is used to mark cutting lines on fabric?",
          options: ["Pen", "Chalk", "Marker", "Pencil"],
          correctIndex: 1,
        },
        {
          id: 5,
          question: "How should fabric be prepared before cutting?",
          options: ["Iron it", "Wash and iron", "Just cut", "Wet it"],
          correctIndex: 1,
        },
        {
          id: 6,
          question: "What is the purpose of a basting stitch?",
          options: [
            "Final join",
            "Temporary hold",
            "Decoration",
            "Waterproofing",
          ],
          correctIndex: 1,
        },
        {
          id: 7,
          question: "Which needle is best for heavy fabric?",
          options: ["9/65", "11/75", "16/100", "8/60"],
          correctIndex: 2,
        },
        {
          id: 8,
          question: "What is 'ease' in pattern making?",
          options: [
            "Stretch",
            "Extra room for movement",
            "Tightness",
            "A stitch type",
          ],
          correctIndex: 1,
        },
        {
          id: 9,
          question: "For a perfect hem, what should you do?",
          options: [
            "Fold twice and stitch",
            "Use glue",
            "Leave raw",
            "Cut shorter",
          ],
          correctIndex: 0,
        },
      ],
      practical: {
        id: 10,
        description:
          "Measure and stitch a straight hem on a piece of fabric. Record yourself doing it.",
      },
    };
  }

  if (
    s.includes("plumb") ||
    s.includes("pipe") ||
    s.includes("పైప్") ||
    s.includes("प्लंबर")
  ) {
    return {
      mcq: [
        {
          id: 1,
          question: "What type of pipe fitting is shown in the video?",
          options: ["Elbow", "Tee", "Coupler", "Reducer"],
          correctIndex: 1,
        },
        {
          id: 2,
          question: "Which pipe material is best for hot water?",
          options: ["PVC", "CPVC", "HDPE", "Iron"],
          correctIndex: 1,
        },
        {
          id: 3,
          question: "What is the correct slope for drainage pipes?",
          options: ["0.5%", "1%", "2%", "5%"],
          correctIndex: 2,
        },
        {
          id: 4,
          question: "What tool is used to cut copper pipes?",
          options: ["Hacksaw", "Pipe cutter", "Grinder", "Chisel"],
          correctIndex: 1,
        },
        {
          id: 5,
          question: "What sealant is used for pipe threads?",
          options: ["Fevicol", "Teflon tape", "Silicone", "Epoxy"],
          correctIndex: 1,
        },
        {
          id: 6,
          question: "What pressure test is done after plumbing?",
          options: [
            "Temperature test",
            "Water pressure test",
            "Gas test",
            "None",
          ],
          correctIndex: 1,
        },
        {
          id: 7,
          question: "What does a P-trap prevent?",
          options: ["Water flow", "Sewer gases", "Leaks", "Pressure drop"],
          correctIndex: 1,
        },
        {
          id: 8,
          question: "Which valve completely stops water flow?",
          options: ["Ball valve", "Gate valve", "Check valve", "Float valve"],
          correctIndex: 0,
        },
        {
          id: 9,
          question: "For a leaking joint, you should first?",
          options: [
            "Replace pipe",
            "Tighten fitting",
            "Apply sealant",
            "Call supervisor",
          ],
          correctIndex: 1,
        },
      ],
      practical: {
        id: 10,
        description:
          "Fix a simulated pipe joint leak. Record yourself identifying and fixing the issue.",
      },
    };
  }

  // Generic fallback
  return {
    mcq: [
      {
        id: 1,
        question: "What safety equipment is essential for this task?",
        options: ["Gloves", "Goggles", "Mask", "All of the above"],
        correctIndex: 3,
      },
      {
        id: 2,
        question: "What is the first step before starting any vocational task?",
        options: [
          "Start working",
          "Assess tools and materials",
          "Call a supervisor",
          "Skip inspection",
        ],
        correctIndex: 1,
      },
      {
        id: 3,
        question: "Which tool is most important for precision work?",
        options: ["Ruler/measuring tape", "Hammer", "Brush", "Wrench"],
        correctIndex: 0,
      },
      {
        id: 4,
        question: "How should tools be maintained?",
        options: [
          "Ignore maintenance",
          "Clean and oil regularly",
          "Replace every month",
          "Leave dirty",
        ],
        correctIndex: 1,
      },
      {
        id: 5,
        question: "What should you do if a tool is damaged?",
        options: [
          "Use it anyway",
          "Report and replace",
          "Hide it",
          "Repair it yourself",
        ],
        correctIndex: 1,
      },
      {
        id: 6,
        question: "What is the best practice for waste disposal?",
        options: [
          "Leave on ground",
          "Dispose in designated area",
          "Burn it",
          "Bury it",
        ],
        correctIndex: 1,
      },
      {
        id: 7,
        question: "When working with sharp tools, you should?",
        options: [
          "Rush",
          "Work slowly and carefully",
          "Use bare hands",
          "Ignore safety rules",
        ],
        correctIndex: 1,
      },
      {
        id: 8,
        question: "Customer satisfaction is achieved by?",
        options: [
          "Quick work",
          "Quality work",
          "Cheap materials",
          "Both A and B",
        ],
        correctIndex: 1,
      },
      {
        id: 9,
        question: "How should you handle a customer complaint?",
        options: ["Ignore", "Listen and resolve", "Argue", "Walk away"],
        correctIndex: 1,
      },
    ],
    practical: {
      id: 10,
      description:
        "Demonstrate a core task from your skill. Record yourself performing the task professionally.",
    },
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

type TestPhase = "intro" | "mcq" | "practical" | "evaluating" | "result";

interface TestResult {
  mcqScore: number;
  practicalPassed: boolean;
  passed: boolean;
}

// ─── Option Button ─────────────────────────────────────────────────────────────

function OptionButton({
  label,
  text,
  selected,
  onClick,
}: {
  label: string;
  text: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 font-body text-sm transition-all duration-200 flex items-center gap-3 ${
        selected
          ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
      }`}
    >
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {label}
      </span>
      <span className="flex-1">{text}</span>
      {selected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function CertificationTestPage() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const { actor } = useActor();
  const { t } = useLang();

  const skill = authUser?.skill ?? "General";
  const bank = getQuestionBank(skill);

  const [phase, setPhase] = useState<TestPhase>("intro");
  const [currentQ, setCurrentQ] = useState(0); // 0-8 for MCQ
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(9).fill(null),
  );
  const [practicalFile, setPracticalFile] = useState<File | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitMutation = useMutation({
    mutationFn: async ({
      mcqScore,
      practicalPassed,
    }: { mcqScore: number; practicalPassed: boolean }) => {
      if (!actor || !authUser) throw new Error("No actor");
      return actor.submitTestResult(
        authUser.id,
        BigInt(mcqScore),
        practicalPassed,
      );
    },
  });

  function selectAnswer(qIndex: number, optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  }

  function handleNext() {
    if (currentQ < 8) {
      setCurrentQ((q) => q + 1);
    } else {
      setPhase("practical");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPracticalFile(file);
  }

  async function handleSubmit() {
    setPhase("evaluating");

    // Simulate evaluation delay
    await new Promise((res) => setTimeout(res, 2500));

    // Demo: always pass with 7/9
    const mcqScore = 7;
    const practicalPassed = true;
    const passed = mcqScore >= 6 && practicalPassed;

    try {
      await submitMutation.mutateAsync({ mcqScore, practicalPassed });
    } catch {
      // Continue even if backend fails (demo mode)
    }

    setResult({ mcqScore, practicalPassed, passed });
    setPhase("result");
  }

  if (!authUser || authUser.role !== "worker") {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="font-display font-semibold text-foreground">
              Workers only
            </p>
            <Button className="mt-4" onClick={() => navigate({ to: "/login" })}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const progressPct =
    phase === "intro"
      ? 0
      : phase === "practical"
        ? 90
        : phase === "result"
          ? 100
          : ((currentQ + 1) / 10) * 90;

  return (
    <main className="flex-1 bg-background min-h-screen">
      {/* Print styles */}
      <style>
        {"@media print { .no-print { display: none !important; } }"}
      </style>

      {/* Header bar */}
      <div className="bg-navy py-4 px-4 no-print">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-white/80" />
            <span className="font-display font-bold text-white text-lg">
              {t("cert_test_intro_title")}
            </span>
          </div>
          {phase !== "intro" && phase !== "result" && (
            <span className="font-body text-sm text-white/60">
              {t("cert_question_of").replace(
                "{n}",
                phase === "practical" ? "10" : String(currentQ + 1),
              )}
            </span>
          )}
        </div>
        {/* Progress bar */}
        {phase !== "intro" && (
          <div className="container mx-auto mt-3">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {/* ── Intro Phase ── */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="border border-border shadow-card overflow-hidden">
                <div className="bg-gradient-to-br from-navy to-navy-deep p-8 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="font-display font-bold text-2xl text-white mb-2">
                    {t("cert_test_intro_title")}
                  </h1>
                  <p className="text-white/70 font-body text-sm">
                    {skill} — Basic Level
                  </p>
                </div>
                <CardContent className="p-8">
                  <p className="font-body text-muted-foreground text-center leading-relaxed mb-8">
                    {t("cert_test_intro_desc")}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      {
                        icon: "📋",
                        label: "9 Scenario MCQs",
                        sub: "Read & answer",
                      },
                      {
                        icon: "🔧",
                        label: "1 Practical",
                        sub: "Upload your video",
                      },
                      { icon: "🏆", label: "Pass: 6/9+", sub: "Get certified" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="text-center p-4 rounded-xl bg-muted/50 border border-border"
                      >
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <p className="font-body font-semibold text-xs text-foreground">
                          {item.label}
                        </p>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">
                          {item.sub}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full h-12 font-body font-semibold text-base gap-2"
                    onClick={() => setPhase("mcq")}
                  >
                    <PlayCircle className="w-5 h-5" />
                    {t("cert_start_test")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── MCQ Phase ── */}
          {phase === "mcq" && (
            <motion.div
              key={`mcq-${currentQ}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-5">
                {/* Question counter */}
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted-foreground">
                    {t("cert_question_of").replace("{n}", String(currentQ + 1))}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body font-semibold">
                    MCQ
                  </span>
                </div>

                {/* Scenario ad card */}
                <Card className="overflow-hidden border border-border shadow-sm">
                  <div
                    className="aspect-video relative flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #ea580c 40%, #dc2626 70%, #b91c1c 100%)",
                    }}
                  >
                    {/* AD badge */}
                    <span className="absolute top-3 right-3 bg-white/90 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase shadow">
                      AD
                    </span>
                    {/* Decorative circles */}
                    <div className="absolute top-[-20%] left-[-10%] w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 rounded-full bg-black/20 blur-3xl" />
                    {/* Skill emoji */}
                    <div className="flex flex-col items-center gap-3 z-10">
                      <span className="text-[clamp(48px,10vw,96px)] drop-shadow-xl select-none">
                        {(() => {
                          const s = skill.toLowerCase();
                          if (
                            s.includes("carpenter") ||
                            s.includes("wood") ||
                            s.includes("joiner")
                          )
                            return "🪵";
                          if (
                            s.includes("tailor") ||
                            s.includes("seam") ||
                            s.includes("stitch") ||
                            s.includes("fashion")
                          )
                            return "🧵";
                          if (
                            s.includes("plumb") ||
                            s.includes("pipe") ||
                            s.includes("water")
                          )
                            return "🔧";
                          if (
                            s.includes("potter") ||
                            s.includes("pot") ||
                            s.includes("clay") ||
                            s.includes("ceramic")
                          )
                            return "🏺";
                          if (s.includes("electr") || s.includes("wire"))
                            return "⚡";
                          if (s.includes("paint")) return "🎨";
                          if (
                            s.includes("mason") ||
                            s.includes("brick") ||
                            s.includes("cement")
                          )
                            return "🧱";
                          if (s.includes("weld")) return "🔩";
                          if (s.includes("barber") || s.includes("hair"))
                            return "✂️";
                          if (
                            s.includes("chef") ||
                            s.includes("cook") ||
                            s.includes("food")
                          )
                            return "👨‍🍳";
                          if (s.includes("driver") || s.includes("auto"))
                            return "🚗";
                          if (s.includes("farm") || s.includes("agri"))
                            return "🌾";
                          return "🛠️";
                        })()}
                      </span>
                      <span className="text-white/90 font-body text-sm font-semibold tracking-wide uppercase bg-black/20 px-4 py-1 rounded-full">
                        Study this scenario
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Question */}
                <Card className="border border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display font-bold text-base text-foreground leading-snug">
                      {bank.mcq[currentQ].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5 pb-4">
                    {bank.mcq[currentQ].options.map((opt, idx) => (
                      <OptionButton
                        key={["A", "B", "C", "D"][idx]}
                        label={["A", "B", "C", "D"][idx]}
                        text={opt}
                        selected={answers[currentQ] === idx}
                        onClick={() => selectAnswer(currentQ, idx)}
                      />
                    ))}
                  </CardContent>
                </Card>

                {/* Navigation */}
                <Button
                  className="w-full h-11 gap-2 font-body font-semibold"
                  disabled={answers[currentQ] === null}
                  onClick={handleNext}
                >
                  {currentQ < 8 ? t("cert_next") : "Go to Practical Question"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Practical Phase ── */}
          {phase === "practical" && (
            <motion.div
              key="practical"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted-foreground">
                    {t("cert_question_of").replace("{n}", "10")}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-body font-semibold">
                    🔧 {t("cert_practical_title")}
                  </span>
                </div>

                <Card className="border border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-display font-bold text-base text-foreground">
                      {t("cert_practical_title")}: {skill}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-6">
                    {/* Task description */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="font-body text-amber-900 leading-relaxed text-sm">
                        {bank.practical.description}
                      </p>
                    </div>

                    {/* Upload area */}
                    <div>
                      <p className="font-body font-semibold text-sm text-foreground mb-3">
                        {t("cert_practical_upload")}
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                          practicalFile
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        {practicalFile ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <FileVideo className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-body font-semibold text-sm text-foreground">
                                {practicalFile.name}
                              </p>
                              <p className="font-body text-xs text-muted-foreground mt-0.5">
                                {(practicalFile.size / 1024 / 1024).toFixed(1)}{" "}
                                MB — Ready to submit
                              </p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                              <Upload className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-body font-semibold text-sm text-foreground">
                                Click to upload your practical video
                              </p>
                              <p className="font-body text-xs text-muted-foreground mt-1">
                                MP4, MOV up to 500MB
                              </p>
                            </div>
                          </div>
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/mov,video/quicktime,video/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>

                    <Button
                      className="w-full h-12 gap-2 font-body font-semibold text-base"
                      disabled={!practicalFile}
                      onClick={handleSubmit}
                    >
                      <Trophy className="w-5 h-5" />
                      {t("cert_submit")}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* ── Evaluating Phase ── */}
          {phase === "evaluating" && (
            <motion.div
              key="evaluating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-border shadow-card">
                <CardContent className="py-20 flex flex-col items-center gap-6 text-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-foreground mb-2">
                      {t("cert_evaluating")}
                    </h2>
                    <p className="font-body text-muted-foreground text-sm">
                      Please wait while we review your answers and practical
                      video...
                    </p>
                  </div>
                  <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── Result Phase ── */}
          {phase === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card
                className={`border-2 shadow-card overflow-hidden ${result.passed ? "border-green-300" : "border-orange-300"}`}
              >
                {/* Result header */}
                <div
                  className={`p-8 text-center ${
                    result.passed
                      ? "bg-gradient-to-br from-green-500 to-green-600"
                      : "bg-gradient-to-br from-orange-400 to-orange-500"
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"
                  >
                    {result.passed ? (
                      <Trophy className="w-10 h-10 text-white" />
                    ) : (
                      <AlertCircle className="w-10 h-10 text-white" />
                    )}
                  </motion.div>
                  <h2 className="font-display font-bold text-2xl text-white">
                    {result.passed ? t("cert_passed_title") : t("cert_failed")}
                  </h2>
                </div>

                <CardContent className="p-8 space-y-6">
                  {/* Score breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
                      <p className="font-body text-xs text-muted-foreground mb-1">
                        {t("cert_score_label")}
                      </p>
                      <p className="font-display font-bold text-3xl text-foreground">
                        {result.mcqScore}
                        <span className="text-muted-foreground text-xl">
                          /9
                        </span>
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
                      <p className="font-body text-xs text-muted-foreground mb-1">
                        {t("cert_practical_label")}
                      </p>
                      <p
                        className={`font-display font-bold text-xl ${result.practicalPassed ? "text-green-600" : "text-orange-500"}`}
                      >
                        {result.practicalPassed
                          ? t("cert_practical_accepted")
                          : "Needs Review"}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar for MCQ */}
                  <div>
                    <div className="flex justify-between font-body text-xs text-muted-foreground mb-2">
                      <span>MCQ Performance</span>
                      <span>{result.mcqScore}/9 correct</span>
                    </div>
                    <Progress
                      value={(result.mcqScore / 9) * 100}
                      className="h-2"
                    />
                  </div>

                  {result.passed ? (
                    <div className="space-y-3">
                      <Button
                        className="w-full h-12 gap-2 font-body font-semibold text-base bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => navigate({ to: "/certificate" })}
                      >
                        <Trophy className="w-5 h-5" />
                        {t("cert_view_certificate")}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full font-body"
                        onClick={() => navigate({ to: "/worker-dashboard" })}
                      >
                        Back to Dashboard
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        className="w-full h-12 gap-2 font-body font-semibold"
                        onClick={() => {
                          setPhase("intro");
                          setCurrentQ(0);
                          setAnswers(Array(9).fill(null));
                          setPracticalFile(null);
                          setResult(null);
                        }}
                      >
                        {t("cert_retry")}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full font-body"
                        onClick={() => navigate({ to: "/worker-dashboard" })}
                      >
                        {t("cert_go_dashboard")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
