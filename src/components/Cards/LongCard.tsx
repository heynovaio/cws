import React from "react";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { ContentBox } from "../ContentBox/ContentBox";
import { PrismicNextLink } from "@/components/PrismicNextLink";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { components } from "@/utils";
import {
  isWhiteSectionCard,
  sectionBackgroundValue,
} from "@/components/Layout/Section";

interface LongCardProps {
  image?: ImageField | undefined;
  title: string | RichTextField;
  content?: RichTextField;
  buttons?: LinkField[];
  links?: LinkField[];
  sectionBackground?: string | null;
}

export const LongCard = ({
  image,
  title,
  content,
  buttons,
  links,
  sectionBackground,
}: LongCardProps) => {
  const buttonsExist = buttons && buttons.length > 0;
  const linksExist = links && links.length > 0;
  const onWhiteSection = isWhiteSectionCard(sectionBackground);
  const onWhiteBackground =
    sectionBackgroundValue(sectionBackground) === "white";

  return (
    <div
      className={`card-white flex flex-col md:flex-row items-center md:!p-2 p-4 gap-12 text-midnight h-full border border-solid ${
        onWhiteBackground
          ? "!border-black"
          : "card-on-white-section border-[#6153a3]"
      } ${onWhiteSection ? "" : "hover-shadow"}`}
    >
      <ResponsiveImage
        image={image}
        containerClassName="md:w-1/3 w-full h-full"
        imageHeightClassName="h-full w-full"
      />
      <div className="flex flex-col md:flex-row md:justify-between gap-8 flex-1">
        <ContentBox
          title={title}
          content={<PrismicRichText field={content} components={components} />}
          buttons={
            buttonsExist
              ? [
                  <div
                    className="flex flex-wrap sm:justify-start justify-center gap-8"
                    key="buttons"
                  >
                    {buttons.map(
                      (item, index) =>
                        item.text && (
                          <PrismicNextLink
                            key={index}
                            field={item}
                            className={`more-hover flex items-center gap-2 px-0 btn btn-text text-[#6153a3]`}
                          >
                            <span>{item.text}</span>
                            <HiOutlineArrowLongRight className="h-10 w-10" />
                          </PrismicNextLink>
                        )
                    )}
                  </div>,
                ]
              : []
          }
          width="full"
          titleClassName="text-[#6153a3]"
          containerClassName="flex-1 md:my-12"
        />
        {/* Link Fields */}
        <div className="flex flex-col w-full md:w-1/3 justify-flex-start pt-[5.25em] gap-4">
          {linksExist &&
            links.map((item, index) => (
              <PrismicNextLink key={index} field={item} className={`flex`}>
                {item.text}
              </PrismicNextLink>
            ))}
        </div>
      </div>
    </div>
  );
};
