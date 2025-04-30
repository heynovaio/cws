import React from "react";
import {
  GlobalsDocumentData,
  MenusDocumentData,
  MenusDocumentDataSlices1Slice,
} from "../../../prismicio-types";
import { Grid, ResponsiveImage } from "..";
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
    <footer className="bg-gradient-dark text-white flex flex-col justify-center items-center">
      <nav className="py-14  mx-auto max-w-screen-xl w-full flex flex-col">
        <div className="flex flex-col lg:flex-row flex-wrap justify-center lg:justify-between gap-x-8 gap-y-12 w-full">
          <div className="flex flex-col items-center md:items-start">
            <ResponsiveImage
              image={global?.site_logo}
              containerClassName="mb-6"
            />
            <div className="flex flex-col items-center md:items-start">
              <h4 className="mb-6">Follow Us</h4>
              <div className="flex flex-row md:flex-col justify-center items-center md:items-start gap-6 ">
                <span className="flex flex-row gap-4 items-center">
                  <FaInstagram size={40} />@{footerData?.instagram_handle}
                </span>
                <span className="flex flex-row gap-4 items-center">
                  <FaFacebook size={40} />/{footerData?.facebook_handle}
                </span>
              </div>
            </div>
          </div>
          <SliceZone slices={slices} components={components} />
        </div>
      </nav>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row gap-6 md:gap-10">
          <PrismicNextLink field={footerData?.policy_link} />
          <PrismicNextLink field={footerData?.helpline} />
        </div>

        <p className="mt-6">{footerData?.copyright}</p>
      </div>
    </footer>
  );
};
