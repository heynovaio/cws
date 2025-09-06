import React from "react";
import { Button } from "../Buttons";
import { defaultCategoryFilter, useCategoryFilter } from "@/providers";
import { useRouter } from "next/navigation";

interface ClearFilterButtonProps {
  styling?: string;
  lang: string;
}

export const ClearFilterButton = ({
  styling,
  lang,
}: ClearFilterButtonProps) => {
  const {
    clearAllFilters,
    searchTerm,
    activeFilter,
    selectedTags,
    selectedResourceCategories,
    selectedProgramCategories,
    selectedFormats,
    hasCredentials,
    maxCostFilter,
    maxCost,
  } = useCategoryFilter();

  const router = useRouter();

  const anyFiltersActive =
    searchTerm ||
    activeFilter !== defaultCategoryFilter ||
    selectedTags.length > 0 ||
    selectedResourceCategories.length > 0 ||
    selectedProgramCategories.length > 0 ||
    selectedFormats.length > 0 ||
    hasCredentials ||
    maxCostFilter !== maxCost;

  const handleClearFilters = () => {
    clearAllFilters();
    const newSearchParams = new URLSearchParams();
    const path = window.location.pathname;

    router.replace(`${path}?${newSearchParams.toString()}`, { scroll: false });
  };

  if (!anyFiltersActive) return null;

  return (
    <Button
      as="button"
      type="button"
      buttonType="primary"
      label={lang === "fr-ca" ? "Effacer les filtres" : "Clear Filters"}
      onClick={handleClearFilters}
      styling={styling}
    />
  );
};
