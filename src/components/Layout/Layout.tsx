"use client";

import React, { ReactNode } from "react";
import {
  GlobalsDocumentData,
  MenusDocumentData,
  PartnersDocumentData,
} from "../../../prismicio-types";
import { Header } from "../Menu/Header";
import Partners from "../Menu/Partners";
import { Container } from "./Container";
import { CustomPagination } from "../CustomPagination";

interface LayoutProps {
  locales?: unknown;
  menus: MenusDocumentData;
  global: GlobalsDocumentData;
  children: ReactNode;
  partners?: PartnersDocumentData;
}

// TEMP TEST DATA
const mockData = Array.from({ length: 70 }, (_, i) => ({
  id: i + 1,
  name: `Test ${i + 1}`,
}));

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

      {/* TEMP JUST NEEDED SOMEWHERE TO SHOW IT  */}
      <Container>
        <CustomPagination itemsPerPage={9}>
          {mockData.map((item) => (
            <div
              key={item.id}
              className="bg-white text-midnight p-4 rounded shadow text-center"
            >
              {item.name}
            </div>
          ))}
        </CustomPagination>
      </Container>

      <Container>
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
    </div>
  );
};
