import { Field, Checkbox, Label } from "@headlessui/react";
import { FaCheck, FaMinus, FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";

type FilterItem = string | { id: string; name: string };

interface FilterPanelProps {
  label?: string;
  items?: FilterItem[];
  selectedItems?: string[];
  onItemToggle?: (itemId: string) => void;
  className?: string;
  initialVisibleCount?: number;

  // Slider specific props
  slider?: boolean;
  sliderMin?: number;
  sliderMax?: number;
  sliderValue?: number;
  onSliderChange?: (value: number) => void;
}

export const FilterPanel = ({
  label = "Filters",
  items = [],
  selectedItems = [],
  onItemToggle,
  className = "rounded bg-light-violet text-midnight p-4 flex flex-col gap-6",
  initialVisibleCount = 4,

  slider = false,
  sliderMin = 0,
  sliderMax = 100,
  sliderValue = 100,
  onSliderChange,
}: FilterPanelProps) => {
  const [showAll, setShowAll] = useState(false);

  const [localSliderValue, setLocalSliderValue] = useState(sliderValue);

  useEffect(() => {
    setLocalSliderValue(sliderValue);
  }, [sliderValue]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLocalSliderValue(newValue);
    onSliderChange?.(newValue);
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
    <div className={className}>
      <label className="label">{label}</label>

      {/* Slider Section */}
      {slider && (
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Free - ${localSliderValue}</span>
          </div>
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            value={localSliderValue}
            onChange={handleSliderChange}
            style={
              {
                "--range-progress": `${((localSliderValue - sliderMin) / (sliderMax - sliderMin)) * 100}%`,
              } as React.CSSProperties
            }
          />
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
                    onChange={() => onItemToggle?.(value)}
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

          {/* Show More/Less Button */}
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
  );
};
