import React from "react";
import { Container } from "../Layout";
import { PrismicRichText } from "@prismicio/react";
import { Button } from "../Buttons";
import { KeyTextField, LinkField, RichTextField } from "@prismicio/client";

interface GeneralHeroProps {
  data: {
    title: RichTextField;
    body: RichTextField;
    button: (LinkField & { text?: string })[];
  };
  tagline?: string | KeyTextField;
}

export const GeneralHero: React.FC<GeneralHeroProps> = ({ data, tagline }) => {
  return (
    <section
      data-test-id="default-hero"
      className="min-h-[600px] flex items-center w-full bg-quadrant-gradient"
    >
      <Container>
        {tagline && (
          <p className="uppercase text-aqua font-bold text-md md:text-tagline text-center">
            tagline
          </p>
        )}
        <div
          className={`text-white flex flex-col items-center  text-center justify-between py-0 gap-8 mt-0 `}
        >
          <PrismicRichText field={data.title} />
          <PrismicRichText field={data.body} />
          {data.button.map((link, index) => (
            <Button
              key={index}
              buttonType="primary"
              buttonLink={link}
              label={link.text}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};
