import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-navy mt-auto py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/20">
                <img
                  src="/assets/uploads/image-14-1.png"
                  alt="KNOT"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-bold text-white text-lg">
                KNOT
              </span>
            </div>
            <p className="text-white/50 text-sm font-body leading-relaxed">
              {t("home_hero_connect")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-3 tracking-wide uppercase">
              {t("nav_dashboard")}
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link
                  to="/"
                  className="text-white/50 hover:text-white/80 text-sm font-body transition-colors"
                >
                  {t("nav_home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/requests"
                  className="text-white/50 hover:text-white/80 text-sm font-body transition-colors"
                >
                  {t("nav_learning_requests")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs font-body">
            © 2026 KNOT. Skills • Trust • Community
          </p>
          <p className="text-white/40 text-xs font-body flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-accent fill-accent" /> for
            vocational communities
          </p>
        </div>
      </div>
    </footer>
  );
}
