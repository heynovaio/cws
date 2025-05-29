"use client";
import { Button } from "@/components";
import { Section, Container, ResponsiveImage, ContentBox } from "@/components";
import { Content, RichTextField } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX, useEffect } from "react";
import { components } from "@/utils";
import { useInView } from "react-intersection-observer";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { asText } from "@prismicio/helpers";

/**
 * Props for `ImageText`.
 */
export type ImageTextProps = SliceComponentProps<Content.ImageTextSlice>;

/**
 * Component for "ImageText" Slices.
 */
const ImageText = ({ slice }: ImageTextProps): JSX.Element => {
  const { ref, inView } = useInView({
    rootMargin: "-200px 0px",
  });

  const imageSide =
    slice.primary.image_side === false ? "md:flex-row" : "md:flex-row-reverse";

  const isVideo = slice.variation === "video";
  const isStats = slice.variation === "stats";
  const animation = slice.primary.animation !== false;

  type StatItemProps = {
    statistic: RichTextField;
    description: RichTextField;
    inView: boolean;
    isPercentage: boolean;
  };

  const StatItem = ({
    statistic,
    description,
    inView,
    isPercentage,
  }: StatItemProps) => {
    const targetNumber = parseInt(asText(statistic) || "0", 10);
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => !isNaN(targetNumber) ? Math.round(latest) : 0);
    const duration = targetNumber > 50 ? 1 : 2;

    useEffect(() => {
      if (targetNumber && inView) {
        count.set(0);
        const controls = animate(count, targetNumber, { duration: duration });
        return () => controls.stop();
      }
    }, [inView, targetNumber, count, duration, rounded]);

    return (
      <div>
        <span className="flex flex-row gap-2">
          <motion.span className="text-[3.125rem] text-aqua font-extraBold">
            {rounded}
          </motion.span>
          {isPercentage && (
            <span className="text-[3.125rem] text-aqua font-extraBold">%</span>
          )}
        </span>
        {rounded && (
          <PrismicRichText
            field={description}
            components={{
              paragraph: ({ children }) => (
                <p className="text-base">{children}</p>
              ),
            }}
            />
        )}
      </div>
    );
  };

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
    >
      <Container
        containerClassName={`flex flex-col ${imageSide} gap-4 md:gap-16 w-full items-center`}
      >
        <div ref={ref} className={`w-full md:w-1/2 overflow-hidden`}>
          {isVideo ? (
            <div
              className={`w-full h-[250px] md:h-[400px] overflow-hidden rounded-xl transition-all duration-700 ${animation ? (inView ? "opacity-100 translate-none" : "motion-safe:opacity-10 motion-safe:translate-y-[150px] lg:motion-safe:translate-y-[300px]") : ""}`}
            >
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
              className={`w-full h-[250px] md:h-[400px] object-cover mb-4 md:mb-0 transition-all duration-700 ease-in-out ${animation ? (inView ? "opacity-100 translate-none" : "motion-safe:opacity-10 motion-safe:translate-y-[150px] lg:motion-safe:translate-y-[300px]") : ""}`}
            />
          )}
        </div>

        <div className={`w-full md:w-1/2 transition-all duration-700`}>
          <ContentBox
            title={slice.primary.title}
            content={
              isStats ? (
                <div className="flex flex-col gap-4 md:mb-4">
                  <div className="text-bodyLarge">
                    <PrismicRichText
                      field={slice.primary.body}
                      components={components}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-center md:text-left">
                    {slice.primary.stats.map((item, index) => (
                      <StatItem
                        key={index}
                        statistic={item.statistic}
                        description={item.description}
                        inView={inView}
                        isPercentage={item.percentage}
                      />
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
