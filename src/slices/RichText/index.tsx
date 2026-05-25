import { Content } from "@prismicio/client";
import { Container, Section } from "@/components";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import { components, hasContent } from "@/utils";

export type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

const RichText = ({ slice }: RichTextProps): JSX.Element | null => {
  const leftAligned = slice.primary.text_alignment === false;
  const textAlignment = leftAligned
    ? "items-start text-left"
    : "items-center text-center";

  if (!hasContent(slice.primary.content)) return null;

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container>
        <div className={`text-content max-w-[900px] mx-auto ${textAlignment}`}>
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