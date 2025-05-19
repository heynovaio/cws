"use client";
import React, { useMemo } from "react";
import { useResourceCategoryData } from "@/hooks";
import { componentsTextSmall } from "@/utils";
import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { DefaultCard } from "../Cards";
import GetAllResources from "@/utils/getAllResources";
import { CustomPagination } from "../CustomPagination";

export type ResourceCategoryGridProps = {
  slice: SliceComponentProps<Content.ContentGridSlice>["slice"];
};

export const ResourceCategoryGrid = ({ slice }: ResourceCategoryGridProps) => {
  const { data } = GetAllResources("en-ca");
  const { resourceCategoryData } = useResourceCategoryData("en-ca");

  const categoryId =
    slice.primary.category && "id" in slice.primary.category
      ? slice.primary.category.id
      : null;

  const resourceData = useMemo(() => {
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

  const matchedCategory = resourceCategoryData?.find(
    (category) => category.id === categoryId
  );
  const categoryName =
    matchedCategory?.data?.name ||
    (slice.primary.category && "name" in slice.primary.category
      ? slice.primary.category.name
      : "Other");

  const resourceCards = resourceData.map((item, index) => (
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
          className="btn pl-0 flex flex-row items-center gap-2 focus:outline-offset-4"
        >
          Learn More
          <HiOutlineArrowLongRight className="h-10 w-10" />
        </Link>,
      ]}
    />
  ));

  return <CustomPagination itemsPerPage={9}>{resourceCards}</CustomPagination>;
};
