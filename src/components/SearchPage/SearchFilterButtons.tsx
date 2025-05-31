"use client";
import React, { useEffect } from "react";
import {
  defaultModuleFilters,
  module_filters_list,
  ModuleFilter,
} from "@/constants";
import { useCategoryFilter } from "@/providers";
import { useSearchParams, useRouter } from "next/navigation";

export const SearchFilterButtons = () => {
  const {
    filterCounts,
    activeFilter,
    setActiveFilter,
    isLoading,
    clearAllFilters,
    searchTerm,
    selectedTags,
    selectedResourceCategories,
    selectedProgramCategories,
    selectedFormats,
    hasCredentials,
    maxCostFilter,
    maxCost,
  } = useCategoryFilter();

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlFilter = searchParams?.get("filter") as ModuleFilter | null;
    if (urlFilter && module_filters_list.includes(urlFilter)) {
      setActiveFilter?.(urlFilter);
    } else if (!urlFilter) {
      setActiveFilter?.("all");
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("filter", "all");
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [searchParams, activeFilter, setActiveFilter, router]);

  const handleFilterClick = (filterKey: ModuleFilter) => {
    // If clicking "All" and there are active filters, clear them
    if (filterKey === "all" && hasActiveFilters()) {
      clearAllFilters();
      const newSearchParams = new URLSearchParams();
      newSearchParams.set("filter", "all");
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    } else {
      // Normal filter behavior
      setActiveFilter?.(filterKey);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("filter", filterKey);
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  };

  const hasActiveFilters = () => {
    return (
      searchTerm ||
      activeFilter !== "all" ||
      selectedTags.length > 0 ||
      selectedResourceCategories.length > 0 ||
      selectedProgramCategories.length > 0 ||
      selectedFormats.length > 0 ||
      hasCredentials ||
      maxCostFilter !== maxCost
    );
  };

  return (
    <div className="flex md:flex-nowrap flex-wrap items-center justify-center gap-2 px-0 md:px-2 py-2 module-filter-buttons">
      {module_filters_list.map((filterKey: ModuleFilter) => (
        <button
          key={filterKey}
          onClick={() => handleFilterClick(filterKey)}
          className={`
            ${activeFilter === filterKey ? "bg-white !text-midnight shadow font-bold" : ""} btn btn-outline focus border`}
        >
          <span className="text-base font-normal hover:text-current flex gap-2 items-center">
            {defaultModuleFilters[filterKey]}{" "}
            {isLoading ? (
              <div className="w-5 h-5 rounded-full bg-white/40 animate-pulse" />
            ) : (
              `(${filterCounts[filterKey]})`
            )}
          </span>
        </button>
      ))}
    </div>
  );
};
