"use client";
import React from "react";
import { Container, Section } from "../Layout";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { ContentBox } from "../ContentBox/ContentBox";
import { PrismicNextLink } from "@prismicio/next";
import { CareerPageDocumentData } from "../../../prismicio-types";
import { PrismicRichText } from "@prismicio/react";
import { components } from "@/utils";
import { Breadcrumb, BreadcrumbProps } from "../Breadcrumb";
import { isFilled } from "@prismicio/client";

interface IntroProps {
  pageData?: CareerPageDocumentData;
  links?: BreadcrumbProps["links"];
}

export const CareerIntro = ({ pageData, links }: IntroProps) => {
  const { image, title, body, button } = pageData || {};

  const buttonArray = Array.isArray(button)
    ? button.filter((btn) => isFilled.link(btn))
    : isFilled.link(button)
      ? [button]
      : [];

  const containerStyle = "bg-white text-midnight";

  return (
    <Section data-test-id="intro">
      <Container>
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-4 rounded p-12 border border-neon-violet shadow backdrop-blur-3xl ${containerStyle}`}
        >
          <div className="md:col-span-6 flex flex-col h-full">
            <div className="flex-grow flex flex-col justify-center">
              <ContentBox
                title={title}
                content={
                  <PrismicRichText field={body} components={components} />
                }
                buttons={
                  buttonArray.length > 0
                    ? buttonArray.map((btn, i) => (
                        <PrismicNextLink
                          key={i}
                          field={btn}
                          className="btn btn-primary"
                        >
                          {"text" in btn && btn.text ? btn.text : "Learn more"}
                        </PrismicNextLink>
                      ))
                    : undefined
                }
                width="full"
              />
            </div>
            <Breadcrumb links={links} color="black" />
          </div>
          <div className="md:col-span-6 grid grid-cols-1 gap-4">
            <ResponsiveImage
              image={image}
              containerClassName="w-full h-full max-h-[400px] md:h-full"
              imageHeightClassName="h-full w-full"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};
