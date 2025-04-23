import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Section, Container, ResponsiveImage } from "@/components";
import { JSX } from "react";

/**
 * Props for `ContentColumn`.
 */
export type ContentColumnProps =
  SliceComponentProps<Content.ContentColumnSlice>;

/**
 * Component for "ContentColumn" Slices.
 */
const ContentColumn = ({ slice }: ContentColumnProps): JSX.Element => {
  const cardBgColor =
    slice.primary.card_background === "Purple"
      ? "bg-neon-violet/60 text-white divide-soft-purple/25"
      : "bg-white text-midnight divide-neon-violet";
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container>
        <div
          className={`${cardBgColor} flex flex-row items-center justify-center shadow rounded border border-neon-violet items-stretch divide-x `}
        >
          {slice.primary.column.map((item) => (
            <div className="flex flex-col items-center justify-center p-10 w-full ">
              {item.icon && (
                <ResponsiveImage
                  image={item.icon}
                  imageHeightClassName="h-[100px] w-auto"
                />
              )}
              <div className="mt-4 text-center">
                <PrismicRichText field={item.title} />
                <PrismicRichText field={item.description} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ContentColumn;
