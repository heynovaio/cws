import React from "react";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { PrismicNextImage } from "@prismicio/next";
import { Container } from "../Layout";
import { ContentBox } from "../ContentBox/ContentBox";
import { Button } from "../Buttons";
import { ImageField, LinkField, RichTextField } from "@prismicio/client";
import {
  optionalBannerBackground,
  sectionBackgroundValue,
} from "../Layout/Section";

interface HomepageHeroProps {
  data: {
    title: RichTextField;
    body: RichTextField;
    button: (LinkField & { text?: string })[];
    image: ImageField;
    hero_background_color?: string | null;
  };
}

export const HomepageHero: React.FC<HomepageHeroProps> = ({ data }) => {
  const bannerBackground = optionalBannerBackground(data.hero_background_color);
  const lightCopy =
    sectionBackgroundValue(data.hero_background_color) === "white";

  return (
    <section
      className={`z-0 md:min-h-[700px] flex items-center w-full pt-16 sm:pt-0 sm:mb-[-80px] md:mb-[-175px] xl:mb-[-200px] ${
        bannerBackground || "bg-cover bg-center"
      }`}
      style={
        bannerBackground
          ? undefined
          : { backgroundImage: "url('/hero-gradient.png')" }
      }
    >
      <Container>
        <div
          className={`${lightCopy ? "text-midnight" : "text-white"} flex flex-col sm:flex-row justify-between items-stretch pt-16 lg:py-0 md:gap-16`}
        >
          <div className="basis-1/2 md:basis-2/5 self-center md:pb-12 lg:pb-0 mt-[-100px]">
            <ContentBox
              title={data.title}
              content={
                <div className="text-bodyLarge">
                  <PrismicRichText field={data.body} />
                </div>
              }
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

          <div className="basic-1/2 md:basis-3/5 min-h-full items-end flex justify-end mb-[-180px] sm:mb-[-40px] md:mb-[-100px] print:mt-6 print:mb-0 md:self-end">
            <PrismicNextImage
              field={data.image}
              className="w-full h-full max-w-[800px]"
              fallbackAlt=""
              priority={true}
              imgixParams={{ auto: ["compress"] }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};
