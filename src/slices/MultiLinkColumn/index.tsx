"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import React, { JSX } from "react";

export type MultiLinkColumnProps =
  SliceComponentProps<Content.MultiLinkColumnSlice>;

const MultiLinkColumn = ({ slice }: MultiLinkColumnProps): JSX.Element => {
  const footerComponentStyling = {
    heading2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="footer-header">{children}</h2>
    ),
    heading3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="footer-header">{children}</h3>
    ),
    heading4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="footer-header">{children}</h4>
    ),
    heading5: ({ children }: { children: React.ReactNode }) => (
      <h5 className="footer-header">{children}</h5>
    ),
    heading6: ({ children }: { children: React.ReactNode }) => (
      <h6 className="footer-header">{children}</h6>
    ),
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex flex-col gap-5"
    >
      <div className="hidden md:flex flex-col gap-5">
        <span className="pl-2">
          <PrismicRichText
            field={slice.primary.title}
            components={footerComponentStyling}
          />
        </span>
        {slice.variation === "default" && (
          <div className="flex flex-col gap-5">
            {slice.primary.link.map((item, index) => (
              <PrismicNextLink field={item} key={index} className="pl-2 " />
            ))}
          </div>
        )}
      </div>

      <Disclosure as="div" className="md:hidden">
        {({ open }) => (
          <>
            <DisclosureButton
              className={`flex items-center justify-center gap-4 pl-2 w-full menu-link ${open ? "mb-3" : ""}`}
            >
              <PrismicRichText
                field={slice.primary.title}
                components={footerComponentStyling}
              />
              <div className="pr-2">
                <FaPlus
                  className={`h-4 w-4 font-bold ${open ? "hidden" : ""}`}
                />
                <FaMinus
                  className={`h-4 w-4 font-bold ${open ? "" : "hidden"}`}
                />
              </div>
            </DisclosureButton>
            <DisclosurePanel className="pl-2 flex flex-col gap-5 mb-3 transition duration-200 ease-out">
              {slice.variation === "default" &&
                slice.primary.link.map((item, index) => (
                  <PrismicNextLink
                    field={item}
                    key={index}
                    className="link-dark-bg focus"
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
