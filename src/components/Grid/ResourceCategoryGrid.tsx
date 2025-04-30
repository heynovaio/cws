import React, { useMemo } from "react";
import { useResourceCategoryData } from "@/hooks";
import { components } from "@/utils";
import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { DefaultCard } from "../Cards";
import { Grid } from "./Grid";
import GetAllResources from "@/utils/getAllResources";

export type ResourceCategoryGridProps = {
  slice: SliceComponentProps<Content.ContentGridSlice>["slice"];
  // Add any other props you need
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

  return (
    <Grid maxColumns={3}>
      {resourceData.map((item, index) => (
        <DefaultCard
          key={index}
          title={asText(item.data.title)}
          content={
            <PrismicRichText field={item.data.body} components={components} />
          }
          image={item.data.image}
          category={categoryName as string}
          cardType="resource"
          buttons={[
            <Link
              key={index}
              href={item.url ?? ""}
              className="btn btn-link px-0 flex gap-2"
            >
              Learn More
              <HiOutlineArrowLongRight className="h-10 w-10 inline" />
            </Link>,
          ]}
        />
      ))}
    </Grid>
  );
};
