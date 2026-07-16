"use client";
import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Container } from "@/components";
import Partners from "@/components/Menu/Partners";

/**
 * Props for `SponsorList`.
 */
export type SponsorListProps = SliceComponentProps<Content.SponsorListSlice>;

/**
 * Component for "SponsorList" Slices.
 */
const SponsorList: FC<SponsorListProps> = ({ slice, index, slices }) => {
  const prevSlice = slices[index - 1];
  const hasPrevSponsorList = prevSlice?.slice_type === "sponsor_list";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      data-test-id={slice.id}
      className="partners-non-carousel"
    >
      <Container
        containerClassName={` py-6 ${
          hasPrevSponsorList ? "border-t border-white border-opacity-30" : ""
        }`}
      >
        <Partners
          title={slice.primary.title}
          body={slice.primary.body}
          buttons={slice.primary.buttons}
          logos={slice.primary.sponsors}
          ctaText={slice.primary.cta_text}
          carousel={false}
          numberOfColumns={Number(slice.primary.number_of_columns) || 4}
          hideTitle={slice.primary.hide_title || false}
        />
      </Container>
    </section>
  );
};

export default SponsorList;
