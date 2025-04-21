"use client";
import { Container } from "@/app/components";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { PlusIcon } from "@/app/components/Icons/Plus";
import { MinusIcon } from "@/app/components/Icons/Minus";

/**
 * Props for `Accordion`.faqver
 */
export type AccordionProps = SliceComponentProps<Content.AccordionSlice>;

/**
 * Component for "Accordion" Slices.
 */

const Accordion = ({ slice }: AccordionProps): JSX.Element => {
  const darkerBackground = slice.primary.background_color == "Darker";
  const bgColor = darkerBackground
    ? "bg-dark-purple-background"
    : "bg-midnight";
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`${bgColor} py-10`}
    >
      <Container>
        <div className="md:max-w-[50%] flex flex-col gap-4 mb-8 ">
          <PrismicRichText field={slice.primary.title} />
          <PrismicRichText field={slice.primary.body} />
        </div>

        {slice.primary.accordion_group.map((accordion, index) => {
          const buttonId = `accordion-button-${index}`;
          const panelId = `accordion-panel-${index}`;

          return (
            <Disclosure key={index}>
              {({ open }) => (
                <div className="shadow rounded border border-neon-violet my-4 p-4 bg-white text-midnight ">
                  <DisclosureButton
                    className="py-2 w-full text-left font-semibold flex flex-row justify-between items-center font-extraBold"
                    aria-expanded={open}
                    aria-controls={panelId}
                    id={buttonId}
                    role="button"
                  >
                    <PrismicRichText field={accordion.title} />
                    {open ? (
                      <MinusIcon color="#6D00FF" />
                    ) : (
                      <PlusIcon color="#6D00FF" />
                    )}
                  </DisclosureButton>

                  <DisclosurePanel
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="mt-2"
                  >
                    <PrismicRichText field={accordion.body} />
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          );
        })}
      </Container>
    </section>
  );
};

export default Accordion;
