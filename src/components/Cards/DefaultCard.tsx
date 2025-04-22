import { ImageField, LinkField, RichTextField } from "@prismicio/client";
import React, { ReactNode } from "react";
import { ContentBox } from "../ContentBox/ContentBox";
import { PrismicNextLink } from "@prismicio/next";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";

/**
 * DefaultCard Component - To be used for Program (coloured) and Resource (white) Cards
 */

interface DefaultCardProps {
  title: string | RichTextField;
  content?: ReactNode;
  buttons?: LinkField[];
  image?: ImageField;
  category?: string[];
  cardType?: "program" | "resource" | string;
}

export const DefaultCard = ({
  title,
  content,
  category,
  image,
  buttons,
  cardType,
}: DefaultCardProps) => {
  const buttonsExist = buttons && buttons.length > 0;

  let cardBackground;
  let categoryChipColor;

  switch (cardType) {
    case "program":
      cardBackground = "card-gradient";
      categoryChipColor =
        "bg-light-violet text-midnight border border-midnight";
      break;
    case "resource":
      cardBackground = "card-white";
      categoryChipColor = "text-dark border border-neon-violet";
      break;
    default:
      cardBackground = "card-white";
      categoryChipColor = "text-dark border border-neon-violet";
      break;
  }
  return (
    <div className={`flex flex-col gap-5 ${cardBackground}`}>
      <ResponsiveImage
        image={image}
        imageHeightClassName="h-full object-cover"
        containerClassName="w-full max-h-[215px] h-[215px] h-full"
      />
      {category && (
        <div className="flex gap-2">
          {category.map((item, index) => (
            <span
              key={index}
              className={`self-start rounded-full px-2 py-1 items-center ${categoryChipColor}`}
            >
              {item}
            </span>
          ))}
        </div>
      )}
      <ContentBox
        title={title}
        content={content}
        buttons={
          buttonsExist
            ? [
                <div
                  className="flex flex-wrap justify-start gap-8"
                  key="buttons"
                >
                  {buttons.map(
                    (item, index) =>
                      item.text && (
                        <PrismicNextLink
                          key={index}
                          field={item}
                          className="btn px-0 flex items-center gap-2 btn-text underline"
                        >
                          {item.text}
                          <HiOutlineArrowLongRight className="h-10 w-10" />
                        </PrismicNextLink>
                      )
                  )}
                </div>,
              ]
            : []
        }
        width="full"
      />
    </div>
  );
};
