import { useCategoryFilter } from "@/providers";
import { FilterPanel } from "./FilterPanel";

export const ProgramsCostFilterPanel = () => {
  const { maxCost, costRange, setCostRange } =
    useCategoryFilter();

  // Convert the cost range to a single value (using the max value from the range)
  const currentMaxCost = costRange[1];

  // Handle slider change - set the new range from 0 to the selected value
  const handleSliderChange = (value: number) => {
    setCostRange([0, value]);
  };

  return (
    <FilterPanel
      label="Price Range"
      slider
      sliderMin={0}
      sliderMax={maxCost}
      sliderValue={currentMaxCost}
      onSliderChange={handleSliderChange}
    />
  );
};
