import { Button } from "@/app/components/Button";
import { Container, ContentBox, Section } from "@/components";
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
      </Container>
    </Section>
  );
};

export default CallToAction;
