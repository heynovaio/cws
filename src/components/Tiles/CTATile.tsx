import { Button } from "@/components/Buttons/Button";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

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
    <div className="border border-neon-violet rounded p-4 text-midnight w-full flex flex-col shadow">
      {image && (
        <>
          <ResponsiveImage
            image={bg_image}
            className="w-full object-cover aspect-square rounded-none"
            imageHeightClassName="h-full"
          />
        </>
      )}
      <div>
        {image && (
          <>
            <ResponsiveImage
              image={image}
              className="w-full object-cover aspect-square rounded-none"
              imageHeightClassName="h-full "
            />
          </>
        )}
        {title && 
          <>
            <PrismicRichText field={title} />
          </>
        }
        {link && (
          <Button
            buttonType="link"
            buttonLink={link}
            label="foo"
            styling="text-base ml-1 mt-1"
          />
          )}
        </div>
    </div>
  );
};
