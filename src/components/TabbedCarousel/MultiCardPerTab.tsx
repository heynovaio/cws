"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import React, { useCallback, useRef, useState } from "react";
import { CarouselButton } from "../Buttons";
import Carousel from "react-multi-carousel";
import { LongCard } from "../Cards";
import { SliceComponentProps } from "@prismicio/react";
import { Content } from "@prismicio/client";
import { responsive } from "@/slices/TabbedCarousel/responsive";
import { Container } from "../Layout";

export type MultiCardPerTabProps = {
  slice: SliceComponentProps<Content.TabbedCarouselSlice>["slice"];
};

export const MultiCardPerTab = ({ slice }: MultiCardPerTabProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const carouselRef = useRef<Carousel>(null);

  type TabItem = (typeof slice.primary.tab)[number];

  // Group tabs by label with "Other" last
  const groupedTabs = slice.primary.tab.reduce<Record<string, TabItem[]>>(
    (acc, item) => {
      const label = item.tab_label || "Other";
      if (!acc[label]) acc[label] = [];
      acc[label].push(item);
      return acc;
    },
    {}
  );

  const tabLabels = Object.keys(groupedTabs).sort((a, b) =>
    a === "Other" ? 1 : b === "Other" ? -1 : 0
  );

  const currentItems = groupedTabs[tabLabels[activeTab]] || [];
  const totalSlides = currentItems.length;
  const [currentSlide, setCurrentSlide] = useState(1);

  // Changes active tab
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setCurrentSlide(1);
  };

  const handleSlideChange = useCallback(
    (direction: "prev" | "next") => {
      if (!carouselRef.current) return;

      if (direction === "prev" && currentSlide > 1) {
        carouselRef.current.previous(1);
      } else if (direction === "next" && currentSlide < totalSlides) {
        carouselRef.current.next(1);
      }
    },
    [currentSlide, totalSlides]
  );
  return (
    <TabGroup onChange={handleTabChange}>
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 mt-8">
          <div className="w-10"></div>
          <TabList className="rounded md:rounded-full bg-white md:flex-nowrap flex-wrap flex-col md:flex-row flex gap-2 p-1 shadow justify-center mx-auto w-full">
            {tabLabels.map((label) => (
              <Tab
                key={label}
                className={({ selected }) =>
                  `flex w-full rounded-full px-4 py-2 font-semibold focus ${
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
          {/* Carousel Buttons */}
          {currentItems.length > 1 && (
            <CarouselButton
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              onSlideChange={handleSlideChange}
            />
          )}
        </div>

        <TabPanels className="py-12 w-full">
          {tabLabels.map((label) => (
            <TabPanel
              key={label}
              className="tabbed-carousel m-0 focus:focus focus:outline-offset-4 !overflow-visible"
            >
              <Carousel
                responsive={responsive}
                partialVisible
                keyBoardControl
                arrows={false}
                itemClass="react-multi-carousel-item"
                className="focus:focus"
                containerClass={` ${groupedTabs[label].length === 1 ? "!overflow-visible" : ""}`}
                ref={
                  activeTab === tabLabels.indexOf(label) ? carouselRef : null
                }
                beforeChange={(nextSlide) => setCurrentSlide(nextSlide + 1)}
              >
                {groupedTabs[label].map((item, index) => (
                  <div key={index} className="pr-3 md:pr-7 h-full">
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
      </Container>
    </TabGroup>
  );
};
