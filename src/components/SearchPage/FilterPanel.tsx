"use client";
import { Field, Checkbox, Label } from "@headlessui/react";
import { FaCheck, FaMinus, FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useCategoryFilter } from "@/providers/CategoryFilterProvider";

export type FilterItem = string | { id: string; name: string };

interface FilterPanelProps {
  label?: string;
  items?: FilterItem[];
  selectedItems?: string[];
  onItemToggle?: (itemId: string) => void;
  className?: string;
  initialVisibleCount?: number;
  filterKey?: string;
  lang?: string;

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
  slider = false,
  sliderMax = 100,
  sliderValue = 100,
  onSliderChange,
  currencySymbol = "$",
  lang = "en-ca",
}: FilterPanelProps) => {
  const { isLoading } = useCategoryFilter();
  const [showAll, setShowAll] = useState(false);
  const [localSliderValue, setLocalSliderValue] = useState(sliderValue);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setLocalSliderValue(sliderValue);
  }, [sliderValue]);

  // Initialize state from URL parameters on mount
  useEffect(() => {
    if (initialized) return;

    if (slider) {
      // For sliders, the URL sync is handled by the parent component
      setInitialized(true);
      return;
    }

    // For non-slider filters, we rely on the selectedItems prop
    // which should already be synchronized with the URL by the parent component
    setInitialized(true);
  }, [initialized, slider]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLocalSliderValue(newValue);
    onSliderChange?.(newValue);
  };

  const handleItemToggle = (itemId: string) => {
    onItemToggle?.(itemId);
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
      {isLoading ? (
        <div className="rounded bg-light-violet/20 p-4 flex flex-col gap-6 h-56 flex-grow animate-pulse w-full"></div>
      ) : (
        <>
          {(slider || (items && items.length > 0)) && (
            <div className={className}>
              <label className="label" aria-labelledby={slider ? "label" : ""}>
                {label}
              </label>
              {slider && (
                <div className="mb-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {localSliderValue === 0
                        ? lang === "fr-ca"
                          ? "Gratuit"
                          : "Free"
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
                    <span>{lang == "fr-ca" ? "Gratuit" : "Free"}</span>
                    <span>
                      {currencySymbol}
                      {sliderMax.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              {!slider && (
                <div>
                  <div className="space-y-3">
                    {visibleItems.map((item) => {
                      const value = getItemValue(item);
                      const name = getItemName(item);
                      const isSelected = selectedItems.includes(value);

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
      )}
    </>
  );
};
