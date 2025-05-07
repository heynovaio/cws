import React from "react";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { Container } from "../Layout";
import { ContentBox } from "../ContentBox/ContentBox";
import { Button } from "../Buttons";

interface HomepageHeroProps {
  data: any;
}

export const HomepageHero: React.FC<HomepageHeroProps> = ({ data }) => {
  return (
    <section
      data-test-id="default-hero"
      className="min-h-[600px] flex items-center  mb-[-120px] w-full"
    >
      <Container>
        <div className="text-white flex flex-col sm:flex-row justify-between sm:items-center  py-0 gap-8 mt-0">
          <ContentBox
            title={data.title}
            content={<PrismicRichText field={data.body} />}
            buttons={data.button.map((link, index) => (
              <Button
                key={index}
                buttonType="primary"
                buttonLink={link}
                label={link.text}
              />
            ))}
          />

          <div className=" print:mt-6 print:mb-0 ">
            <PrismicNextImage
              field={data.image}
              className="w-[900px] h-auto object-contain"
              fallbackAlt=""
              priority={true}
              imgixParams={{ compress: true }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};
