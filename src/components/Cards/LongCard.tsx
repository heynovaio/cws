import React from "react";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { ContentBox } from "../ContentBox/ContentBox";
import { PrismicNextLink } from "@prismicio/next";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { components } from "@/utils";

interface LongCardProps {
  image?: ImageField | undefined;
  title: string | RichTextField;
  content?: RichTextField;
  buttons?: LinkField[];
  links?: LinkField[];
}

export const LongCard = ({
  image,
  title,
  content,
  buttons,
  links,
}: LongCardProps) => {
  const buttonsExist = buttons && buttons.length > 0;
  const linksExist = links && links.length > 0;

  return (
    <div className="card-white flex flex-col md:flex-row items-center md:!p-2 p-4 gap-12 hover-shadow text-midnight h-full">
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
                            className={`flex items-center gap-2 px-0 btn btn-text text-neon-violet`}
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
          titleClassName="text-neon-violet"
          containerClassName="flex-1 md:my-12"
        />
        {/* Link Fields */}
        <div className="flex flex-col w-full md:w-1/3 items-center justify-center gap-4">
          {linksExist &&
            links.map((item, index) => (
              <PrismicNextLink
                key={index}
                field={item}
                className={`flex items-center`}
              >
                {item.text}
              </PrismicNextLink>
            ))}
        </div>
      </div>
    </div>
  );
};
