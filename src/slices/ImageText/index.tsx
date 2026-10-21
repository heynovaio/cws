"use client";
import { Button } from "@/components";
import { Section, Container, ResponsiveImage, ContentBox } from "@/components";
import { Content, RichTextField } from "@prismicio/client";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { SliceComponentProps } from "@prismicio/react";
import { JSX, useEffect } from "react";
import { components, hasContent } from "@/utils";
import { useInView } from "react-intersection-observer";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { asText } from "@prismicio/helpers";
import { PrismicNextImage } from "@prismicio/next";
import { isFilled } from "@prismicio/client";

export type ImageTextProps = SliceComponentProps<Content.ImageTextSlice>;

const ImageText = ({ slice }: ImageTextProps): JSX.Element => {
  const { ref, inView } = useInView({
    rootMargin: "-200px 0px",
    triggerOnce: true,
  });

  const imageSide =
    slice.primary.image_side === false ? "md:flex-row" : "md:flex-row-reverse";

  const isVideo = slice.variation === "video";
  const isStats = slice.variation === "stats";
  const animation = slice.primary.animation !== false;
  const isContain =
    slice.variation !== "video" && slice.primary.image_fit === true;

  const animationClass = animation
    ? inView
      ? "opacity-100 translate-none"
      : "motion-safe:opacity-10 motion-safe:translate-y-[150px] lg:motion-safe:translate-y-[300px]"
    : "";

  const hasMedia =
    slice.variation === "video"
      ? isFilled.embed(slice.primary.video)
      : isFilled.image(slice.primary.image);

  const columnedTextClass = hasMedia
    ? ""
    : "md:columns-3 md:gap-x-12 md:[column-fill:balance-all] [&_p]:md:!w-auto [&_p]:md:!max-w-none [&_p]:md:!mx-0 [&_p]:md:[orphans:1] [&_p]:md:[widows:1] [&_ul]:md:!w-auto [&_ul]:md:!max-w-none [&_ul]:md:!mx-0 [&_ol]:md:!w-auto [&_ol]:md:!max-w-none [&_ol]:md:!mx-0 [&_li]:md:[orphans:1] [&_li]:md:[widows:1] [&_li]:break-inside-avoid [&_img]:break-inside-avoid";

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
    const rounded = useTransform(count, (latest) =>
      !isNaN(targetNumber) ? Math.round(latest) : 0
    );
    const duration = targetNumber > 50 ? 1 : 2;

    useEffect(() => {
      if (targetNumber && inView) {
        count.set(0);
        const controls = animate(count, targetNumber, { duration: duration });
        return () => controls.stop();
      }
    }, [inView, targetNumber, count, duration, rounded]);

    return (
      <div className="flex items-stretch gap-5 text-left">
        <span
          className="w-[15px] shrink-0 bg-current text-current"
          aria-hidden="true"
        />
        <div className="text-current">
          <span className="flex flex-row gap-2 justify-start">
            <motion.span className="text-[3.125rem] text-current font-extraBold">
              {rounded}
            </motion.span>
            {isPercentage && (
              <span className="text-[3.125rem] text-current font-extraBold">
                %
              </span>
            )}
          </span>
          {rounded && (
            <PrismicRichText
              field={description}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-base text-current">{children}</p>
                ),
              }}
            />
          )}
        </div>
      </div>
    );
  };

  const renderImage = () => {
    if (isVideo) {
      return (
        <div
          className={`w-full h-[250px] md:h-[400px] overflow-hidden transition-all duration-700 ${animationClass}`}
        >
          <div
            className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:absolute [&>iframe]:top-0 [&>iframe]:left-0 relative"
            dangerouslySetInnerHTML={{
              __html: slice.primary.video?.html ?? "",
            }}
          />
        </div>
      );
    }

    if (isContain && isFilled.image(slice.primary.image)) {
      return (
        <div
          className={`relative w-full h-[400px] transition-all duration-700 ease-in-out ${animationClass}`}
        >
          <PrismicNextImage
            field={slice.primary.image}
            fallbackAlt=""
            fill
            className="object-contain rounded"
          />
        </div>
      );
    }

    return (
      <ResponsiveImage
        image={slice.primary.image}
        className={`w-full h-[250px] md:h-[400px] object-cover mb-4 md:mb-0 transition-all duration-700 ease-in-out ${animationClass}`}
      />
    );
  };

  const hasTextContent = hasContent(
    slice.primary.title,
    slice.primary.body,
    slice.primary.button
  );

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
    >
      <Container>
        <div
          ref={ref}
          className={`flex flex-col w-full items-center ${
            hasMedia ? `${imageSide} gap-4 md:gap-16` : ""
          }`}
        >
          {hasMedia && (
            <div className="w-full md:w-1/2 overflow-hidden">
              {renderImage()}
            </div>
          )}

          {hasTextContent && (
            <div
              className={`${hasMedia ? "w-full md:w-1/2" : "w-full"} transition-all duration-700`}
            >
              <ContentBox
                title={
                  !isStats && hasContent(slice.primary.title)
                    ? slice.primary.title
                    : undefined
                }
                content={
                  isStats ? (
                    <div
                      className={
                        hasMedia
                          ? "flex flex-col gap-4 md:mb-4"
                          : "grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 items-start text-left"
                      }
                    >
                      <div className="flex flex-col gap-4">
                        {hasContent(slice.primary.title) && (
                          <PrismicRichText
                            field={slice.primary.title}
                            components={components}
                          />
                        )}
                        {hasContent(slice.primary.body) && (
                          <div className="text-bodyLarge [&_p]:!mx-0 [&_p]:!w-auto [&_p]:!max-w-none">
                            <PrismicRichText
                              field={slice.primary.body}
                              components={components}
                            />
                          </div>
                        )}
                      </div>
                      {hasMedia ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-left">
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
                      ) : (
                        slice.primary.stats.map((item, index) => (
                          <StatItem
                            key={index}
                            statistic={item.statistic}
                            description={item.description}
                            inView={inView}
                            isPercentage={item.percentage}
                          />
                        ))
                      )}
                    </div>
                  ) : hasContent(slice.primary.body) ? (
                    <div className={columnedTextClass || undefined}>
                      <PrismicRichText
                        field={slice.primary.body}
                        components={components}
                      />
                    </div>
                  ) : undefined
                }
                buttons={
                  hasContent(slice.primary.button)
                    ? slice.primary.button.map((link, index) => (
                        <Button
                          key={index}
                          buttonType="primary"
                          buttonLink={link}
                          label={link.text}
                        />
                      ))
                    : undefined
                }
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

export default ImageText;
