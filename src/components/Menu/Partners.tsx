"use client";
import { CarouselButton, Container, ContentBox } from "@/components";
import Carousel, { CarouselInternalState } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicNextLink } from "@/components/PrismicNextLink";

import {
  ImageField,
  KeyTextField,
  LinkField,
  RichTextField,
} from "@prismicio/client";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { useRef, useState } from "react";
import { Button } from "@/components";

interface IndividualLogo {
  logo_image: ImageField;
  logo_link: LinkField;
}

interface PartnersProps {
  title: RichTextField;
  body: RichTextField;
  buttons: LinkField[];
  logos: IndividualLogo[];
  ctaText?: KeyTextField;
  carousel?: boolean;
  numberOfColumns?: number;
  hideTitle?: boolean;
}

export const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
  },
};

export const Partners = ({
  title,
  body,
  buttons,
  logos,
  ctaText,
  carousel = true,
  numberOfColumns = 4,
  hideTitle = false,
}: PartnersProps) => {

  const logoTiles = Array.from(
    { length: Math.ceil(logos.length / 6) },
    (_, i) => logos.slice(i * 6, i * 6 + 6)
  );

  const carouselRef = useRef<Carousel>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (_: unknown, state: CarouselInternalState) => {
    setCurrentSlide(state.currentSlide);
  };

  return (
    <section className={carousel ? "my-16" : ""}>
      <Container
        className={`flex flex-col md:flex-row items-center gap-0 md:gap-6 ${
          hideTitle ? "justify-center" : ""
        }`}
      >
        {!hideTitle && (
          <ContentBox
            title={title}
            content={
              <div className="flex flex-col gap-2 pr-8">
                <PrismicRichText field={body} />
                {ctaText && (
                  <p className="font-extraBold text-[1.625rem] md:text-[2rem] mt-6">
                    {ctaText}
                  </p>
                )}
              </div>
            }
            buttons={buttons.map((button, i) => (
              <Button
                key={i}
                buttonType="primary"
                label={button.text}
                buttonLink={button}
              />
            ))}
            containerClassName={`${
              carousel ? "" : "flex basis-1/3"
            } text-center md:text-left`}
          />
        )}

        {carousel && (
          <div className={!hideTitle ? "w-full md:w-2/3" : "w-full max-w-4xl mx-auto"}>
            <div className="flex justify-end mb-4 mx-2">
              <CarouselButton
                currentSlide={currentSlide + 1}
                totalSlides={logoTiles.length}
                onSlideChange={(direction) => {
                  if (
                    direction === "next" &&
                    currentSlide < logoTiles.length - 1
                  ) {
                    carouselRef.current?.next(1);
                  } else if (direction === "prev" && currentSlide > 0) {
                    carouselRef.current?.previous(1);
                  }
                }}
                styling="w-fit"
              />
            </div>

            <Carousel
              ref={carouselRef}
              responsive={responsive}
              infinite={false}
              arrows={false}
              slidesToSlide={1}
              afterChange={handleSlideChange}
              containerClass="w-full"
            >
              {logoTiles.map((tile, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2 gap-8 md:gap-16 p-1 ${!hideTitle ? "" : "flex justify-center"}`}
                >
                  {tile.map((logo, i) => (
                    <PrismicNextLink
                      key={i}
                      field={logo.logo_link}
                      className="logo-carousel-tile"
                    >
                      <PrismicNextImage
                        field={logo.logo_image}
                        className="max-h-full w-full object-contain"
                        alt=""
                      />
                    </PrismicNextLink>
                  ))}
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {!carousel && (
          <div
            className={
              !hideTitle
                ? "grid grid-cols-2 md:grid-cols-[repeat(var(--sponsor-cols),minmax(0,1fr))] gap-4 md:gap-8 md:basis-2/3"
                : "flex flex-wrap justify-center gap-4 md:gap-8 w-full"
            }
            style={
              { "--sponsor-cols": numberOfColumns } as React.CSSProperties
            }
          >
            {logos.map((logo, i) => (
              <PrismicNextLink
                key={i}
                field={logo.logo_link}
                className={`logo-carousel-tile aspect-square flex items-center justify-center flex-none ${
                  !hideTitle
                    ? ""
                    : "basis-[calc((100%-1rem)/2)] md:basis-[calc((100%-(var(--sponsor-cols)-1)*2rem)/var(--sponsor-cols))]"
                }`}
              >
                <PrismicNextImage
                  field={logo.logo_image}
                  className="max-h-full max-w-full w-full h-full object-contain"
                />
              </PrismicNextLink>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default Partners;