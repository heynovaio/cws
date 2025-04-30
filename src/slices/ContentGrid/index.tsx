"use client";
import {
  Container,
  ContentBox,
  DefaultCard,
  Grid,
  Section,
} from "@/components";
import { components } from "@/utils";
import GetAllProgramCategories from "@/utils/useGetAllProgramCategories";
import GetAllPrograms from "@/utils/useGetAllPrograms";
import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { JSX, useMemo } from "react";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { ProgramCategoryDocument } from "../../../prismicio-types";
import { useProgramCategoryData } from "@/hooks";
import { useProgramCategoryDataById } from "@/hooks/use-program-category-data-by-id";

/**
 * Props for `ContentGrid`.
 */
export type ContentGridProps = SliceComponentProps<Content.ContentGridSlice>;

/**
 * Component for "ContentGrid" Slices.
 */
const ProgramContentGrid = ({ slice }: ContentGridProps): JSX.Element => {
  const { data } = GetAllPrograms("en-ca");
  // const { programCategoryData: allProgramCategoryData } = useProgramCategoryData("en-ca");

  // const { programCategoryData} = useProgramCategoryDataById()

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

  console.log("Slice: ", slice);
  console.log("Data: ", data);
  console.log("All Program Category Data: ", programData);

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
          width="standard"
          containerClassName="flex mx-auto justify-center text-center"
        />
        <Grid maxColumns={3}>
          {programData.map((item, index) => {
            console.log("Item: ", item);
            return (
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
                category={
                  item.data.category && "name" in item.data.category
                    ? (item.data.category.name as string)
                    : "Other"
                }
                cardType="program"
                buttons={[
                  <Link
                    key={index}
                    href={item.url ?? ""}
                    className="flex items-center gap-2 px-0 btn btn-text underline underline-offset-4"
                  >
                    Learn More
                    <HiOutlineArrowLongRight className="h-10 w-10" />
                  </Link>,
                ]}
              />
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
};

export default ProgramContentGrid;
