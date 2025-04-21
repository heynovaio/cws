"use client";
import { ContentBox, Section, Container } from "@/components";
import { LongCard } from "@/components/Cards/LongCard";
import { components } from "@/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

/**
 * Props for `TabbedCarousel`.
 */
export type TabbedCarouselProps =
  SliceComponentProps<Content.TabbedCarouselSlice>;

/**
 * Component for "TabbedCarousel" Slices.
 */
const TabbedCarousel = ({ slice }: TabbedCarouselProps): JSX.Element => {
  const groupedTabs: Record<string, Array<(typeof slice.primary.tab)[0]>> = {};

  slice.primary.tab.forEach((item) => {
    const label = item.tab_label || "Other";
    if (!groupedTabs[label]) {
      groupedTabs[label] = [];
    }
    groupedTabs[label].push(item);
  });

  // Get sorted tab labels (Other always last)
  const tabLabels = Object.keys(groupedTabs).sort((a, b) =>
    a === "Other" ? 1 : b === "Other" ? -1 : 0
  );

  // Define carousel settings
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
      partialVisibilityGutter: 100,
    },
    tablet: {
      breakpoint: { max: 1023, min: 640 },
      items: 1,
      slidesToSlide: 1,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: { max: 639, min: 0 },
      items: 1,
      slidesToSlide: 1,
      partialVisibilityGutter: 20,
    },
  };

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      styling="bg-midnight"
    >
      <Container containerClassName="flex flex-col items-center">
        <ContentBox
          title={slice.primary.title}
          content={
            <PrismicRichText
              field={slice.primary.body}
              components={components}
            />
          }
          width="standard"
          containerClassName="text-center gap-4"
        />
        {/* Tabs List, which is from unique values */}
        <TabGroup>
          <TabList className="rounded-full bg-white flex gap-2 p-1 mt-8 shadow justify-center mx-auto w-fit">
            {tabLabels.map((label) => (
              <Tab
                key={label}
                className={({ selected }) =>
                  `rounded-full px-4 py-2 font-semibold ${
                    selected
                      ? "bg-neon-violet text-white"
                      : "text-midnight hover:bg-neon-violet/20"
                  }`
                }
              >
                {label}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="py-12 xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm max-w-screen-xs w-full">
            {tabLabels.map((label) => (
              <TabPanel key={label}>
                <Carousel
                  responsive={responsive}
                  partialVisible
                  keyBoardControl
                  itemClass="react-multi-carousel-item"
                >
                  {groupedTabs[label].map((item, index) => (
                    <div key={index}>
                      <LongCard
                        image={item?.card_image}
                        title={item?.card_title || "Untitled"}
                        content={item?.card_description}
                        buttons={item?.card_button}
                        links={item?.card_link}
                      />
                    </div>
                  ))}
                </Carousel>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </Container>
    </Section>
  );
};

export default TabbedCarousel;
