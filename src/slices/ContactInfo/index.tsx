import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import { Section, Container, ResponsiveImage } from "@/components";

/**
 * Props for `ContactInfo`.
 */
export type ContactInfoProps = SliceComponentProps<Content.ContactInfoSlice>;

/**
 * Component for "ContactInfo" Slices.
 */
const ContactInfo = ({ slice }: ContactInfoProps): JSX.Element => {
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container>
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
          <div className="w-full md:w-2/3 ">
            <PrismicRichText field={slice.primary.title} />
            <PrismicRichText field={slice.primary.description} />
            {slice.primary.image && (
              <ResponsiveImage
                image={slice.primary.image}
                className="mt-6 md:mt-10 w-full h-[350px] object-cover"
              />
            )}
          </div>
          {/** fixed height is just in there as the form embed placeholder */}
          <div className="bg-white w-full h-[800px] rounded text-midnight">
            FORM PLACEHOLDER
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ContactInfo;
