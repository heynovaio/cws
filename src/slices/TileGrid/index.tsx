import {
  Container,
  ContentBox,
  Section,
} from "@/components";
import { components } from "@/utils";
import { Content} from "@prismicio/client";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import { CTATile } from "@/components/Tiles/CTATile";

/**
 * Props for `TileGrid`.
 */
export type TileGridProps = SliceComponentProps<Content.TileGridSlice>;

/**
 * Component for "TileGrid" Slices.
 */
const TileGrid = ({ slice }: TileGridProps): JSX.Element => {
  const columns = slice.primary.columns
  const gridClasses = {
    base: "grid gap-8",
    responsive:
      columns === '2'
        ? "grid-cols-1 sm:grid-cols-2"
        : columns === '3'
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
          : columns === '4'
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1",
  };
  return (
  <Section
    data-slice-type={slice.slice_type}
    data-slice-variation={slice.variation}
    backgroundColor={slice.primary.background_color}
    styling={`pb-12 mb-12`}
  >
    <Container containerClassName="flex flex-col gap-12 text-center">
      <ContentBox
        title={slice.primary.title}
        content={
          <PrismicRichText
            field={slice.primary.body}
            components={components}
          />
        }
      />
      <div className={`${gridClasses.base} ${gridClasses.responsive}`}> 
        {slice.primary.tiles.map((tile, index) => (
          <CTATile
            key={index}
            bg_image={tile.tile_background_image}
            title={tile.tile_title}
            image={tile.tile_image}
            link={tile.tile_link}
          />
        ))}  
        </div> 
      </Container>
  </Section>
  );
};

export default TileGrid;
