import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ContentGrid`.
 */
export type ContentGridProps = SliceComponentProps<Content.ContentGridSlice>;

/**
 * Component for "ContentGrid" Slices.
 */
const ContentGrid: FC<ContentGridProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for content_grid (variation: {slice.variation})
      Slices
    </section>
  );
};

export default ContentGrid;
