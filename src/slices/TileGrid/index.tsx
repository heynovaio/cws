import { Container, ContentBox, Section } from "@/components";
import { components, hasContent } from "@/utils";
import { Content } from "@prismicio/client";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import { CTATile } from "@/components/Tiles/CTATile";

export type TileGridProps = SliceComponentProps<Content.TileGridSlice>;

const TileGrid = ({ slice }: TileGridProps): JSX.Element => {
  const columns = slice.primary.columns;
  const gridClasses = {
    base: "grid gap-8",
    responsive:
      columns === "2"
        ? "grid-cols-1 sm:grid-cols-2"
        : columns === "3"
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
          : columns === "4"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1",
  };

  const hasTitle = hasContent(slice.primary.title);
  const hasBody = hasContent(slice.primary.body);

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
      styling="pb-12 mb-12"
    >
      <Container containerClassName="flex flex-col gap-12 text-center">
        {(hasTitle || hasBody) && (
          <ContentBox
            title={hasTitle ? slice.primary.title : undefined}
            content={
              hasBody ? (
                <PrismicRichText
                  field={slice.primary.body}
                  components={components}
                />
              ) : undefined
            }
          />
        )}
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
