import { Button } from "@/components/Buttons/Button";
import { Container, ContentBox, Section } from "@/components";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { JSX } from "react";

/**
 * Props for `CallToAction`.
 */
export type CallToActionProps = SliceComponentProps<Content.CallToActionSlice>;

/**
 * Component for "CallToAction" Slices.
 */
const CallToAction = ({ slice }: CallToActionProps): JSX.Element => {
  const leftAligned = slice.primary.text_alignment === false;
  const textAlignment = leftAligned
    ? "items-start text-left"
    : "items-center text-center";

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
    >
      <Container>
        <div
          className={`rounded bg-gradient-dark p-6 md:p-24 ${textAlignment} flex flex-col gap-6`}
        >
          <ContentBox
            title={slice.primary.title}
            content={<PrismicRichText field={slice.primary.body} />}
            buttons={slice.primary.button.map((button) => {
              return (
                <Button
                  key={button.text}
                  buttonLink={button}
                  buttonType="primary"
                  label={button.text}
                />
              );
            })}
            containerClassName={textAlignment}
          />
        </div>
      </Container>
    </Section>
  );
};

export default CallToAction;
