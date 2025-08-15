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

interface LayoutProps {
  locales: PrismicDocument[];
  menus: MenusDocumentData;
  global: GlobalsDocumentData;
  children: ReactNode;
  partners?: PartnersDocumentData | null;
  include_newsletter_sign_up_banner: boolean;
  useMobileNav?: boolean;
}

export const Layout = ({
  locales,
  menus,
  global,
  partners,
  children,
  include_newsletter_sign_up_banner,
  useMobileNav = false,
}: LayoutProps) => {
  return (
    <div>
      <a href="#main-content" className="skip-to-content-link">
        Skip to Content
      </a>
      <div className="sticky top-0 z-50 ">
        <TopBar locales={locales} global={global} text={menus.banner_text} />
        <Header
          logo={global.site_logo}
          slices={menus.slices}
          locales={locales}
          useMobileNav={useMobileNav}
        />
      </div>
      <main id="main-content" className="relative focus:outline-0" tabIndex={0}>
        {children}
      </main>
      <Container>
        {include_newsletter_sign_up_banner && (
          <NewsletterSignupBanner lang={"en-ca"} />
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

      <Footer global={global} slices={menus?.slices1} footerData={menus} />
    </div>
  );
};
