"use client";
import { ContentBox } from "@/components";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import { FaChevronDown } from "react-icons/fa";

/**
 * Props for `MenuPanel`.
 */
export type MenuPanelProps = SliceComponentProps<Content.MenuPanelSlice>;

/**
 * Component for "MenuPanel" Slices.
 * This component has two variations: "default" and "menuTwoLists".
 * First aspect to consider is the dropdown label
 */
const MenuPanel = ({ slice }: MenuPanelProps): JSX.Element => {
  const numColumns3 = slice.primary.columns === true;

  return (
    <>
      <Popover
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="relative hidden md:flex"
      >
        {({ open }) => (
          <>
            <PopoverButton className="menu-link flex items-center gap-2 ocus:outline focus:outline-4 focus:outline-offset-2 focus:outline-ultra-pink rounded-md text-md">
              {slice.primary.menu_display || "Dropdown"}
              <FaChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom"
              className="bg-neon-violet/50 z-10 w-full transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] translate-y-6 data-[closed]:-translate-y-1 data-[closed]:opacity-0"
              style={{ backdropFilter: "blur(35px)" }}
            >
              <div className="px-16 py-10 lg:px-28 lg:py-20 flex ">
                <ContentBox
                  title={slice.primary.title}
                  content={<PrismicRichText field={slice.primary.body} />}
                  containerClassName="border-r border-black basis-1/3 lg:pr-32 pr-16 py-5"
                />
                <div className="flex flex-col basis-2/3 justify-center text-white lg:pl-32 pl-16 py-5 w-full">
                  {slice.primary.link_group.map((item, index) => (
                    <div key={index} className="mb-8">
                      {item.title && (
                        <div className="mb-4 ">
                          <PrismicRichText field={item.title} />
                        </div>
                      )}

                      <div
                        className={`grid gap-4 text-left ${
                          numColumns3 ? "grid-cols-3" : "grid-cols-2"
                        }`}
                      >
                        {(item.link || []).map((linkItem, linkIndex) => (
                          <PrismicNextLink
                            key={linkIndex}
                            field={linkItem}
                            className="block text-sm hover:underline"
                          >
                            {linkItem.text}
                          </PrismicNextLink>
                        ))}
                      </div>
                    </div>
                  ))}
                  {slice.primary.link_with_paragraph.length > 0 && (
                    <div
                      className={`mb-8 grid gap-x-24 gap-y-8 text-left ${
                        numColumns3 ? "grid-cols-3" : "grid-cols-2"
                      }`}
                    >
                      {slice.primary.link_with_paragraph.map((item, index) => (
                        <div key={index}>
                          {item.link && (
                            <div className="mb-4">
                              <PrismicNextLink field={item.link} />
                            </div>
                          )}
                          {item.body && (
                            <div className="mb-4">
                              <PrismicRichText field={item.body} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover>
      <Disclosure
        as="div"
        className="flex flex-col md:hidden relative menu-link-mobile gap-2"
      >
        {({}) => (
          <>
            <DisclosureButton className="flex menu-link-mobile  gap-2">
              {slice.primary.menu_display || "Dropdown"}
            </DisclosureButton>

            <DisclosurePanel className=" w-full text-sm origin-top transition duration-200 ease-out px-5 py-5">
              <div className="border-b border-white pb-4 mb-4">
                <ContentBox
                  content={
                    <PrismicRichText
                      field={slice.primary.body}
                      components={{
                        paragraph: ({ children }) => (
                          <p className="text-md font-normal">{children}</p>
                        ),
                      }}
                    />
                  }
                  containerClassName="mb-4 text-white "
                />
              </div>

              <div className="flex flex-col text-white ">
                {slice.primary.link_group.map((item, index) => (
                  <div key={index} className="mb-8">
                    {item.title && (
                      <div className="mb-4 ">
                        <PrismicRichText field={item.title} />
                      </div>
                    )}

                    <div className="flex flex-col gap-4">
                      {(item.link || []).map((linkItem, linkIndex) => (
                        <PrismicNextLink
                          key={linkIndex}
                          field={linkItem}
                          className="block text-sm hover:underline"
                        >
                          {linkItem.text}
                        </PrismicNextLink>
                      ))}
                    </div>
                  </div>
                ))}
                {slice.primary.link_with_paragraph.map((item, index) => (
                  <div key={index} className="mb-8">
                    {item.link && (
                      <div className="mb-4 ">
                        <PrismicNextLink field={item.link} />
                      </div>
                    )}
                    {item.body && (
                      <div className="mb-4 ">
                        <PrismicRichText field={item.body} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default MenuPanel;
