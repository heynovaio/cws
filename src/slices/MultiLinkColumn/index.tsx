import { ResponsiveImage } from "@/components";
import { Content } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `MultiLinkColumn`.
 */
export type MultiLinkColumnProps =
  SliceComponentProps<Content.MultiLinkColumnSlice>;

/**
 * Component for "MultiLinkColumn" Slices.
 */
const MultiLinkColumn = ({ slice }: MultiLinkColumnProps): JSX.Element => {
  const footerComponentStyling = {
    heading2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="footer-header">{children}</h2>
    ),
    heading3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="footer-header">{children}</h3>
    ),
    heading4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="text-h4">{children}</h4>
    ),
    heading5: ({ children }: { children: React.ReactNode }) => (
      <h5 className="footer-header">{children}</h5>
    ),
    heading6: ({ children }: { children: React.ReactNode }) => (
      <h6 className="footer-header">{children}</h6>
    ),
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex flex-col gap-5"
    >
      <span className="pl-2">
        <PrismicRichText
          field={slice.primary.title}
          components={footerComponentStyling}
        />
      </span>

      {/* Default Variation */}
      {slice.variation === "default" && (
        <div className="flex flex-col gap-5">
          {slice.primary.link.map((item, index) => (
            <PrismicNextLink
              field={item}
              key={index}
              className="pl-2 link-dark-bg focus"
            />
          ))}
        </div>
      )}

      {/* Logo Variation */}
      {/* {slice.variation === "withIcon" && (
        <div className="flex flex-col gap-5 justify-center items-center md:justify-start md:items-start">
          {slice.primary.Icon.map((item, index) => {
            return (
              <PrismicNextLink
                field={item.link}
                key={index}
                className="link-dark-bg focus p-2"
              >
                {item.image && Object.keys(item.image).length !== 0 ? (
                  <ResponsiveImage
                    imageHeightClassName="max-w-[288px] pr-2 rounded-xl"
                    containerClassName=""
                    image={item.image}
                  />
                ) : (
                  <span>{item.link.text}</span>
                )}
              </PrismicNextLink>
            );
          })}
        </div>
      )} */}
    </section>
  );
};

export default MultiLinkColumn;
