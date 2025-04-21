"use client";
import { ContentBox, Section, Container } from "@/components";
import { LongCard } from "@/components/Cards/LongCard";
import { components } from "@/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { useState, useRef } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export type TabbedCarouselProps =
  SliceComponentProps<Content.TabbedCarouselSlice>;

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
  },
  mobile: {
    breakpoint: { max: 639, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const TabbedCarousel = ({ slice }: TabbedCarouselProps) => {
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

  // Carousel button to view next slide
  const handleSlideChange = (direction: "prev" | "next") => {
    if (!carouselRef.current) return;

    if (direction === "prev" && currentSlide > 1) {
      carouselRef.current.previous(1);
    } else if (direction === "next" && currentSlide < totalSlides) {
      carouselRef.current.next(1);
    }
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

        <TabGroup onChange={handleTabChange}>
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 mt-8">
            <div className="w-10"></div>
            <TabList className="rounded-full bg-white flex gap-2 p-1 shadow justify-center mx-auto w-fit">
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
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white text-midnight">
              <button
                onClick={() => handleSlideChange("prev")}
                disabled={currentSlide === 1}
                aria-label="Previous slide"
                className={`${currentSlide === 1 ? "opacity-50" : "hover:text-neon-violet"}`}
              >
                <HiOutlineArrowLeft className="h-5 w-5" />
              </button>
              <span>
                {currentSlide}/{totalSlides}
              </span>
              <button
                onClick={() => handleSlideChange("next")}
                disabled={currentSlide === totalSlides}
                aria-label="Next slide"
                className={`${currentSlide === totalSlides ? "opacity-50" : "hover:text-neon-violet"}`}
              >
                <HiOutlineArrowLeft className="h-5 w-5 rotate-180" />
              </button>
            </div>
          </div>

          <TabPanels className="py-12 xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm max-w-screen-xs xl:min-w-screen-xl lg:min-w-screen-lg md:min-w-screen-md sm:min-w-screen-sm min-w-screen-xs  w-full">
            {tabLabels.map((label) => (
              <TabPanel key={label} className="tabbed-carousel">
                <Carousel
                  responsive={responsive}
                  partialVisible
                  keyBoardControl
                  arrows={false}
                  itemClass="react-multi-carousel-item"
                  containerClass={`lg:w-[1144px] ${groupedTabs[label].length === 1 ? "!overflow-visible" : ""}`}
                  ref={
                    activeTab === tabLabels.indexOf(label) ? carouselRef : null
                  }
                  beforeChange={(nextSlide) => setCurrentSlide(nextSlide + 1)}
                >
                  {groupedTabs[label].map((item, index) => (
                    <div key={index} className="px-2">
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
