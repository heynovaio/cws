"use client";
import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { Tab } from "@headlessui/react";
import { Container } from "@/components";

/**
 * Props for `TabbedContentStickyImage`.
 */
export type TabbedContentStickyImageProps =
  SliceComponentProps<Content.TabbedContentStickyImageSlice>;

/**
 * Component for "TabbedContentStickyImage" Slices.
 */
const TabbedContentStickyImage: FC<TabbedContentStickyImageProps> = ({
  slice,
}) => {
  const sections = slice.primary.section || [];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container>
        <Tab.Group>
          <Tab.List className="flex space-x-2 mb-4">
            {sections.map((tab, idx) => (
              <Tab
                key={idx}
                className={({ selected }) =>
                  `px-4 py-2 rounded-[12px] focus:outline-none  ${
                    selected
                      ? "bg-[#6D00FF] text-white font-bold"
                      : "border border-white text-white hover:bg-white/20"
                  }`
                }
              >
                <div className="text-[1.25rem] font-[600]">{tab.tab_title}</div>
                {tab.tab_description && (
                  <div className="text-[1rem] font-normal">
                    {tab.tab_description}
                  </div>
                )}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-4">
            {sections.map((tab, idx) => (
              <Tab.Panel
                key={idx}
                className="p-6 rounded-[20px] border border-[#6D00FF]"
                style={{
                  background: "rgba(121, 19, 224, 0.2)",
                  boxShadow: "0 0 30px 0 rgba(99, 15, 249, 0.8)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {tab.section_title && (
                  <h3 className="text-[5.5rem] font-[600] mb-2">
                    {tab.section_title}
                  </h3>
                )}

                {tab.section_quote && (
                  <blockquote className="italic mb-2">
                    <PrismicRichText field={tab.section_quote} />
                  </blockquote>
                )}

                {tab.section_text && (
                  <PrismicRichText field={tab.section_text} />
                )}

                {tab.section_image?.url && (
                  <div className="my-4">
                    {/* <PrismicNextImage field={tab.section_image} /> */}
                  </div>
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </Container>
    </section>
  );
};

export default TabbedContentStickyImage;
