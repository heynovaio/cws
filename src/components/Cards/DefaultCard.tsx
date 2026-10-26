import { ImageField, RichTextField } from "@prismicio/client";
import React, { ReactNode } from "react";
import { ContentBox } from "../ContentBox/ContentBox";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { HiOutlinePhoto } from "react-icons/hi2";
import { isWhiteSectionCard } from "@/components/Layout/Section";

export type CardStyle = "purple" | "white";

interface DefaultCardProps {
  title: string | RichTextField;
  content?: ReactNode;
  buttons?: ReactNode[];
  image?: ImageField;
  category?: string;
  cardType?: "program_page" | "resource_page" | "manual" | string;
  cardStyle?: CardStyle;
  sectionBackground?: string | null;
}

const CARD_STYLES: Record<CardStyle, { chip: string }> = {
  purple: {
    chip: "card-tag bg-[#e6e7e8] text-midnight",
  },
  white: {
    chip: "card-tag bg-[#e6e7e8] text-dark",
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
  sectionBackground,
}: DefaultCardProps) => {
  const onWhiteSection = isWhiteSectionCard(sectionBackground);
  const cardBackground = "card-white card-on-white-section";
  let categoryChipColor: string;

  if (cardType === "manual" && cardStyle && CARD_STYLES[cardStyle]) {
    categoryChipColor = CARD_STYLES[cardStyle].chip;
  } else {
    switch (cardType) {
      case "program":
      case "program_page":
        categoryChipColor = "card-tag bg-[#e6e7e8] text-midnight";
        break;
      case "resource":
      case "resource_page":
      default:
        categoryChipColor = "card-tag bg-[#e6e7e8] text-dark";
        break;
    }
  }

  return (
    <div
      className={`flex flex-col gap-5 w-full ${onWhiteSection ? "" : "hover-shadow"} ${cardBackground}`}
    >
      {image?.url ? (
        <ResponsiveImage
          image={image}
          imageHeightClassName="absolute inset-0 h-full w-full"
          containerClassName="w-full min-h-[235px]"
        />
      ) : cardType === "manual" ? (
        <div className="w-full min-h-[235px] flex items-center justify-center bg-black/5">
          <HiOutlinePhoto className="w-12 h-12 opacity-30" />
        </div>
      ) : null}
      <div className="p-4 flex flex-col gap-5 h-full">
        {category && (
          <div className="flex gap-2">
            <span
              className={`self-start px-2 py-1 items-center font-medium border-[1.5px] ${categoryChipColor}`}
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
    </div>
  );
};
