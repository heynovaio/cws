import {
  Popover ,
  PopoverButton ,
  PopoverPanel ,
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
*/
const MenuPanel = ({ slice }: MenuPanelProps): JSX.Element => {
  console.log(slice);

  return (
    <>
      <Popover
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="relative hidden md:flex"
      >
        {({ open }) => (
          <>
            <PopoverButton className="flex items-center gap-2">
              {slice.primary.menu_display || "Dropdown"}
              <FaChevronDown
                className={`h-3 w-3 ${open ? "rotate-180 transform" : ""}`}
              />
            </PopoverButton>
            < PopoverPanel
              transition
              anchor="bottom"
              className="bg-[#000] lg:mt-4 mt-6 w-full transition duration-200 ease-in-out"
            >
              <div className="px-16 py-10 lg:px-32 lg:py-20 flex">
                {/* TODO: Insert Content Box here */}
                <div>
                  <PrismicRichText field={slice.primary.title} />
                  {"body" in slice.primary && <PrismicRichText field={slice.primary.body} />}
                </div>

                {"link_group" in slice.primary &&
                  slice.primary.link_group.length !== 0 &&
                  slice.primary.link_group.map((items, index) => (
                    <div key={index} className="">
                      <PrismicRichText field={items.title} />
                      {items.link.map((link, index) => (
                        <PrismicNextLink
                          key={index}
                          field={link}
                          className=""
                        />
                      ))}
                    </div>
                  ))}
              </div>
            </PopoverPanel>​​
          </>
        )}
      </Popover>
      {/* <Disclosure as="div" className="flex flex-col md:hidden relative">
        {({ open }) => (
          <>
            <DisclosureButton className="menu-link flex items-center justify-center gap-2">
              {slice.primary.dropdown_label || "Dropdown"}
              <FaChevronDown
                className={`h-3 w-3 ${open ? "rotate-90 transform" : "-rotate-90"}`}
              />
            </DisclosureButton>
            <DisclosurePanel
              transition
              className="bg-gray mt-2 w-full text-sm/6 origin-top transition duration-200 ease-out data-[closed]:translate-x-full data-[closed]:opacity-0"
            >
              <div className="px-5 py-20 flex flex-col">
                 {/* TODO: Insert ContentBox here */ }
      {/* {slice.variation === "menuTwoLists" ? (
                  <div className="flex flex-col md:gap-4">
                    <LinkColumn
                      label={slice.primary.links_1_heading}
                      links={slice.primary.links_1 as CustomLinkProps[]}
                    />
                    <LinkColumn
                      label={slice.primary.links_2_heading}
                      links={slice.primary.links_2 as CustomLinkProps[]}
                    />
                  </div>
                ) : (
                  <LinkColumn
                    links={slice.primary.links as CustomLinkProps[]}
                    columns={false}
                  />
                )}
              </div>
            </DisclosurePanel> */}
      {/* </>
        )}
      </Disclosure> */}
    </>
  );
};

export default MenuPanel;