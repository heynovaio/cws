"use client";
import { Container, ContentBox, Section } from "@/components";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Button } from "@/components";

/**
 * Props for `Accordion`.faqver
 */
export type AccordionProps = SliceComponentProps<Content.AccordionSlice>;

/**
 * Component for "Accordion" Slices.
 */

const Accordion = ({ slice }: AccordionProps): JSX.Element => {
  const filteredButtons = slice.primary.button?.filter(
    (button) => button.text && button
  );

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      backgroundColor={slice.primary.background_color}
      styling="py-10"
    >
      <Container>
        <div className="md:max-w-[50%] flex flex-col gap-4 mb-8 ">
          <ContentBox
            title={slice.primary.title}
            content={<PrismicRichText field={slice.primary.body} />}
            buttons={filteredButtons?.map((button) => {
              return (
                <Button
                  key={button.text}
                  buttonLink={button}
                  buttonType="primary"
                  label={button.text}
                />
              );
            })}
          />
        </div>

        {slice.primary.accordion_group.map((accordion, index) => {
          const buttonId = `accordion-button-${index}`;
          const panelId = `accordion-panel-${index}`;

          return (
            <Disclosure key={index}>
              {({ open }) => (
                <div className="group focus-within:ring-4 focus-within:ring-neon-violet shadow rounded border border-neon-violet my-4 p-4 bg-white text-midnight ">
                  <DisclosureButton
                    className="py-2 w-full text-left font-semibold flex flex-row justify-between items-center font-extraBold focus:outline-none"
                    aria-expanded={open}
                    aria-controls={panelId}
                    id={buttonId}
                    role="button"
                  >
                    <PrismicRichText field={accordion.title} />
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
                      accordion.button.map((button) => {
                        return (
                          <Button
                            key={button.text}
                            buttonLink={button}
                            buttonType="primary"
                            label={button.text}
                          />
                        );
                      })}
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          );
        })}
      </Container>
    </Section>
  );
};

export default Accordion;
