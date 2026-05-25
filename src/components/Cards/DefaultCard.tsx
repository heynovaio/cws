import { ImageField, RichTextField } from "@prismicio/client";
import React, { ReactNode } from "react";
import { ContentBox } from "../ContentBox/ContentBox";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { HiOutlinePhoto } from "react-icons/hi2";

export type CardStyle = "purple" | "white";

interface DefaultCardProps {
  title: string | RichTextField;
  content?: ReactNode;
  buttons?: ReactNode[];
  image?: ImageField;
  category?: string;
  cardType?: "program_page" | "resource_page" | "manual" | string;
  cardStyle?: CardStyle;
}

const CARD_STYLES: Record<CardStyle, { background: string; chip: string }> = {
  purple: {
    background: "card-gradient",
    chip: "bg-light-violet text-midnight border-midnight",
  },
  white: {
    background: "card-white",
    chip: "text-dark border-neon-violet",
  },
};

export const DefaultCard = ({
  title,
  content,
  category,
  image,
  buttons,
  cardType,
  cardStyle,
}: DefaultCardProps) => {
  let cardBackground: string;
  let categoryChipColor: string;

  if (cardType === "manual" && cardStyle && CARD_STYLES[cardStyle]) {
    cardBackground = CARD_STYLES[cardStyle].background;
    categoryChipColor = CARD_STYLES[cardStyle].chip;
  } else {
    switch (cardType) {
      case "program":
      case "program_page":
        cardBackground = "card-gradient";
        categoryChipColor = "bg-light-violet text-midnight border-midnight";
        break;
      case "resource":
      case "resource_page":
      default:
        cardBackground = "card-white";
        categoryChipColor = "text-dark border-neon-violet";
        break;
    }
  }

  return (
    <div className={`flex flex-col gap-5 w-full hover-shadow ${cardBackground}`}>
      {image?.url ? (
        <ResponsiveImage
          image={image}
          imageHeightClassName="h-full w-full"
          containerClassName="w-full max-h-[215px] h-full"
        />
      ) : cardType === "manual" ? (
        <div className="w-full max-h-[215px] h-[215px] flex items-center justify-center bg-black/5">
          <HiOutlinePhoto className="w-12 h-12 opacity-30" />
        </div>
      ) : null}
      {category && (
        <div className="flex gap-2">
          <span
            className={`self-start rounded-full px-2 py-1 items-center font-medium border-[1.5px] ${categoryChipColor}`}
          >
            {category}
          </span>
        </div>
      )}
      <ContentBox
        title={title}
        titleLevel={3}
        titleClassName="text-h4"
        content={content}
        buttons={buttons}
        width="full"
        containerClassName="justify-between flex-grow"
      />
    </div>
  );
};