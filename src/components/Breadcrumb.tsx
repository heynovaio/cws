"use client";
import { PrismicNextLink } from "@prismicio/next";
import { Fragment } from "react";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";

export type BreadcrumbLink = {
  href?: string;
  label: string;
};
export interface BreadcrumbProps {
  links?: BreadcrumbLink[];
  color: "black" | "white";
  lang?: string;
}

export const Breadcrumb = ({
  links,
  color = "black",
  lang,
}: BreadcrumbProps) => {
  const textColor = color == "black" ? "text-midnight" : "text-white";
  return (
    <nav
      aria-label="Breadcrumb"
      className="print:hidden flex items-center flex-wrap gap-1 text-md mt-7"
    >
      <Link href="/" className={`${textColor} underlined-link-dark text-md`}>
        {lang === "fr-ca" ? "Accueil" : "Home"}
      </Link>
      <span>
        <FaChevronRight size={15} color={color} />
      </span>
      {links?.map((link, index) => (
        <Fragment key={index}>
          {link.href ? (
            <PrismicNextLink
              href={link.href}
              className={`${textColor} underlined-link-dark font-normal text-md`}
            >
              {link.label}
            </PrismicNextLink>
          ) : (
            <span className={`${textColor} font-normal text-md`}>
              {link.label}
            </span>
          )}
          {index < links.length - 1 && (
            <span>
              <FaChevronRight size={15} color={color} />
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
};
