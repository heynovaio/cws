import React from "react";
import { Container } from "../Layout";
import { PrismicRichText } from "@prismicio/react";
import { Button } from "../Buttons";

interface GeneralHeroProps {
  data: any;
}

export const GeneralHero: React.FC<GeneralHeroProps> = ({ data }) => {
  return (
    <section
      data-test-id="default-hero"
      className="min-h-[600px] flex items-center w-full bg-quadrant-gradient"
    >
      <Container>
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
