"use client";
import Script from "next/script";

interface ZohoFormsEmbedProps {
  url: string;
  minHeight?: number;
}

export const ZohoFormsEmbed = ({ url, minHeight = 900 }: ZohoFormsEmbedProps) => {
  const divId = "zf_div_cws_general";
  const iframeId = "zf_ifrm_cws_general";

  const inlineScript = `
    (function() {
      try {
        var existing = document.getElementById("${iframeId}");
        if (existing) existing.remove();

        var f = document.createElement("iframe");
        f.src = "${url}";
        f.style.border = "none";
        f.style.width = "100%";
        f.style.height = "${minHeight}px";
        f.id = "${iframeId}";
        f.setAttribute("scrolling", "no");
        f.setAttribute("allow", "geolocation; microphone; camera; fullscreen");

        var container = document.getElementById("${divId}");
        if (container) container.appendChild(f);

        window.addEventListener("message", function(event) {
          var data = event.data;
          if (!data || typeof data !== "string") return;
          var parts = data.split("|");
          if (parts.length === 2) {
            var newHeight = parseInt(parts[1], 10);
            if (!isNaN(newHeight) && newHeight > 0) {
              var iframe = document.getElementById("${iframeId}");
              if (iframe) iframe.style.height = (newHeight + 15) + "px";
            }
          }
        }, false);
      } catch(e) {}
    })();
  `;

  return (
    <div className="w-full" id="form">
      <div id={divId} className="w-full" />
      <Script
        id="zoho-forms-embed"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: inlineScript }}
      />
    </div>
  );
};