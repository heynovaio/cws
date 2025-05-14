"use client";
import React from "react";
import { Container, Section } from "../Layout";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { SpecCard } from "../SpecCard";
import { ContentBox } from "../ContentBox/ContentBox";
import { PrismicNextLink } from "@prismicio/next";
import { useProgramCategoryData } from "@/hooks";
import { useResourceCategoryData } from "@/hooks/use-all-resource-category-data-hook";
import { CareerPageDocumentData } from "../../../prismicio-types";
import { PrismicRichText } from "@prismicio/react";
import { components } from "@/utils";
import { Breadcrumb, BreadcrumbProps } from "../Breadcrumb";

interface IntroProps {
  pageData?: CareerPageDocumentData;
  type?: "program" | "resource" | string;
  links?: BreadcrumbProps["links"];
}

export const CareerIntro = ({ type, pageData, links }: IntroProps) => {
  const { image, title, body, button } = pageData || {};
  const isProgramPage = type === "program";

  // Only if it is a program page
  const { time, cost, certs, format, included_resources } = (
    isProgramPage ? pageData : {}
  ) as {
    time?: string;
    cost?: number;
    certs?: boolean;
    format?: string;
    included_resources?: [];
  };

  const buttonsExist = Array.isArray(button) && button.length > 0;

  // TODO: Fix the lang once we have the use context provider set up (future PR for all translations as well)
  const { programCategoryData } = useProgramCategoryData("en-ca");
  const { resourceCategoryData } = useResourceCategoryData("en-ca");

  const containerStyle = "bg-white text-midnight";

  const breadcrumbColor = isProgramPage ? "white" : "black";
  return (
    <Section data-test-id="intro">
      <Container>
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-4 rounded p-12 border border-neon-violet shadow backdrop-blur-3xl ${containerStyle}`}
        >
          <div className="md:col-span-6 flex flex-col h-full">
            <div className="flex-grow flex flex-col justify-center">
              {/* If program intro */}
              {isProgramPage &&
                programCategoryData?.map((category, index) => (
                  <span key={category.id} className="tagline">
                    {category.data.name?.toUpperCase()}
                    {index < programCategoryData.length - 1 && ", "}
                  </span>
                ))}
              {/* If resource intro */}
              {!isProgramPage &&
                resourceCategoryData?.map((category, index) => (
                  <span key={category.id} className="text-neon-violet tagline">
                    {category.data.name?.toUpperCase()}
                    {index < resourceCategoryData.length - 1 && ", "}
                  </span>
                ))}
              <ContentBox
                title={title}
                content={
                  <PrismicRichText field={body} components={components} />
                }
                buttons={
                  buttonsExist && (
                    <div
                      className="flex flex-wrap justify-start gap-2"
                      key="buttons"
                    >
                      {button.map(
                        (item, index) =>
                          item.text && (
                            <PrismicNextLink
                              key={index}
                              field={item}
                              className={
                                index === 1
                                  ? "btn btn-secondary"
                                  : "btn btn-primary"
                              }
                            >
                              {item.text}
                            </PrismicNextLink>
                          )
                      )}
                    </div>
                  )
                }
                width="full"
              />
            </div>
            {/* TODO: Add the real breadcrumbs */}
            <Breadcrumb links={links} color={breadcrumbColor} />
          </div>
          <div
            className={`md:col-span-6 grid ${isProgramPage ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-4`}
          >
            <ResponsiveImage
              image={image}
              containerClassName={`w-full h-full max-h-[400px] md:h-full ${!isProgramPage ? "md:col-span-2" : ""}`}
              imageHeightClassName="h-full w-full"
            />
            {isProgramPage && (
              <SpecCard
                title="Details: "
                time={time}
                cost={cost}
                certs={certs}
                format={format}
                resources={included_resources}
              />
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
};
