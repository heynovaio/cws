import { Container } from "@/components";
import { Button } from "@/components/Buttons/Button";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `Testimonials`.
 */
export type TestimonialsProps = SliceComponentProps<Content.TestimonialsSlice>;

/**
 * Component for "Testimonials" Slices.
 */
const Testimonials = ({ slice }: TestimonialsProps): JSX.Element => {
  const isImageRight = slice.primary.image_side == false;
  const imageSide = isImageRight ? "md:flex-row" : "md:flex-row-reverse";
  const backgroundImageSide = !isImageRight
    ? "right -145spx center"
    : "left -40px center";
  const allTestimonials = slice.primary.testimonials;
  const displayedTestimonial =
    allTestimonials[Math.floor(Math.random() * allTestimonials.length)];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-midnight p-10"
    >
      <Container containerClassName="flex flex-col gap-12 items-center">
        <div
          className="bg-neon-violet shadow rounded py-4 px-6 md:py-16 md:px-28  bg-no-repeat "
          style={{
            backgroundImage: "url('/LogoBig.png')",
            backgroundPosition: backgroundImageSide,
          }}
        >
          <div
            className={`flex flex-col ${imageSide} gap-4 md:gap-12 md:items-center`}
          >
            <div className="w-full md:w-1/3 aspect-square flex-shrink-0 max-h-60 md:max-h-none">
              <PrismicNextImage
                field={displayedTestimonial.image}
                className="w-full h-full object-cover rounded"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-4">
              <PrismicRichText field={slice.primary.title} />
              <PrismicRichText field={displayedTestimonial.quote} />
              <div className="flex flex-col">
                <p className="text-base font-accent">
                  {displayedTestimonial.author}
                </p>
                <p className="text-[1.375rem] font-bold">
                  {displayedTestimonial.author_title}
                </p>
              </div>
            </div>
          </div>
        </div>
        {slice.primary.button &&
          slice.primary.button.map((link) => (
            <Button
              buttonType="primary"
              label={link.text}
              key={link.key}
              buttonLink={link}
            />
          ))}
      </Container>
    </section>
  );
};

export default Testimonials;
