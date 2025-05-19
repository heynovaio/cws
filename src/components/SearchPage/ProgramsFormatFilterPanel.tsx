import { useCategoryFilter } from "@/providers";
import { FilterPanel } from "./FilterPanel";
import { PROGRAM_FORMATS, ProgramFormat } from "@/constants";

export const ProgramsFormatFilterPanel = () => {
  const { selectedFormats, toggleFormat } = useCategoryFilter();

  return (
    <FilterPanel
      label="Format"
      filterKey="program_formats"
      items={Object.values(PROGRAM_FORMATS).map((format) => ({
        id: format,
        name: format,
      }))}
      selectedItems={selectedFormats}
      onItemToggle={(itemId) => toggleFormat(itemId as ProgramFormat)}
    />
  );
};
