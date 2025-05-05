import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

interface CTATileProps {
  bg_image?: ImageField;
  image?: ImageField;
  title?: RichTextField;
  link?: LinkField;
}

export const CTATile = ({
  bg_image,
  image,
  title,
  link,
}: CTATileProps) => {
  
  return (
    <PrismicNextLink
      field={link}
      className="hover-zoom hover-shadow relative bg-gradient-tile h-[430px] border border-neon-violet rounded overflow-hidden text-midnight w-full flex flex-col no-underline">
      {image && (
          <PrismicNextImage
            field={bg_image}
            alt=""
            className="hover-zoom-img absolute top-0 bottom-0 left-0 right-0 z-0 w-full min-h-full object-cover opacity-10"
          />
      )}
      <div className="relative z-10 text-white h-full w-full flex flex-col gap-0 items-center justify-center">
        {image && (
          <>
            <ResponsiveImage
              image={image}
              className="max-w-[65px] full object-cover aspect-square rounded-none"
              imageHeightClassName="h-full max-h-[65px]"
            />
          </>
        )}
        {title && 
          <div className="mt-4">
            <PrismicRichText field={title}/>
          </div>
        }
        {link && (
          <div
            className={`flex items-center text-large underline font-normal"`}
          >
            {link?.text || 'Learn More'}<HiOutlineArrowLongRight className="h-10 w-10 ml-3" />
          </div>
          )}
        </div>
    </PrismicNextLink>
  );
};
