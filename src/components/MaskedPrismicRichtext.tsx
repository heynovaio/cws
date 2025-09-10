import { PrismicRichText, type PrismicRichTextProps, type JSXMapSerializer } from "@prismicio/react";
import { isFilled, type LinkField } from "@prismicio/client";
import { PrismicNextLink as MaskedPrismicNextLink } from "@/components/PrismicNextLink";

type Props = Omit<PrismicRichTextProps, "components"> & { components?: JSXMapSerializer };

export function MaskedPrismicRichText({ components, ...rest }: Props) {
  const hyperlink: JSXMapSerializer["hyperlink"] = ({ node, children }) => {
    const field = node.data as LinkField;

    if (!isFilled.link(field)) {
      return <>{children}</>;
    }

    const target = "target" in field ? field.target : undefined;
    const rel = target === "_blank" ? "noopener noreferrer" : undefined;

    return (
      <MaskedPrismicNextLink field={field} target={target} rel={rel}>
        {children}
      </MaskedPrismicNextLink>
    );
  };

  return <PrismicRichText {...rest} components={{ hyperlink, ...components }} />;
}
