import React from "react";
import {
  GlobalsDocumentData,
  MenusDocumentDataSlices1Slice,
} from "../../../prismicio-types";
import { Grid, ResponsiveImage } from "..";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { FaFacebook, FaInstagram } from "react-icons/fa6";

interface FooterProps {
  global?: GlobalsDocumentData;
  slices: MenusDocumentDataSlices1Slice[] | undefined;
}

export const Footer = ({ global, slices }: FooterProps) => {
  const numberOfSlices = (slices?.length ?? 0) + 1;

  return (
    <footer className="bg-dark-purple-background text-white flex flex-col justify-center items-center">
      <nav className="py-14 px-5 mx-auto max-w-screen-xl w-full flex flex-col gap-20">
        <Grid
          maxColumns={numberOfSlices}
          gridClassName="!gap-12 justify-center text-center md:justify-start md:text-left"
        >
          <div className="flex flex-col items-center ">
            <ResponsiveImage
              image={global?.site_logo}
              containerClassName="mb-6"
            />
            <div>
              <h4 className="mb-6">Follow Us</h4>
              <div className="flex flex-row justify-center items-center gap-6">
                <FaInstagram size={40} />
                <FaFacebook size={40} />
              </div>
            </div>
          </div>
          <SliceZone slices={slices} components={components} />
        </Grid>
      </nav>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row gap-8">
          <p>Privacy Policy</p>
          <p>Helpline</p>
        </div>

        <p>copyright</p>
      </div>
    </footer>
  );
};
