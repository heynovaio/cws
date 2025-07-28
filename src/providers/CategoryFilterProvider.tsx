"use client";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import Fuse from "fuse.js";
import {
  ResourcePageDocument,
  ProgramPageDocument,
  ResourceCategoryDocument,
  ProgramCategoryDocument,
} from "../../prismicio-types";
import { ModuleFilter, PROGRAM_FORMATS, ProgramFormat } from "@/constants";
import { asText } from "@prismicio/client";
import { useSearchParams, useRouter } from "next/navigation";

interface CategoryFilterContextProps {
  resources: ResourcePageDocument[];
  setResources: (resources: ResourcePageDocument[]) => void;
  programs: ProgramPageDocument[];
  setPrograms: (programs: ProgramPageDocument[]) => void;
  activeFilter: ModuleFilter;
  setActiveFilter: (filter: ModuleFilter) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredItems: (ResourcePageDocument | ProgramPageDocument)[];
  filterCounts: Record<ModuleFilter, number>;
  resultCount: number;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  allTags: string[];
  clearAllFilters: () => void;
  selectedResourceCategories: string[];
  setSelectedResourceCategories: (categoryIds: string[]) => void;
  toggleResourceCategory: (categoryId: string) => void;
  resourceCategories: ResourceCategoryDocument[];
  setResourceCategories: (categories: ResourceCategoryDocument[]) => void;
  selectedProgramCategories: string[];
  setSelectedProgramCategories: (categoryIds: string[]) => void;
  toggleProgramCategory: (categoryId: string) => void;
  programCategories: ProgramCategoryDocument[];
  setProgramCategories: (categories: ProgramCategoryDocument[]) => void;
  availableTags: string[];
  selectedFormats: ProgramFormat[];
  setSelectedFormats: (formats: ProgramFormat[]) => void;
  toggleFormat: (format: ProgramFormat) => void;
  hasCredentials: boolean;
  setHasCredentials: (value: boolean) => void;
  toggleCredentials: () => void;
  maxCostFilter: number;
  setMaxCostFilter: (value: number) => void;
  maxCost: number;
  resetCostFilter: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const CategoryFilterContext = createContext<
  CategoryFilterContextProps | undefined
>(undefined);

export const defaultCategoryFilter: ModuleFilter = "all";

const CategoryFilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State initialization from URL
  const [resources, setResources] = useState<ResourcePageDocument[]>([]);
  const [programs, setPrograms] = useState<ProgramPageDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || ""
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const urlTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    return urlTags;
  });
  const [_activeFilter, _setActiveFilter] = useState<ModuleFilter>(() => {
    return (
      (searchParams.get("filter") as ModuleFilter) || defaultCategoryFilter
    );
  });
  const [selectedResourceCategories, setSelectedResourceCategories] = useState<
    string[]
  >(() => {
    const urlCategories =
      searchParams.get("resource_categories")?.split(",").filter(Boolean) || [];
    return urlCategories;
  });
  const [selectedProgramCategories, setSelectedProgramCategories] = useState<
    string[]
  >(() => {
    const urlCategories =
      searchParams.get("program_categories")?.split(",").filter(Boolean) || [];
    return urlCategories;
  });
  const [resourceCategories, setResourceCategories] = useState<
    ResourceCategoryDocument[]
  >([]);
  const [programCategories, setProgramCategories] = useState<
    ProgramCategoryDocument[]
  >([]);
  const [selectedFormats, setSelectedFormats] = useState<ProgramFormat[]>(
    () => {
      const urlFormats =
        searchParams.get("formats")?.split(",").filter(Boolean) || [];
      return urlFormats as ProgramFormat[];
    }
  );
  const [hasCredentials, setHasCredentials] = useState<boolean>(() => {
    return searchParams.get("credentials") === "true";
  });
  const [isLoading, setLoading] = useState<boolean>(true);

  // Calculate max cost from programs - Fixed to handle the actual cost values properly
  const maxCost = useMemo(() => {
    if (programs.length === 0) return 0;

    const costs = programs
      .map((program) => program.data.cost)
      .filter((cost): cost is number => typeof cost === "number" && cost > 0);

    return costs.length > 0 ? Math.max(...costs) : 0;
  }, [programs]);

  // Initialize maxCostFilter - handle both URL params and program data loading
  const [maxCostFilter, setMaxCostFilter] = useState<number>(() => {
    const urlMaxCost = searchParams.get("max_cost");
    return urlMaxCost ? parseInt(urlMaxCost, 10) : 0;
  });

  // Update maxCostFilter when programs load and no URL param was set
  useEffect(() => {
    const urlMaxCost = searchParams.get("max_cost");
    if (!urlMaxCost && maxCost > 0 && maxCostFilter === 0) {
      setMaxCostFilter(maxCost);
    }
  }, [maxCost, maxCostFilter, searchParams]);

  // Centralized URL update function
  const updateUrl = useCallback(
    (
      updates: Partial<{
        filter: ModuleFilter;
        search: string;
        tags: string[];
        resource_categories: string[];
        program_categories: string[];
        formats: ProgramFormat[];
        credentials: boolean;
        max_cost: number;
      }>
    ) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      // Handle each parameter
      if (updates.filter !== undefined) {
        newSearchParams.set("filter", updates.filter);
      }

      if (updates.search !== undefined) {
        if (updates.search.trim()) {
          newSearchParams.set("search", updates.search);
        } else {
          newSearchParams.delete("search");
        }
      }

      if (updates.tags !== undefined) {
        if (updates.tags.length > 0) {
          newSearchParams.set("tags", updates.tags.join(","));
        } else {
          newSearchParams.delete("tags");
        }
      }

      if (updates.resource_categories !== undefined) {
        if (updates.resource_categories.length > 0) {
          newSearchParams.set(
            "resource_categories",
            updates.resource_categories.join(",")
          );
        } else {
          newSearchParams.delete("resource_categories");
        }
      }

      if (updates.program_categories !== undefined) {
        if (updates.program_categories.length > 0) {
          newSearchParams.set(
            "program_categories",
            updates.program_categories.join(",")
          );
        } else {
          newSearchParams.delete("program_categories");
        }
      }

      if (updates.formats !== undefined) {
        if (updates.formats.length > 0) {
          newSearchParams.set("formats", updates.formats.join(","));
        } else {
          newSearchParams.delete("formats");
        }
      }

      if (updates.credentials !== undefined) {
        if (updates.credentials) {
          newSearchParams.set("credentials", "true");
        } else {
          newSearchParams.delete("credentials");
        }
      }

      if (updates.max_cost !== undefined) {
        // Always set the max_cost parameter if it's different from the current maxCost
        // This allows for proper URL state management
        newSearchParams.set("max_cost", updates.max_cost.toString());
      }

      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    },
    [searchParams, router, maxCost]
  );

  // Tag calculations (moved up to avoid initialization issues)
  const resourceTags = useMemo(() => {
    return Array.from(
      new Set(resources.flatMap((resource) => resource.tags || []))
    ).sort();
  }, [resources]);

  const programTags = useMemo(() => {
    return Array.from(
      new Set(programs.flatMap((program) => program.tags || []))
    ).sort();
  }, [programs]);

  const allTags = useMemo(() => {
    return Array.from(new Set([...resourceTags, ...programTags])).sort();
  }, [resourceTags, programTags]);

  // Enhanced state setters that update URL
  const setActiveFilter = useCallback(
    (filter: ModuleFilter) => {
      // Clear opposite category filters when switching to specific filter types
      if (filter === "program_page" && _activeFilter !== "program_page") {
        // Clear resource-specific filters
        setSelectedResourceCategories([]);
        updateUrl({
          filter,
          resource_categories: [],
        });
      } else if (
        filter === "resource_page" &&
        _activeFilter !== "resource_page"
      ) {
        setSelectedProgramCategories([]);
        setSelectedFormats([]);
        setHasCredentials(false);
        setMaxCostFilter(maxCost);
        updateUrl({
          filter,
          program_categories: [],
          formats: [],
          credentials: false,
          max_cost: maxCost,
        });
      } else {
        updateUrl({ filter });
      }

      const getAvailableTagsForFilter = (filterType: ModuleFilter) => {
        switch (filterType) {
          case "resource_page":
            return resourceTags;
          case "program_page":
            return programTags;
          case "all":
          default:
            return allTags;
        }
      };

      const availableTagsForNewFilter = getAvailableTagsForFilter(filter);
      const compatibleTags = selectedTags.filter((tag) =>
        availableTagsForNewFilter.includes(tag)
      );

      if (compatibleTags.length !== selectedTags.length) {
        setSelectedTags(compatibleTags);
        updateUrl({ tags: compatibleTags });
      }

      _setActiveFilter(filter);
    },
    [
      _activeFilter,
      maxCost,
      resourceTags,
      programTags,
      allTags,
      selectedTags,
      updateUrl,
    ]
  );

  const activeFilter = _activeFilter;

  const availableTags = useMemo(() => {
    switch (activeFilter) {
      case "resource_page":
        return resourceTags;
      case "program_page":
        return programTags;
      case "all":
      default:
        return allTags;
    }
  }, [activeFilter, resourceTags, programTags, allTags]);

  const toggleTag = useCallback(
    (tag: string) => {
      if (availableTags.includes(tag)) {
        const newTags = selectedTags.includes(tag)
          ? selectedTags.filter((t) => t !== tag)
          : [...selectedTags, tag];

        setSelectedTags(newTags);
        updateUrl({ tags: newTags });
      }
    },
    [availableTags, selectedTags, updateUrl]
  );

  const handleSetSearchTerm = useCallback(
    (term: string) => {
      setSearchTerm(term);
      updateUrl({ search: term });
    },
    [updateUrl]
  );

  const toggleResourceCategory = useCallback(
    (categoryId: string) => {
      const newCategories = selectedResourceCategories.includes(categoryId)
        ? selectedResourceCategories.filter((id) => id !== categoryId)
        : [...selectedResourceCategories, categoryId];

      setSelectedResourceCategories(newCategories);
      updateUrl({ resource_categories: newCategories });
    },
    [selectedResourceCategories, updateUrl]
  );

  const toggleProgramCategory = useCallback(
    (categoryId: string) => {
      const newCategories = selectedProgramCategories.includes(categoryId)
        ? selectedProgramCategories.filter((id) => id !== categoryId)
        : [...selectedProgramCategories, categoryId];

      setSelectedProgramCategories(newCategories);
      updateUrl({ program_categories: newCategories });
    },
    [selectedProgramCategories, updateUrl]
  );

  const handleSetResourceCategories = useCallback(
    (categoryIds: string[]) => {
      setSelectedResourceCategories(categoryIds);
      updateUrl({ resource_categories: categoryIds });
    },
    [updateUrl]
  );

  const handleSetProgramCategories = useCallback(
    (categoryIds: string[]) => {
      setSelectedProgramCategories(categoryIds);
      updateUrl({ program_categories: categoryIds });
    },
    [updateUrl]
  );

  const toggleFormat = useCallback(
    (format: ProgramFormat) => {
      const newFormats = selectedFormats.includes(format)
        ? selectedFormats.filter((f) => f !== format)
        : [...selectedFormats, format];

      setSelectedFormats(newFormats);
      updateUrl({ formats: newFormats });
    },
    [selectedFormats, updateUrl]
  );

  const toggleCredentials = useCallback(() => {
    const newValue = !hasCredentials;
    setHasCredentials(newValue);
    updateUrl({ credentials: newValue });
  }, [hasCredentials, updateUrl]);

  const handleSetMaxCostFilter = useCallback(
    (value: number) => {
      setMaxCostFilter(value);
      updateUrl({ max_cost: value });
    },
    [updateUrl]
  );

  const resetCostFilter = useCallback(() => {
    setMaxCostFilter(maxCost);
    // Remove the max_cost parameter from URL when resetting to max
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("max_cost");
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  }, [maxCost, router, searchParams]);

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedTags([]);
    setSelectedResourceCategories([]);
    setSelectedProgramCategories([]);
    setSelectedFormats([]);
    setHasCredentials(false);
    setMaxCostFilter(maxCost);
    _setActiveFilter(defaultCategoryFilter);

    // Clear all URL parameters except keep the base URL
    router.replace(window.location.pathname, { scroll: false });
  }, [maxCost, router]);

  // Fuse.js setup
  const fuseOptions = useMemo(
    () => ({
      keys: [
        { name: "title", weight: 0.6 },
        { name: "description", weight: 0.3 },
        { name: "tags", weight: 0.1 },
      ],
      threshold: 0.3,
      minMatchCharLength: 2,
      includeScore: true,
      includeMatches: true,
    }),
    []
  );

  const searchableItems = useMemo(() => {
    return [...programs, ...resources].map((item) => ({
      id: item.id,
      type: item.type,
      title: asText(item.data.title) || "",
      description: asText(item.data.body) || "",
      tags: item.tags || [],
      originalItem: item,
    }));
  }, [programs, resources]);

  const fuse = useMemo(() => {
    return new Fuse(searchableItems, fuseOptions);
  }, [searchableItems, fuseOptions]);

  const fuzzySearch = useCallback(
    (term: string) => {
      if (!term.trim()) return searchableItems.map((item) => item.originalItem);
      const results = fuse.search(term);
      return results.map((result) => result.item.originalItem);
    },
    [fuse, searchableItems]
  );

  const filteredItems = useMemo(() => {
    let items: (ResourcePageDocument | ProgramPageDocument)[] = [];

    const urlMaxCost = searchParams.get("max_cost");
    const isCostFilterActive = urlMaxCost
      ? parseInt(urlMaxCost, 10) < maxCost
      : maxCostFilter < maxCost;
    const hasTagFilters = selectedTags.length > 0;

    if (activeFilter === "program_page") {
      items = programs;
    } else if (activeFilter === "resource_page") {
      items = resources;
    } else {
      items = [...programs, ...resources];
    }

    if (searchTerm) {
      items = fuzzySearch(searchTerm).filter((item) =>
        items.some((i) => i.id === item.id)
      );
    }

    items = items.filter((item) => {
      const hasResourceCategoryFilters = selectedResourceCategories.length > 0;
      const hasProgramCategoryFilters = selectedProgramCategories.length > 0;
      const hasMainFilters =
        hasResourceCategoryFilters ||
        hasProgramCategoryFilters ||
        hasTagFilters;

      if (hasCredentials && !hasMainFilters) {
        if (item.type === "resource_page") {
          return false;
        }
      }

      if (hasMainFilters) {
        let passesMainFilters = false;

        if (hasResourceCategoryFilters && item.type === "resource_page") {
          const matchesResourceCategory =
            item.data.category &&
            selectedResourceCategories.includes(
              "id" in item.data.category ? item.data.category.id : ""
            );
          if (matchesResourceCategory) passesMainFilters = true;
        }

        if (hasProgramCategoryFilters && item.type === "program_page") {
          const matchesProgramCategory =
            item.data.category &&
            selectedProgramCategories.includes(
              "id" in item.data.category ? item.data.category.id : ""
            );
          if (matchesProgramCategory) passesMainFilters = true;
        }

        if (hasTagFilters && item.tags) {
          const matchesTag = selectedTags.some((tag) =>
            item.tags?.includes(tag)
          );
          if (matchesTag) passesMainFilters = true;
        }

        if (!passesMainFilters) {
          return false;
        }
      }

      if (item.type === "program_page") {
        if (selectedFormats.length > 0) {
          if (!item.data.format) return false;

          const format = item.data.format;
          const hasVirtual = selectedFormats.includes(PROGRAM_FORMATS.VIRTUAL);
          const hasInPerson = selectedFormats.includes(
            PROGRAM_FORMATS.IN_PERSON
          );

          if (hasVirtual && !hasInPerson) {
            if (
              !(format === PROGRAM_FORMATS.VIRTUAL || format.includes("Both"))
            ) {
              return false;
            }
          }

          if (hasInPerson && !hasVirtual) {
            if (
              !(format === PROGRAM_FORMATS.IN_PERSON || format.includes("Both"))
            ) {
              return false;
            }
          }

          if (hasVirtual && hasInPerson) {
            if (!format.includes("Both")) {
              return false;
            }
          }
        }

        if (hasCredentials) {
          if (!item.data.certs) {
            return false;
          }
        }

        if (isCostFilterActive) {
          // Special case: if only cost filter is active (no tags/categories), only show programs
          if (!hasMainFilters) {
            const effectiveMaxCost = urlMaxCost
              ? parseInt(urlMaxCost, 10)
              : maxCostFilter;
            const itemCost =
              typeof item.data.cost === "number" ? item.data.cost : 0;

            if (itemCost > effectiveMaxCost) {
              return false;
            }
          } else {
            // If main filters are also active, apply cost filter to programs
            const effectiveMaxCost = urlMaxCost
              ? parseInt(urlMaxCost, 10)
              : maxCostFilter;
            const itemCost =
              typeof item.data.cost === "number" ? item.data.cost : 0;

            if (itemCost > effectiveMaxCost) {
              return false;
            }
          }
        }
      } else if (item.type === "resource_page") {
        // For resources, if only cost filter is active (no other filters), hide resources
        const hasOtherFilters =
          hasMainFilters || selectedFormats.length > 0 || hasCredentials;
        if (isCostFilterActive && !hasOtherFilters) {
          return false;
        }
      }

      return true;
    });

    return items;
  }, [
    activeFilter,
    programs,
    resources,
    searchTerm,
    fuzzySearch,
    selectedResourceCategories,
    selectedProgramCategories,
    selectedTags,
    selectedFormats,
    hasCredentials,
    maxCostFilter,
    maxCost,
    searchParams,
  ]);

  const filterCounts = useMemo(() => {
    const countFiltered = (type: ModuleFilter) => {
      let count = 0;

      if (type === "all") {
        count = filteredItems.length;
      } else if (type === "program_page") {
        count = filteredItems.filter(
          (item) => item.type === "program_page"
        ).length;
      } else if (type === "resource_page") {
        count = filteredItems.filter(
          (item) => item.type === "resource_page"
        ).length;
      }

      return count;
    };

    return {
      all: countFiltered("all"),
      program_page: countFiltered("program_page"),
      resource_page: countFiltered("resource_page"),
    };
  }, [filteredItems]);

  const value = {
    resources,
    setResources,
    programs,
    setPrograms,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm: handleSetSearchTerm,
    filteredItems,
    filterCounts,
    resultCount: filteredItems.length,
    selectedTags,
    toggleTag,
    allTags,
    clearAllFilters,
    selectedResourceCategories,
    setSelectedResourceCategories: handleSetResourceCategories,
    toggleResourceCategory,
    resourceCategories,
    setResourceCategories,
    selectedProgramCategories,
    setSelectedProgramCategories: handleSetProgramCategories,
    toggleProgramCategory,
    programCategories,
    setProgramCategories,
    availableTags,
    selectedFormats,
    setSelectedFormats,
    toggleFormat,
    hasCredentials,
    setHasCredentials,
    toggleCredentials,
    maxCostFilter,
    setMaxCostFilter: handleSetMaxCostFilter,
    maxCost,
    resetCostFilter,
    isLoading,
    setLoading,
  };

  return (
    <CategoryFilterContext.Provider value={value}>
      {children}
    </CategoryFilterContext.Provider>
  );
};

export default CategoryFilterProvider;

export const useCategoryFilter = (): CategoryFilterContextProps => {
  const context = useContext(CategoryFilterContext);
  if (!context) {
    throw new Error(
      "useCategoryFilter must be used within a CategoryFilterProvider"
    );
  }
  return context;
};
