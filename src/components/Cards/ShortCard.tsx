import { RichTextField } from "@prismicio/client";
import React, { ReactNode } from "react";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { isWhiteSectionCard } from "@/components/Layout/Section";

interface ShortCardProps {
  title: string | RichTextField;
  buttons?: ReactNode[] | undefined;
  category?: string;
  cardType?: "program" | "resource" | string;
  sectionBackground?: string | null;
}

export const ShortCard = ({
  title,
  buttons,
  category,
  cardType,
  sectionBackground,
}: ShortCardProps) => {
  const onWhiteSection = isWhiteSectionCard(sectionBackground);
  const cardBackground = "card-white card-on-white-section";
  const categoryChipColor =
    cardType === "program"
      ? "bg-light-violet text-midnight border-midnight"
      : "text-dark border-neon-violet";

  return (
    <div
      className={`flex flex-col gap-2 w-full p-4 ${onWhiteSection ? "" : "hover-shadow"} ${cardBackground} justify-between flex-grow`}
    >
      {category && (
        <div className="flex gap-2">
          <span
            className={`self-start px-2 py-1 items-center font-accent font-medium border-[1.5px] ${categoryChipColor}`}
          >
            {category}
          </span>
        </div>
      )}
      {typeof title === "string" ? (
        <p className="text-h4 font-bold mb-0">{title}</p>
      ) : (
        <PrismicRichText
          field={title}
          components={{
            paragraph: ({ children }) => (
              <p className="text-h4 font-bold mb-0">{children}</p>
            ),
          }}
        />
      )}
      {buttons && <div className="p-0">{buttons.map((btn) => btn)}</div>}
    </div>
  );
};
