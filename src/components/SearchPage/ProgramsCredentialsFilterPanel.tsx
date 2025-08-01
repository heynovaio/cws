import { useCategoryFilter } from "@/providers";
import { FilterPanel } from "./FilterPanel";

export const ProgramsCredentialsFilterPanel = () => {
  const { hasCredentials, toggleCredentials } = useCategoryFilter();

  const handleCredentialsToggle = (itemId: string) => {
    if (itemId === "nccp-pd-points") {
      toggleCredentials();
    }
  };

  return (
    <FilterPanel
      label="Credentials"
      filterKey="credentials"
      items={[
        {
          id: "nccp-pd-points",
          name: "NCCP PD Points",
        },
      ]}
      selectedItems={hasCredentials ? ["nccp-pd-points"] : []}
      onItemToggle={handleCredentialsToggle}
    />
  );
};
