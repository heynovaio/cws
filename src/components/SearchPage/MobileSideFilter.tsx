import { Button, CloseButton, Dialog, DialogPanel } from "@headlessui/react";
import React, { useState } from "react";
import { VscSettings } from "react-icons/vsc";
import { SideFilter } from "./SideFilter";
import { FaXmark } from "react-icons/fa6";
import { useCategoryFilter } from "@/providers";
import { useRouter, useSearchParams } from "next/navigation";
import { ProgramFormat } from "@/constants";

// Applied Filter Tag Component
type AppliedFilterTagProps = {
  label: string;
  onRemove: () => void;
  type?: string;
};

const AppliedFilterTag: React.FC<AppliedFilterTagProps> = ({
  label,
  onRemove,
}) => {
  return (
    <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-400/30 rounded-full px-3 py-1.5 text-sm text-purple-200">
      <span className="truncate max-w-32">{label}</span>
      <button
        onClick={onRemove}
        className="flex-shrink-0 hover:bg-purple-500/30 rounded-full p-0.5 transition-colors duration-200"
        aria-label={`Remove ${label} filter`}
      >
        <FaXmark className="h-3 w-3" />
      </button>
    </div>
  );
};

// Applied Filters Section Component
const AppliedFiltersSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    selectedTags,
    toggleTag,
    selectedResourceCategories,
    toggleResourceCategory,
    resourceCategories,
    selectedProgramCategories,
    toggleProgramCategory,
    programCategories,
    selectedFormats,
    toggleFormat,
    hasCredentials,
    toggleCredentials,
    maxCostFilter,
    maxCost,
    resetCostFilter,
  } = useCategoryFilter();

  const updateFilterParams = React.useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedResourceCategories.length > 0) {
      params.set("resourceCategories", selectedResourceCategories.join(","));
    } else {
      params.delete("resourceCategories");
    }

    if (selectedProgramCategories.length > 0) {
      params.set("programCategories", selectedProgramCategories.join(","));
    } else {
      params.delete("programCategories");
    }

    if (selectedFormats.length > 0) {
      params.set("formats", selectedFormats.join(","));
    } else {
      params.delete("formats");
    }

    if (hasCredentials) {
      params.set("hasCredentials", "true");
    } else {
      params.delete("hasCredentials");
    }

    if (maxCostFilter < maxCost && maxCost > 0) {
      params.set("maxCost", maxCostFilter.toString());
    } else {
      params.delete("maxCost");
    }

    const currentUrl = searchParams.toString();
    const newUrl = params.toString();
    if (currentUrl !== newUrl) {
      router.replace(`?${newUrl}`, { scroll: false });
    }
  }, [
    searchParams,
    selectedResourceCategories,
    selectedProgramCategories,
    selectedFormats,
    hasCredentials,
    maxCostFilter,
    maxCost,
    router,
  ]);

  const handleRemoveTag = (tag: string) => {
    toggleTag(tag);
  };

  const handleRemoveResourceCategory = (categoryId: string) => {
    toggleResourceCategory(categoryId);
  };

  const handleRemoveProgramCategory = (categoryId: string) => {
    toggleProgramCategory(categoryId);
  };

  const handleRemoveFormat = (format: ProgramFormat) => {
    toggleFormat(format);
  };

  const handleRemoveCredentials = () => {
    toggleCredentials();
  };

  const handleResetCostFilter = () => {
    resetCostFilter();
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilterParams();
    }, 15);

    return () => clearTimeout(timeoutId);
  }, [
    selectedResourceCategories,
    selectedProgramCategories,
    selectedFormats,
    hasCredentials,
    maxCostFilter,
    maxCost,
    updateFilterParams,
  ]);

  // Collect all applied filters with URL-synced handlers
  const appliedFilters = [
    // Tags
    ...selectedTags.map((tag) => ({
      type: "tag",
      label: tag,
      removeHandler: () => handleRemoveTag(tag),
    })),

    // Resource Categories
    ...selectedResourceCategories.map((categoryId) => {
      const category = resourceCategories?.find((c) => c.id === categoryId);
      return {
        type: "resource-category",
        label: category?.data?.name || "Other",
        removeHandler: () => handleRemoveResourceCategory(categoryId),
      };
    }),

    // Program Categories
    ...selectedProgramCategories.map((categoryId) => {
      const category = programCategories?.find((c) => c.id === categoryId);
      return {
        type: "program-category",
        label: category?.data?.name || "Other",
        removeHandler: () => handleRemoveProgramCategory(categoryId),
      };
    }),

    ...selectedFormats.map((format) => ({
      type: "format",
      label: format,
      removeHandler: () => handleRemoveFormat(format as ProgramFormat),
    })),

    ...(hasCredentials
      ? [
          {
            type: "credentials",
            label: "Has Credentials",
            removeHandler: handleRemoveCredentials,
          },
        ]
      : []),

    ...(maxCostFilter < maxCost
      ? [
          {
            type: "cost",
            label: `Under ${maxCostFilter.toLocaleString()}`,
            removeHandler: handleResetCostFilter,
          },
        ]
      : []),
  ];

  if (appliedFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-300 mb-3">
        Applied Filters
      </h3>
      <div className="flex flex-wrap gap-2">
        {appliedFilters.map((filter, index) => (
          <AppliedFilterTag
            key={`${filter.type}-${filter.label}-${index}`}
            label={filter.label}
            onRemove={filter.removeHandler}
            type={filter.type}
          />
        ))}
      </div>
    </div>
  );
};

export const MobileSideFilter = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterClick = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex md:hidden w-full flex-col gap-3">
      {/* Filter Button */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handleFilterClick}
          className="self-start btn btn-outline border focus flex items-center gap-2 justify-center relative"
        >
          Filters
          <VscSettings className="h-5 w-5" />
        </Button>
      </div>

      {/* Applied Filters Display - Only on mobile */}
      <AppliedFiltersSection />

      {/* Filter Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed bg-dark-purple-background pb-6 inset-0 flex w-full overflow-auto">
          <DialogPanel
            transition
            className="w-full rounded-xl px-5 py-8 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <CloseButton
              className="z-20 fixed top-4 right-4 p-5 btn-primary rounded-full duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
              onClick={() => setIsOpen(false)}
            >
              <FaXmark className="h-5 w-5" />
            </CloseButton>

            {/* Applied Filters in Dialog */}
            <div className="mb-6">
              <AppliedFiltersSection />
            </div>

            <SideFilter />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};
