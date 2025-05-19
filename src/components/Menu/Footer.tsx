import React from "react";
import {
  GlobalsDocumentData,
  MenusDocumentData,
  MenusDocumentDataSlices1Slice,
} from "../../../prismicio-types";
import { ResponsiveImage } from "..";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { PrismicNextLink } from "@prismicio/next";

interface FooterProps {
  global?: GlobalsDocumentData;
  footerData?: MenusDocumentData;
  slices: MenusDocumentDataSlices1Slice[] | undefined;
}

export const Footer = ({ global, slices, footerData }: FooterProps) => {
  return (
    <footer className="bg-neon-violet/50 text-white flex flex-col justify-center items-center">
      <nav className="py-14  mx-auto max-w-screen-xl w-full flex flex-col">
        <div className="flex flex-col md:flex-row flex-wrap justify-center md:justify-between gap-x-8 gap-y-12 w-full text-center md:text-left footer-links">
          <div className="flex flex-col items-center lg:items-start">
            <ResponsiveImage
              image={global?.site_logo}
              containerClassName="mb-8"
            />
            <div className="flex flex-col items-center md:items-start">
              <h4 className="mb-6 footer-header">Follow Us</h4>
              <div className="flex flex-row md:flex-col justify-center items-center md:items-start gap-6 ">
                <span className="flex flex-row gap-4 items-center ">
                  <FaInstagram size={35} />
                  <PrismicNextLink
                    field={footerData?.instagram}
                    className="text-base underline-offset-4 menu-link"
                  />
                </span>
                <span className="flex flex-row gap-4 items-center">
                  <FaFacebook size={35} />
                  <PrismicNextLink
                    field={footerData?.facebook}
                    className="text-base underline-offset-4 menu-link"
                  />
                </span>
              </div>
            </div>
          </div>
          <SliceZone slices={slices} components={components} />
          <div className="flex flex-col">
            <h4 className="footer-header">Contact Us</h4>
            <p>{global?.email}</p>
          </div>
        </div>
      </nav>
      <div className="flex flex-col justify-center items-center mt-6 footer-links">
        <div className="flex flex-row gap-6 md:gap-10">
          <PrismicNextLink
            field={footerData?.policy_link}
            className="text-base md:text-bodyLarge menu-link underline-offset-4"
          />
          <PrismicNextLink
            field={footerData?.helpline}
            className="text-base md:text-bodyLarge menu-link underline-offset-4"
          />
        </div>

        <p className="mt-6 text-center text-base">{footerData?.copyright}</p>
      </div>
    </footer>
  );
};
