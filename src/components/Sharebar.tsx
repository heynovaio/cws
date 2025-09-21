/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { trackShare } from "@/utils";
import { FaFacebook, FaLinkedin, FaShareSquare } from "react-icons/fa";

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
        flex items-center gap-4
        rounded-full bg-white/90 shadow-lg
        text-sm font-medium text-gray-800
        border border-gray-200
        backdrop-blur-md
        shadow-[0_0_30px_rgba(99,15,249,0.8)]
      "
    >
      {canWebShare && (
        <button
          type="button"
          onClick={() => {
            trackShare("webshare");
            onWebShare();
          }}
          aria-label="Share via device"
          className="btn btn-primary"
        >
          Share
        </button>
      )}
      <div className="flex flex-row items-center justify-center gap-3 px-4 py-2">
        {/* LinkedIn */}
        <a
          href={linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          onClick={() => trackShare("linkedin")}
        >
          <FaLinkedin color="#6D00FF" size="25px" />
        </a>

        {/* Facebook */}
        <a
          href={facebookHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          onClick={() => trackShare("facebook")}
        >
          <FaFacebook color="#6D00FF" size="25px" />
        </a>
        <FaShareSquare color="#6D00FF" size="25px" />
        {/* Native Web Share (mobile) */}
      </div>
    </div>
  );
};
