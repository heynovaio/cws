"use client";
import {
  Container,
  ContentBox,
  DefaultCard,
  Grid,
  Section,
} from "@/components";
import { components } from "@/utils";
import GetAllPrograms from "@/utils/useGetAllPrograms";
import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX, useMemo } from "react";

/**
 * Props for `ContentGrid`.
 */
export type ContentGridProps = SliceComponentProps<Content.ContentGridSlice>;

/**
 * Component for "ContentGrid" Slices.
 */
const ProgramContentGrid = ({ slice }: ContentGridProps): JSX.Element => {
  const { data } = GetAllPrograms("en-ca");
  console.log("Data: ", data);

  const categoryId =
    slice.primary.category && "id" in slice.primary.category
      ? slice.primary.category.id
      : null;

  const programData = useMemo(() => {
    return (
      data?.filter((item) => {
        if (!item.data?.category) return false;

        if ("id" in item.data.category) {
          return item.data.category.id === categoryId;
        }

        return false;
      }) ?? []
    );
  }, [data, categoryId]);

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
    >
      <Container>
        <ContentBox
          title={slice.primary.title}
          content={
            <PrismicRichText
              field={slice.primary.body}
              components={components}
            />
          }
          width="standard"
          containerClassName="flex mx-auto justify-center text-center"
        />
        {/* Insert Program Cards here */}
        <Grid maxColumns={3}>
          {programData.map((item, index) => (
            <DefaultCard
              key={index}
              title={asText(item.data.title)}
              content={
                <PrismicRichText
                  field={item.data.body}
                  components={components}
                />
              }
              image={item.data.image}
              cardType="program"
            />
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default ProgramContentGrid;
