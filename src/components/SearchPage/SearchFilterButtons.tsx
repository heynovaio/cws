"use client";
import React from "react";
import { defaultModuleFilters, module_filters_list, ModuleFilter } from "@/constants";
import { useCategoryFilter } from "@/providers";

export const SearchFilterButtons = () => {
  const { filterCounts, activeFilter, setActiveFilter } = useCategoryFilter();

  return (
    <div className="flex md:flex-nowrap flex-wrap items-center justify-center gap-2 px-0 md:px-2 py-2 module-filter-buttons">
      {module_filters_list.map((filterKey: ModuleFilter) => (
        <button
          key={filterKey}
          onClick={() => setActiveFilter?.(filterKey)}
          className={`
            ${activeFilter === filterKey ? "bg-white !text-midnight shadow font-bold" : ""} btn btn-outline focus border`}
        >
          <span className="text-base font-normal hover:text-current">
            {defaultModuleFilters[filterKey]} ({filterCounts[filterKey]})
          </span>
        </button>
      ))}
    </div>
  );
};
