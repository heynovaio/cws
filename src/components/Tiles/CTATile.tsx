import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
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
    <div className="bg-gradient-tile h-[430px] border border-neon-violet rounded overflow-hidden text-midnight w-full flex flex-col shadow">
      {image && (
        <>
          <ResponsiveImage
            image={bg_image}
            className="absolute top-0 bottom-0 left-0 right-0 z-0 w-full object-cover aspect-square opacity-10"
            imageHeightClassName="h-full"
          />
        </>
      )}
      <div className="text-white h-full w-full flex flex-col gap-5 items-center justify-center">
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
          <h4>
            <PrismicRichText field={title}/>
          </h4>
        }
        {link && (
          <PrismicNextLink
            field={link}
            className={`flex items-center text-large underline font-normal"`}
          >
            Learn more <HiOutlineArrowLongRight className="h-10 w-10 ml-3" />
          </PrismicNextLink>
          )}
        </div>
    </div>
  );
};
