import React from "react";
import { Container } from "../Layout";
import { PrismicRichText } from "@prismicio/react";
import { Button } from "../Buttons";
import { KeyTextField, LinkField, RichTextField } from "@prismicio/client";
// import { HiArrowLongDown } from "react-icons/hi2";

interface GeneralHeroProps {
  data: {
    title: RichTextField;
    body: RichTextField;
    button: (LinkField & { text?: string })[];
  };
  tagline?: string | KeyTextField;
  shortHero?: boolean;
}

export const GeneralHero: React.FC<GeneralHeroProps> = ({
  data,
  tagline,
  shortHero = false,
}) => {
  return (
    <section
      data-test-id="default-hero"
      className={`relative flex items-center w-full bg-quadrant-gradient   ${
        shortHero ? "md:min-h-[500px] min-h-[400px]" : "md:min-h-[600px] min-h-[400px]"
      }`}
    >
      <Container>
        {tagline && (
          <p className="uppercase text-aqua font-bold text-md md:text-tagline text-center mb-4">
            {tagline}
          </p>
        )}

        <div className="text-white flex flex-col items-center text-center justify-between gap-8 mx-auto max-w-[900px]">
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

      {/* {!shortHero && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer">
          <a href="#next-section" aria-label="Scroll to next section">
            <HiArrowLongDown className="w-8 h-8 text-white" />
          </a>
        </div>
      )} */}
    </section>
  );
};
