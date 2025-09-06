import { SupportedLanguage } from ".";

export type ModuleFilter = "all" | "program_page" | "resource_page";

export const MODULE_FILTER_TRANSLATIONS = {
  "en-ca": {
    all: "All",
    program_page: "Programs",
    resource_page: "Resources",
  },
  "fr-ca": {
    all: "Tout",
    program_page: "Programmes",
    resource_page: "Ressources",
  },
} as const;

export const module_filters_list: ModuleFilter[] = [
  "all",
  "program_page",
  "resource_page",
];

export const getModuleFilterLabel = (
  filter: ModuleFilter,
  lang: SupportedLanguage
) => {
  return (
    MODULE_FILTER_TRANSLATIONS[lang]?.[filter] ||
    MODULE_FILTER_TRANSLATIONS["en-ca"][filter]
  );
};
