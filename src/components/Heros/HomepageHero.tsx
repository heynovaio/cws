import React from "react";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { Container } from "../Layout";
import { ContentBox } from "../ContentBox/ContentBox";
import { Button } from "../Buttons";
import { ImageField, LinkField, RichTextField } from "@prismicio/client";

interface HomepageHeroProps {
  data: {
    title: RichTextField;
    body: RichTextField;
    button: (LinkField & { text?: string })[];
    image: ImageField;
  };
}

export const HomepageHero: React.FC<HomepageHeroProps> = ({ data }) => {
  return (
    <section
      className="z-0 md:min-h-[700px] flex items-center w-full bg-cover bg-center md:mb-[-155px] xl:mb-[-120px]"
      style={{ backgroundImage: "url('/hero-gradient.png')" }}
    >
      <Container>
        <div className="text-white flex flex-col sm:flex-row justify-between items-stretch pt-8 lg:py-0 md:gap-16 mt-0 ">
          <div className="basis-1/2 md:pb-12 lg:pb-0">
            <ContentBox
              title={data.title}
              content={<div className="text-bodyLarge"><PrismicRichText field={data.body} /></div>}
              buttons={data.button.map((link, index) => (
                <Button
                  key={index}
                  buttonType="primary"
                  buttonLink={link}
                  label={link.text}
                />
              ))}
            />
          </div>

          <div className="basis-1/2 min-h-full items-end flex justify-center print:mt-6 print:mb-0">
            <PrismicNextImage
              field={data.image}
              className="w-full h-auto object-contain max-w-[800px]"
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
