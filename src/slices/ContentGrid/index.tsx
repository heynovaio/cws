"use client";
import {
  Container,
  ContentBox,
  ProgramCategoryGrid,
  ResourceCategoryGrid,
  Section,
} from "@/components";
import { components } from "@/utils";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `ContentGrid`.
 */
export type ContentGridProps = SliceComponentProps<Content.ContentGridSlice>;

/**
 * Component for "ContentGrid" Slices.
 */
const ContentGrid = ({ slice }: ContentGridProps): JSX.Element => {
  const isProgram = slice.variation === "default";

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
    >
      <Container containerClassName="flex flex-col gap-12">
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
        {isProgram ? (
          <ProgramCategoryGrid slice={slice} />
        ) : (
          <ResourceCategoryGrid slice={slice} />
        )}
      </Container>
    </Section>
  );
};

export default ContentGrid;
