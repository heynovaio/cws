import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import { Section, Container, ResponsiveImage } from "@/components";

/**
 * Props for `FormEmbed`.
 */
export type ContactInfoProps = SliceComponentProps<Content.ContactInfoSlice>;

/**
 * Component for "FormEmbed" Slices.
 */
const FormEmbed = ({ slice }: ContactInfoProps): JSX.Element => {
  const isTwoColumn = slice.primary.desktop_alignment === "Two Column";

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container>
        {isTwoColumn ? (
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
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
            <div className="bg-white w-full rounded text-midnight p-4 flex justify-center items-center">
              <div
                dangerouslySetInnerHTML={{
                  __html: slice.primary.form?.html ?? "",
                }}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-[800px] mx-auto flex flex-col items-center gap-6">
            <div className="text-center">
              <PrismicRichText field={slice.primary.title} />
              <PrismicRichText field={slice.primary.description} />
            </div>

            {slice.primary.image && (
              <ResponsiveImage
                image={slice.primary.image}
                className={`${isTwoColumn ? "mt-6" : "mt-0"} w-full h-[350px] object-cover`}
              />
            )}

            <div className="bg-white w-full rounded text-midnight p-6 flex justify-center items-center">
              <div
                dangerouslySetInnerHTML={{
                  __html: slice.primary.form?.html ?? "",
                }}
              />
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
};

export default FormEmbed;
