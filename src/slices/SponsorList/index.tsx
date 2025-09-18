"use client";
import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Button, Container, ContentBox, Section } from "@/components";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

/**
 * Props for `SponsorList`.
 */
export type SponsorListProps = SliceComponentProps<Content.SponsorListSlice>;

/**
 * Component for "SponsorList" Slices.
 */
const SponsorList: FC<SponsorListProps> = ({ slice }) => {
  const totalItems = slice.primary.sponsors.length;
  const logoTiles = Array.from(
    { length: Math.ceil(slice.primary.sponsors.length / 6) },
    (_, i) => slice.primary.sponsors.slice(i * 6, i * 6 + 6)
  );

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      data-test-id={slice.id}
    >
      <Container>
        {slice.primary.sponsors.map((sponsor, index: number) => {
          const title = sponsor.title;
          const body = sponsor.body;
          const ctaText = sponsor.cta_text;
          const buttons = sponsor.buttons || [];

          return (
            <Container
              key={index}
              className={`flex flex-col md:flex-row items-center gap-6 ${
                index === 0 && index !== totalItems - 1
                  ? "border-b-[rgb(255_255_255_/_55%)] border-b-[0.5px] mb-8"
                  : ""
              }`}
            >
              <ContentBox
                title={title}
                content={
                  <div className="flex flex-col gap-2 pr-8">
                    <PrismicRichText field={body} />
                    <p className="font-extraBold text-[1.625rem] md:text-[2rem] mt-6">
                      {ctaText}
                    </p>
                  </div>
                }
                buttons={buttons.map((button, i: number) => (
                  <Button
                    key={i}
                    buttonType="primary"
                    label={button.text}
                    buttonLink={button}
                  />
                ))}
                containerClassName="flex basis-1/3"
              />
              {logoTiles.map((tile, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2 gap-8 md:gap-16 p-1 basis-2/3"
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
            </Container>
          );
        })}
      </Container>
    </Section>
  );
};

export default SponsorList;
