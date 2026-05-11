"use client";
import { useEffect, useRef, useState } from "react";

interface GenericIframeEmbedProps {
  url: string;
  title?: string;
  minHeight?: number;
}

export const GenericIframeEmbed = ({
  url,
  title = "Form",
  minHeight = 540,
}: GenericIframeEmbedProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);

  useEffect(() => {
    if (!url) return;

    let origin: string;
    try {
      origin = new URL(url).origin;
    } catch {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== origin) return;

      const data = event.data;

      if (data?.action === "setHeight" && typeof data.height === "number") {
        setHeight(Math.max(data.height, minHeight));
        return;
      }

      if (
        data?.event === "Tally.FormHeightChanged" &&
        typeof data.payload?.height === "number"
      ) {
        setHeight(Math.max(data.payload.height, minHeight));
        return;
      }

      if (data?.height !== undefined) {
        const raw =
          typeof data.height === "string"
            ? parseInt(data.height, 10)
            : data.height;
        if (!isNaN(raw) && raw > 0) {
          setHeight(Math.max(raw, minHeight));
          return;
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [url, minHeight]);

  if (!url) return null;

  return (
    <div className="w-full" id="form">
      <iframe
        ref={iframeRef}
        title={title}
        src={url}
        className="w-full border-0"
        style={{ height: `${height}px` }}
        scrolling="no"
        allow="geolocation; microphone; camera; fullscreen"
      />
    </div>
  );
};