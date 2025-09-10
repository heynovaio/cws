import { useCategoryFilter } from "@/providers";
import { FilterPanel } from "./FilterPanel";
import {
  PROGRAM_FORMATS,
  ProgramFormat,
  getFormatLabel,
  SupportedLanguage,
} from "@/constants";

interface ProgramsFormatFilterPanelProps {
  lang: SupportedLanguage | string;
}

export const ProgramsFormatFilterPanel = ({
  lang,
}: ProgramsFormatFilterPanelProps) => {
  const { selectedFormats, toggleFormat } = useCategoryFilter();

  return (
    <FilterPanel
      label="Format"
      filterKey="program_formats"
      items={Object.values(PROGRAM_FORMATS).map((format) => ({
        id: format,
        name: getFormatLabel(format, lang as "en-ca" | "fr-ca"),
      }))}
      selectedItems={selectedFormats}
      onItemToggle={(itemId) => toggleFormat(itemId as ProgramFormat)}
    />
  );
};
