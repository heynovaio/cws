import React from "react";
import { Container } from "../Layout";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { IoMdPin } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import * as prismic from "@prismicio/client";

interface DefaultHeroProps {
  data: any;
  content?: React.ReactNode;
  newsEventsPage?: boolean;
}

export const DefaultHero: React.FC<DefaultHeroProps> = ({
  data,
  content,
  newsEventsPage,
}) => {
  const imageExists = data.image?.url;
  return (
    <section
      data-test-id="default-hero"
      className={`${imageExists ? "min-h-[600px] py-16" : "py-16  md:h-auto"} bg-purple-gradient-reverse flex items-center hero-content print:py-6`}
    >
      <Container>
        <div
          className={`text-white flex flex-col sm:flex-row justify-between ${imageExists ? "sm:items-center" : "items-center"} padded-div py-0 gap-8 mt-0`}
        >
          {/* Header + body */}
          <div
            className={`${imageExists ? "basis-1/2" : "text-center grow mx-auto"} hero-container flex flex-col gap-5  order-1 max-w-[750px] sm:order-0 print-text`}
          >
            <PrismicRichText field={data.title} />
            {newsEventsPage ? (
              <PrismicRichText field={data.introduction_paragraph} />
            ) : (
              <PrismicRichText field={data.paragraph} />
            )}

            {/* Resources */}
            {data.applies_to_pei && (
              <div
                className={` flex xs:items-center text-start gap-3  ${imageExists ? "" : "xs:justify-center"}`}
              >
                <IoMdPin className="h-6 w-auto" />
                <p className="mb-0 ">{"Applies to Prince Edward Island"}</p>
              </div>
            )}
            {data.reviewed_for_accuracy && (
              <div
                className={` flex xs:items-center text-start gap-3 ${imageExists ? "" : "xs:justify-center"}`}
              >
                <FaCheckCircle className="h-6 w-auto " />
                <p className="mb-0">
                  {"Reviewed for Legal Accuracy"}{" "}
                  <time
                    dateTime={prismic
                      .asDate(data.reviewed_for_accuracy)
                      ?.toLocaleDateString()}
                  >
                    {prismic
                      .asDate(data.reviewed_for_accuracy)
                      ?.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                  </time>
                </p>
              </div>
            )}

            {content}
          </div>

          {/* Image */}
          {imageExists && (
            <div className="basis-1/2 order-0 sm:order-1 print:mt-6 print:mb-0">
              <PrismicNextImage
                field={data.image}
                className="w-auto object-cover object-center rounded"
                fallbackAlt=""
                priority={true}
                imgixParams={{ compress: true }}
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};
