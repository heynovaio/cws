import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `TileGrid`.
 */
export type TileGridProps = SliceComponentProps<Content.TileGridSlice>;

/**
 * Component for "TileGrid" Slices.
 */
const TileGrid = ({ slice }: TileGridProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for tile_grid (variation: {slice.variation}) Slices
    </section>
  );
};

export default TileGrid;
