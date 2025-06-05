"use client";
import { Tab, TabGroup, TabList, TabPanels } from "@headlessui/react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import React, { useState, useRef, useEffect } from "react";
import { LongCard } from "../Cards";
import Carousel from "react-multi-carousel";
import { responsive } from "@/slices/TabbedCarousel/responsive";
import { Container } from "../Layout";
import { motion } from "motion/react";

export type SingleCardPerTabProps = {
  slice: SliceComponentProps<Content.TabbedCarouselSlice>["slice"];
};

export const SingleCardPerTab = ({ slice }: SingleCardPerTabProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<Carousel>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [indicatorPosition, setIndicatorPosition] = useState({
    left: 0,
    width: 0,
    top: 0,
    height: 0,
  });

  const tabs = slice.primary.tab || [];

  const handleTabChange = (index: number) => {
    setCurrentSlide(index);
    if (carouselRef.current) {
      carouselRef.current.goToSlide(index);
    }
  };

  useEffect(() => {
    const currentTab = tabRefs.current[currentSlide];
    if (currentTab && currentTab.offsetParent) {
      setIndicatorPosition({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
        top: currentTab.offsetTop,
        height: currentTab.offsetHeight,
      });
    }
  }, [currentSlide, tabs]);

  return (
    <TabGroup selectedIndex={currentSlide} onChange={handleTabChange}>
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 mt-8">
          <TabList className="relative rounded-3xl md:rounded-full bg-white flex flex-wrap md:flex-nowrap gap-2 p-1 shadow justify-center mx-auto w-fit max-w-full overflow-x-auto">
            <motion.div
              className="absolute bg-neon-violet rounded-full z-0"
              animate={{
                left: indicatorPosition.left,
                top: indicatorPosition.top,
                width: indicatorPosition.width,
                height: indicatorPosition.height,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            {tabs.map((item, index) => (
              <Tab key={index}>
                {({ selected }) => (
                  <div
                    ref={(reffedTab) => {
                      tabRefs.current[index] = reffedTab;
                    }}
                    className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2 font-semibold cursor-pointer duration-300 ${
                      selected ? "text-white" : "text-midnight"
                    }`}
                  >
                    {item.tab_label || "Label"}
                  </div>
                )}
              </Tab>
            ))}
          </TabList>
        </div>
      </Container>

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
            containerClass="mx-auto tabbed-carousel m-0 focus:focus focus:outline-offset-8 !overflow-visible"
          >
            {tabs.map((item, index) => (
              <div key={index} className="pr-3 md:pr-7 h-full">
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
