import { useCategoryFilter } from "@/providers";
import { FilterPanel } from "./FilterPanel";

export const ProgramsCategoriesFilterPanel = () => {
  const {
    selectedProgramCategories,
    toggleProgramCategory,
    programCategories,
  } = useCategoryFilter();

  return (
    <FilterPanel
      label="Program Categories"
      items={programCategories.map((cat) => ({
        id: cat.id,
        name: cat?.data?.name?.toString() || "Unknown",
      }))}
      selectedItems={selectedProgramCategories}
      onItemToggle={toggleProgramCategory}
    />
  );
};
