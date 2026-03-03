import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface AdConfig {
  id: string;
  title: string;
  description: string;
  cta: string;
  url: string;
  emoji: string;
  bgFrom: string;
  bgTo: string;
  accentColor: string;
}

const ADS: AdConfig[] = [
  {
    id: "ad_tools",
    title: "Upgrade Your Tools",
    description:
      "Get professional-grade tools delivered to your door. Trusted by 50,000+ craftsmen.",
    cta: "Shop Now",
    url: "#",
    emoji: "🔧",
    bgFrom: "#1e3a5f",
    bgTo: "#0f2340",
    accentColor: "#f59e0b",
  },
  {
    id: "ad_training",
    title: "Free Skill Training Videos",
    description:
      "Learn advanced techniques from master craftsmen. 200+ hours of free content.",
    cta: "Watch Free",
    url: "#",
    emoji: "🎓",
    bgFrom: "#14532d",
    bgTo: "#052e16",
    accentColor: "#4ade80",
  },
  {
    id: "ad_insurance",
    title: "Worker Insurance Plans",
    description:
      "Protect yourself and your income. Special rates for vocational workers.",
    cta: "Get Covered",
    url: "#",
    emoji: "🛡️",
    bgFrom: "#4c1d95",
    bgTo: "#2e1065",
    accentColor: "#c084fc",
  },
  {
    id: "ad_materials",
    title: "Raw Materials at Wholesale",
    description:
      "Buy wood, fabric, pipes & more at factory prices. Free delivery on ₹500+",
    cta: "Order Now",
    url: "#",
    emoji: "🏭",
    bgFrom: "#7c2d12",
    bgTo: "#431407",
    accentColor: "#fb923c",
  },
];

// Banner ad shown inline in the feed
export function BannerAd({ className = "" }: { className?: string }) {
  const [adIndex] = useState(() => Math.floor(Math.random() * ADS.length));
  const ad = ADS[adIndex];

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-border shadow-sm ${className}`}
      style={{
        background: `linear-gradient(135deg, ${ad.bgFrom} 0%, ${ad.bgTo} 100%)`,
      }}
      data-ocid="banner_ad.card"
    >
      <div className="px-5 py-4 flex items-center gap-4">
        <span className="text-4xl select-none">{ad.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: ad.accentColor,
              }}
            >
              AD
            </span>
            <p className="font-display font-bold text-white text-sm truncate">
              {ad.title}
            </p>
          </div>
          <p className="font-body text-white/70 text-xs leading-snug line-clamp-1">
            {ad.description}
          </p>
        </div>
        <a
          href={ad.url}
          onClick={(e) => e.preventDefault()}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ background: ad.accentColor, color: "#000" }}
          data-ocid="banner_ad.cta_button"
        >
          {ad.cta}
        </a>
      </div>
    </div>
  );
}

// Pop-up ad shown after a delay
export function PopupAd() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [adIndex] = useState(() => Math.floor(Math.random() * ADS.length));
  const ad = ADS[adIndex];

  useEffect(() => {
    // Show after 8 seconds
    const showTimer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 8000);

    return () => clearTimeout(showTimer);
  }, [dismissed]);

  // Re-show every 3 minutes if user stays on page
  useEffect(() => {
    if (dismissed) {
      const reshowTimer = setTimeout(
        () => {
          setDismissed(false);
          setVisible(true);
        },
        3 * 60 * 1000,
      );
      return () => clearTimeout(reshowTimer);
    }
  }, [dismissed]);

  function handleDismiss() {
    setVisible(false);
    setDismissed(true);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="popup-ad"
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{
            background: `linear-gradient(135deg, ${ad.bgFrom} 0%, ${ad.bgTo} 100%)`,
          }}
          data-ocid="popup_ad.modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: ad.accentColor,
              }}
            >
              Sponsored
            </span>
            <button
              type="button"
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              data-ocid="popup_ad.close_button"
            >
              <X className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 pb-5 flex flex-col items-center text-center gap-3">
            <span className="text-5xl select-none drop-shadow-lg">
              {ad.emoji}
            </span>
            <div>
              <h3 className="font-display font-bold text-white text-lg mb-1">
                {ad.title}
              </h3>
              <p className="font-body text-white/70 text-sm leading-relaxed">
                {ad.description}
              </p>
            </div>
            <a
              href={ad.url}
              onClick={(e) => {
                e.preventDefault();
                handleDismiss();
              }}
              className="w-full py-2.5 rounded-xl text-sm font-body font-semibold text-center transition-all hover:opacity-90 active:scale-95"
              style={{ background: ad.accentColor, color: "#000" }}
              data-ocid="popup_ad.cta_button"
            >
              {ad.cta}
            </a>
            <button
              type="button"
              onClick={handleDismiss}
              className="font-body text-xs text-white/40 hover:text-white/60 transition-colors"
              data-ocid="popup_ad.dismiss_button"
            >
              Not interested
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
