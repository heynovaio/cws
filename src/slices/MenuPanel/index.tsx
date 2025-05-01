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
            <PopoverButton className="menu-link flex items-center gap-2">
              {slice.primary.menu_display || "Dropdown"}
              <FaChevronDown
                className={`h-3 w-3 ${open ? "rotate-180 transform" : ""}`}
              />
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom"
              className="bg-dark-purple-background z-10 lg:mt-4 mt-0 w-full transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
              <div className="px-16 py-10 lg:px-28 lg:py-20 flex items-center">
                <ContentBox
                  title={slice.primary.title}
                  content={<PrismicRichText field={slice.primary.body} />}
                  containerClassName="border-r border-black basis-1/3 lg:pr-32 pr-16 py-5"
                />
                <div className="flex flex-col basis-2/3 text-white lg:pl-32 pl-16 py-5 w-full">
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
                </div>
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover>
      <Disclosure
        as="div"
        className="flex flex-col md:hidden relative bg-dark-purple-background"
      >
        {({ open }) => (
          <>
            <DisclosureButton className="  menu-link flex items-center justify-center gap-2">
              {slice.primary.menu_display || "Dropdown"}
              <FaChevronDown
                className={`h-3 w-3 ${open ? "rotate-90 transform" : "-rotate-90"}`}
              />
            </DisclosureButton>
            <DisclosurePanel className="bg-dark-purple-background z-[10] w-full text-sm origin-top transition duration-200 ease-out px-5 py-10">
              <ContentBox
                title={slice.primary.title}
                content={<PrismicRichText field={slice.primary.body} />}
                containerClassName="mb-4 text-white"
              />
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default MenuPanel;
