import React from "react";
import { Button } from "../Buttons";
import { defaultCategoryFilter, useCategoryFilter } from "@/providers";

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
    costRange,
    maxCost,
  } = useCategoryFilter();

  const anyFiltersActive =
    searchTerm ||
    activeFilter !== defaultCategoryFilter ||
    selectedTags.length > 0 ||
    selectedResourceCategories.length > 0 ||
    selectedProgramCategories.length > 0 ||
    selectedFormats.length > 0 ||
    hasCredentials ||
    costRange[0] !== 0 ||
    costRange[1] !== maxCost;

  if (!anyFiltersActive) return null;

  return (
    <Button
      as="button"
      type="button"
      buttonType="primary"
      label="Clear Filters"
      onClick={clearAllFilters}
    />
  );
};