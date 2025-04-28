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
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch">
          <div className="w-full md:w-2/3 md:mt-10">
            <PrismicRichText field={slice.primary.title} />
            <PrismicRichText field={slice.primary.description} />
            {slice.primary.image && (
              <ResponsiveImage
                image={slice.primary.image}
                className="mt-6 md:mt-10 w-full h-[350px] object-cover"
              />
            )}
          </div>
          {/** white bg is just temp to show the two columns */}
          <div className="bg-white w-full rounded text-midnight p-4 flex justify-center items-center ">
            <div
              dangerouslySetInnerHTML={{
                __html: slice.primary.form?.html ?? "",
              }}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ContactInfo;
