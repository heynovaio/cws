"use client";
import { Container, ContentBox, Section, SplitLayout } from "@/components";
import type { SplitLayoutRatio } from "@/components";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { JSX } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Button } from "@/components";
import { hasContent } from "@/utils";

export type AccordionProps = SliceComponentProps<Content.AccordionSlice>;

const Accordion = ({ slice }: AccordionProps): JSX.Element => {
  const filteredButtons = slice.primary.button?.filter(
    (button) => button.text && button
  );

  const introContent = (
    <ContentBox
      title={slice.primary.title}
      content={<PrismicRichText field={slice.primary.body} />}
      buttons={filteredButtons?.map((button) => (
        <Button
          key={button.text}
          buttonLink={button}
          buttonType="primary"
          label={button.text}
        />
      ))}
    />
  );

  const accordionItems = (
    <>
      {slice.primary.accordion_group.map((accordion, index) => {
        const buttonId = `accordion-button-${index}`;
        const panelId = `accordion-panel-${index}`;
        return (
          <Disclosure key={index}>
            {({ open }) => (
              <div className="group focus-within:ring-4 focus-within:ring-neon-violet shadow rounded border border-neon-violet my-4 p-4 bg-white text-midnight">
                <DisclosureButton
                  className="py-2 w-full text-left flex flex-row justify-between items-center font-extraBold focus:outline-none"
                  aria-expanded={open}
                  aria-controls={panelId}
                  id={buttonId}
                  role="button"
                >
                  <PrismicRichText
                    field={accordion.title}
                    components={{
                      paragraph: ({ children }) => (
                        <p className="font-extraBold">{children}</p>
                      ),
                    }}
                  />
                  {open ? (
                    <FaMinus color="6D00FF" />
                  ) : (
                    <FaPlus color="6D00FF" />
                  )}
                </DisclosureButton>
                <DisclosurePanel
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="mt-2 flex flex-col gap-4"
                >
                  <PrismicRichText field={accordion.body} />
                  {accordion.button &&
                    accordion.button.map((button) => (
                      <Button
                        key={button.text}
                        buttonLink={button}
                        buttonType="primary"
                        label={button.text}
                      />
                    ))}
                </DisclosurePanel>
              </div>
            )}
          </Disclosure>
        );
      })}
    </>
  );

  const ratio = (slice.primary.column_ratio ?? "Stacked") as SplitLayoutRatio | "Stacked";
  const contentFirst = slice.primary.content_first ?? true;

  const hasIntroContent = hasContent(
    slice.primary.title,
    slice.primary.body,
    slice.primary.button
  );

  if (ratio !== "Stacked") {
    return (
      <Section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        backgroundColor={slice.primary.background_color}
      >
        <Container>
          <SplitLayout ratio={ratio as SplitLayoutRatio} flip={!contentFirst}>
            {introContent}
            {accordionItems}
          </SplitLayout>
        </Container>
      </Section>
    );
  }

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
    >
      <Container>
        {hasIntroContent && (
          <div className="md:max-w-[50%] flex flex-col gap-4 mb-8">
            {introContent}
          </div>
        )}
        {accordionItems}
      </Container>
    </Section>
  );
};

export default Accordion;