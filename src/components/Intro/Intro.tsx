import React, { ReactNode } from "react";
import { Container, Section } from "../Layout";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { SpecCard } from "../SpecCard";
import { ContentBox } from "../ContentBox/ContentBox";
import { PrismicNextLink } from "@prismicio/next";

interface IntroProps {
  image?: ImageField | undefined;
  title: string | RichTextField;
  content?: ReactNode;
  buttons?: LinkField[];
  categories?: string[];
}

export const Intro = ({ title, content, image, buttons }: IntroProps) => {
  const buttonsExist = buttons && buttons.length > 0;

  return (
    <Section data-test-id="intro">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded p-12 bg-gradient-primary shadow backdrop-blur-3xl">
          <div className="md:col-span-6 flex flex-col h-full">
            <div className="flex-grow flex flex-col justify-center">
              {<label>{category}</label>}
              <ContentBox
                title={title}
                content={content}
                buttons={[]}
                width="full"
              />
            </div>
            <p>BreadCrumbs</p>
          </div>
          <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResponsiveImage
              image={image}
              containerClassName="w-full h-full max-h-[400px] md:h-full"
              imageHeightClassName="h-full w-full"
            />
            <SpecCard
              title="Details: "
              time="2 hours"
              cost={100}
              certs={true}
              format="Online"
              resources={[
                {
                  link: "https://example.com",
                  text: "Resource 1",
                },
                {
                  link: "https://example.com",
                  text: "Resource 2",
                },
              ]}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};
