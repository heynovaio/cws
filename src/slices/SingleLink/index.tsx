import { JSX } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

/**
 * Props for `SingleLink`.
 */
export type SingleLinkProps = SliceComponentProps<Content.SingleLinkSlice>;

/**
 * Component for "SingleLink" Slices.
 */
const SingleLink = ({ slice }: SingleLinkProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {slice.variation === "singleLinkButtonIcon" ? (

          <PrismicNextLink
            field={slice.primary.link || undefined}
            className="text-white flex gap-2 pl-4"
          >
            <PrismicNextImage
              field={slice.primary.icon}
              fallbackAlt=""
              width={18}
              height={18}
            />
            {slice.primary.link.text}
          </PrismicNextLink>
      ) : (
          // TODO: Style default button icon
          <PrismicNextLink
            field={slice.primary.link || undefined}
            className="text-white"
          >
            {slice.primary.link.text}
          </PrismicNextLink>

      )}
    </section>
  );
};

export default SingleLink;
