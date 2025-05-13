"use client";
import React, { useEffect } from "react";
import { SearchBar } from "./SearchBar";
import { SearchFilterButtons } from "./SearchFilterButtons";
import { SearchGrid } from "./SearchGrid";
import { useCategoryFilter } from "@/providers";
import GetAllResources from "@/utils/getAllResources";
import GetAllPrograms from "@/utils/useGetAllPrograms";
import { TagsFilterPanel } from "./TagsFilterPanel";
import { ClearFilterButton } from "./ClearFilterButton";
import { ResourcesCategoriesFilterPanel } from "./ResourcesCategoriesFilterPanel";
import GetAllResourceCategories from "@/utils/useGetAllResourceCategories";
import { SearchPanelContainer } from "./SearchPanelContainer";
import { ProgramsCategoriesFilterPanel } from "./ProgramsCategoriesFilterPanel";
import GetAllProgramCategories from "@/utils/useGetAllProgramCategories";
import { ProgramsFormatFilterPanel } from "./ProgramsFormatFilterPanel";
import { ProgramsCredentialsFilterPanel } from "./ProgramsCredentialsFilterPanel";

interface SearchLayoutProps {
  lang?: string;
}
export const SearchLayout = ({ lang = "en-ca" }: SearchLayoutProps) => {
  const {
    setResources,
    setPrograms,
    setResourceCategories,
    setProgramCategories,
    activeFilter,
  } = useCategoryFilter();
  const { data: resourceData } = GetAllResources(lang);
  const { data: programData } = GetAllPrograms(lang);
  const { data: resourceCategoryData } = GetAllResourceCategories(lang);
  const { data: programCategoryData } = GetAllProgramCategories(lang);
  const [isResourceContainerHidden, setIsResourceContainerHidden] =
    React.useState(false);
  const [isProgramContainerHidden, setIsProgramContainerHidden] =
    React.useState(false);

  useEffect(() => {
    if (resourceData) setResources(resourceData);
    if (programData) setPrograms(programData);
    if (resourceCategoryData) setResourceCategories(resourceCategoryData);
    if (programCategoryData) setProgramCategories(programCategoryData);
    if (activeFilter === "resource_page") {
      setIsResourceContainerHidden(false);
      setIsProgramContainerHidden(true);
    } else if (activeFilter === "program_page") {
      setIsResourceContainerHidden(true);
      setIsProgramContainerHidden(false);
    } else {
      setIsResourceContainerHidden(false);
      setIsProgramContainerHidden(false);
    }
  }, [
    resourceData,
    programData,
    setResources,
    setPrograms,
    resourceCategoryData,
    setResourceCategories,
    programCategoryData,
    setProgramCategories,
    activeFilter,
  ]);

  return (
    <section
      data-test-id="search-layout"
      className="flex m-0 border border-neon-violet"
    >
      {/* Containers */}
      <aside className="hidden md:flex md:flex-col m-0 gap-12 py-7 px-5 border-neon-violet border-r w-1/4 bg-[#7913E033]">
        <SearchPanelContainer panel={<TagsFilterPanel />} />
        <SearchPanelContainer
          label="Resource Filters"
          panel={<ResourcesCategoriesFilterPanel />}
          topPanel={true}
          isHidden={isResourceContainerHidden}
        />
        <SearchPanelContainer
          label="Program Filters"
          panel={
            <div className="flex flex-col gap-5">
              <ProgramsCategoriesFilterPanel />
              <ProgramsFormatFilterPanel />
              <ProgramsCredentialsFilterPanel />
            </div>
          }
          topPanel={true}
          isHidden={isProgramContainerHidden}
        />
        <ClearFilterButton />
      </aside>
      <div className="py-7 px-6 md:w-3/4 w-full flex flex-col gap-14">
        {/* Search Bar + Page Type */}
        <div className="flex justify-center items-center md:justify-between md:flex-row flex-col gap-9 md:gap-2">
          {/* Filter Categories */}
          <SearchFilterButtons />
          {/* Search Bar */}
          <SearchBar />
        </div>
        {/* Grid */}
        <SearchGrid lang={"en-ca"} />
      </div>
    </section>
  );
};
