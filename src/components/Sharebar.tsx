/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { trackShare } from "@/utils";
import { FaFacebook, FaLinkedin, FaShareSquare } from "react-icons/fa";

interface SharebarProps {
  absoluteUrl: string;
}

export const Sharebar = ({ absoluteUrl }: SharebarProps) => {
  // Prefer the current location when available so scrapers use the exact URL being viewed (avoids cross-domain redirect issues)
  const shareUrl =
    typeof window !== "undefined" && window.location?.href
      ? window.location.href
      : absoluteUrl;

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;

  const canWebShare =
    typeof navigator !== "undefined" &&
    typeof (navigator as any).share === "function";

  const onWebShare = async () => {
    try {
      await (navigator as any).share({
        url: shareUrl,
        title:
          typeof document !== "undefined" && document.title
            ? document.title
            : undefined,
      });
      trackShare("webshare");
    } catch {
      // user cancelled or unsupported
    }
  };

  // Determine locale to show "Share" or "Partager"
  const [locale, setLocale] = React.useState<"en" | "fr">("en");
  React.useEffect(() => {
    try {
      // 1) <html lang="fr"> wins
      const htmlLang =
        typeof document !== "undefined"
          ? (document.documentElement.lang || "").toLowerCase()
          : "";

      // 2) URL path prefix like /fr, /fr-FR, /fr-CA
      const path =
        typeof window !== "undefined" ? window.location?.pathname || "" : "";
      const pathLooksFrench = /^\/(fr|fr-fr|fr-ca)(\/|$)/i.test(path);

      // 3) absoluteUrl path (SSR fallback)
      let absLooksFrench = false;
      if (!path && absoluteUrl) {
        try {
          const u = new URL(absoluteUrl);
          absLooksFrench = /^\/(fr|fr-fr|fr-ca)(\/|$)/i.test(u.pathname);
        } catch {
          // ignore
        }
      }

      // 4) Navigator language as a last hint
      const navLang =
        typeof navigator !== "undefined"
          ? (navigator.language || "").toLowerCase()
          : "";

      if (
        htmlLang.startsWith("fr") ||
        pathLooksFrench ||
        absLooksFrench ||
        navLang.startsWith("fr")
      ) {
        setLocale("fr");
      } else {
        setLocale("en");
      }
    } catch {
      setLocale("en");
    }
  }, [absoluteUrl]);

  const t = {
    share: locale === "fr" ? "Partager:" : "Share:",
    linkedin: locale === "fr" ? "Partager sur LinkedIn" : "Share on LinkedIn",
    facebook: locale === "fr" ? "Partager sur Facebook" : "Share on Facebook",
    device: locale === "fr" ? "Partager via l'appareil" : "Share via device",
  };

  // Measure the initial width of the label vs. the whole bar so the pink highlight starts under the label
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const labelRef = React.useRef<HTMLSpanElement | null>(null);
  const [initialScale, setInitialScale] = React.useState(0.35);

  React.useEffect(() => {
    const computeScale = () => {
      const bar = barRef.current;
      const label = labelRef.current;
      if (!bar || !label) return;
      const barWidth = bar.getBoundingClientRect().width;
      const labelWidth = label.getBoundingClientRect().width;
      if (barWidth > 0) {
        // Clamp 0..1, add a tiny padding so highlight peeks beyond label edges a bit
        const ratio = Math.max(0, Math.min(1, (labelWidth + 8) / barWidth));
        setInitialScale(ratio);
      }
    };

    computeScale();
    window.addEventListener("resize", computeScale);
    return () => window.removeEventListener("resize", computeScale);
  }, []);

  // Open a centered popup; return the window or null if blocked
  const openCenteredPopup = (
    url: string,
    name: string,
    w = 740,
    h = 600
  ): Window | null => {
    try {
      const dualLeft = (window as any).screenLeft ?? window.screenX ?? 0;
      const dualTop = (window as any).screenTop ?? window.screenY ?? 0;
      const width =
        window.innerWidth ??
        document.documentElement.clientWidth ??
        screen.width;
      const height =
        window.innerHeight ??
        document.documentElement.clientHeight ??
        screen.height;

      const left = Math.max(0, dualLeft + (width - w) / 2);
      const top = Math.max(0, dualTop + (height - h) / 2);

      const features = [
        "scrollbars=yes",
        `width=${w}`,
        `height=${h}`,
        `top=${Math.floor(top)}`,
        `left=${Math.floor(left)}`,
        "noopener",
      ].join(",");

      const win = window.open(url, name, features);
      if (win && typeof win.focus === "function") {
        win.focus();
      }
      return win;
    } catch {
      return null;
    }
  };

  // Prevent default nav; open popup; fall back to NEW TAB (not same-tab); preserve modifier-click behavior
  const handlePopupShare =
    (platform: "linkedin" | "facebook", href: string) =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Allow user-intended new-tab actions (Cmd/Ctrl/Shift/Alt or middle-click)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) {
        trackShare(platform);
        return; // let browser handle it (usually new tab)
      }

      e.preventDefault();
      trackShare(platform);

      const win = openCenteredPopup(href, `${platform}-share`, 740, 600);

      // If popup blocked/unsupported, open in a new tab instead of navigating away
      if (!win) {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    };

  // Icons: keep color change on bar hover; enlarge ONLY the hovered icon
  const iconBaseClasses =
    "block transform origin-center will-change-transform transition-transform transition-colors duration-300 ease-out " +
    "text-[#6D00FF] group-hover:text-white " + // color flips when bar hover
    "hover:scale-[1.3] focus-visible:scale-[1.3]"; // specific icon emphasis

  return (
    // Wrapper ensures glow is visible even if inner bar uses overflow-hidden
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative inline-flex items-center group">
        {/* Always-visible glow behind the full bar (not clipped by overflow-hidden) */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute -inset-6 z-0
            rounded-full
            blur-3xl
            opacity-95
            transition-transform duration-300 ease-out
            bg-[radial-gradient(ellipse_at_center,rgba(253,52,151,0.5),rgba(109,0,255,0.4)_55%,transparent_75%)]
            group-hover:scale-[1.03]
          "
        />

        {/* Actual bar */}
        <div
          ref={barRef}
          className="
            relative z-10
            flex items-center
            rounded-full bg-white/90 shadow-lg
            text-sm font-medium text-gray-800
            border border-neon-violet
            backdrop-blur-md
            overflow-hidden
          "
          // CSS variable controls the starting width of the highlight; on hover, it's set to 1 via Tailwind arbitrary property
          style={
            {
              "--highlight-scale": initialScale,
            } as React.CSSProperties
          }
        >
          {/* Expanding pink highlight that starts under the label and grows to cover the bar on hover */}
          <div
            className="
              absolute inset-y-0 left-0 w-full
              bg-neon-violet
              origin-left
              transition-[transform] duration-500 ease-out
              pointer-events-none
              z-0
              group-hover:[--highlight-scale:1]
              will-change-transform
            "
            style={{
              transform: "scaleX(var(--highlight-scale, 0.35))",
            }}
            aria-hidden="true"
          />

          {/* Foreground content */}
          <span
            ref={labelRef}
            className="
              relative z-10
              pl-4 pr-2 pt-1 pb-2
              text-white
              transition-colors duration-300
              select-none
              text-[1.2rem]
            "
          >
            {t.share}
          </span>

          <div className="relative z-10 flex flex-row items-center justify-center gap-3 px-4 py-2">
            {/* LinkedIn */}
            <a
              href={linkedinHref}
              aria-label={t.linkedin}
              className="px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-full"
              onClick={handlePopupShare("linkedin", linkedinHref)}
            >
              <FaLinkedin className={iconBaseClasses} size={30} />
            </a>

            {/* Facebook */}
            <a
              href={facebookHref}
              aria-label={t.facebook}
              className="px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-full"
              onClick={handlePopupShare("facebook", facebookHref)}
            >
              <FaFacebook className={iconBaseClasses} size={30} />
            </a>

            {/* Native Web Share shown only when supported */}
            {canWebShare && (
              <a
                href="#"
                aria-label={t.device}
                className="px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  onWebShare();
                }}
              >
                <FaShareSquare className={iconBaseClasses} size={30} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
