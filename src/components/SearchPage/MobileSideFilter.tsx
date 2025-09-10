import { Button, CloseButton, Dialog, DialogPanel } from "@headlessui/react";
import React, { useState } from "react";
import { VscSettings } from "react-icons/vsc";
import { SideFilter } from "./SideFilter";
import { FaXmark } from "react-icons/fa6";
import { useCategoryFilter } from "@/providers";
import { getFormatLabel, ProgramFormat } from "@/constants";
import { SupportedLanguage } from "@/constants";

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
const AppliedFiltersSection = ({
  lang,
}: {
  lang: string | SupportedLanguage;
}) => {
  const {
    activeFilter,
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

  const handleRemoveTag = (tag: string) => {
    toggleTag(tag);
  };

  const handleRemoveResourceCategory = (categoryId: string) => {
    if (activeFilter !== "program_page") {
      toggleResourceCategory(categoryId);
    }
  };

  const handleRemoveProgramCategory = (categoryId: string) => {
    if (activeFilter !== "resource_page") {
      toggleProgramCategory(categoryId);
    }
  };

  const handleRemoveFormat = (format: ProgramFormat) => {
    if (activeFilter !== "resource_page") {
      toggleFormat(format);
    }
  };

  const handleRemoveCredentials = () => {
    if (activeFilter !== "resource_page") {
      toggleCredentials();
    }
  };

  const handleResetCostFilter = () => {
    if (activeFilter !== "resource_page") {
      resetCostFilter();
    }
  };

  // Filter out incompatible applied filters based on active filter
  const appliedFilters = [
    // Tags (always applicable)
    ...selectedTags.map((tag) => ({
      type: "tag",
      label: tag,
      removeHandler: () => handleRemoveTag(tag),
    })),

    ...(activeFilter !== "program_page"
      ? selectedResourceCategories.map((categoryId) => {
          const category = resourceCategories?.find((c) => c.id === categoryId);
          return {
            type: "resource-category",
            label: category?.data?.name || "Other",
            removeHandler: () => handleRemoveResourceCategory(categoryId),
          };
        })
      : []),

    ...(activeFilter !== "resource_page"
      ? selectedProgramCategories.map((categoryId) => {
          const category = programCategories?.find((c) => c.id === categoryId);
          return {
            type: "program-category",
            label: category?.data?.name || "Other",
            removeHandler: () => handleRemoveProgramCategory(categoryId),
          };
        })
      : []),

    ...(activeFilter !== "resource_page"
      ? selectedFormats.map((format) => ({
          type: "format",
          label: getFormatLabel(format, lang as "en-ca" | "fr-ca"),
          removeHandler: () => handleRemoveFormat(format as ProgramFormat),
        }))
      : []),

    ...(hasCredentials && activeFilter !== "resource_page"
      ? [
          {
            type: "credentials",
            label: lang === "fr-ca" ? "Points PD (NCCP)" : "PD NCCP Points",
            removeHandler: handleRemoveCredentials,
          },
        ]
      : []),

    ...(maxCostFilter < maxCost && activeFilter !== "resource_page"
      ? [
          {
            type: "cost",
            label:
              lang === "fr-ca"
                ? `Moins de $${maxCostFilter.toLocaleString()}`
                : `Under $${maxCostFilter.toLocaleString()}`,
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
        {lang === "fr-ca" ? "Filtres appliqués" : "Applied Filters"}
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

type MobileSideFilterProps = {
  lang: string;
};

export const MobileSideFilter: React.FC<MobileSideFilterProps> = ({ lang }) => {
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
          {lang === "fr-ca" ? "Filtres" : "Filters"}
          <VscSettings className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-6">
        <AppliedFiltersSection lang={lang} />
      </div>
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
            <div className="my-6">
              <AppliedFiltersSection lang={lang} />
            </div>

            <SideFilter lang={lang} />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};
