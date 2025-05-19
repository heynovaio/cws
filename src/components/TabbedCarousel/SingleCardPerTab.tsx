"use client";
import { Tab, TabGroup, TabList, TabPanels } from "@headlessui/react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import React, { useState, useRef } from "react";
import { LongCard } from "../Cards";
import Carousel from "react-multi-carousel";
import { responsive } from "@/slices/TabbedCarousel/responsive";
import { Container } from "../Layout";

export type SingleCardPerTabProps = {
  slice: SliceComponentProps<Content.TabbedCarouselSlice>["slice"];
};

export const SingleCardPerTab = ({ slice }: SingleCardPerTabProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<Carousel>(null);

  // If no tabs exist, create a single "Other" tab
  const tabs =
    slice.primary.tab?.length > 0
      ? slice.primary.tab
      : [{ tab_label: "Other" } as (typeof slice.primary.tab)[number]];

  const handleTabChange = (index: number) => {
    setCurrentSlide(index);
    if (carouselRef.current) {
      carouselRef.current.goToSlide(index);
    }
  };

  return (
    <TabGroup selectedIndex={currentSlide} onChange={handleTabChange}>
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 mt-8">
        <TabList className="rounded-full bg-white flex gap-2 p-1 shadow justify-center mx-auto w-fit max-w-full overflow-x-auto">
          {tabs.map((item, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                `whitespace-nowrap rounded-full px-4 py-2 font-semibold focus ${
                  selected
                    ? "bg-neon-violet text-white"
                    : "text-midnight hover:bg-neon-violet/20"
                }`
              }
            >
              {item.tab_label || "Other"}
            </Tab>
          ))}
        </TabList>
      </div>
      <Container>
        <TabPanels className="py-12 w-full">
          <Carousel
            responsive={responsive}
            partialVisible
            keyBoardControl
            arrows={false}
            ref={carouselRef}
            beforeChange={(nextSlide) => setCurrentSlide(nextSlide)}
            additionalTransfrom={0}
            itemClass="pr-10"
            containerClass="mx-auto tabbed-carousel m-0 focus:focus focus:outline-offset-8 !overflow-visible"
          >
            {tabs.map((item, index) => (
              <div key={index} className="h-full">
                {item.card_title ? (
                  <LongCard
                    image={item?.card_image}
                    title={item?.card_title || "Untitled"}
                    content={item?.card_description}
                    buttons={item?.card_button}
                    links={item?.card_link}
                  />
                ) : (
                  <div className="text-center py-8 h-full flex items-center justify-center">
                    No content available
                  </div>
                )}
              </div>
            ))}
          </Carousel>
        </TabPanels>
      </Container>
    </TabGroup>
  );
};
