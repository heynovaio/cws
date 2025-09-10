import { PrismicNextLink as _PrismicNextLink } from "@prismicio/next";
import { isFilled } from "@prismicio/client";
import type React from "react";
import type { UrlObject } from "url";

type BaseProps = React.ComponentProps<typeof _PrismicNextLink>;
type FieldProp = BaseProps["field"];
type DocumentProp = BaseProps["document"];

function getUrlIfWebOrMedia(field: FieldProp): string | undefined {
  if (!field || !isFilled.link(field)) return;
  if (field.link_type === "Web" && "url" in field)  return field.url;
  if (field.link_type === "Media" && "url" in field) return field.url;
  return;
}

export function toFilesMask(href?: string): string | undefined {
  if (!href) return;
  try {
    const u = new URL(href);
    if (!u.hostname.endsWith(".cdn.prismic.io")) return;
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return;
    const key = parts.slice(1).join("/");
    return `/files/${key}${u.search}`;
  } catch {
    return;
  }
}

function maskHref<T extends string | UrlObject>(href: T): T {
  if (typeof href === "string") {
    const masked = toFilesMask(href);
    return (masked ?? href) as T;
  }
  return href;
}

type Common = Omit<BaseProps, "href" | "field" | "document">;
type PropsWithHref = Common & { href: string | UrlObject; field?: never; document?: never };
type PropsWithField = Common & { field: FieldProp; href?: never; document?: never };
type PropsWithDocument = Common & { document: DocumentProp; href?: never; field?: never };

export type MaskedPrismicNextLinkProps =
  | PropsWithHref
  | PropsWithField
  | PropsWithDocument;

function hasField(p: MaskedPrismicNextLinkProps): p is PropsWithField {
  return "field" in p;
}
function hasHref(p: MaskedPrismicNextLinkProps): p is PropsWithHref {
  return "href" in p;
}
function hasDocument(p: MaskedPrismicNextLinkProps): p is PropsWithDocument {
  return "document" in p;
}

export function PrismicNextLink(props: MaskedPrismicNextLinkProps) {
  const rel = props.rel ?? (props.target === "_blank" ? "noopener noreferrer" : undefined);

  if (hasField(props)) {
    const { field, ...rest } = props;
    const raw = getUrlIfWebOrMedia(field);
    const masked = toFilesMask(raw);
    if (masked) {
      return <_PrismicNextLink {...(rest as Common)} href={masked} rel={rel} />;
    }
    return <_PrismicNextLink {...props} rel={rel} />;
  }

  if (hasHref(props)) {
    const { href, ...rest } = props;
    const finalHref = maskHref(href);
    return <_PrismicNextLink {...(rest as Common)} href={finalHref} rel={rel} />;
  }

  if (hasDocument(props)) {
    return <_PrismicNextLink {...props} rel={rel} />;
  }

  return null;
}
