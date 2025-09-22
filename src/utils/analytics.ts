/* eslint-disable @typescript-eslint/no-explicit-any */
export const trackShare = (platform: "linkedin" | "facebook" | "webshare") => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "share_click", {
      event_category: "engagement",
      event_label: platform,
      method: platform,
    });
  }
};
