import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ContentCarousel`.
 */
export type ContentCarouselProps =
  SliceComponentProps<Content.ContentCarouselSlice>;

/**
 * Component for "ContentCarousel" Slices.
 */
const ContentCarousel = ({ slice }: ContentCarouselProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for content_carousel (variation: {slice.variation})
      Slices
    </section>
  );
};

export default ContentCarousel;
