"use client";
import {
  ContentBox,
  Section,
  Container,
  MultiCardPerTab,
  SingleCardPerTab,
} from "@/components";
import { components } from "@/utils";
import { Content } from "@prismicio/client";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { SliceComponentProps } from "@prismicio/react";
import "react-multi-carousel/lib/styles.css";

export type TabbedCarouselProps =
  SliceComponentProps<Content.TabbedCarouselSlice>;

const TabbedCarousel = ({ slice }: TabbedCarouselProps) => {
  let carouselType;
  switch (slice.variation) {
    case "tabbedCarouselMultiCard":
      carouselType = <MultiCardPerTab slice={slice} />;
      break;
    case "tabbedCarouselCampaign": // TODO: Change this to the campaign component once made
    default:
      carouselType = <SingleCardPerTab slice={slice} />;
      break;
  }

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      styling="overflow-x-hidden"
    >
      <Container containerClassName="flex flex-col items-center">
        <ContentBox
          title={slice.primary.title}
          content={
            <div className="text-bodyLarge">
              <PrismicRichText
                field={slice.primary.body}
                components={components}
                />
            </div>
          }
          width="standard"
          containerClassName="text-center gap-4"
        />
      </Container>
      {carouselType}
    </Section>
  );
};

export default TabbedCarousel;
