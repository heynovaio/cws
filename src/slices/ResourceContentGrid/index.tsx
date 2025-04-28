import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ResourceContentGrid`.
 */
export type ResourceContentGridProps =
  SliceComponentProps<Content.ResourceContentGridSlice>;

/**
 * Component for "ResourceContentGrid" Slices.
 */
const ResourceContentGrid = ({
  slice,
}: ResourceContentGridProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for resource_content_grid (variation:{" "}
      {slice.variation}) Slices
    </section>
  );
};

export default ResourceContentGrid;
