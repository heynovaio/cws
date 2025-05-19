"use client";
import { components } from "@/slices";
import { ImageField } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { SliceZone } from "@prismicio/react";
import React, { Fragment } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { HiBars3 } from "react-icons/hi2";
import { MenusDocumentDataSlicesSlice } from "../../../prismicio-types";

interface HeaderProps {
  logo: ImageField;
  slices: MenusDocumentDataSlicesSlice[];
  locales?: unknown;
}

export const Header: React.FC<HeaderProps> = ({ logo, slices }) => {
  return (
    <header
      className="sticky top-0 z-50 bg-midnight/70"
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
          href={`/`}
        >
          <PrismicNextImage field={logo} fallbackAlt="" className="pr-4" />
        </PrismicNextLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center xl:gap-10 gap-3 z-50 ">
          <SliceZone slices={slices} components={components} />
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Popover className="relative">
            <PopoverButton
              className="inline-flex justify-center w-full p-2 relative"
              aria-label="Main Menu"
            >
              <HiBars3 className="h-8 w-8 text-white" />
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
                className="w-screen h-screen bg-midnight bg-gradient-dark lg:mt-4 pb-10 z-40"
              >
                <div className="flex flex-col pl-4  gap-10 mt-10">
                  <SliceZone slices={slices} components={components} />
                </div>
              </PopoverPanel>
            </Transition>
          </Popover>
        </div>
      </nav>
    </header>
  );
};
