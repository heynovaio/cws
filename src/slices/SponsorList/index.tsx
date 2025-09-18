"use client";
import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Container, Section } from "@/components";
import Partners from "@/components/Menu/Partners";

/**
 * Props for `SponsorList`.
 */
export type SponsorListProps = SliceComponentProps<Content.SponsorListSlice>;

/**
 * Component for "SponsorList" Slices.
 */
const SponsorList: FC<SponsorListProps> = ({ slice }) => {
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      data-test-id={slice.id}
      styling="partners-non-carousel"
    >
      <Container containerClassName="">
        <Partners
          title={slice.primary.title}
          body={slice.primary.body}
          buttons={slice.primary.buttons}
          logos={slice.primary.sponsors}
          ctaText={slice.primary.cta_text}
          carousel={false}
        />
      </Container>
    </Section>
  );
};

export default SponsorList;
