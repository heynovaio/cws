import { Container } from "@/components";
import { Content } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `LogoList`.
 */
export type LogoListProps = SliceComponentProps<Content.LogoListSlice>;

/**
 * Component for "LogoList" Slices.
 */
const LogoList = ({ slice }: LogoListProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-midnight"
    >
      <Container>
        <div className="flex flex-col md:flex-row">
          <div>
            <PrismicRichText field={slice.primary.title} />
            <PrismicRichText field={slice.primary.body} />
            {slice.primary.button &&
              slice.primary.button.map((link) => (
                <PrismicNextLink
                  key={link.key}
                  field={link}
                  className="btn btn-secondary"
                />
              ))}
          </div>
          <div>
            {slice.primary.logos &&
              slice.primary.logos.map((item, index) => (
                <PrismicNextLink field={item.logo_link} key={index}>
                  <PrismicNextImage field={item.logo_image} alt="" />
                </PrismicNextLink>
              ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LogoList;
