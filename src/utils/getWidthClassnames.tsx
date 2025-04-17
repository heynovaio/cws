export type WidthProp = "narrow" | "wide" | "full" | "standard";

// Max-width classes are defined in tailwind.config.js
export function getWidthClassNames(width: WidthProp): string {
  switch (width) {
    case "narrow":
      return "max-w-narrow w-full";
    case "wide":
      return "max-w-wide w-full";
    case "standard":
      return "max-w-standard w-full";
    case "full":
      return "max-w-full w-full";
    default:
      return "max-w-full w-full";
  }
}
