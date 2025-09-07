import React from "react";
import {
  GlobalsDocumentData,
  MenusDocumentData,
  MenusDocumentDataSlices1Slice,
} from "../../../prismicio-types";
import { ResponsiveImage } from "..";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { FaFacebook, FaInstagram, FaMeta, FaXTwitter } from "react-icons/fa6";
import { PrismicNextLink } from "@prismicio/next";
import { FaLinkedin, FaMinus, FaPlus } from "react-icons/fa";
import Image from "next/image";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

interface FooterProps {
  global?: GlobalsDocumentData;
  footerData?: MenusDocumentData;
  slices: MenusDocumentDataSlices1Slice[] | undefined;
  lang: string;
}

export const Footer = ({ global, slices, footerData, lang }: FooterProps) => {
  return (
    <footer className="bg-neon-violet/50 text-white flex flex-col justify-center items-center">
      <nav className="py-14 px-5 mx-auto max-w-screen-xl w-full flex flex-col">
        <div className="flex gap-x-20 gap-y-16 flex-wrap md:flex-nowrap items-center justify-center md:justify-normal md:items-stretch">
          <div className="flex flex-col items-center lg:items-start">
            <ResponsiveImage
              image={global?.site_logo}
              containerClassName="mb-8 max-w-[180px] md:max-w-[220px]"
            />
            <div className="flex flex-col items-center md:items-start">
              <h4 className="mb-6 footer-header">
                {lang === "fr-ca" ? "Suivez-nous" : "Follow Us"}
              </h4>
              <div className="flex  flex-col justify-center items-center md:items-start gap-6 ">
                {footerData?.instagram.text !== "" &&
                  footerData?.instagram.link_type !== "Any" && (
                    <span className="flex flex-row gap-4 items-center ">
                      <FaInstagram size={35} />
                      <PrismicNextLink
                        field={footerData?.instagram}
                        className="text-base underline-offset-4 menu-link"
                      />
                    </span>
                  )}
                {footerData?.facebook.text !== "" &&
                  footerData?.facebook.link_type !== "Any" && (
                    <span className="flex flex-row gap-4 items-center">
                      <FaFacebook size={35} />
                      <PrismicNextLink
                        field={footerData?.facebook}
                        className="text-base underline-offset-4 menu-link"
                      />
                    </span>
                  )}
                {footerData?.linkedin.text !== "" &&
                  footerData?.linkedin.link_type !== "Any" && (
                    <span className="flex flex-row gap-4 items-center">
                      <FaLinkedin size={35} />
                      <PrismicNextLink
                        field={footerData?.linkedin}
                        className="text-base underline-offset-4 menu-link"
                      />
                    </span>
                  )}
                {footerData?.meta.text !== "" &&
                  footerData?.meta.link_type !== "Any" && (
                    <span className="flex flex-row gap-4 items-center">
                      <FaMeta size={35} />
                      <PrismicNextLink
                        field={footerData?.meta}
                        className="text-base underline-offset-4 menu-link"
                      />
                    </span>
                  )}
                {footerData?.twitter.text !== "" &&
                  footerData?.twitter.link_type !== "Any" && (
                    <span className="flex flex-row gap-4 items-center">
                      <FaXTwitter size={35} />
                      <PrismicNextLink
                        field={footerData?.twitter}
                        className="text-base underline-offset-4 menu-link"
                      />
                    </span>
                  )}
              </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col flex-wrap grow justify-between">
            <div className="flex flex-col md:flex-row justify-center md:justify-between gap-x-8 gap-y-12 w-full text-center md:text-left footer-links">
              <SliceZone slices={slices} components={components} />
              <Disclosure as="div" className="md:hidden">
                {({ open }) => (
                  <>
                    <DisclosureButton
                      className={`flex items-center justify-center gap-4 pl-2 w-full menu-link  ${open ? "mb-3" : ""}`}
                    >
                      <h4 className="footer-header">
                        {lang === "fr-ca" ? "Contactez-nous" : "Contact Us"}
                      </h4>
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
                      {global?.email && (
                        <a href={`mailto:${global?.email}`}>{global?.email}</a>
                      )}
                      {global?.phone && (
                        <a href={`tel:${global?.phone}`}>{global?.phone}</a>
                      )}
                      {global?.address && <p>{global?.address}</p>}
                      {global?.fax_number && <p>{global?.fax_number}</p>}
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
              <div className="hidden md:flex flex-col gap-4">
                <h4 className="footer-header">
                  {lang === "fr-ca" ? "Contactez-nous" : "Contact Us"}
                </h4>
                {global?.email && (
                  <a href={`mailto:${global?.email}`}>{global?.email}</a>
                )}
                {global?.phone && (
                  <a href={`tel:${global?.phone}`}>{global?.phone}</a>
                )}
                {global?.address && <p>{global?.address}</p>}
                {global?.fax_number && <p>{global?.fax_number}</p>}
              </div>
            </div>
            {/* Government of Canada Logo */}
            <div className="hidden md:flex ml-auto flex-grow items-end">
              {lang === "fr-ca" ? (
                <Image
                  src="/GovernmentOfCanadaFR.png"
                  alt="Gouvernement du Canada"
                  width={500}
                  height={100}
                  className="mx-auto w-auto h-auto max-w-full"
                  sizes="(max-width: 1040px) 520px, 580px"
                />
              ) : (
                <Image
                  src="/GovernmentOfCanadaEN.png"
                  alt="Government of Canada"
                  width={500}
                  height={100}
                  className="mx-auto w-auto h-auto md:max-w-[400px] max-w-[200px]"
                />
              )}
            </div>
          </div>
          <div className="md:hidden flex ml-auto flex-grow items-end">
            {lang === "fr-ca" ? (
              <Image
                src="/GovernmentOfCanadaFR.png"
                alt="Gouvernement du Canada"
                width={500}
                height={100}
                className="mx-auto w-auto h-auto max-w-[400px]"
              />
            ) : (
              <Image
                src="/GovernmentOfCanadaEN.png"
                alt="Government of Canada"
                width={500}
                height={100}
                className="mx-auto w-auto h-auto max-w-[400px]"
              />
            )}
          </div>
        </div>
      </nav>
      <div className="flex flex-col justify-center items-center mt-6 footer-links">
        <div className="flex flex-row">
          <PrismicNextLink
            field={footerData?.policy_link}
            className="text-base md:text-bodyLarge menu-link underline-offset-4"
          />
          <PrismicNextLink
            field={footerData?.helpline}
            className="text-base md:text-bodyLarge menu-link underline-offset-4"
          />
        </div>

        <p className="mt-4 text-center text-base">{footerData?.copyright}</p>

        <a
          className="mt-2 text-center text-base no-underline mb-4"
          href="https://heynova.io/"
          target="_blank"
        >
          {lang === "fr-ca" ? "Conçu par Hey Nova" : "Designed by Hey Nova"}
        </a>
      </div>
    </footer>
  );
};
