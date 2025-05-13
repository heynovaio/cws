export type ModuleFilter = "all" | "program_page" | "resource_page";
export type ModuleFilterTranslated = "All" | "Programs" | "Resources";

export const defaultModuleFilters: Record<
  ModuleFilter,
  ModuleFilterTranslated
> = {
  all: "All",
  program_page: "Programs",
  resource_page: "Resources",
};

export const module_filters_list: ModuleFilter[] = Object.keys(
  defaultModuleFilters
) as ModuleFilter[];
