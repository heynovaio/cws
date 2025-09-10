"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@/components/PrismicNextLink";
import { SliceComponentProps } from "@prismicio/react";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import React, { JSX } from "react";

export type MultiLinkColumnProps =
  SliceComponentProps<Content.MultiLinkColumnSlice>;

const MultiLinkColumn = ({ slice }: MultiLinkColumnProps): JSX.Element => {
  const footerComponentStyling = {
    heading4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="footer-header">{children}</h4>
    ),
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex flex-col gap-5"
    >
      <div className="hidden md:flex flex-col gap-5">
        <span className="">
          <PrismicRichText
            field={slice.primary.title}
            components={footerComponentStyling}
          />
        </span>
        {slice.variation === "default" && (
          <div className="flex flex-col gap-5">
            {slice.primary.link.map((item, index) => (
              <PrismicNextLink
                field={item}
                key={index}
                className="no-underline menu-link"
              />
            ))}
          </div>
        )}
      </div>

      <Disclosure as="div" className="md:hidden">
        {({ open }) => (
          <>
            <DisclosureButton
              className={`flex items-center justify-center gap-4 pl-2 w-full menu-link  ${open ? "mb-3" : ""}`}
            >
              <PrismicRichText
                field={slice.primary.title}
                components={footerComponentStyling}
              />
              <div>
                <FaPlus
                  className={`h-4 w-4 font-bold ${open ? "hidden" : ""}`}
                />
                <FaMinus
                  className={`h-4 w-4 font-bold ${open ? "" : "hidden"}`}
                />
              </div>
            </DisclosureButton>
            <DisclosurePanel className="pl-2 flex flex-col gap-5 mb-3 transition duration-200 ease-out text-center">
              {slice.variation === "default" &&
                slice.primary.link.map((item, index) => (
                  <PrismicNextLink
                    field={item}
                    key={index}
                    className="no-underline text-base menu-link"
                  />
                ))}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </section>
  );
};

export default MultiLinkColumn;
