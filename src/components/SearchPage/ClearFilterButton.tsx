import React from "react";
import { Button } from "../Buttons";
import { defaultCategoryFilter, useCategoryFilter } from "@/providers";

export const ClearFilterButton = () => {
  const { clearAllFilters, searchTerm, activeFilter, selectedTags } =
    useCategoryFilter();

  const anyFiltersActive =
    searchTerm ||
    activeFilter !== defaultCategoryFilter ||
    selectedTags.length > 0;

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
