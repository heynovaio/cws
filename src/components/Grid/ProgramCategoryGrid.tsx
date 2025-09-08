"use client";
import React, { useMemo } from "react";
import { useProgramCategoryData } from "@/hooks";
import { componentsTextSmall } from "@/utils";
import GetAllPrograms from "@/utils/useGetAllPrograms";
import { asText, Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";

import Link from "next/link";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { DefaultCard } from "../Cards";
import { CustomPagination } from "../CustomPagination";

export type ProgramCategoryGridProps = {
  slice: SliceComponentProps<Content.ContentGridSlice>["slice"];
};

export const ProgramCategoryGrid = ({ slice }: ProgramCategoryGridProps) => {
  const { data } = GetAllPrograms("en-ca");
  const { programCategoryData } = useProgramCategoryData("en-ca");

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

  const matchedCategory = programCategoryData?.find(
    (category) => category.id === categoryId
  );
  const categoryName =
    matchedCategory?.data?.name ||
    (slice.primary.category && "name" in slice.primary.category
      ? slice.primary.category.name
      : "Other");

  const programCards = programData.map((item, index) => (
    <DefaultCard
      key={index}
      title={asText(item.data.title)}
      content={
        <PrismicRichText
          field={item.data.body}
          components={componentsTextSmall}
        />
      }
      image={item.data.image}
      category={categoryName as string}
      cardType={item.type}
      buttons={[
        <Link
          key={index}
          href={item.url ?? ""}
          className="more-hover btn pl-0 flex flex-row items-center gap-2 focus:outline-offset-4"
        >
          <span>Learn More</span>
          <HiOutlineArrowLongRight className="h-10 w-10" />
        </Link>,
      ]}
    />
  ));

  return <CustomPagination itemsPerPage={6}>{programCards}</CustomPagination>;
};
