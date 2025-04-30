import {
  Container,
  ContentBox,
  Section,
} from "@/components";
import { components } from "@/utils";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
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
  return (
    <Section
    data-slice-type={slice.slice_type}
    data-slice-variation={slice.variation}
    backgroundColor={slice.primary.background_color}
  >
    <Container containerClassName="flex flex-col gap-12">
      <ContentBox
        title={slice.primary.title}
        content={
          <PrismicRichText
            field={slice.primary.body}
            components={components}
          />
        }
      />
      </Container>
      <div> 
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
  </Section>
  );
};

export default TileGrid;
