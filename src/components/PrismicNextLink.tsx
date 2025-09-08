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

type Common = Omit<BaseProps, "href" | "field" | "document">;
type PropsWithHref = Common & { href: string | UrlObject; field?: never; document?: never };
type PropsWithField = Common & { field: FieldProp; href?: never; document?: never };
type PropsWithDocument = Common & { document: DocumentProp; href?: never; field?: never };
export type MaskedPrismicNextLinkProps = PropsWithHref | PropsWithField | PropsWithDocument;

export function PrismicNextLink(props: MaskedPrismicNextLinkProps) {
  const normalizedRel =
    props.rel ?? (props.target === "_blank" ? "noopener noreferrer" : undefined);

  if ("field" in props) {
    const { field, ...rest } = props;
    const raw = getUrlIfWebOrMedia(field);
    const masked = toFilesMask(raw);

    if (masked) {
      const { ...withoutField } = rest as Omit<BaseProps, "field">;
      return <_PrismicNextLink {...(withoutField as Common)} href={masked} rel={normalizedRel} />;
    }

    return <_PrismicNextLink {...props} rel={normalizedRel} />;
  }

  if ("href" in props) {
    const { href, field, document, ...rest } = props;
    const finalHref = typeof href === "string" ? toFilesMask(href) ?? href : href;
    if (finalHref === undefined) return null;
    return <_PrismicNextLink {...rest} href={finalHref} rel={normalizedRel} />;
  }

  return <_PrismicNextLink {...props} rel={normalizedRel} />;
}
