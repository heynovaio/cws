"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { CarouselButton } from "../Buttons";
import Carousel from "react-multi-carousel";
import { LongCard } from "../Cards";
import { SliceComponentProps } from "@prismicio/react";
import { Content } from "@prismicio/client";
import { responsive } from "@/slices/TabbedCarousel/responsive";
import { Container } from "../Layout";
import { motion } from "motion/react";

export type MultiCardPerTabProps = {
  slice: SliceComponentProps<Content.TabbedCarouselSlice>["slice"];
};

export const MultiCardPerTab = ({ slice }: MultiCardPerTabProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const carouselRef = useRef<Carousel>(null);

  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [indicatorPosition, setIndicatorPosition] = useState({
    left: 0,
    width: 0,
  });

  type TabItem = (typeof slice.primary.tab)[number];

  // Group tabs by label with "Other" last
  const groupedTabs = useMemo(() => {
    return slice.primary.tab.reduce<Record<string, TabItem[]>>((acc, item) => {
      const label = item.tab_label || "Other";
      if (!acc[label]) acc[label] = [];
      acc[label].push(item);
      return acc;
    }, {});
  }, [slice.primary.tab]);

  const tabLabels = useMemo(() => {
    return Object.keys(groupedTabs).sort((a, b) =>
      a === "Other" ? 1 : b === "Other" ? -1 : 0
    );
  }, [groupedTabs]);

  const currentItems = groupedTabs[tabLabels[activeTab]] || [];
  const totalSlides = currentItems.length;
  const [currentSlide, setCurrentSlide] = useState(1);

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

  useEffect(() => {
    const currentTab = tabRefs.current[activeTab];
    if (currentTab && currentTab.offsetParent) {
      setIndicatorPosition({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
      });
    }
  }, [activeTab, tabLabels]);

  return (
    <TabGroup onChange={handleTabChange}>
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 mt-8">
          <div className="w-10"></div>
          <TabList className="relative rounded-3xl md:rounded-full bg-white flex flex-wrap md:flex-nowrap gap-2 p-1 shadow justify-center mx-auto w-fit max-w-full overflow-x-auto">
            <motion.div
              className="absolute top-1 bottom-1 bg-neon-violet rounded-full z-0"
              animate={{
                left: indicatorPosition.left,
                width: indicatorPosition.width,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            {tabLabels.map((item, index) => (
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
                    {item || "Label"}
                  </div>
                )}
              </Tab>
            ))}
          </TabList>

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
                containerClass={` ${
                  groupedTabs[label].length === 1 ? "!overflow-visible" : ""
                }`}
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
