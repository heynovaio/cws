"use client";
import React, { useEffect } from "react";
import { SearchBar } from "./SearchBar";
import { SearchFilterButtons } from "./SearchFilterButtons";
import { SearchGrid } from "./SearchGrid";
import { useCategoryFilter } from "@/providers";
import GetAllResources from "@/utils/getAllResources";
import GetAllPrograms from "@/utils/useGetAllPrograms";

export const SearchLayout = () => {
  const { setResources, setPrograms } = useCategoryFilter();
  const { data: resourceData } = GetAllResources("en-ca");
  const { data: programData } = GetAllPrograms("en-ca");

  useEffect(() => {
    if (resourceData) setResources(resourceData);
    if (programData) setPrograms(programData);
  }, [resourceData, programData, setResources, setPrograms]);

  return (
    <section
      data-test-id="search-layout"
      className="flex m-0 border border-neon-violet"
    >
      {/* Containers */}
      <aside className="hidden md:block m-0 py-7 px-5 border-neon-violet border-r w-1/4 bg-[#7913E033]">
        This will be the filter panels
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
