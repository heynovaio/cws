"use client";
import React, { useEffect } from "react";
import { SearchBar } from "./SearchBar";
import { SearchFilterButtons } from "./SearchFilterButtons";
import { SearchGrid } from "./SearchGrid";
import { defaultCategoryFilter, useCategoryFilter } from "@/providers";
import GetAllResources from "@/utils/getAllResources";
import GetAllPrograms from "@/utils/useGetAllPrograms";
import GetAllResourceCategories from "@/utils/useGetAllResourceCategories";
import GetAllProgramCategories from "@/utils/useGetAllProgramCategories";
import { SideFilter } from "./SideFilter";
import { MobileSideFilter } from "./MobileSideFilter";
import { useRouter, useSearchParams } from "next/navigation";
import { ModuleFilter } from "@/constants";

interface SearchLayoutProps {
  lang?: string;
}
export const SearchLayout = ({ lang = "en-ca" }: SearchLayoutProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    setResources,
    setPrograms,
    setResourceCategories,
    setProgramCategories,
    activeFilter,
    selectedTags,
    toggleTag,
    setActiveFilter,
  } = useCategoryFilter();
  const { data: resourceData } = GetAllResources(lang);
  const { data: programData } = GetAllPrograms(lang);
  const { data: resourceCategoryData } = GetAllResourceCategories(lang);
  const { data: programCategoryData } = GetAllProgramCategories(lang);

  useEffect(() => {
    if (resourceData) setResources(resourceData);
    if (programData) setPrograms(programData);
    if (resourceCategoryData) setResourceCategories(resourceCategoryData);
    if (programCategoryData) setProgramCategories(programCategoryData);
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

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const urlTags = params.get("tags")?.split(",") || [];
    const filter =
      (params.get("filter") as ModuleFilter) || defaultCategoryFilter;

    // Sync active filter
    setActiveFilter(filter);

    // Sync tags
    urlTags.forEach((tag) => {
      if (!selectedTags.includes(tag)) {
        toggleTag(tag);
      }
    });
  }, [searchParams, selectedTags, setActiveFilter, toggleTag]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","));
    } else {
      params.delete("tags");
    }

    if (activeFilter !== defaultCategoryFilter) {
      params.set("filter", activeFilter);
    } else {
      params.delete("filter");
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selectedTags, activeFilter, searchParams, router]);

  return (
    <section
      data-test-id="search-layout"
      className="flex m-0 md:border border-neon-violet"
    >
      {/* Containers */}
      <div className="hidden md:flex w-1/4">
        <aside className="flex flex-col m-0 py-7 px-5 border-neon-violet border-r bg-[#7913E033]">
          <SideFilter />
        </aside>
      </div>
      <div className="py-7 md:pl-0 px-6 md:w-3/4 w-full flex flex-col gap-14">
        {/* Search Bar + Page Type */}
        <div className="flex justify-center items-center md:justify-between md:flex-row flex-col gap-9 md:gap-2">
          {/* Filter Categories */}
          <SearchFilterButtons />
          {/* Search Bar */}
          <SearchBar />
          {/* Mobile side filter */}
          <MobileSideFilter />
        </div>
        {/* Grid */}
        <SearchGrid lang={"en-ca"} />
      </div>
    </section>
  );
};
