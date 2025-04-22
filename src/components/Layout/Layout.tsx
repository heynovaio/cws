import React, { ReactNode } from "react";
import {
  GlobalsDocumentData,
  MenusDocumentData,
  PartnersDocumentData,
} from "../../../prismicio-types";
import { Header } from "../Menu/Header";
import Partners from "../Menu/Partners";
import { Container } from "./Container";

interface LayoutProps {
  locales?: unknown;
  menus: MenusDocumentData;
  global: GlobalsDocumentData;
  children: ReactNode;
  partners: PartnersDocumentData;
}

export const Layout = ({
  locales,
  menus,
  global,
  partners,
  children,
}: LayoutProps) => {
  return (
    <div>
      <Header logo={global.site_logo} slices={menus.slices} locales={locales} />
      <main id="main-content" className="relative focus:outline-0" tabIndex={0}>
        {children}
      </main>
      <Container>
        <Partners
          title={partners.title}
          body={partners.body}
          buttons={partners.button}
          logos={partners.logos}
          ctaText={partners.cta_text}
        />
      </Container>
    </div>
  );
};
