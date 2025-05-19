import { useCategoryFilter } from "@/providers";
import { FilterPanel } from "./FilterPanel";
import { useEffect } from "react";

export const ProgramsCostFilterPanel = () => {
  const { maxCost, setMaxCostFilter, maxCostFilter } = useCategoryFilter();

  // Initialize with max cost on first render
  useEffect(() => {
    if (maxCostFilter === undefined && maxCost !== undefined) {
      setMaxCostFilter(maxCost);
    }
  }, [maxCost, maxCostFilter, setMaxCostFilter]);

  return (
    <FilterPanel
      slider
      label="Max Cost"
      filterKey="max_cost"
      sliderMax={maxCost}
      sliderValue={maxCostFilter ?? maxCost} // Fallback to maxCost if undefined
      onSliderChange={setMaxCostFilter}
      currencySymbol="$"
    />
  );
};
