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
      className="min-h-[600px] flex items-center hero-content print:py-6 mb-[-150px] w-full"
    >
      <Container>
        <div className="text-white flex flex-col sm:flex-row justify-between sm:items-center padded-div py-0 gap-8 mt-0">
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
            containerClassName="w-1/3"
          />

          <div className=" print:mt-6 print:mb-0">
            <PrismicNextImage
              field={data.image}
              className="w-full h-[750px] object-cover object-center rounded "
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
