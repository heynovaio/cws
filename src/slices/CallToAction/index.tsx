import { Button } from "@/app/components/Button";
import { Container, Section } from "@/components";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
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

  console.log(slice.primary.background_color);

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
      styling={`py-10`}
    >
      <Container>
        <div
          className={`rounded bg-gradient-dark p-6 md:p-24 ${textAlignment} flex flex-col gap-6`}
        >
          <PrismicRichText field={slice.primary.title} />
          <PrismicRichText field={slice.primary.body} />
          {slice.primary.button.map((button) => {
            return (
              <Button
                key={button.text}
                buttonLink={button}
                buttonType="primary"
                label={button.text}
              />
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default CallToAction;
