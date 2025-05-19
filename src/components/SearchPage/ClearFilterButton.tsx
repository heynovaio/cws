import React from "react";
import { Button } from "../Buttons";
import { defaultCategoryFilter, useCategoryFilter } from "@/providers";
import { useRouter, useSearchParams } from "next/navigation";

export const ClearFilterButton = () => {
  const {
    clearAllFilters,
    searchTerm,
    activeFilter,
    selectedTags,
    selectedResourceCategories,
    selectedProgramCategories,
    selectedFormats,
    hasCredentials,
    maxCostFilter,
    maxCost,
  } = useCategoryFilter();

  const router = useRouter();
  const searchParams = useSearchParams();

  const anyFiltersActive =
    searchTerm ||
    activeFilter !== defaultCategoryFilter ||
    selectedTags.length > 0 ||
    selectedResourceCategories.length > 0 ||
    selectedProgramCategories.length > 0 ||
    selectedFormats.length > 0 ||
    hasCredentials ||
    maxCostFilter !== maxCost;

  const handleClearFilters = () => {
    clearAllFilters();

    const newSearchParams = new URLSearchParams(searchParams?.toString());

    newSearchParams.delete("searchTerm");
    newSearchParams.delete("filter");
    newSearchParams.delete("tags");
    newSearchParams.delete("resource_categories");
    newSearchParams.delete("program_categories");
    newSearchParams.delete("formats");
    newSearchParams.delete("credentials");
    newSearchParams.delete("max_cost");

    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  if (!anyFiltersActive) return null;

  return (
    <Button
      as="button"
      type="button"
      buttonType="primary"
      label="Clear Filters"
      onClick={handleClearFilters}
    />
  );
};
