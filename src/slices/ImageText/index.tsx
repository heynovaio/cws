import { Button } from "@/app/components/Button";
import { Section, Container, ResponsiveImage, ContentBox } from "@/components";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `ImageText`.
 */
export type ImageTextProps = SliceComponentProps<Content.ImageTextSlice>;

/**
 * Component for "ImageText" Slices.
 */
const ImageText = ({ slice }: ImageTextProps): JSX.Element => {
  const imageSide =
    slice.primary.image_side === false ? "md:flex-row" : "md:flex-row-reverse";

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
    >
      <Container
        containerClassName={`flex flex-col ${imageSide} gap-4 md:gap-16 w-full items-center`}
      >
        <div className="w-full md:w-1/2">
          <ResponsiveImage
            image={slice.primary.image}
            className="w-full md:h-[400px] object-contain"
          />
        </div>

        <div className="w-full md:w-1/2">
          <ContentBox
            title={slice.primary.title}
            content={<PrismicRichText field={slice.primary.body} />}
            buttons={slice.primary.button.map((link, index) => (
              <Button
                key={index}
                buttonType="primary"
                buttonLink={link}
                label={link.text}
              />
            ))}
          />
        </div>
      </Container>
    </Section>
  );
};

export default ImageText;
