import { Content } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `SingleLink`.
 */
export type SingleLinkProps = SliceComponentProps<Content.SingleLinkSlice>;

/**
 * Component for "SingleLink" Slices.
 */
const SingleLink = ({ slice }: SingleLinkProps): JSX.Element => {
  const IconOnly = slice.primary.link.variant === "Icon Only";

  let buttonClass = "btn btn-primary";

  switch (slice.primary.link.variant) {
    case "Primary":
      buttonClass = "btn btn-primary";
      break;
    case "Secondary":
      buttonClass = "btn btn-secondary";
      break;
    case "Icon Only":
      buttonClass = "";
      break;
    default:
      buttonClass = "btn btn-primary";
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      data-test-id={slice.slice_type}
    >
      {slice.variation === "singleLinkButtonIcon" && (
        <PrismicNextLink
          field={slice.primary.link}
          className={`flex flex-row-reverse gap-2 justify-center items-center  text-md w-fit ${buttonClass}`}
        >
          {slice.primary.icon && (
            <PrismicNextImage
              field={slice.primary.icon}
              className={IconOnly ? "w-5 h-5" : "w-3 h-3"}
              alt=""
            />
          )}
          {!IconOnly && (
            <span className="whitespace-nowrap">{slice.primary.link.text}</span>
          )}
        </PrismicNextLink>
      )}

      {slice.variation === "default" && (
        <PrismicNextLink
          field={slice.primary.link}
          className="flex md:justify-center text-white no-underline menu-link text-left menu-link-mobile md:text-md menu-link"
        >
          {slice.primary.link.text}
        </PrismicNextLink>
      )}
    </section>
  );
};

export default SingleLink;
