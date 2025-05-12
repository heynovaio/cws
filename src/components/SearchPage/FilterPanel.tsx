import { Field, Checkbox, Label } from "@headlessui/react";
import { FaCheck, FaMinus, FaPlus } from "react-icons/fa";
import { useState } from "react";

type FilterItem = string | { id: string; name: string };

interface FilterPanelProps {
  label?: string;
  items?: FilterItem[];
  selectedItems?: string[];
  onItemToggle?: (itemId: string) => void;
  className?: string;
  initialVisibleCount?: number;
}

export const FilterPanel = ({
  label = "Filters",
  items = [],
  selectedItems = [],
  onItemToggle,
  className = "rounded bg-light-violet text-midnight p-4 flex flex-col gap-6",
  initialVisibleCount = 4,
}: FilterPanelProps) => {
  const [showAll, setShowAll] = useState(false);

  // Helper function to get the ID/string value for comparison
  const getItemValue = (item: FilterItem): string => {
    return typeof item === "string" ? item : item.id;
  };

  // Helper function to get the display name
  const getItemName = (item: FilterItem): string => {
    return typeof item === "string" ? item : item.name;
  };

  const visibleItems = showAll ? items : items.slice(0, initialVisibleCount);
  const remainingCount = items.length - initialVisibleCount;

  return (
    <div className={className}>
      <label className="label">{label}</label>

      <div className="flex flex-col gap-3">
        {visibleItems.map((item) => {
          const value = getItemValue(item);
          const name = getItemName(item);

          return (
            <Field key={value} className="flex items-center gap-3">
              <Checkbox
                checked={selectedItems?.includes(value)}
                onChange={() => onItemToggle?.(value)}
                className="group flex size-6 items-center justify-center border border-midnight rounded-md data-[checked]:bg-midnight focus"
              >
                <FaCheck
                  className={`size-3 ${selectedItems?.includes(value) ? "text-aqua" : "opacity-0"}`}
                />
              </Checkbox>
              <Label className="cursor-pointer text-base font-normal">
                {name}
              </Label>
            </Field>
          );
        })}

        {items.length > initialVisibleCount && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 text-sm text-midnight mt-2 hover:underline focus:outline-none btn-link"
          >
            {showAll ? (
              <>
                <FaMinus className="size-3" />
                Hide ({remainingCount})
              </>
            ) : (
              <>
                <FaPlus className="size-3" />
                View all ({remainingCount})
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
