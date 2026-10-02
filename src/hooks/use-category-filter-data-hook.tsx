import { useCategoryFilter } from "@/providers/CategoryFilterProvider";

export const useCategoryFilterData = () => {
  const { resources, programs } = useCategoryFilter();

  return {
    resources,
    programs,
  };
};
