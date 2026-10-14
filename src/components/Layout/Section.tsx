import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  backgroundColor?: string | null | undefined;
  styling?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}

const LIGHT_BACKGROUNDS = new Set(["white", "lighter", "light"]);
const WHITE_SECTION_CARDS = new Set(["white", "purple"]);

export function sectionBackgroundValue(
  backgroundColor?: string | null
): string {
  return (backgroundColor ?? "").trim().toLowerCase();
}

export function isLightSectionBackground(
  backgroundColor?: string | null
): boolean {
  return LIGHT_BACKGROUNDS.has((backgroundColor ?? "").trim().toLowerCase());
}

export function isWhiteSectionCard(sectionBackground?: string | null): boolean {
  return WHITE_SECTION_CARDS.has(
    (sectionBackground ?? "").trim().toLowerCase()
  );
}

/**
 * No Background and Darker share the site's dark section.
 * Purple is its own section: #6153a3 with white text, and the same cards as White.
 * White and Lighter share the light section. An empty value uses the dark section.
 */
export function sectionBackgroundClass(
  backgroundColor?: string | null
): string {
  const value = sectionBackgroundValue(backgroundColor);

  if (value === "gradient") {
    return "bg-gradient-section text-white";
  }

  if (value === "transparent") {
    return "bg-transparent text-white";
  }

  if (value === "purple") {
    return "bg-[#6153a3] text-white section-no-shadow";
  }

  if (value === "white") {
    return "bg-white text-midnight section-no-shadow";
  }

  if (LIGHT_BACKGROUNDS.has(value)) {
    return "bg-white text-midnight";
  }

  return "bg-midnight text-white";
}

export const Section: React.FC<SectionProps> = ({
  children,
  styling,
  backgroundColor,
  className,
  ...props
}) => {
  const background = sectionBackgroundClass(backgroundColor);

  return (
    <section
      className={`py-8 md:py-16 print:py-0 print:my-0 w-full ${background} ${styling ?? ""} ${className ?? ""}`}
      {...props}
    >
      {children}
    </section>
  );
};
