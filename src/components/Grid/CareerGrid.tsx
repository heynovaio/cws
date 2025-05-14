"use client";
import React from "react";
import Link from "next/link";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

import GetAllCareers from "@/utils/getAllCareers";
import { componentsTextSmall } from "@/utils";
import { DefaultCard } from "../Cards";
import { CustomPagination } from "../CustomPagination";

export type CareerGridProps = {
  slice: SliceComponentProps<Content.ContentGridSlice>["slice"];
};

export const CareerGrid = ({ slice }: CareerGridProps) => {
  const { data } = GetAllCareers("en-ca");

  const careerCards = data?.map((item, index) => (
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
      category="Career Opportunity"
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

  return (
    <CustomPagination itemsPerPage={6}> {careerCards ?? []}</CustomPagination>
  );
};
