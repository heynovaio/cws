import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Section, Container, ResponsiveImage } from "@/components";
import { JSX } from "react";
import { components } from "@/utils";

/**
 * Props for `ContentColumn`.
 */
export type ContentColumnProps =
  SliceComponentProps<Content.ContentColumnSlice>;

/**
 * Component for "ContentColumn" Slices.
 */
const ContentColumn = ({ slice }: ContentColumnProps): JSX.Element => {
  const cardStyling =
    slice.primary.card_background === "Purple"
      ? "bg-neon-violet/60 text-white divide-soft-purple/25"
      : "bg-white text-midnight divide-neon-violet";

  const isSingleColumn = slice.primary.column.length === 1;
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container
        containerClassName={isSingleColumn ? "flex justify-center" : ""}
      >
        <div
          className={`${cardStyling} flex flex-col md:flex-row items-center justify-center shadow rounded border border-neon-violet items-stretch ${
            isSingleColumn ? "max-w-[860px] w-full" : "w-full"
          }`}
        >
          {slice.primary.column.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center p-10 w-full ${
                index !== 0
                  ? "border-t md:border-t-0 md:border-l border-neon-violet"
                  : ""
              }`}
            >
              {item.icon && (
                <ResponsiveImage
                  image={item.icon}
                  imageHeightClassName="h-[100px] w-auto aspect-square"
                />
              )}
              <div className="mt-4 text-center flex flex-col gap-2">
                {slice.variation === "stats"
                  ? "stat_number" in item && <h3>{item.stat_number}</h3>
                  : "title" in item && <PrismicRichText field={item.title} />}
                <PrismicRichText
                  field={item.description}
                  components={components}
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ContentColumn;
