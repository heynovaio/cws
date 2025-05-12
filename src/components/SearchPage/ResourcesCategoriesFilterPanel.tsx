import { useCategoryFilter } from "@/providers";
import { FilterPanel } from "./FilterPanel";

export const ResourcesCategoriesFilterPanel = () => {
  const {
    selectedResourceCategories,
    toggleResourceCategory,
    resourceCategories,
  } = useCategoryFilter();

  return (
    <FilterPanel
      label="Resource Categories"
      items={resourceCategories.map((cat) => ({
        id: cat.id,
        name: cat?.data?.name?.toString() || "Unknown",
      }))}
      selectedItems={selectedResourceCategories}
      onItemToggle={toggleResourceCategory}
    />
  );
};
