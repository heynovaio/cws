import React, { ReactNode } from "react";
import { Header } from "../Menus";
import {
  GlobalsDocumentData,
  MenusDocumentData,
} from "../../../../prismicio-types";
import { PrismicDocument } from "@prismicio/client";

interface LayoutProps {
  locales?: (PrismicDocument<Record<string, string>, string, string> & {
    lang_name: string;
  })[];
  menus: MenusDocumentData;
  global: GlobalsDocumentData;
  children: ReactNode;
}

export const Layout = ({ locales, menus, global, children }: LayoutProps) => {
  return (
    <div>
      <Header logo={global.site_logo} slices={menus.slices} locales={locales} />
      {children}
    </div>
  );
};
