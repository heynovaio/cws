import { PrismicRichText, type PrismicRichTextProps, type JSXMapSerializer } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

/** Rewrite https://<repo>.cdn.prismic.io/<repo>/<KEY> -> /files/<KEY>[?query] */
function maskPrismicCdnUrl(href?: string | null): string | undefined {
  if (!href) return undefined;
  try {
    const u = new URL(href);
    if (!u.hostname.endsWith(".cdn.prismic.io")) return href;
    const parts = u.pathname.split("/").filter(Boolean); // ["<repo>", "<KEY>", ...]
    if (parts.length < 2) return href;
    const key = parts.slice(1).join("/"); // support subdirs
    return `/files/${key}${u.search}`;
  } catch {
    return href;
  }
}

type Props = Omit<PrismicRichTextProps, "components"> & { components?: JSXMapSerializer };

export function MaskedPrismicRichText({ components, ...rest }: Props) {
  const hyperlink: JSXMapSerializer["hyperlink"] = ({ node, children }) => {
    const data: any = node.data;
    const maskedHref = maskPrismicCdnUrl(data?.url);
    return maskedHref ? (
      <PrismicNextLink
        field={data}
        href={maskedHref}
        rel={data?.target === "_blank" ? "noopener noreferrer" : undefined}
      >
        {children}
      </PrismicNextLink>
    ) : (
      <PrismicNextLink
        field={data}
        rel={data?.target === "_blank" ? "noopener noreferrer" : undefined}
      >
        {children}
      </PrismicNextLink>
    );
  };

  return <PrismicRichText {...rest} components={{ hyperlink, ...components }} />;
}
