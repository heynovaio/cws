"use client";
import { Container, ContentBox } from "@/components";
import Carousel, { CarouselInternalState } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import {
  ImageField,
  KeyTextField,
  LinkField,
  RichTextField,
} from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { useRef, useState } from "react";
import { LongLeftArrow, LongRightArrow } from "@/app/components/Icons/Arrows";
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
}

const responsive = {
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

const CustomArrowBox = ({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
}: {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
}) => {
  return (
    <div className="mb-4 flex justify-end">
      <button
        onClick={currentSlide === totalSlides - 1 ? onPrev : onNext}
        className="carousel-button"
      >
        {currentSlide === totalSlides - 1 && (
          <LongLeftArrow color="currentColor" />
        )}
        <span aria-live="polite" aria-atomic="true">
          {currentSlide + 1} / {totalSlides}
        </span>
        {currentSlide !== totalSlides - 1 && (
          <LongRightArrow color="currentColor" />
        )}
      </button>
    </div>
  );
};

export const Partners = ({
  title,
  body,
  buttons,
  logos,
  ctaText,
}: PartnersProps) => {
  const logoTiles = Array.from(
    { length: Math.ceil(logos.length / 6) },
    (_, i) => logos.slice(i * 6, i * 6 + 6)
  );

  const carouselRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (_: any, state: CarouselInternalState) => {
    setCurrentSlide(state.currentSlide);
  };

  return (
    <section className="my-16">
      <Container className="flex flex-col md:flex-row items-center gap-6">
        <ContentBox
          title={title}
          content={
            <div className="flex flex-col gap-2">
              <PrismicRichText field={body} />
              <p className="font-extraBold text-[2rem] mt-6">{ctaText}</p>
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
        />

        <div className="w-full md:w-2/3">
          <CustomArrowBox
            currentSlide={currentSlide}
            totalSlides={logoTiles.length}
            onNext={() => carouselRef.current?.next()}
            onPrev={() => carouselRef.current?.previous()}
          />

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
                className="grid grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2 gap-8 md:gap-16 p-1"
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
      </Container>
    </section>
  );
};

export default Partners;
