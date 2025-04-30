"use client";
import React, { useMemo } from "react";
import { useProgramCategoryData } from "@/hooks";
import { components } from "@/utils";
import GetAllPrograms from "@/utils/useGetAllPrograms";
import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { DefaultCard } from "../Cards";
import { Grid } from "./Grid";

export type ProgramCategoryGridProps = {
  slice: SliceComponentProps<Content.ContentGridSlice>["slice"];
};

export const ProgramCategoryGrid = ({ slice }: ProgramCategoryGridProps) => {
  const { data } = GetAllPrograms("en-ca");
  const { programCategoryData } = useProgramCategoryData("en-ca");

  console.log("Data: ", data);
  console.log("Program Category Data: ", programCategoryData);
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

  console.log("Program Data: ", programData);

  const matchedCategory = programCategoryData?.find(
    (category) => category.id === categoryId
  );
  const categoryName =
    matchedCategory?.data?.name ||
    (slice.primary.category && "name" in slice.primary.category
      ? slice.primary.category.name
      : "Other");

  return (
    <Grid maxColumns={3}>
      {programData.map((item, index) => (
        <DefaultCard
          key={index}
          title={asText(item.data.title)}
          content={
            <PrismicRichText field={item.data.body} components={components} />
          }
          image={item.data.image}
          category={categoryName as string}
          cardType="program"
          buttons={[
            <Link
              key={index}
              href={item.url ?? ""}
              className="btn pl-0 flex flex-row items-center gap-2 focus:outline-offset-4"
            >
              Learn More
              <HiOutlineArrowLongRight className="h-10 w-10" />
            </Link>,
          ]}
        />
      ))}
    </Grid>
  );
};
