import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import React from "react";
import { LongCard } from "../Cards";

export type SingleCardPerTabProps = {
  slice: SliceComponentProps<Content.TabbedCarouselSlice>["slice"];
};

export const SingleCardPerTab = ({ slice }: SingleCardPerTabProps) => {
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

  return (
    <TabGroup>
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 mt-8">
        <TabList className="rounded-full bg-white flex gap-2 p-1 shadow justify-center mx-auto w-fit">
          {tabLabels.map((label) => (
            <Tab
              key={label}
              className={({ selected }) =>
                `rounded-full px-4 py-2 font-semibold focus ${
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
      </div>
      <TabPanels className="py-12 xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm max-w-screen-xs xl:min-w-screen-xl lg:min-w-screen-lg md:min-w-screen-md sm:min-w-screen-sm min-w-screen-xs w-full">
        {tabLabels.map((label) => (
          <TabPanel
            key={label}
            className="tabbed-carousel m-0 rounded-xl focus:focus focus:outline-offset-8"
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
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};
