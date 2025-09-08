"use client";
import React from "react";
import { Container, Section } from "../Layout";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { SpecCard } from "../SpecCard";
import { ContentBox } from "../ContentBox/ContentBox";
import { PrismicNextLink } from "@/components/PrismicNextLink";
import { useProgramCategoryData } from "@/hooks";
import { useResourceCategoryData } from "@/hooks/use-all-resource-category-data-hook";
import {
  ProgramPageDocumentData,
  ResourcePageDocumentData,
} from "../../../prismicio-types";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { components } from "@/utils";
import { Breadcrumb, BreadcrumbProps } from "../Breadcrumb";
import { ProgramFormat } from "@/constants";

interface IntroProps {
  pageData?: ProgramPageDocumentData | ResourcePageDocumentData;
  type?: "program" | "resource" | string;
  links?: BreadcrumbProps["links"];
  lang?: string;
}

export const Intro = ({ type, pageData, links, lang }: IntroProps) => {
  const { image, title, body, button, include_newsletter_sign_up_banner } =
    pageData || {};
  const isProgramPage = type === "program";
  const newsLetterSignUp = isProgramPage && include_newsletter_sign_up_banner;

  // Only if it is a program page
  const { time, cost, certs, format, included_resources } = (
    isProgramPage ? pageData : {}
  ) as {
    time?: string;
    cost?: number;
    certs?: boolean;
    format?: ProgramFormat | "both";
    included_resources?: [];
  };

  const buttonsExist = Array.isArray(button) && button.length > 0;

  // TODO: Fix the lang once we have the use context provider set up (future PR for all translations as well)
  const { programCategoryData } = useProgramCategoryData("en-ca");
  const { resourceCategoryData } = useResourceCategoryData("en-ca");

  let containerStyle;
  switch (type) {
    case "program":
      containerStyle = "bg-gradient-primary";
      break;
    case "resource":
    default:
      containerStyle = "bg-white text-midnight";
      break;
  }

  const breadcrumbColor = isProgramPage ? "white" : "black";
  return (
    <Section data-test-id="intro">
      <Container>
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-4 rounded p-6 md:p-12 border border-neon-violet shadow backdrop-blur-3xl ${containerStyle}`}
        >
          <div className="md:col-span-6 flex flex-col h-full">
            <div className="flex-grow flex flex-col justify-center">
              {isProgramPage && pageData?.category && (
                <span className="tagline">
                  {programCategoryData
                    ?.find(
                      (categories: { id: string }) =>
                        pageData.category &&
                        "id" in pageData.category &&
                        categories.id === pageData.category.id
                    )
                    ?.data.name?.toUpperCase()}
                </span>
              )}
              {/* If resource intro */}
              {!isProgramPage &&
                pageData?.category &&
                "id" in pageData.category && (
                  <span className="text-neon-violet tagline">
                    {resourceCategoryData
                      ?.find(
                        (category: { id: string }) =>
                          "id" in pageData.category &&
                          category.id === pageData.category.id
                      )
                      ?.data.name?.toUpperCase()}
                  </span>
                )}
              <ContentBox
                title={title}
                content={
                  <div className="text-bodyLarge">
                    <PrismicRichText field={body} components={components} />
                  </div>
                }
                buttons={
                  buttonsExist && (!isProgramPage || newsLetterSignUp)
                    ? [
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
                        </div>,
                      ]
                    : []
                }
                width="full"
              />
            </div>
            <Breadcrumb links={links} color={breadcrumbColor} lang={lang} />
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
                title={lang === "fr-ca" ? "Détails: " : "Details: "}
                time={time}
                cost={cost}
                certs={certs}
                format={format}
                resources={included_resources}
                lang={lang}
              />
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
};
