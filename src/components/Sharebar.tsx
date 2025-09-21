"use client";

import { trackShare } from "@/utils";
import { FaFacebook, FaLinkedin } from "react-icons/fa";

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
    flex items-center
    rounded-full bg-white/90
    text-sm font-medium text-gray-800
    border border-gray-200
    backdrop-blur-md
    drop-shadow-glow
    hover:ring-2
    hover:ring-dove-grey
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
          className="btn btn-primary transform-none hover:translate-x-0 hover:translate-y-0"
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
          <FaLinkedin
            size="25px"
            className="text-dove-grey hover:text-ultra-pink"
          />
        </a>

        {/* Facebook */}
        <a
          href={facebookHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          onClick={() => trackShare("facebook")}
        >
          <FaFacebook
            size="25px"
            className="text-dove-grey hover:text-ultra-pink"
          />
        </a>
        {/* <a
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share"
          onClick={() => {
            trackShare("webshare");
            onWebShare();
          }}
          className="md:hidden block"
        >
          <FaShareSquare
            size="25px"
            className="text-dove-grey hover:text-ultra-pink"
          />
        </a> */}
      </div>
    </div>
  );
};
