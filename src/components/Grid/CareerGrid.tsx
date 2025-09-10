"use client";
import React from "react";
import Link from "next/link";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { asText, Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";


import GetAllCareers from "@/utils/getAllCareers";
import { componentsTextSmall } from "@/utils";
import { DefaultCard } from "../Cards";
import { CustomPagination } from "../CustomPagination";
import { useLang } from "@/utils/getLang";

export type CareerGridProps = {
  slice: SliceComponentProps<Content.ContentGridSlice>["slice"];
};

export const CareerGrid = ({}: CareerGridProps) => {
  const lang = useLang();
  const { data } = GetAllCareers(lang.routeLocale);

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
      cardType={item.type}
      buttons={[
        <Link
          key={index}
          href={item.url ?? ""}
          className="more-hover btn pl-0 flex flex-row items-center gap-2 focus:outline-offset-4"
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
