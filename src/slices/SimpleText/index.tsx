import { Button } from "@/components/Buttons/Button";
import { Container, ContentBox, Section } from "@/components";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `SimpleText`.
 */
export type SimpleTextProps = SliceComponentProps<Content.SimpleTextSlice>;

/**
 * Component for "SimpleText" Slices.
 */
const SimpleText = ({ slice }: SimpleTextProps): JSX.Element => {
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
        <ContentBox
          title={slice.primary.title}
          tagline={slice.primary.tagline!}
          content={<PrismicRichText field={slice.primary.body} />}
          containerClassName={textAlignment}
          buttons={slice.primary.button.map((button, index) => {
            const buttonStyle = index == 0 ? "primary" : "outline";
              return (
                <Button
                  key={index}
                  buttonLink={button}
                  buttonType={buttonStyle}
                  label={button.text}
                  />
              ); 
            })}
          />
      </Container>
    </Section>
  );
};

export default SimpleText;
