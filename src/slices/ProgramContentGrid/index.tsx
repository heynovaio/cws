"use client";
import { Container, ContentBox, Section } from "@/components";
import { useCategoryFilterData } from "@/hooks";
import { useCategoryFilter } from "@/providers";
import { components } from "@/utils";
import GetAllPrograms from "@/utils/useGetAllPrograms";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX, useEffect, useMemo } from "react";
import { ProgramPageDocument } from "../../../prismicio-types";

/**
 * Props for `ContentGrid`.
 */
export type ContentGridProps =
  SliceComponentProps<Content.ProgramContentGridSlice>;

/**
 * Component for "ContentGrid" Slices.
 */
const ProgramContentGrid = ({ slice }: ContentGridProps): JSX.Element => {
  const { data } = GetAllPrograms("en-ca");
  console.log("Data: ", data);

  console.log("Slice: ", slice.primary.category);
  // const ProgramData = useMemo(() => {
  //   return data?.filter((item) => {
  //     return item.data.category?.some(
  //       (categoryItem) =>
  //         categoryItem.category &&
  //         "id" in categoryItem.category &&
  //         categoryItem.category.id === categoryId
  //     );
  //   }) as ProgramPageDocument[];
  // }, [data, categoryId]);

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
      </Container>
    </Section>
  );
};

export default ProgramContentGrid;
