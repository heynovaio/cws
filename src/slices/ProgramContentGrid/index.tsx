"use client";
import { Container, ContentBox, Section } from "@/components";
import { useCategoryFilterData } from "@/hooks";
import { components } from "@/utils";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `ContentGrid`.
 */
export type ContentGridProps =
  SliceComponentProps<Content.ProgramContentGridSlice>;

/**
 * Component for "ContentGrid" Slices.
 */
const ProgramContentGrid = ({ slice }: ContentGridProps): JSX.Element => {
  const { categories } = useCategoryFilterData("en-ca", "program");

  console.log("Categories: ", categories);

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
    >
      <Container>
        <ContentBox
          title={slice.primary.title}
          content={
            <PrismicRichText
              field={slice.primary.body}
              components={components}
            />
          }
          width="standard"
          containerClassName="flex mx-auto justify-center text-center"
        />
        {/* Insert Program Cards here */}
      </Container>
    </Section>
  );
};

export default ProgramContentGrid;
