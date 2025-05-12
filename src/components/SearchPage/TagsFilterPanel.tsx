import React from "react";
import { FilterPanel } from "./FilterPanel";
import { useCategoryFilter } from "@/providers";

export const TagsFilterPanel = () => {
  const { allTags, selectedTags, toggleTag } = useCategoryFilter();

  return (
    <FilterPanel
      label="Tags"
      items={allTags}
      selectedItems={selectedTags}
      onItemToggle={toggleTag}
    />
  );
};
