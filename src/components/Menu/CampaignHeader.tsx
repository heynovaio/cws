"use client";
import { components } from "@/slices";
import { ImageField } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { usePathname } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import React, { Fragment } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { MenusDocumentDataSlicesSlice } from "../../../prismicio-types";

interface CampaignHeaderProps {
  logo: ImageField;
  slices: MenusDocumentDataSlicesSlice[];
  locales?: unknown;
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  logo,
  slices,
}) => {
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1] === "fr-ca" ? "fr-ca" : "en-ca";
  return (
    <header
      className="z-50 bg-midnight/70"
      style={{ backdropFilter: "blur(35px)" }}
    >
      <nav
        aria-label="Main Nav"
        className="flex justify-between items-center px-5 lg:py-2 py-1 "
      >
        <PrismicNextLink
          className="flex max-w-[180px] md:max-w-[220px]"
          aria-label="homepage link"
          prefetch={true}
          href={`/${currentLang}`}
        >
          <PrismicNextImage field={logo} fallbackAlt="" className="pr-4" />
        </PrismicNextLink>

        <div>
          <Popover className="relative">
            {({ open }) => (
              <>
                <PopoverButton
                  className="inline-flex justify-center w-full p-2 relative group"
                  aria-label="Main Menu"
                >
                  <div className="flex flex-col justify-center items-center w-8 h-8">
                    <span
                      className={`block absolute h-0.5 w-8 bg-white transform transition duration-300 ease-in-out ${
                        open ? "rotate-45 translate-y-0" : "-translate-y-2"
                      }`}
                    ></span>
                    <span
                      className={`block absolute h-0.5 w-8 bg-white transform transition duration-300 ease-in-out ${
                        open ? "opacity-0" : "opacity-100"
                      }`}
                    ></span>
                    <span
                      className={`block absolute h-0.5 w-8 bg-white transform transition duration-300 ease-in-out ${
                        open ? "-rotate-45 translate-y-0" : "translate-y-2"
                      }`}
                    ></span>
                  </div>
                </PopoverButton>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 translate-x-full"
                  enterTo="transform opacity-100 translate-x-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 translate-x-0"
                  leaveTo="transform opacity-0 translate-x-full"
                >
                  <PopoverPanel
                    anchor="bottom"
                    className="
                        lg:absolute lg:right-0 lg:top-full 
                        w-screen h-screen lg:w-auto lg:h-auto
                        bg-midnight bg-gradient-dark 
                        lg:shadow-lg
                        lg:mt-2
                    "
                  >
                    <div className="flex flex-col pl-4 gap-10 mt-10 lg:hidden">
                      <SliceZone slices={slices} components={components} />
                    </div>

                    <div className="hidden lg:flex justify-center items-center xl:gap-10 gap-6 w-full p-6">
                      <SliceZone slices={slices} components={components} />
                    </div>
                  </PopoverPanel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </nav>
    </header>
  );
};
