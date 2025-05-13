"use client";
import { Button } from "@/components";
import { Section, Container, ResponsiveImage, ContentBox } from "@/components";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import { components } from "@/utils";
import { useInView } from "react-intersection-observer";

/**
 * Props for `ImageText`.
 */
export type ImageTextProps = SliceComponentProps<Content.ImageTextSlice>;

/**
 * Component for "ImageText" Slices.
 */
const ImageText = ({ slice }: ImageTextProps): JSX.Element => {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 1,
  })

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
        <div ref={ref} className="w-full md:w-1/2">
          <h2>{`Header inside viewport ${inView}.`}</h2>
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
                className="w-full h-[250px] md:h-[400px] object-cover mb-4 md:mb-0"
              />
            )}
          </div>

          <div className="w-full md:w-1/2">
            <ContentBox
              title={slice.primary.title}
              content={
                isStats ? (
                  <div className="flex flex-col gap-4 md:mb-4">
                    <PrismicRichText
                      field={slice.primary.body}
                      components={components}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-center md:text-left">
                      {slice.primary.stats.map((item, index) => (
                        <div key={index}>
                          <PrismicRichText
                            field={item.statistic}
                            components={{
                              paragraph: ({ children }) => (
                                <p className="text-[3.125rem] text-aqua font-extraBold">
                                  {children}
                                </p>
                              ),
                            }}
                          />
                          <PrismicRichText
                            field={item.description}
                            components={{
                              paragraph: ({ children }) => (
                                <p className="text-base">{children}</p>
                              ),
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <PrismicRichText
                    field={slice.primary.body}
                    components={components}
                  />
                )
              }
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