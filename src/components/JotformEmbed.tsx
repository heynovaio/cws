"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    jotformEmbedHandler?: (iframeSelector: string, domain: string) => void;
  }
}

interface JotformEmbedProps {
  url: string;
  title?: string;
}

export const JotformEmbed = ({
  url,
  title = "Jotform Form",
}: JotformEmbedProps) => {
  const match = url.match(/\/(\d{9,})$/);
  const formId = match ? match[1] : null;

  useEffect(() => {
    if (!formId) return;

    const script = document.createElement("script");
    script.src = "https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js";
    script.async = true;
    script.onload = () => {
      if (window?.jotformEmbedHandler) {
        window.jotformEmbedHandler(
          `iframe[id='JotFormIFrame-${formId}']`,
          "https://form.jotform.com/"
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [formId]);

  if (!formId) return null;

  return (
    <div className="w-full">
      <iframe
        id={`JotFormIFrame-${formId}`}
        title={title}
        src={url}
        className="w-full border-0"
        style={{ minHeight: "540px" }}
        allow="geolocation; microphone; camera; fullscreen"
        allowTransparency={true}
      ></iframe>
    </div>
  );
};
