import { PrismicNextLink as _PrismicNextLink } from "@prismicio/next";
import type {
  LinkField,
  FilledLinkToWebField,
  FilledLinkToMediaField,
  PrismicDocument,
} from "@prismicio/types";
import type React from "react";

function getUrlIfWebOrMedia(field?: LinkField | null): string | undefined {
  if (!field) return;
  if (field.link_type === "Web") return (field as FilledLinkToWebField).url;
  if (field.link_type === "Media") return (field as FilledLinkToMediaField).url;
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

type BaseProps = React.ComponentProps<typeof _PrismicNextLink>;

export function PrismicNextLink(props: BaseProps) {
  const { href: hrefProp, field, document, rel, target, ...rest } = props as BaseProps & {
    field?: LinkField;
    document?: PrismicDocument;
  };

  let maskedFromField: string | undefined;
  if (field) {
    const raw = getUrlIfWebOrMedia(field);
    const masked = toFilesMask(raw);
    if (masked && masked !== raw) maskedFromField = masked;
  }

  let maskedFromHref: string | undefined;
  if (typeof hrefProp === "string") {
    maskedFromHref = toFilesMask(hrefProp);
  }

  const finalRel = rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

  if (field && maskedFromField) {
    return <_PrismicNextLink href={maskedFromField} target={target} rel={finalRel} {...rest} />;
  }

  if (maskedFromHref) {
    return <_PrismicNextLink href={maskedFromHref} target={target} rel={finalRel} {...rest} />;
  }

  if (field)   return <_PrismicNextLink field={field} target={target} rel={finalRel} {...rest} />;
  if (document) return <_PrismicNextLink document={document} target={target} rel={finalRel} {...rest} />;
  if (hrefProp !== undefined) return <_PrismicNextLink href={hrefProp as any} target={target} rel={finalRel} {...rest} />;

  return <a target={target} rel={finalRel} {...(rest as any)}>{(rest as any)?.children}</a>;
}
