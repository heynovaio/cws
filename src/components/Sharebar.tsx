"use client";

import { trackShare } from "@/utils";

interface SharebarProps {
  absoluteUrl: string;
}

export const Sharebar = ({ absoluteUrl }: SharebarProps) => {
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    absoluteUrl
  )}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    absoluteUrl
  )}`;

  const canWebShare =
    typeof navigator !== "undefined" &&
    typeof (navigator as any).share === "function";

  const onWebShare = async () => {
    try {
      await (navigator as any).share({
        url: absoluteUrl,
        title: document.title,
      });
    } catch {
      // user cancelled or unsupported
    }
  };

  return (
    <div
      className="
        fixed bottom-4 right-4 z-50
        flex items-center gap-3
        rounded-full bg-white/95 shadow-lg
        px-4 py-2
        text-sm font-medium text-gray-800
        border border-gray-200
      "
    >
      <span className="font-semibold">Share:</span>

      {/* LinkedIn */}
      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="hover:text-blue-700"
        onClick={() => trackShare("linkedin")}
      >
        LI
      </a>

      {/* Facebook */}
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="hover:text-blue-600"
        onClick={() => trackShare("facebook")}
      >
        FB
      </a>

      {/* Native Web Share (mobile) */}
      {canWebShare && (
        <button
          type="button"
          onClick={() => {
            trackShare("webshare");
            onWebShare();
          }}
          aria-label="Share via device"
          className="hover:text-gray-600"
        >
          Share
        </button>
      )}
    </div>
  );
};
