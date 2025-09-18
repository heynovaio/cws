"use client";

import React, { ReactNode } from "react";
import {
  GlobalsDocumentData,
  MenusDocumentData,
  PartnersDocumentData,
} from "../../../prismicio-types";
import { Header } from "../Menu/Header";
import Partners from "../Menu/Partners";
import NewsletterSignupBanner from "../NewsletterSignup/NewsletterSignup";
import { Container } from "./Container";
import { Footer } from "../Menu/Footer";
import { TopBar } from "./TopBar";
import { PrismicDocument } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import LanguageSwitcher from "./LanguageSwitcher";

interface LayoutProps {
  locales: PrismicDocument[];
  lang?: string;
  menus: MenusDocumentData;
  global: GlobalsDocumentData;
  children: ReactNode;
  partners?: PartnersDocumentData | null;
  include_newsletter_sign_up_banner: boolean;
  isCampaignPage?: boolean;
}

export const Layout = ({
  locales,
  lang = "en-ca",
  menus,
  global,
  partners,
  children,
  include_newsletter_sign_up_banner,
  isCampaignPage = false,
}: LayoutProps) => {
  return (
    <div>
      <a href="#main-content" className="skip-to-content-link">
        Skip to Content
      </a>
      <div className={isCampaignPage ? "z-50" : "sticky top-0 z-50 "}>
        {!isCampaignPage ? (
          <TopBar locales={locales} global={global} text={menus.banner_text} />
        ) : (
          <div className="flex w-full justify-end flex-row">
            <LanguageSwitcher
              locales={locales}
              global={global}
              classname=" mt-2"
            />
          </div>
        )}
        {!isCampaignPage ? (
          <Header
            logo={global.site_logo}
            slices={menus.slices}
            locales={locales}
          />
        ) : (
          <PrismicNextLink
            className="flex justify-center w-full pt-4 xs:mt-10 md:mt-0"
            aria-label="homepage link"
            prefetch={true}
            href="/"
          >
            <PrismicNextImage
              field={global.site_logo}
              fallbackAlt=""
              className="max-w-[200px] md:max-w-[400px] w-full h-auto"
            />
          </PrismicNextLink>
        )}
      </div>
      <main id="main-content" className="relative focus:outline-0" tabIndex={0}>
        {children}
      </main>
      <Container>
        {include_newsletter_sign_up_banner && (
          <NewsletterSignupBanner lang={lang} />
        )}
        {partners && (
          <Partners
            title={partners.title}
            body={partners.body}
            buttons={partners.button}
            logos={partners.logos}
            ctaText={partners.cta_text}
          />
        )}
      </Container>

      <Footer
        global={global}
        slices={menus?.slices1}
        footerData={menus}
        lang={lang}
      />
    </div>
  );
};
