import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `TabbedCarousel`.
 */
export type TabbedCarouselProps =
  SliceComponentProps<Content.TabbedCarouselSlice>;

/**
 * Component for "TabbedCarousel" Slices.
 */
const TabbedCarousel = ({ slice }: TabbedCarouselProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for tabbed_carousel (variation: {slice.variation})
      Slices
    </section>
  );
};

export default TabbedCarousel;
