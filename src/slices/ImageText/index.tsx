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

  const isVideo = slice.variation === "video";
  const isStats = slice.variation === "stats";

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
          {isVideo ? (
            <div className="w-full h-[250px] md:h-[400px] overflow-hidden rounded-xl">
              <div
                className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:absolute [&>iframe]:top-0 [&>iframe]:left-0 relative"
                dangerouslySetInnerHTML={{
                  __html: slice.primary.video?.html ?? "",
                }}
              />
            </div>
          ) : (
            <ResponsiveImage
              image={slice.primary.image}
              className="w-full h-[250px] md:h-[400px] object-cover"
            />
          )}
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
