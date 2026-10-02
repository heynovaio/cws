import React, { useEffect } from "react";
import { FilterPanel, FilterItem } from "./FilterPanel";
interface TagFilterPanelProps {
  selectedItems?: string[];
  availableTags?: FilterItem[];
  toggleTag: (tag: string) => void;
  onLoad?: () => void;
}

export const TagsFilterPanel = ({
  availableTags,
  selectedItems,
  toggleTag,
  onLoad,
}: TagFilterPanelProps) => {
  useEffect(() => {
    onLoad?.();
  }, [onLoad]);
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
