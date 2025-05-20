import { Content } from "@prismicio/client";
import { Container, Section } from "@/components";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import { components } from "@/utils";

/**
 * Props for `RichText`.
 */
export type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

/**
 * Component for "RichText" Slices.
 */
const RichText = ({ slice }: RichTextProps): JSX.Element => {
  const leftAligned = slice.primary.text_alignment === false;
  const textAlignment = leftAligned
    ? "items-start text-left"
    : "items-center text-center";

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container>
        <div className={`!!!text-content ${textAlignment}`}>
          <PrismicRichText
            field={slice.primary.content}
            components={components}
          />
        </div>
      </Container>
    </Section>
  );
};

export default RichText;
