import { Container } from "@/app/components";
import { Content } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
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
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-midnight p-10"
    >
      <Container className="flex flex-col gap-12 items-center">
        <div
          className="bg-neon-violet shadow rounded py-4 px-6 md:py-16 md:px-28  bg-no-repeat"
          style={{
            backgroundImage: "url('/LogoBig.png')",
            backgroundPosition: "left -40px center",
          }}
        >
          <div className={`flex flex-col ${imageSide} gap-4 md:gap-10 `}>
            <div className="w-full md:w-1/3 aspect-square flex-shrink-0 ">
              <PrismicNextImage
                field={slice.primary.image}
                className="w-full h-full object-contain "
                alt=""
              />
            </div>
            <div>
              <PrismicRichText field={slice.primary.title} />
              <PrismicRichText field={slice.primary.body} />
            </div>
          </div>
        </div>
        {slice.primary.button &&
          slice.primary.button.map((link) => (
            <PrismicNextLink
              key={link.key}
              field={link}
              className="btn btn-secondary w-fit"
            />
          ))}
      </Container>
    </section>
  );
};

export default Testimonials;
