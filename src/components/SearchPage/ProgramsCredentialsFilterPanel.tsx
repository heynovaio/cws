import { useCategoryFilter } from "@/providers";
import { FilterPanel } from "./FilterPanel";

export const ProgramsCredentialsFilterPanel = ({ lang }: { lang: string }) => {
  const { hasCredentials, toggleCredentials } = useCategoryFilter();

  const handleCredentialsToggle = (itemId: string) => {
    if (itemId === "nccp-pd-points") {
      toggleCredentials();
    }
  };

  return (
    <FilterPanel
      label={lang === "fr-ca" ? "Titres de compétences" : "Credentials"}
      filterKey="credentials"
      items={[
        {
          id: "nccp-pd-points",
          name: lang === "fr-ca" ? "Points PD (NCCP)" : "NCCP PD Points",
        },
      ]}
      selectedItems={hasCredentials ? ["nccp-pd-points"] : []}
      onItemToggle={handleCredentialsToggle}
    />
  );
};
