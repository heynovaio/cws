import { PrismicRichText, type PrismicRichTextProps, type JSXMapSerializer } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { FilledLinkToMediaField, FilledLinkToWebField, LinkField } from "@prismicio/client";

function getUrlIfWebOrMedia(field?: LinkField | null): string | undefined {
  if (!field) return;
  if (field.link_type === "Web") {
    return (field as FilledLinkToWebField).url;
  }
  if (field.link_type === "Media") {
    return (field as FilledLinkToMediaField).url;
  }
  return;
}

export function maskPrismicCdnUrl(href?: string): string | undefined {
  if (!href) return;
  try {
    const u = new URL(href);
    if (!u.hostname.endsWith(".cdn.prismic.io")) return href;
    const parts = u.pathname.split("/").filter(Boolean); // ["<repo>", "<KEY>", ...]
    if (parts.length < 2) return href;
    const key = parts.slice(1).join("/");
    return `/files/${key}${u.search}`;
  } catch {
    return href;
  }
}

type Props = Omit<PrismicRichTextProps, "components"> & { components?: JSXMapSerializer };

export function MaskedPrismicRichText({ components, ...rest }: Props) {
  const hyperlink: JSXMapSerializer["hyperlink"] = ({ node, children }) => {
    const field = node.data as LinkField;
    const raw = getUrlIfWebOrMedia(field);
    const masked = maskPrismicCdnUrl(raw);
    const target = (field as { target?: string }).target;
    const rel = target === "_blank" ? "noopener noreferrer" : undefined;

    const linkProps =
      masked !== undefined
        ? ({ href: masked } as const)
        : ({ field } as const);

    return (
      <PrismicNextLink {...linkProps} target={target} rel={rel}>
        {children}
      </PrismicNextLink>
    );
  };

  return <PrismicRichText {...rest} components={{ hyperlink, ...components }} />;
}
