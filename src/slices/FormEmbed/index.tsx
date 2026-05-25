import { Content, isFilled } from "@prismicio/client";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import { Section, Container, ResponsiveImage } from "@/components";
import { JotformEmbed } from "@/components/JotformEmbed";
import { GenericIframeEmbed } from "@/components/GenericIframeEmbed";
import { ZohoFormsEmbed } from "@/components/ZohoFormsEmbed";
import { PrismicNextImage } from "@prismicio/next";

export type ContactInfoProps = SliceComponentProps<Content.ContactInfoSlice>;

const FormEmbed = ({ slice }: ContactInfoProps): JSX.Element => {
  const isTwoColumn = slice.primary.desktop_alignment === "Two Column";
  const provider = slice.primary.form_provider ?? "JotForm";
  const formUrl = slice.primary.jotform_url;
  const sectionId = slice.primary.section_id ?? undefined;
  const isContain = slice.primary.image_fit === true;

  const formEmbed = formUrl ? (
    provider === "Zoho Forms" ? (
      <ZohoFormsEmbed url={formUrl} />
    ) : provider === "Generic iframe" ? (
      <GenericIframeEmbed url={formUrl} />
    ) : (
      <JotformEmbed url={formUrl} />
    )
  ) : (
    <p className="text-gray-600">Form not available right now.</p>
  );

  const renderImage = (className?: string) => {
    if (!isFilled.image(slice.primary.image)) return null;

    if (isContain) {
      return (
        <div className={`relative w-full h-[350px] ${className ?? ""}`}>
          <PrismicNextImage
            field={slice.primary.image}
            fallbackAlt=""
            fill
            className="object-contain rounded"
          />
        </div>
      );
    }

    return (
      <ResponsiveImage
        image={slice.primary.image}
        className={`rounded w-full h-[350px] object-cover ${className ?? ""}`}
      />
    );
  };

  return (
    <Section
      id={sectionId}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="scroll-mt-32"
    >
      <Container>
        {isTwoColumn ? (
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="w-full md:w-2/3 md:mt-10">
              <PrismicRichText field={slice.primary.title} />
              <PrismicRichText field={slice.primary.description} />
              {renderImage("mt-6 md:mt-10")}
            </div>
            <div className="bg-white w-full rounded text-midnight p-4 flex justify-center items-center">
              {formEmbed}
            </div>
          </div>
        ) : (
          <div className="max-w-[800px] mx-auto flex flex-col items-center gap-6">
            <div className="text-center">
              <PrismicRichText field={slice.primary.title} />
              <PrismicRichText field={slice.primary.description} />
            </div>
            {renderImage("mt-0")}
            <div className="bg-white w-full rounded text-midnight p-6 flex justify-center items-center">
              {formEmbed}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
};

export default FormEmbed;