import { useCategoryFilter } from "@/providers";
import { FilterPanel } from "./FilterPanel";

export const ProgramsCredentialsFilterPanel = () => {
  const { hasCredentials, toggleCredentials } = useCategoryFilter();

  return (
    <FilterPanel
      label="Credentials"
      items={[
        {
          id: "nccp-pd-points",
          name: "NCCP PD Points",
        },
      ]}
      selectedItems={hasCredentials ? ["nccp-pd-points"] : []}
      onItemToggle={toggleCredentials}
    />
  );
};
