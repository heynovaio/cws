import { useCategoryFilter } from "@/providers";
import { FilterPanel } from "./FilterPanel";
import { useEffect } from "react";

export const ProgramsCostFilterPanel = ({ lang }: { lang: string }) => {
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
      label={lang === "fr-ca" ? "Coût maximum" : "Max Cost"}
      filterKey="max_cost"
      sliderMax={maxCost}
      sliderValue={maxCostFilter ?? maxCost}
      onSliderChange={setMaxCostFilter}
      currencySymbol="$"
      lang={lang}
    />
  );
};
