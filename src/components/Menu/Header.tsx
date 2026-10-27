"use client";
import { components } from "@/slices";
import { PrismicDocument } from "@prismicio/client";
import { PrismicNextLink } from "@/components/PrismicNextLink";
import { SliceZone } from "@prismicio/react";
import React, { Fragment, useEffect, useState } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { MenusDocumentDataSlicesSlice } from "../../../prismicio-types";
import LanguageSwitcher from "../Layout/LanguageSwitcher";
import { useLang } from "@/utils/getLang";

interface HeaderProps {
  slices: MenusDocumentDataSlicesSlice[];
  locales: PrismicDocument[];
}

export const Header: React.FC<HeaderProps> = ({ slices, locales }) => {
  const lang = useLang();
  const currentLang = lang.routeLocale;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`section-bg-white sticky top-0 z-50 ${scrolled ? "bg-white/70" : "bg-white"}`}
      style={scrolled ? { backdropFilter: "blur(35px)" } : undefined}
    >
      <nav
        aria-label="Main Nav"
        className="flex justify-between items-center px-5 py-4 lg:py-4"
      >
        <PrismicNextLink
          className="flex w-full max-w-[170px] md:max-w-[170px]"
          aria-label="homepage link"
          prefetch={true}
          href={`/${currentLang}`}
        >
          <img
            src="/cws-logo-color.svg"
            alt=""
            width={338}
            height={108}
            className="h-auto w-full pr-4"
          />
        </PrismicNextLink>

        {/* Desktop Menu */}

        <div className="hidden lg:flex items-center xl:gap-10 gap-3 z-50 text-midnight">
          <SliceZone slices={slices} components={components} />
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Popover className="relative">
            {({ open }) => (
              <>
                <PopoverButton
                  className="inline-flex justify-center w-full p-2 relative group"
                  aria-label="Main Menu"
                >
                  <div className="flex flex-col justify-center items-center w-8 h-8">
                    <span
                      className={`block absolute h-0.5 w-8 bg-midnight transform transition duration-300 ease-in-out ${
                        open ? "rotate-45 translate-y-0" : "-translate-y-2"
                      }`}
                    ></span>
                    <span
                      className={`block absolute h-0.5 w-8 bg-midnight transform transition duration-300 ease-in-out ${
                        open ? "opacity-0" : "opacity-100"
                      }`}
                    ></span>
                    <span
                      className={`block absolute h-0.5 w-8 bg-midnight transform transition duration-300 ease-in-out ${
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
                    className="section-bg-gradient w-screen h-screen bg-[#6153a3] text-white lg:mt-4 pb-10 z-40"
                  >
                    <div className="flex flex-col pl-4 gap-10 mt-10">
                      <SliceZone slices={slices} components={components} />
                    </div>
                    <div className="mt-10 pl-2">
                      <LanguageSwitcher
                        lang={lang.prismicLocale as "en-ca" | "fr-ca"}
                        locales={locales}
                      />
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
