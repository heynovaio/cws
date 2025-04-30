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
      {/* Added pl-2 for padding for links to look visually better inside ContactSection. Also in SliceZone */}
      {/* Contact Section */}
      {/* <ContactSection
            contact_us={global?.contact_us}
            phone={null} //global?.phone if needed
            address={global?.address}
            email={global?.email}
          /> */}

      <nav className="py-14 px-5 mx-auto max-w-screen-xl w-full flex flex-col gap-20">
        <Grid
          maxColumns={numberOfSlices}
          gridClassName="!gap-12 justify-center text-center md:justify-start md:text-left"
        >
          <div>
            <ResponsiveImage />
            <h4>Follow Us</h4>
            <FaFacebook size={25} />
            <FaInstagram size={25} />
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
