import React from "react";
import {
  GlobalsDocumentData,
  MenusDocumentData,
} from "../../../prismicio-types";
import { ResponsiveImage } from "..";
import { FaFacebook, FaInstagram, FaMeta, FaXTwitter } from "react-icons/fa6";
import { PrismicNextLink } from "@/components/PrismicNextLink";
import { FaLinkedin } from "react-icons/fa";
import Image from "next/image";

interface FooterProps {
  global?: GlobalsDocumentData;
  footerData?: MenusDocumentData;
  lang: string;
}

export const CampaignFooter = ({ global, footerData, lang }: FooterProps) => {
  return (
    <footer className="bg-neon-violet/50 text-white flex flex-col justify-center items-center">
      <nav className="py-10 px-5 mx-auto max-w-screen-xl w-full flex flex-col gap-10">
        {/* IMAGE */}
        <div className="w-full flex justify-center">
          <ResponsiveImage
            image={global?.site_logo}
            containerClassName="mb-8 max-w-[180px] md:max-w-[220px]"
          />
        </div>

        {/*SOCIALS */}
        <div className="flex flex-col items-center">
          <h4 className="mb-6">
            {lang === "fr-ca" ? "Suivez-nous" : "Follow Us"}
          </h4>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            {footerData?.instagram.text !== "" &&
              footerData?.instagram.link_type !== "Any" && (
                <span className="flex flex-row gap-4 items-center">
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

        {/* Government of Canada Logo */}
        <div className="my-4 w-full">
          <div className="hidden md:flex justify-center">
            {lang === "fr-ca" ? (
              <Image
                src="/GovernmentOfCanadaFR.png"
                alt="Gouvernement du Canada"
                width={500}
                height={100}
                className="mx-auto w-auto h-auto max-w-full md:max-w-[400px]"
                sizes="(max-width: 1040px) 520px, 580px"
              />
            ) : (
              <Image
                src="/GovernmentOfCanadaEN.png"
                alt="Government of Canada"
                width={500}
                height={100}
                className="mx-auto w-auto h-auto max-w-full md:max-w-[400px]"
              />
            )}
          </div>
          <div className="md:hidden flex justify-center">
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

        {/* POLICIES */}
        <div className="flex flex-col justify-center items-center footer-links">
          <div className="flex flex-row gap-4">
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
      </nav>
    </footer>
  );
};
