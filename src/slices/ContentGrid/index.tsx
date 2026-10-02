"use client";
import {
  Container,
  ContentBox,
  ProgramCategoryGrid,
  ResourceCategoryGrid,
  Section,
} from "@/components";
import { CareerGrid } from "@/components/Grid/CareerGrid";
import { components, hasContent } from "@/utils";
import { Content } from "@prismicio/client";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

export type ContentGridProps = SliceComponentProps<Content.ContentGridSlice>;

const ContentGrid = ({ slice }: ContentGridProps): JSX.Element => {
  const isProgram = slice.variation === "default";
  const isCareer = slice.variation === "careersGrid";

  const hasTitle = hasContent(slice.primary.title);
  const hasBody = hasContent(slice.primary.body);

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
    >
      <Container containerClassName="flex flex-col gap-12 mb-12">
        {(hasTitle || hasBody) && (
          <ContentBox
            title={hasTitle ? slice.primary.title : undefined}
            content={
              hasBody ? (
                <PrismicRichText
                  field={slice.primary.body}
                  components={components}
                />
              ) : undefined
            }
            width="standard"
            containerClassName="flex mx-auto justify-center text-center"
          />
        )}
        {isProgram ? (
          <ProgramCategoryGrid slice={slice} />
        ) : isCareer ? (
          <div className="mt-[-2rem]">
            <CareerGrid slice={slice} />
          </div>
        ) : (
          <ResourceCategoryGrid slice={slice} />
        )}
      </Container>
    </Section>
  );
};

export default ContentGrid;
