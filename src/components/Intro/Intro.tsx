"use client";
import React from "react";
import { Container, Section } from "../Layout";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { SpecCard } from "../SpecCard";
import { ContentBox } from "../ContentBox/ContentBox";
import { PrismicNextLink } from "@prismicio/next";
import { useProgramCategoryData, useResourceCategoryData } from "@/hooks";
import {
  ProgramPageDocumentData,
  ResourcePageDocumentData,
} from "../../../prismicio-types";
import { PrismicRichText } from "@prismicio/react";
import { components } from "@/utils";

interface IntroProps {
  pageData?: ProgramPageDocumentData | ResourcePageDocumentData;
  type?: "program" | "resource" | string;
}

export const Intro = ({ type, pageData }: IntroProps) => {
  const { image, title, body, link, newsletter_sign_up } = pageData || {};
  const isProgramPage = type === "program";
  const newsLetterSignUp = isProgramPage && newsletter_sign_up;

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

  const buttonsExist = Array.isArray(link) && link.length > 0;

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

  return (
    <Section data-test-id="intro">
      <Container>
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-4 rounded p-12 border border-neon-violet shadow backdrop-blur-3xl ${containerStyle}`}
        >
          <div className="order-1 md:order-2 md:col-span-3">
            <ResponsiveImage
              image={image}
              containerClassName="w-full h-full max-h-[400px]"
              imageHeightClassName="h-full w-full"
            />
          </div>

          {/* Content Box - Left Column (6 cols) */}
          <div className="order-2 md:order-1 md:col-span-6 flex flex-col h-full">
            <div className="flex-grow flex flex-col justify-center">
              {programCategoryData?.map((category, index) => (
                <span key={category.id} className="tagline">
                  {category.data.name?.toUpperCase()}
                  {index < programCategoryData.length - 1 && ", "}
                </span>
              ))}
              {resourceCategoryData?.map((category, index) => (
                <span key={category.id} className="text-neon-violet tagline">
                  {category.data.name?.toUpperCase()}
                  {index < resourceCategoryData.length - 1 && ", "}
                </span>
              ))}
              <ContentBox
                title={title}
                titleClassName="h1-alt"
                content={
                  <PrismicRichText field={body} components={components} />
                }
                buttons={
                  buttonsExist && (!isProgramPage || newsLetterSignUp)
                    ? [
                        <div
                          className="flex flex-wrap justify-start gap-2"
                          key="buttons"
                        >
                          {link.map(
                            (item, index) =>
                              item.text && (
                                <PrismicNextLink
                                  key={index}
                                  field={item}
                                  className={
                                    index === 1
                                      ? "btn btn-primary"
                                      : "btn btn-secondary"
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
            <p>[INSERT BREADCRUMBS HERE]</p>
          </div>

          {isProgramPage && (
            <div className="order-3 md:order-2 md:col-span-3">
              <SpecCard
                title="Details: "
                time={time}
                cost={cost}
                certs={certs}
                format={format}
                resources={included_resources}
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};
