import { Button } from "@/components/Buttons/Button";
import { Container, ContentBox, Section } from "@/components";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { JSX } from "react";
import { hasContent } from "@/utils";

export type CallToActionProps = SliceComponentProps<Content.CallToActionSlice>;

const CallToAction = ({ slice }: CallToActionProps): JSX.Element => {
  const leftAligned = slice.primary.text_alignment === false;
  const textAlignment = leftAligned
    ? "items-start text-left"
    : "items-center text-center";

  const hasTitle = hasContent(slice.primary.title);
  const hasBody = hasContent(slice.primary.body);
  const hasButtons = hasContent(slice.primary.button);

  if (!hasTitle && !hasBody && !hasButtons) return <></>;

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
            title={hasTitle ? slice.primary.title : undefined}
            content={
              hasBody ? (
                <PrismicRichText field={slice.primary.body} />
              ) : undefined
            }
            buttons={
              hasButtons
                ? slice.primary.button
                    .filter((b) => isFilled.link(b))
                    .map((button) => (
                      <Button
                        key={button.text}
                        buttonLink={button}
                        buttonType="primary"
                        label={button.text}
                      />
                    ))
                : undefined
            }
            containerClassName={textAlignment}
          />
        </div>
      </Container>
    </Section>
  );
};

export default CallToAction;