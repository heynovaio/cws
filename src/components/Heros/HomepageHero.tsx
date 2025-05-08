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
    <section className="z-0 min-h-[600px] flex items-center w-full bg-quadrant-gradient mb-[-80px]">
      <Container>
        <div className="text-white flex flex-col sm:flex-row justify-between items-center py-0 gap-16 mt-0 ">
          <div className="basis-1/2 ">
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
          </div>

          <div className="basis-1/2 flex justify-center print:mt-6 print:mb-0">
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
