import { useCategoryFilter } from "@/providers";
import { FilterPanel } from "./FilterPanel";

export const ProgramsCostFilterPanel = () => {
  const { maxCost, setMaxCostFilter, maxCostFilter } = useCategoryFilter();

  return (
    <FilterPanel
      slider
      label="Max Cost"
      filterKey="max_cost"
      sliderMax={maxCost}
      sliderValue={maxCostFilter}
      onSliderChange={setMaxCostFilter}
      currencySymbol="$"
    />
  );
};
