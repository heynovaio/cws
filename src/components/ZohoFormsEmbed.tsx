"use client";
import { useEffect, useRef } from "react";

interface ZohoFormsEmbedProps {
  url: string;
  minHeight?: number;
}

export const ZohoFormsEmbed = ({ url, minHeight = 900 }: ZohoFormsEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const resizeUrl = url.includes("zf_rszfm=1")
    ? url
    : url.includes("?")
    ? `${url}&zf_rszfm=1`
    : `${url}?zf_rszfm=1`;

  useEffect(() => {
    if (!containerRef.current) return;

    if (iframeRef.current) {
      iframeRef.current.remove();
      iframeRef.current = null;
    }

    const f = document.createElement("iframe");
    f.src = resizeUrl;
    f.style.border = "none";
    f.style.width = "100%";
    f.style.height = `${minHeight}px`;
    f.setAttribute("scrolling", "no");
    f.setAttribute("allow", "geolocation; microphone; camera; fullscreen");
    containerRef.current.appendChild(f);
    iframeRef.current = f;

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "string") return;
      const parts = data.split("|");
      if (parts.length === 2) {
        const newHeight = parseInt(parts[1], 10);
        if (!isNaN(newHeight) && newHeight > 0 && iframeRef.current) {
          iframeRef.current.style.height = `${newHeight + 15}px`;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (iframeRef.current) {
        iframeRef.current.remove();
        iframeRef.current = null;
      }
    };
  }, [resizeUrl, minHeight]);

  return (
    <div className="w-full" id="form">
      <div ref={containerRef} className="w-full" />
    </div>
  );
};