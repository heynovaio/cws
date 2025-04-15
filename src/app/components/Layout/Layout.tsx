import React, { ReactNode } from "react";
import { Header } from "../Menus";
import {
  GlobalsDocumentData,
  MenusDocumentData,
} from "../../../../prismicio-types";

interface LayoutProps {
  locales?: unknown;
  menus: MenusDocumentData;
  global: GlobalsDocumentData;
  children: ReactNode;
}

export const Layout = ({ locales, menus, global, children }: LayoutProps) => {
  return (
    <div>
      <Header logo={global.site_logo} slices={menus.slices} locales={locales} />
      <main id="main-content" className="relative focus:outline-0" tabIndex={0}>
        {children}
      </main>
    </div>
  );
};
