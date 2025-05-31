import React from "react";
import { FilterPanel, FilterItem } from "./FilterPanel";
interface TagFilterPanelProps {
  selectedItems?: string[];
  availableTags?: FilterItem[];
  toggleTag: (tag: string) => void;
}

export const TagsFilterPanel = ({availableTags, selectedItems, toggleTag}: TagFilterPanelProps) => {

  return (
    <FilterPanel
      label="Tags"
      filterKey="tags"
      items={availableTags}
      selectedItems={selectedItems}
      onItemToggle={toggleTag}
    />
  );
};
