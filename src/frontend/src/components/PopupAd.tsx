import { ExternalLink, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── Google AdSense Configuration ─────────────────────────────────────────────
//
// HOW TO ENABLE REAL ADS AND EARN REVENUE:
//
// STEP 1: Go to https://adsense.google.com and sign up with your Google account
// STEP 2: Add your website domain (e.g. knot-app.your-domain.com) and wait for verification
// STEP 3: Once approved, go to AdSense dashboard → Your Publisher ID (looks like: ca-pub-1234567890123456)
// STEP 4: Create two ad units in AdSense:
//           - Banner ad unit (horizontal, 728x90 or responsive)
//           - Rectangle ad unit (300x250 for popup)
//         Each unit gives you a slot ID (e.g. 1234567890)
// STEP 5: Replace the three values below with your real IDs:
//           ADSENSE_CLIENT  → your Publisher ID  (e.g. "ca-pub-1234567890123456")
//           BANNER_AD_SLOT  → your banner ad unit ID
//           POPUP_AD_SLOT   → your rectangle ad unit ID
//
// Once these are set, real ads from Google's network will replace the demo placeholders
// and you will earn revenue for every impression and click.
//
const ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX";
const BANNER_AD_SLOT = "1234567890"; // Replace with your banner ad unit ID
const POPUP_AD_SLOT = "0987654321"; // Replace with your popup ad unit ID

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

function loadAdSenseScript() {
  if (typeof document === "undefined") return;
  if (document.querySelector('script[src*="pagead2.googlesyndication.com"]'))
    return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
}

function pushAdSlot() {
  try {
    if (!window.adsbygoogle) window.adsbygoogle = [];
    window.adsbygoogle.push({});
  } catch {
    // AdSense not loaded or blocked
  }
}

const isRealPublisherId = !ADSENSE_CLIENT.includes("XXXXXXXX");

// ── Fallback / Placeholder Ads (shown until real AdSense is configured) ───────

interface FallbackAd {
  id: string;
  title: string;
  description: string;
  cta: string;
  url: string;
  emoji: string;
  bgGradient: string;
  accentColor: string;
  textColor: string;
  tag: string;
}

const FALLBACK_ADS: FallbackAd[] = [
  {
    id: "ad_tools",
    title: "Pro Tools for Craftsmen",
    description:
      "Drills, saws, hammers & more — factory prices delivered to your door. Used by 50,000+ skilled workers.",
    cta: "Shop Tools →",
    url: "https://www.amazon.in/tools",
    emoji: "🔨",
    bgGradient: "linear-gradient(135deg, #1a3a5c 0%, #0f2035 100%)",
    accentColor: "#f59e0b",
    textColor: "#ffffff",
    tag: "Sponsored",
  },
  {
    id: "ad_training",
    title: "Free Skill Certification Videos",
    description:
      "Master advanced techniques. 200+ hours of free vocational training content from India's top craftsmen.",
    cta: "Start Learning Free →",
    url: "#",
    emoji: "🎓",
    bgGradient: "linear-gradient(135deg, #134e1e 0%, #052e0f 100%)",
    accentColor: "#4ade80",
    textColor: "#ffffff",
    tag: "Sponsored",
  },
  {
    id: "ad_insurance",
    title: "Worker Income Protection",
    description:
      "Special insurance plans for carpenters, tailors, plumbers & more. Low monthly premiums across India.",
    cta: "Get Covered Today →",
    url: "#",
    emoji: "🛡️",
    bgGradient: "linear-gradient(135deg, #3b1278 0%, #1e0850 100%)",
    accentColor: "#c084fc",
    textColor: "#ffffff",
    tag: "Sponsored",
  },
  {
    id: "ad_materials",
    title: "Raw Materials at Wholesale",
    description:
      "Wood, fabric, pipes, paint & more at factory prices. Free delivery on orders above ₹500.",
    cta: "Order Now →",
    url: "#",
    emoji: "🏭",
    bgGradient: "linear-gradient(135deg, #7c2000 0%, #3d0f00 100%)",
    accentColor: "#fb923c",
    textColor: "#ffffff",
    tag: "Sponsored",
  },
  {
    id: "ad_loan",
    title: "Business Loan for Workers",
    description:
      "Grow your craft business. Get up to ₹5 lakhs with minimal documentation. Quick approval.",
    cta: "Apply for Loan →",
    url: "#",
    emoji: "💰",
    bgGradient: "linear-gradient(135deg, #1a4a2e 0%, #0b2416 100%)",
    accentColor: "#34d399",
    textColor: "#ffffff",
    tag: "Sponsored",
  },
];

// ── Banner Ad (inline in feed / assessment) ───────────────────────────────────

export function BannerAd({ className = "" }: { className?: string }) {
  const insRef = useRef<HTMLModElement>(null);
  const [adIndex] = useState(() =>
    Math.floor(Math.random() * FALLBACK_ADS.length),
  );
  const ad = FALLBACK_ADS[adIndex];

  useEffect(() => {
    loadAdSenseScript();
    if (isRealPublisherId) {
      const timer = setTimeout(() => {
        pushAdSlot();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-md border border-white/10 ${className}`}
      data-ocid="banner_ad.card"
    >
      {isRealPublisherId ? (
        <div className="min-h-[90px] bg-gray-50 flex items-center justify-center">
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: "90px" }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot={BANNER_AD_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        <a
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.preventDefault()}
          className="block no-underline"
          data-ocid="banner_ad.link"
        >
          <div
            className="px-5 py-4 flex items-center gap-4 cursor-pointer group transition-opacity hover:opacity-95"
            style={{ background: ad.bgGradient }}
          >
            <span className="text-4xl select-none drop-shadow-lg">
              {ad.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-widest"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: ad.accentColor,
                    border: `1px solid ${ad.accentColor}40`,
                  }}
                >
                  {ad.tag}
                </span>
                <p className="font-display font-bold text-white text-sm truncate">
                  {ad.title}
                </p>
              </div>
              <p className="font-body text-white/65 text-xs leading-snug line-clamp-1">
                {ad.description}
              </p>
            </div>
            <div
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-body font-bold transition-all group-hover:opacity-90 whitespace-nowrap"
              style={{ background: ad.accentColor, color: "#000" }}
              data-ocid="banner_ad.cta_button"
            >
              {ad.cta}
            </div>
          </div>
          {/* Demo label — only shown until real AdSense is configured */}
          <div className="px-3 py-1 bg-black/50 text-center">
            <p className="font-body text-[9px] text-white/40 tracking-wide">
              Demo ad · Configure AdSense (see PopupAd.tsx) to earn real revenue
            </p>
          </div>
        </a>
      )}
    </div>
  );
}

// ── Popup Ad (bottom-right, appears after 8s) ────────────────────────────────

export function PopupAd() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [adIndex] = useState(() =>
    Math.floor(Math.random() * FALLBACK_ADS.length),
  );
  const ad = FALLBACK_ADS[adIndex];
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    loadAdSenseScript();
  }, []);

  // Show after 8 seconds
  useEffect(() => {
    const t = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 8000);
    return () => clearTimeout(t);
  }, [dismissed]);

  // Re-show every 2 minutes
  useEffect(() => {
    if (dismissed) {
      const t = setTimeout(
        () => {
          setDismissed(false);
        },
        2 * 60 * 1000,
      );
      return () => clearTimeout(t);
    }
  }, [dismissed]);

  useEffect(() => {
    if (visible && isRealPublisherId) {
      setTimeout(() => pushAdSlot(), 100);
    }
  }, [visible]);

  function handleDismiss() {
    setVisible(false);
    setDismissed(true);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="popup-ad"
          initial={{ opacity: 0, scale: 0.88, y: 48 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 48 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-6 right-6 z-50 w-[320px] rounded-2xl overflow-hidden shadow-2xl"
          data-ocid="popup_ad.modal"
        >
          {isRealPublisherId ? (
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
              <div className="flex items-center justify-between px-4 pt-3 pb-2 bg-gray-50 border-b border-gray-200">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Sponsored
                </span>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  data-ocid="popup_ad.close_button"
                >
                  <X className="w-3 h-3 text-gray-600" />
                </button>
              </div>
              <div className="p-2 min-h-[250px]">
                <ins
                  ref={insRef}
                  className="adsbygoogle"
                  style={{
                    display: "block",
                    width: "100%",
                    minHeight: "250px",
                  }}
                  data-ad-client={ADSENSE_CLIENT}
                  data-ad-slot={POPUP_AD_SLOT}
                  data-ad-format="rectangle"
                />
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden border border-white/10"
              style={{ background: ad.bgGradient }}
            >
              {/* Header bar */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: ad.accentColor,
                    border: `1px solid ${ad.accentColor}40`,
                  }}
                >
                  {ad.tag}
                </span>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  data-ocid="popup_ad.close_button"
                >
                  <X className="w-3.5 h-3.5 text-white/70" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 pb-5 flex flex-col items-center text-center gap-3">
                <span className="text-6xl select-none drop-shadow-xl">
                  {ad.emoji}
                </span>
                <div>
                  <h3 className="font-display font-bold text-white text-lg mb-1.5">
                    {ad.title}
                  </h3>
                  <p className="font-body text-white/65 text-sm leading-relaxed">
                    {ad.description}
                  </p>
                </div>
                <a
                  href={ad.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDismiss();
                  }}
                  className="w-full py-3 rounded-xl text-sm font-body font-bold text-center transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-1.5"
                  style={{ background: ad.accentColor, color: "#000" }}
                  data-ocid="popup_ad.cta_button"
                >
                  {ad.cta}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="font-body text-xs text-white/35 hover:text-white/55 transition-colors"
                  data-ocid="popup_ad.dismiss_button"
                >
                  No thanks, close ad
                </button>
                {/* Demo label — only shown until real AdSense is configured */}
                <p className="font-body text-[9px] text-white/25 tracking-wide">
                  Demo ad · Configure AdSense to earn real revenue
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
