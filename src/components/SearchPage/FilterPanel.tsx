"use client";
import { Field, Checkbox, Label } from "@headlessui/react";
import { FaCheck, FaMinus, FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type FilterItem = string | { id: string; name: string };

interface FilterPanelProps {
  label?: string;
  items?: FilterItem[];
  selectedItems?: string[];
  onItemToggle?: (itemId: string) => void;
  className?: string;
  initialVisibleCount?: number;
  filterKey?: string;

  // Slider specific props
  slider?: boolean;
  sliderMax?: number;
  sliderValue?: number;
  onSliderChange?: (value: number) => void;
  currencySymbol?: string;
}

export const FilterPanel = ({
  label = "Filters",
  items = [],
  selectedItems = [],
  onItemToggle,
  className = "rounded bg-light-violet text-midnight p-4 flex flex-col gap-6",
  initialVisibleCount = 4,
  filterKey = "FilterPanel",
  slider = false,
  sliderMax = 100,
  sliderValue = 100,
  onSliderChange,
  currencySymbol = "$",
}: FilterPanelProps) => {
  const [showAll, setShowAll] = useState(false);
  const [localSliderValue, setLocalSliderValue] = useState(sliderValue);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    setLocalSliderValue(sliderValue);
  }, [sliderValue]);

  // Get initial values from URL on mount
  useEffect(() => {
    if (slider) return;

    const params = new URLSearchParams(searchParams?.toString());
    const urlValues = params.get(filterKey)?.split(",").filter(Boolean) || [];

    // Only update if there's a mismatch between URL and current selection
    if (
      urlValues.length > 0 &&
      JSON.stringify(urlValues) !== JSON.stringify(selectedItems)
    ) {
      urlValues.forEach((value) => {
        if (
          items.some((item) => getItemValue(item) === value) &&
          !selectedItems?.includes(value)
        ) {
          onItemToggle?.(value);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, searchParams]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLocalSliderValue(newValue);
    onSliderChange?.(newValue);
  };

  const handleItemToggle = (itemId: string) => {
    // First update the local state
    onItemToggle?.(itemId);

    // Then update the URL
    const newParams = new URLSearchParams(searchParams?.toString());
    const currentValues =
      newParams.get(filterKey)?.split(",").filter(Boolean) || [];
    const valueExists = currentValues.includes(itemId);

    let newValues: string[];
    if (valueExists) {
      newValues = currentValues.filter((v) => v !== itemId);
    } else {
      newValues = [...currentValues, itemId];
    }

    if (newValues.length > 0) {
      newParams.set(filterKey, newValues.join(","));
    } else {
      newParams.delete(filterKey);
    }

    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  const getItemValue = (item: FilterItem): string => {
    return typeof item === "string" ? item : item.id;
  };

  const getItemName = (item: FilterItem): string => {
    return typeof item === "string" ? item : item.name;
  };

  const visibleItems = showAll ? items : items.slice(0, initialVisibleCount);
  const remainingCount = Math.max(0, items.length - initialVisibleCount);

  return (
    <>
      {(slider || (items && items.length > 0)) && (
        <div className={className}>
          <label className="label">{label}</label>
          {/* Slider Section */}
          {slider && (
            <div className="mb-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {localSliderValue === 0
                    ? "Free"
                    : `${currencySymbol}${localSliderValue.toLocaleString()}`}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={sliderMax}
                value={localSliderValue}
                onChange={handleSliderChange}
                style={
                  {
                    "--range-progress": `${((localSliderValue - 0) / (sliderMax - 0)) * 100}%`,
                  } as React.CSSProperties
                }
                className="w-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-midnight"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Free</span>
                <span>
                  {currencySymbol}
                  {sliderMax.toLocaleString()}
                </span>
              </div>
            </div>
          )}
          {/* Filter Items Section */}
          {!slider && (
            <div>
              <div className="space-y-3">
                {visibleItems.map((item) => {
                  const value = getItemValue(item);
                  const name = getItemName(item);
                  const isSelected = selectedItems?.includes(value);

                  return (
                    <Field key={value} className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleItemToggle(value)}
                        className={`group flex size-6 items-center justify-center rounded-md border focus
                  ${isSelected ? "border-midnight bg-midnight" : "border-midnight"}`}
                      >
                        <FaCheck
                          className={`size-3 ${isSelected ? "text-aqua" : "opacity-0"}`}
                        />
                      </Checkbox>
                      <Label className="cursor-pointer text-base font-normal">
                        {name}
                      </Label>
                    </Field>
                  );
                })}
              </div>

              {remainingCount > 0 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center gap-2 text-sm text-midnight btn-link mt-4 focus"
                >
                  {showAll ? (
                    <>
                      <FaMinus className="size-3" />
                      Show less
                    </>
                  ) : (
                    <>
                      <FaPlus className="size-3" />
                      Show more ({remainingCount})
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
