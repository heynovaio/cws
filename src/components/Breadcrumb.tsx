"use client";
import { PrismicNextLink } from "@prismicio/next";
import { Fragment } from "react";
import { FaChevronRight } from "react-icons/fa";

type BreadcrumbLink = {
  href?: string;
  label: string;
};
export interface BreadcrumbProps {
  links?: BreadcrumbLink[];
  color: "black" | "white";
}

export const Breadcrumb = ({ links }: BreadcrumbProps) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="print:hidden flex items-center flex-wrap gap-1 text-md"
    >
      <a href="/" className="underlined-link-dark text-md">
        Home
      </a>
      <span>
        <FaChevronRight size={15} />
      </span>
      {links?.map((link, index) => (
        <Fragment key={index}>
          {link.href ? (
            <PrismicNextLink
              href={link.href}
              className="underlined-link-dark font-normal text-md"
            >
              {link.label}
            </PrismicNextLink>
          ) : (
            <span className="font-normal text-md">{link.label}</span>
          )}
          {index < links.length - 1 && (
            <span>
              <FaChevronRight size={15} />
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
};
