"use client";
import { PrismicNextLink } from "@prismicio/next";
import { Fragment } from "react";

type BreadcrumbLink = {
  href?: string;
  label: string;
};
export interface BreadcrumbProps {
  links?: BreadcrumbLink[];
}

export const Breadcrumb = ({ links }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className="print:hidden">
      <a href="/" className="underlined-link-dark">
        Home
      </a>
      <span> {">"} </span>
      {links?.map((link, index) => (
        <Fragment key={index}>
          {link.href ? (
            <PrismicNextLink href={link.href} className="underlined-link-dark">
              {link.label}
            </PrismicNextLink>
          ) : (
            <span className="font-bold">{link.label}</span>
          )}
          {index < links.length - 1 && <span> / </span>}
        </Fragment>
      ))}
    </nav>
  );
};
