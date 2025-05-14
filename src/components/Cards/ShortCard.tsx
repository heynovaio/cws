import { RichTextField } from "@prismicio/client";
import React, { ReactNode } from "react";
import { PrismicRichText } from "@prismicio/react";

interface ShortCardProps {
  title: string | RichTextField;
  buttons?: ReactNode[] | undefined;
  category?: string;
  cardType?: "program" | "resource" | string;
}

export const ShortCard = ({
  title,
  buttons,
  category,
  cardType,
}: ShortCardProps) => {
  let cardBackground;
  let categoryChipColor;

  switch (cardType) {
    case "program":
      cardBackground = "card-gradient";
      categoryChipColor = "bg-light-violet text-midnight border-midnight";
      break;
    case "resource":
      cardBackground = "card-white";
      categoryChipColor = "text-dark border-neon-violet";
      break;
    default:
      cardBackground = "card-white";
      categoryChipColor = "text-dark border-neon-violet";
      break;
  }

  return (
    <div
      className={`flex flex-col gap-2 w-full ${cardBackground} justify-between flex-grow`}
    >
      {category && (
        <div className="flex gap-2">
          <span
            className={`self-start rounded-full px-2 py-1 items-center font-accent font-medium border-[1.5px] ${categoryChipColor}`}
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
