import React from "react";
import { FilterPanel } from "./FilterPanel";
import { useCategoryFilter } from "@/providers";

export const TagsFilterPanel = () => {
  const { availableTags, selectedTags, toggleTag } = useCategoryFilter();

  return (
    <FilterPanel
      label="Tags"
      items={availableTags}
      selectedItems={selectedTags}
      onItemToggle={toggleTag}
    />
  );
};
