import { ImageField, RichTextField } from "@prismicio/client";
import React, { ReactNode } from "react";
import { ContentBox } from "../ContentBox/ContentBox";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";

/**
 * DefaultCard Component - To be used for Program (coloured) and Resource (white) Cards
 */

interface DefaultCardProps {
  title: string | RichTextField;
  content?: ReactNode;
  buttons?: ReactNode[] | undefined;
  image?: ImageField;
  category?: string;
  cardType?: "program_page" | "resource_page" | string;

}

export const DefaultCard = ({
  title,
  content,
  category,
  image,
  buttons,
  cardType,
}: DefaultCardProps) => {
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
    <div className={`flex flex-col gap-5 w-full ${cardBackground}`}>
      {image && (
        <ResponsiveImage
          image={image}
          imageHeightClassName="h-full w-full"
          containerClassName="w-full max-h-[215px] h-full"
        />
      )}
      {/* TODO: Turn these into links once the filter pages are made */}
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
